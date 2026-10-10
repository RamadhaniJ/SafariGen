import axios from "axios";
// Ondoa 'toast' kwa sababu hatuitumii tena

const BASE_API_URL = "http://127.0.0.1:8000/api/";

const api = axios.create({
    baseURL: BASE_API_URL,
    withCredentials: true,
});

// 🌉 Hii ndiyo "bridge" itakayoshikwa na AuthProvider
let onSessionExpiredCallback = null;

export const setSessionExpiredHandler = (callback) => {
    onSessionExpiredCallback = callback;
    // 🚨 HAMNA setTimeout hapa! Redirect itafanywa na Modal.
};

// ────────────────────────────────────────────────────────────
// 1. CSRF Token Interceptor
// ────────────────────────────────────────────────────────────
api.interceptors.request.use(
    (config) => {
        try {
            const csrfCookie = document.cookie
                .split("; ")
                .find((c) => c.startsWith("csrftoken="));
            if (csrfCookie) {
                config.headers["X-CSRFToken"] = csrfCookie.split("=")[1];
            }
        } catch (_) {}
        return config;
    },
    (err) => Promise.reject(err)
);

// ────────────────────────────────────────────────────────────
// 2. Shared Refresh Promise
// ────────────────────────────────────────────────────────────
let refreshPromise = null;

const triggerRefresh = () => {
    if (!refreshPromise) {
        refreshPromise = api
            .post("account/token/refresh", {}, { _skipInterceptor: true })
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
};

// ────────────────────────────────────────────────────────────
// 3. Response Interceptor
// ────────────────────────────────────────────────────────────
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (!originalRequest || !originalRequest.url || originalRequest._skipInterceptor) {
            return Promise.reject(error);
        }

        const status = error.response?.status;
        const detail = String(error.response?.data?.detail || "").toLowerCase();

        const onAuthPage = window.location.pathname === "/" || window.location.pathname === "/login";
        const sessionExpired = detail.includes("signed in on another device") || detail.includes("invalid session data");

        // ─── SCENARIO A: Session invalidated by another device ───
        if ((status === 401 || status === 403) && sessionExpired) {
            if (!onAuthPage) {
                try {
                    await api.post("account/users/logout", {}, { _skipInterceptor: true });
                } catch (logoutError) {
                    console.warn("Cleanup logout failed:", logoutError);
                }
                
                if (onSessionExpiredCallback) {
                    onSessionExpiredCallback();
                } else {
                    window.location.href = "/";
                }
            }
            return Promise.reject(error);
        }

        // ─── SCENARIO B: Already on login page ───
        if (onAuthPage) {
            return Promise.reject(error);
        }

        // ─── SCENARIO C: Normal 401 (Token expired naturally) ───
        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await triggerRefresh();
                return api(originalRequest);
            } catch (refreshError) {
                if (onSessionExpiredCallback) {
                    onSessionExpiredCallback();
                } else {
                    window.location.href = "/";
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;