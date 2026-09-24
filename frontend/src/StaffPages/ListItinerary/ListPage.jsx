import { useEffect, useState, version } from 'react';
import api from '../../Apis/api';
import GlobalLoader from '../../Component/Loader';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  Edit2, Trash2, Send, Eye, Calendar, MapPin, MoveLeft, MoreHorizontal,
  Loader2, Plus, Sparkles, BellRing, UserPlus, FileText, ArrowUpRight,
  User, Clock, Banknote, Users, X
} from 'lucide-react';


import SendEmailToClientPopUp from './SendEmail/SendEmailPoUp';
/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const STATUS_STYLES = {
  ACCEPTED: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/30',
  SENT: 'bg-sky-500/15 text-sky-300 ring-sky-400/30',
  DRAFT: 'bg-amber-500/15 text-amber-300 ring-amber-400/30',
  REJECTED: 'bg-rose-500/15 text-rose-300 ring-rose-400/30',
  EXPIRED: 'bg-rose-500/15 text-rose-300 ring-rose-400/30',
};

const getStatusStyle = (status) =>
  STATUS_STYLES[status] || 'bg-slate-500/15 text-slate-300 ring-slate-400/30';

const formatDateTime = (iso) => {
  if (!iso) return '—';
  const safe = String(iso).replace(/(\.\d{3})\d+/, '$1');
  const d = new Date(safe);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });
};

const formatMoney = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
};

/* ------------------------------------------------------------------ */
/*  Presentational Components                                          */
/* ------------------------------------------------------------------ */

function StatBox({ label, value, accent = false, icon: Icon }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border px-3 py-3 text-center transition-all duration-300 hover:scale-[1.02] ${
      accent 
        ? 'border-fuchsia-400/30 bg-gradient-to-b from-fuchsia-500/10 to-fuchsia-500/[0.02]' 
        : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
    }`}>
      {Icon && (
        <Icon className={`mx-auto mb-1.5 h-4 w-4 transition-colors ${accent ? 'text-fuchsia-300' : 'text-slate-400'}`} />
      )}
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`mt-0.5 text-sm font-bold ${accent ? 'text-fuchsia-200' : 'text-white'}`}>
        {value}
      </p>
    </div>
  );
}

function IconButton({ title, onClick, disabled, danger = false, children }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={`group inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${
        danger
          ? 'border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:border-red-400/40 hover:text-red-200'
          : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20'
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ onCreate }) {
  return (
    <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden p-4">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-fuchsia-600/20 blur-[130px] animate-pulse" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-indigo-600/20 blur-[130px] animate-pulse" />

      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center shadow-2xl shadow-black/60 backdrop-blur-2xl transition-transform hover:scale-[1.01]">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-fuchsia-600 to-purple-700 shadow-lg shadow-fuchsia-500/30">
          <MapPin className="h-9 w-9 text-white" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-white">No Quotes Yet</h2>
        <p className="mb-8 text-sm text-slate-400">
          Start by creating your first safari itinerary and watch it come to life.
        </p>
        <button
          onClick={onCreate}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Generate New Itinerary
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */

export default function ListAllItineraryWithVersionPage() {
  const [itineraryData, setItineraryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersions, setSelectedVersions] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [moreSheet, setMoreSheet] = useState(null);

  const [showSendQuoteModel , setShowSendQuoteModel] = useState(false)
  const [emailQuoteData, setEmailQuoteData] = useState(null);
   const [isEmailSent, setIsEmailSent] = useState(false);

  const navigate = useNavigate();

  const fetchItineraryData = async () => {
    setLoading(true);
    try {
      const resp = await api.get('itinerary/list/itinerary/quotes/');
      setItineraryData(Array.isArray(resp.data) ? resp.data : []);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to load itineraries');
      setItineraryData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItineraryData();
  }, []);

  const getActiveVersion = (data) => {
    const versions = Array.isArray(data.versions) ? data.versions : [];
    if (!versions.length) return null;
    const selectedId = selectedVersions[data.id];
    return (
      versions.find((v) => v.id === selectedId) ||
      versions.find((v) => v.is_current) ||
      versions[0]
    );
  };

  const requestDelete = (data, version) => {
    if (version.is_current) {
      toast.error('Cannot delete the current version. Create a new version first.');
      return;
    }
    setDeleteTarget({ itineraryId: data.id, tourTitle: version.tour_title, version });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await api.delete(`itinerary/delete/version/itinerary/${deleteTarget.version.id}/`);
      toast.success('Version deleted successfully');
      setDeleteTarget(null);
      await fetchItineraryData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete version');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditVersion = (versionId, clientId) =>{
    navigate(`/staff/dashboard/itinerary/edit/${clientId}/${versionId}`)
  } 

  const handleViewMore = (data, version) => {
    navigate(`/preview/safari/itinerary/${data.id}/${version.id}`);
  };

    const handleSendQuote = (data, version) => {
    setMoreSheet(null); // Funga bottom sheet kwanza
    setEmailQuoteData({data, version });
    setShowSendQuoteModel(true); // Fungua email modal
  };


  if (loading) return <GlobalLoader />;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-200">
      {/* Global Animations & Utilities */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Ambient Background Glows */}
      <div className="pointer-events-none fixed -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-fuchsia-600/10 blur-[140px]" />
      <div className="pointer-events-none fixed -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation Header */}
         <button
          type="button"
          onClick={() => navigate(-1)}
          className="group mb-6 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/50"
        >
          <MoveLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back
        </button>

        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              My Quotes
            </h1>
            {/* <p className="mt-1 text-sm text-slate-400">
              Manage, track, and refine your safari itineraries.
            </p> */}
          </div>

          <button
            onClick={() => navigate('/staff/dashboard/create/quote/')}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            New Quote
          </button>
        </div>

        {/* Content Grid */}
        {!itineraryData.length ? (
          <EmptyState onCreate={() => navigate('/staff/dashboard/create/quote/')} />
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {itineraryData.map((data) => {
              const versions = Array.isArray(data.versions) ? data.versions : [];
              if (!versions.length) return null;

              const active = getActiveVersion(data);
              if (!active) return null;

              const heroImage = data.cover_image?.hero_image;
              const country = data.country;
              const isCurrent = active.is_current;

              return (
                <div
                  key={data.id}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-xl shadow-black/40 backdrop-blur-xl transition-all duration-500 hover:border-fuchsia-500/30 hover:bg-white/[0.05] hover:shadow-2xl hover:shadow-fuchsia-500/10"
                >
                  {/* Top Hover Glow Line */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="flex flex-col md:flex-row">
                    {/* LEFT: Visual & Client Info */}
                    <div className="relative flex flex-col items-center border-b border-white/10 bg-gradient-to-b from-fuchsia-500/[0.08] to-transparent p-6 md:w-2/5 md:border-b-0 md:border-r">
                      <div className="w-full text-center md:text-left">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Quote for</p>
                        <h3 className="mt-1 line-clamp-2 text-lg font-bold leading-tight text-white">
                          {active.client_name || 'Unknown Client'}
                        </h3>
                        <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-slate-400">
                          <MapPin className="h-3.5 w-3.5" />
                          {country || 'Location TBD'}
                        </p>
                      </div>

                      {/* 3D Book Cover */}
                      <div className="relative mt-6 aspect-[3/4] w-32 [perspective:1000px] md:w-40">
                        <div className="relative h-full w-full rounded-r-lg rounded-l-sm bg-slate-800 shadow-2xl transition-all duration-500 ease-out [transform-style:preserve-3d] [transform:rotateY(-15deg)] group-hover:[transform:rotateY(0deg)_scale(1.02)]">
                          {/* Cover Image / Placeholder */}
                          <div className="absolute inset-0 overflow-hidden rounded-r-lg rounded-l-sm">
                            {heroImage ? (
                              <img
                                src={heroImage}
                                alt={active.snapshot_tour_title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            ) : (
                              <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-fuchsia-700 via-purple-800 to-indigo-900">
                                <MapPin className="h-8 w-8 text-white/50" />
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/60">No Cover</span>
                              </div>
                            )}
                            {/* Gloss Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-white/10" />
                          </div>

                          {/* Spine & Pages Effect */}
                          <div className="absolute inset-y-0 left-0 w-2 rounded-l-sm bg-gradient-to-r from-black/70 to-transparent" />
                          <div className="absolute inset-y-1 right-0 w-1.5 translate-x-1 rounded-r-sm bg-slate-300/80" />
                          
                          {/* Title Plate */}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 pt-8">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-fuchsia-300">
                              {active.tour_code || 'QUOTE'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT: Details & Actions */}
                    <div className="flex flex-1 flex-col p-6">
                      {/* Badges */}
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${getStatusStyle(active.status)}`}>
                          {/* <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" /> */}
                          {active.status}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold text-slate-300">
                          v-{active.version_number}
                        </span>
                        {isCurrent && (
                          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                            Current
                          </span>
                        )}
                      </div>

                      {/* Title & Meta */}
                      <h2 className="line-clamp-2 text-xl font-bold text-white">
                        {active.snapshot_tour_title}
                      </h2>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDateTime(active.created_at)}
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                          <Send className="h-3.5 w-3.5" />
                          Sent {active.sent_count ?? 0}×
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" />
                          Created by <span className='text-slate-200' >{active.created_by || 'System'}</span> 
                        </span>

                      </div>

                      {/* Stats Grid */}
                      <div className="mt-5 grid grid-cols-3 gap-2.5">
                        <StatBox label="Duration" value={`${active.snapshot_tour_length} Day${Number(active.snapshot_tour_length) > 1 ? 's' : ''}`} />
                        <StatBox label="Total" value={`$${formatMoney(active.grand_total)}`}  />
                        <StatBox label="Per Pax" value={`$${formatMoney(active.price_per_person)}`} />
                      </div>

                      {/* Version Switcher (Scrollable on mobile) */}
                      {versions.length > 1 && (
                        <div className="mt-5">
                          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Versions</p>
                          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {versions.map((v) => {
                              const isActive = v.id === active.id;
                              return (
                                <button
                                  key={v.id}
                                  type="button"
                                  onClick={() => setSelectedVersions((prev) => ({ ...prev, [data.id]: v.id }))}
                                  className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[11px] font-bold transition-all duration-300 ${
                                    isActive
                                      ? 'border-transparent bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-lg shadow-fuchsia-500/25'
                                      : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20'
                                  }`}
                                >
                                  v{v.version_number}
                                  {v.is_current && (
                                    <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-emerald-400'}`} />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="mt-6 flex items-center gap-2 border-t border-white/[0.07] pt-4">
                        <button
                          type="button"
                          onClick={() => handleViewMore(data, active)}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>
                        <button
                          type="button"
                          onClick ={() => handleEditVersion(active.id, data.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-200 transition-all duration-300 hover:bg-white/10 hover:text-white active:scale-[0.98]"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <IconButton
                          title={isCurrent ? 'Current version cannot be deleted' : 'Delete this version'}
                          danger
                          disabled={isCurrent}
                          onClick={() => requestDelete(data, active)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </IconButton>
                        <IconButton
                          title="More options"
                          onClick={() => setMoreSheet({ data, version: active })}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ------------------- MORE OPTIONS BOTTOM SHEET ------------------- */}
      {moreSheet && (
        <div
          onClick={() => setMoreSheet(null)}
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 backdrop-blur-sm [animation:fadeIn_.2s_ease-out]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-t-3xl border-t border-white/10 bg-slate-900/95 p-6 pb-9 shadow-2xl shadow-black/80 backdrop-blur-2xl [animation:slideUp_.32s_cubic-bezier(.16,1,.3,1)]"
          >
            {/* Drag Handle */}
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-white/20" />

            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">More options</p>
                <h3 className="line-clamp-2 text-base font-bold text-white">
                  {moreSheet.version.snapshot_tour_title}
                </h3>
                <p className="mt-0.5 font-mono text-[11px] text-slate-500">
                  {moreSheet.version.tour_code} · v{moreSheet.version.version_number}
                </p>
              </div>
              <button
                onClick={() => setMoreSheet(null)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              {[
                { icon: Send, label: 'Send Quote to Client', desc: 'Email this version to the traveller', action: ()=> handleSendQuote(moreSheet.data, moreSheet.version)  },
                { icon: BellRing, label: 'Follow Up', desc: 'Schedule a reminder to chase this quote', action: () => { setMoreSheet(null); toast.success('Follow-up scheduled'); } },
                { icon: UserPlus, label: 'Assign To', desc: 'Hand this quote over to a team member', action: () => { setMoreSheet(null); toast.success('Assignment updated'); } },
                { icon: FileText, label: 'Duplicate Version', desc: 'Create a copy of this itinerary version', action: () => { setMoreSheet(null); toast.warning('Coming soon...'); } },
              ].map(({ icon: Icon, label, desc, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="group flex w-full items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 text-left transition-all duration-300 hover:border-fuchsia-400/30 hover:bg-white/[0.07]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-600/25 to-purple-600/25 text-fuchsia-300 ring-1 ring-fuchsia-400/20 transition-transform group-hover:scale-110">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-white">{label}</span>
                    <span className="block truncate text-[11px] text-slate-400">{desc}</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-600 transition-colors group-hover:text-fuchsia-300" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------- DELETE CONFIRMATION MODAL ------------------- */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm [animation:fadeIn_.2s_ease-out]">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900/95 p-6 text-center shadow-2xl shadow-black/70 backdrop-blur-2xl [animation:popIn_.25s_cubic-bezier(.16,1,.3,1)]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 shadow-lg shadow-red-500/10">
              <Trash2 className="h-7 w-7" />
            </div>

            <h3 className="text-lg font-bold text-white">
              Delete Version {deleteTarget.version.version_number}?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              This will permanently remove <span className="font-semibold text-slate-200">"{deleteTarget.tourTitle}"</span>. This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={actionLoading}
                className="w-1/2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={actionLoading}
                className="inline-flex w-1/2 min-w-[120px] items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-md shadow-red-500/20 transition hover:bg-red-500 disabled:opacity-60"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting…
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

        {showSendQuoteModel && emailQuoteData && (
        <SendEmailToClientPopUp 
          client_id={emailQuoteData.data.id}
          version_id={emailQuoteData.version.id}
          client_name={emailQuoteData.version.client_name}
          tour_title={emailQuoteData.version.snapshot_tour_title}
          version_number={emailQuoteData.version.version_number}
          onClose={() => {  
            setShowSendQuoteModel(false);
            setEmailQuoteData(null);
          }}
          onSuccess={() => {
            setShowSendQuoteModel(false);
            setEmailQuoteData(null);
            fetchItineraryData(); 
            toast.success("Itinerary sent successfully!");
          }}
        />
      )}

    </div>
  );
}
