import axios from 'axios';



const BASE_API_URL = "http://127.0.0.1:8000/api/";

const api = axios.create({
    baseURL : BASE_API_URL,
    withCredentials: true,
});


// const AUTH_EXCLUDED = [
//     "clients and others"
// ]


api.interceptors.request.use(
    (config) => {
        const csrfCookie = document.cookie.split("; ").find((cook)=> cook.startsWith("csrftoken="));

        if (csrfCookie){
            const csrfToken = csrfCookie.split("=")[1];
            config.headers['X-CSRFToken'] = csrfToken;
        }
        return config;
    },
    (error)=> Promise.reject(error)
);



let isRefresh = false;
let failedQueue = [];


const processQueue = (error, token = null)=>{
    failedQueue.forEach((promises)=>{
        if (error){
            promises.reject(error);
        }else{
            promises.resolve(token);
        }
    });
    failedQueue = [];
};



api.interceptors.response.use(
    (response) => response,

    async (error)=>{
        const originalRequest = error.config;
                                                  
        // if (AUTH_EXECLUDED.some(url => originalRequest.url.includes(url))){
        //     return Promise.reject(error);
        // }
    // excluded url

    if (error.response?.status === 401 && !originalRequest._retry){
        if (isRefresh){
            return new Promise((resolve, reject)=>{
                failedQueue.push({resolve, reject});
            })
            .then(()=> api(originalRequest))
            .catch((error)=> Promise.reject(error));

        }
        originalRequest._retry = true;
        isRefresh = true;

        try{
            await api.post("account/token/refresh", {});
            processQueue(null);
            return api(originalRequest);
        }catch(error){
            processQueue(error, null);
            return Promise.reject(error);
        }finally{
            isRefresh = false;
        }
    }
    return Promise.reject(error);

     }

    
)

export default api;

