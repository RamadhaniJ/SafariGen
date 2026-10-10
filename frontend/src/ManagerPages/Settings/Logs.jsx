import { useState, useEffect, useMemo, useRef } from "react";
import api from "../../Apis/api";
import { toast } from "sonner";
import {
  Activity,
  Trash2,
  PlusCircle,
  Edit3,
  RefreshCw,
  Search,
  X,
  ChevronDown,
  ArrowRight,
  Inbox,
  SearchX,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */
const PAGE_SIZE = 30;

const ACTION_STYLES = {
  CREATED: {
    label: "Created",
    icon: PlusCircle,
    icon_box: "bg-[#E3F1E8] text-[#1E5A3B] ring-[#1E5A3B]/20",
    pill: "bg-[#E3F1E8] text-[#1E5A3B] ring-[#1E5A3B]/20",
    dot: "bg-[#1E5A3B]",
  },
  UPDATED: {
    label: "Updated",
    icon: Edit3,
    icon_box: "bg-[#E2EEF4] text-[#1D4E68] ring-[#1D4E68]/20",
    pill: "bg-[#E2EEF4] text-[#1D4E68] ring-[#1D4E68]/20",
    dot: "bg-[#1D4E68]",
  },
  DELETED: {
    label: "Deleted",
    icon: Trash2,
    icon_box: "bg-[#FBE5E2] text-[#8E2A1F] ring-[#8E2A1F]/20",
    pill: "bg-[#FBE5E2] text-[#8E2A1F] ring-[#8E2A1F]/20",
    dot: "bg-[#8E2A1F]",
  },
  STATUS_CHANGED: {
    label: "Status changed",
    icon: RefreshCw,
    icon_box: "bg-[#FDF4DD] text-[#7A4E08] ring-[#F2B544]/30",
    pill: "bg-[#FDF4DD] text-[#7A4E08] ring-[#F2B544]/30",
    dot: "bg-[#F2B544]",
  },
};

const FALLBACK_STYLE = {
  label: "Activity",
  icon: Activity,
  icon_box: "bg-[#F6F1E7] text-[#6B6459] ring-[#E4DCCB]",
  pill: "bg-[#F6F1E7] text-[#6B6459] ring-[#E4DCCB]",
  dot: "bg-[#6B6459]",
};

const FILTERS = [
  { key: "ALL", label: "All" },
  { key: "CREATED", label: "Created" },
  { key: "UPDATED", label: "Updated" },
  { key: "DELETED", label: "Deleted" },
  { key: "STATUS_CHANGED", label: "Status changes" },
];

const FOCUS =
  "focus-visible:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const getStyle = (action) => ACTION_STYLES[action] || FALLBACK_STYLE;

const humanize = (value) =>
  String(value || "")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());

const formatFull = (dateString) => {
  if (!dateString) return "Unknown date";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatTime = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const relativeTime = (dateString) => {
  if (!dateString) return "";
  const diff = Date.now() - new Date(dateString).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min}m ago`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return formatTime(dateString);
};

const dayKey = (dateString) => {
  if (!dateString) return "unknown";
  const d = new Date(dateString);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

const dayLabel = (dateString) => {
  if (!dateString) return "Unknown date";
  const d = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (dayKey(d) === dayKey(today)) return "Today";
  if (dayKey(d) === dayKey(yesterday)) return "Yesterday";
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const initials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "?";
};

const showValue = (val) => { 
    if (val === null || val === undefined ) return "N/A";
     if  ( typeof val === "boolean") return val ? "Yes" : "No";
     return String(val);
 }

/* ------------------------------------------------------------------ */
/*  Pieces                                                             */
/* ------------------------------------------------------------------ */
function SkeletonRow() {
  return (
    <div className="flex gap-4 py-4">
      <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-[#F6F1E7]" />
      <div className="flex-1 space-y-2.5">
        <div className="h-3.5 w-2/3 animate-pulse rounded bg-[#F6F1E7]" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-[#F6F1E7]" />
      </div>
      <div className="hidden h-3 w-12 animate-pulse rounded bg-[#F6F1E7] sm:block" />
    </div>
  );
}

function ChangesDiff({ changes }) {
  return (
    <ul className="mt-3 divide-y divide-[#E4DCCB] overflow-hidden rounded-xl bg-[#F6F1E7]/50 ring-1 ring-[#E4DCCB]">
      {changes.map((change, idx) => (
        <li
          key={idx}
          className="flex flex-col gap-1.5 px-3.5 py-2.5 text-[13px] sm:flex-row sm:items-center sm:gap-3"
        >
          <span className="w-32 shrink-0 font-semibold text-[#0F2A2E]">
            {humanize(change.field)}
          </span>
          <span className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="max-w-full truncate rounded-md bg-[#FBE5E2] px-1.5 py-0.5 text-[#8E2A1F] line-through decoration-[#8E2A1F]/40">
              {showValue(change.old_value)}
            </span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#B34F12]" />
            <span className="max-w-full truncate rounded-md bg-[#E3F1E8] px-1.5 py-0.5 font-semibold text-[#1E5A3B]">
              {showValue(change.new_value)}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function LogRow({ log, isLast, expanded, onToggle }) {
  const style = getStyle(log.action);
  const Icon = style.icon;
  const changes = Array.isArray(log.changes_display) ? log.changes_display : [];
  const hasChanges = changes.length > 0;

  return (
    <li className="relative flex gap-4 pb-7">
      {/* timeline rail */}
      {!isLast && (
        <span
          className="absolute left-4 top-9 -bottom-0 w-px -translate-x-1/2 bg-[#E4DCCB]"
          aria-hidden="true"
        />
      )}

      {/* icon */}
      <span
        className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full ring-1 ${style.icon_box}`}
        title={style.label}
      >
        <Icon className="h-4 w-4" strokeWidth={1.9} />
      </span>

      {/* content */}
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex items-start justify-between gap-4">
          <p className="min-w-0 text-[15px] leading-snug text-[#0F2A2E]">
            {log.description || "No description provided."}
          </p>
          <time
            dateTime={log.created_at}
            title={formatFull(log.created_at)}
            className="shrink-0 pt-0.5 text-[13px] tabular-nums text-[#6B6459]"
          >
            {relativeTime(log.created_at)}
          </time>
        </div>

        {/* tags */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-semibold ring-1 ${style.pill}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
            {style.label}
          </span>

          {log.module && (
            <span className="rounded bg-[#F6F1E7] px-2 py-0.5 text-xs font-semibold text-[#6B6459] border border-[#E4DCCB]">
              {humanize(log.module)}
            </span>
          )}

          {log.tour_code && (
            <span className="rounded bg-[#0F2A2E] px-2 py-0.5 text-xs font-semibold tabular-nums text-[#F6F1E7]">
              {log.tour_code}
            </span>
          )}
        </div>

        {/* actor */}
        <div className="mt-3 flex items-center gap-2.5">
          <span
            className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#FCE9DA] text-[9px] font-bold text-[#B34F12] ring-1 ring-[#E8772E]/20"
            aria-hidden="true"
          >
            {initials(log.actor_name)}
          </span>
          <p className="min-w-0 truncate text-[13px] text-[#6B6459]">
            <span className="font-semibold text-[#0F2A2E]">
              {log.actor_name || "Unknown user"}
            </span>
            {(log.actor_role || log.actor_company_name) && (
              <span>
                {" "}
                {log.actor_role}
                {log.actor_role && log.actor_company_name ? " at " : ""}
                {log.actor_company_name}
              </span>
            )}
          </p>
        </div>

        {/* changes */}
        {hasChanges && (
          <>
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={expanded}
              className={`mt-3 inline-flex items-center gap-1 rounded-lg py-1 pr-2 text-[13px] font-semibold text-[#6B6459] transition-colors hover:text-[#B34F12] ${FOCUS}`}
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 motion-reduce:transition-none ${
                  expanded ? "rotate-180" : ""
                }`}
              />
              {expanded ? "Hide" : "View"} {changes.length}{" "}
              {changes.length === 1 ? "change" : "changes"}
            </button>
            {expanded && <ChangesDiff changes={changes} />}
          </>
        )}
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */
export default function ManagerLogsComponent() {
  const [logData, setLogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [expandedIds, setExpandedIds] = useState(() => new Set());
  const searchRef = useRef(null);

  /* fetch on mount */
  useEffect(() => {
    fetchManagerLogs();
  }, []);

  /* press "/" to jump to search */
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* reset pagination when the view changes */
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, activeFilter]);

  const fetchManagerLogs = async () => {
    setLoading(true);
    try {
      const resp = await api.get("activities-logs/list/activities/logs/");
      // Backend returns an array directly, or { results: [...] } when paginated
      const logs = resp.data.results || resp.data || [];
      setLogData(logs);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.detail ||
        "Failed to load activity logs. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (id) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  /* search -> counts -> filter */
  const searched = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const sorted = [...logData].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    if (!q) return sorted;
    return sorted.filter(
      (log) =>
        log.description?.toLowerCase().includes(q) ||
        log.tour_code?.toLowerCase().includes(q) ||
        log.actor_name?.toLowerCase().includes(q)
    );
  }, [logData, searchQuery]);

  const counts = useMemo(() => {
    const c = { ALL: searched.length };
    searched.forEach((l) => {
      c[l.action] = (c[l.action] || 0) + 1;
    });
    return c;
  }, [searched]);

  const filteredLogs = useMemo(
    () =>
      activeFilter === "ALL"
        ? searched
        : searched.filter((l) => l.action === activeFilter),
    [searched, activeFilter]
  );

  const visibleLogs = filteredLogs.slice(0, visibleCount);

  /* group by day */
  const groups = useMemo(() => {
    const map = new Map();
    visibleLogs.forEach((log) => {
      const key = dayKey(log.created_at);
      if (!map.has(key)) {
        map.set(key, { label: dayLabel(log.created_at), items: [] });
      }
      map.get(key).items.push(log);
    });
    return Array.from(map.values());
  }, [visibleLogs]);

  const isFiltering = searchQuery.trim() || activeFilter !== "ALL";

  return (
    <div className="min-h-screen bg-[#F6F1E7] text-[#0F2A2E] selection:bg-[#E8772E] selection:text-[#0F2A2E] relative overflow-x-hidden">

      {/* Ambient brand washes */}
      <div className="pointer-events-none fixed -top-40 -right-40 w-[520px] h-[520px] bg-[#E8772E]/10 blur-[150px] rounded-full" />
      <div className="pointer-events-none fixed -bottom-40 -left-40 w-[520px] h-[520px] bg-[#F2B544]/12 blur-[150px] rounded-full" />

      <div className=" max-w-3xl px-4  md:px-6 py-4 relative z-10">

        {/* ------------------------------ header ------------------------------ */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0F2A2E] md:text-3xl">
              Activity log
            </h1>
            <p className="max-w-md text-[15px] leading-relaxed text-[#6B6459]">
              Every change, update and deletion in one place. Only authorized
              managers can see this.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchManagerLogs}
            disabled={loading}
            className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-white px-3.5 text-sm font-semibold text-[#0F2A2E] shadow-[0_1px_2px_rgba(15,42,46,0.04)] border border-[#E4DCCB] transition-all hover:bg-[#FCE9DA] hover:border-[#E8772E]/40 hover:text-[#B34F12] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#E9E3D6] disabled:text-[#A39C8F] disabled:border-[#E9E3D6] disabled:hover:bg-[#E9E3D6] motion-reduce:active:scale-100 ${FOCUS}`}
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin text-[#E8772E]" : "text-[#6B6459]"}`}
            />
            <span className="hidden sm:inline">Refresh</span>
            <span className="sr-only sm:hidden">Refresh logs</span>
          </button>
        </div>

        {/* ------------------------------ search ------------------------------ */}
        <div className="relative mt-8">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6459]" />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by tour code, person or description"
            aria-label="Search activity logs"
            className="h-12 w-full rounded bg-white pl-11 pr-12 text-[15px] text-[#0F2A2E] shadow-[0_1px_2px_rgba(15,42,46,0.04)] border border-[#E4DCCB] transition-all placeholder:text-[#6B6459]/50 focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className={`absolute right-2.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-[#6B6459] transition-colors hover:bg-[#F6F1E7] hover:text-[#0F2A2E] ${FOCUS}`}
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="pointer-events-none absolute right-3.5 top-1/2 hidden h-6 -translate-y-1/2 items-center rounded-md bg-[#F6F1E7] px-2 text-xs font-semibold text-[#6B6459] border border-[#E4DCCB] sm:inline-flex">
              /
            </kbd>
          )}
        </div>

        {/* ------------------------------ filters ----------------------------- */}
        <div
          className="-mx-4 mt-4 flex gap-1.5 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Filter by action"
        >
          {FILTERS.map((f) => {
            const active = activeFilter === f.key;
            const count = counts[f.key] || 0;
            return (
              <button
                key={f.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveFilter(f.key)}
                className={`inline-flex h-9 shrink-0 items-center gap-2 rounded px-3.5 text-sm font-semibold transition-colors ${FOCUS} ${
                  active
                    ? "bg-[#E8772E] text-[#0F2A2E] shadow-md shadow-[#E8772E]/25"
                    : "bg-white text-[#6B6459] border border-[#E4DCCB] hover:bg-[#FCE9DA] hover:text-[#B34F12] hover:border-[#E8772E]/40"
                }`}
              >
                {f.label}
                {!loading && (
                  <span
                    className={`text-xs tabular-nums font-bold ${
                      active ? "text-[#0F2A2E]/60" : "text-[#6B6459]/70"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ------------------------------ content ----------------------------- */}
        <div className="mt-8" aria-live="polite">
          {loading ? (
            <div className="divide-y divide-[#E4DCCB]" aria-busy="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center rounded-3xl border border-dashed border-[#E4DCCB] bg-white px-6 py-16 text-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-[#E8772E]/20 blur-md" />
                <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-[#FCE9DA] border border-[#E8772E]/25 text-[#B34F12]">
                  {isFiltering ? (
                    <SearchX className="h-5 w-5" strokeWidth={1.8} />
                  ) : (
                    <Inbox className="h-5 w-5" strokeWidth={1.8} />
                  )}
                </span>
              </div>
              <h3 className="mt-4 text-base font-bold text-[#0F2A2E]">
                {isFiltering ? "No matching activity" : "No activity yet"}
              </h3>
              <p className="mt-1 max-w-xs text-sm text-[#6B6459]">
                {isFiltering
                  ? "Try a different search or switch the filter back to All."
                  : "Changes will show up here as soon as someone makes one."}
              </p>
              {isFiltering && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilter("ALL");
                  }}
                  className={`mt-5 inline-flex h-9 items-center rounded-xl bg-[#E8772E] px-4 text-sm font-bold text-[#0F2A2E] transition-all hover:bg-[#D4661F] hover:shadow-lg hover:shadow-[#E8772E]/25 active:bg-[#B34F12] active:text-white active:scale-[0.98] ${FOCUS}`}
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-10">
                {groups.map((group, gi) => (
                  <section key={group.label + gi}>
                    <h2 className="sticky top-16 z-10 -mx-1 mb-5 bg-[#F6F1E7]/90 px-1 py-2 text-sm font-bold text-[#0F2A2E] backdrop-blur md:top-[72px]">
                      {group.label}
                      <span className="ml-2 font-medium text-[#6B6459]/70">
                        {group.items.length}
                      </span>
                    </h2>
                    <ol>
                      {group.items.map((log, idx) => (
                        <LogRow
                          key={log.id}
                          log={log}
                          isLast={idx === group.items.length - 1}
                          expanded={expandedIds.has(log.id)}
                          onToggle={() => toggleExpanded(log.id)}
                        />
                      ))}
                    </ol>
                  </section>
                ))}
              </div>

              {filteredLogs.length > visibleCount && (
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    className={`inline-flex h-10 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-[#0F2A2E] shadow-[0_1px_2px_rgba(15,42,46,0.04)] border border-[#E4DCCB] transition-all hover:bg-[#FCE9DA] hover:border-[#E8772E]/40 hover:text-[#B34F12] active:scale-[0.98] motion-reduce:active:scale-100 ${FOCUS}`}
                  >
                    Show more
                    <span className="text-[#6B6459]">
                      {filteredLogs.length - visibleCount} left
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}