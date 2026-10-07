 import { useEffect, useState, useContext, useMemo } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  Edit2, Trash2, Send, Eye, Calendar, MapPin, MoveLeft, MoreHorizontal,
  Loader2, Plus, BellRing, UserPlus, FileText, ArrowUpRight,
  User, X
} from 'lucide-react';
import api from '../../../Apis/api';
import GlobalLoader from '../../../Component/Loader';
import SendEmailToClientGlobalPopUp from './Emails/SendEmail';
import { AuthenticationContext } from '../../../Apis/AuthProvider';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const STATUS_STYLES = {
  ACCEPTED: 'bg-[#E3F1E8] text-[#1E5A3B] ring-[#1E5A3B]/25',
  SENT:     'bg-[#E2EEF4] text-[#1D4E68] ring-[#1D4E68]/25',
  DRAFT:    'bg-[#FDF4DD] text-[#7A4E08] ring-[#F2B544]/30',
  REJECTED: 'bg-[#FBE5E2] text-[#8E2A1F] ring-[#8E2A1F]/25',
  EXPIRED:  'bg-[#FBE5E2] text-[#8E2A1F] ring-[#8E2A1F]/25',
};

const getStatusStyle = (status) =>
  STATUS_STYLES[status] || 'bg-[#F6F1E7] text-[#6B6459] ring-[#E4DCCB]';

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
    <div
      className={`relative overflow-hidden rounded-md border px-3 py-2.5 text-center transition-all duration-300 hover:scale-[1.02] ${
        accent
          ? 'border-[#E8772E]/30 bg-[#FCE9DA]'
          : 'border-[#E4DCCB] bg-[#F6F1E7]/60 hover:bg-[#F6F1E7]'
      }`}
    >
      {Icon && (
        <Icon
          className={`mx-auto mb-1 h-3.5 w-3.5 ${
            accent ? 'text-[#B34F12]' : 'text-[#6B6459]'
          }`}
        />
      )}
      <p className="text-[9.5px] font-bold uppercase tracking-widest text-[#6B6459]">
        {label}
      </p>
      <p
        className={`mt-0.5 text-sm font-bold ${
          accent ? 'text-[#B34F12]' : 'text-[#0F2A2E]'
        }`}
      >
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
      className={`group inline-flex h-9 w-9 items-center justify-center rounded-md border transition-all duration-300 disabled:cursor-not-allowed disabled:bg-[#E9E3D6] disabled:text-[#A39C8F] disabled:border-[#E9E3D6] disabled:hover:bg-[#E9E3D6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E] ${
        danger
          ? 'border-[#8E2A1F]/20 bg-[#FBE5E2] text-[#8E2A1F] hover:bg-[#8E2A1F]/15 hover:border-[#8E2A1F]/40'
          : 'border-[#E4DCCB] bg-white text-[#6B6459] hover:bg-[#FCE9DA] hover:text-[#B34F12] hover:border-[#E8772E]/40'
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ onCreate }) {
  return (
    <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden p-4">
      {/* Ambient washes */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#E8772E]/12 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-[#F2B544]/15 blur-[130px]" />

      <div className="relative w-full max-w-md rounded-3xl border border-[#E4DCCB] bg-white p-10 text-center shadow-[0_20px_60px_-15px_rgba(15,42,46,0.2)] transition-transform hover:scale-[1.01]">
        {/* Icon badge with glow */}
        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-[#E8772E]/25 blur-lg" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-[#E8772E] shadow-lg shadow-[#E8772E]/30">
            <MapPin className="h-9 w-9 text-[#0F2A2E]" />
          </div>
        </div>

        <h2 className="mb-2 text-2xl font-bold text-[#0F2A2E]">
          No quotes yet
        </h2>
        <p className="mb-8 text-sm leading-relaxed text-[#6B6459]">
          Start by creating your first safari itinerary and watch it come to life.
        </p>

        <button
          onClick={onCreate}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E8772E] px-8 py-3.5 text-sm font-bold text-[#0F2A2E]
                     shadow-lg shadow-[#E8772E]/25 transition-all duration-300
                     hover:bg-[#D4661F] hover:shadow-xl hover:shadow-[#E8772E]/30 hover:-translate-y-0.5
                     active:bg-[#B34F12] active:text-white active:translate-y-0 active:scale-[0.99]
                     focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
        >
          <Plus className="h-4 w-4" />
          Generate new itinerary
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */

export default function ListItinerariesWithVersionGlobal() {
  const [itineraryData, setItineraryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersions, setSelectedVersions] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [moreSheet, setMoreSheet] = useState(null);

  const [showSendQuoteModel, setShowSendQuoteModel] = useState(false);
  const [emailQuoteData, setEmailQuoteData] = useState(null);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const [userRole, setUserRole] = useState(null);
  const {refreshAuth} = useContext(AuthenticationContext);
  const navigateHelper = useMemo(()=>{
          if (userRole === "MANAGER") return '/dashboard/manager';
          if (userRole === "STAFF") return '/staff/dashboard';
          return null;
      }, [userRole])
  
  
  

  const navigate = useNavigate();
 
  const fetchItineraryData = async () => {
    setLoading(true);
    try {
      const resp = await api.get('itinerary/list/itinerary/quotes/');
      setItineraryData(Array.isArray(resp.data) ? resp.data : []);

      const user = await refreshAuth();
      if (user?.role === "MANAGER" || user?.role === "STAFF"){
         setUserRole(user.role);
      }else{
         navigate("/", {replace: true});
     }

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

  const handleEditVersion = (versionId, clientId) => {
    navigate(`${navigateHelper}/quotes/editing/${clientId}/${versionId}`);
  };

  const handleViewMore = (data, version) => {
    navigate(`/preview/safari/itinerary/${data.id}/${version.id}`);
  };

  const handleSendQuote = (data, version) => {
    setMoreSheet(null);
    setEmailQuoteData({ data, version });
    setShowSendQuoteModel(true);
  };

  if (loading) return <GlobalLoader />;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F6F1E7] text-[#0F2A2E] font-sans selection:bg-[#E8772E] selection:text-[#0F2A2E]">

      {/* Global Animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Ambient Background Glows */}
      <div className="pointer-events-none fixed -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#E8772E]/10 blur-[140px]" />
      <div className="pointer-events-none fixed -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#F2B544]/12 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Back navigation */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="group mb-6 inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-[#6B6459] transition-colors hover:text-[#0F2A2E] focus-visible:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
        >
          <MoveLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back
        </button>

        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0F2A2E] sm:text-4xl">
              My Quotes
            </h1>
            <p className="text-sm text-[#6B6459]">
              Manage, track, and refine your safari itineraries.
            </p>
          </div>

          <button
            onClick={() => navigate(`${navigateHelper}/quote/create/gate/`)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#E8772E] px-5 py-3 text-sm font-bold text-[#0F2A2E]
                       shadow-lg shadow-[#E8772E]/25 transition-all duration-300
                       hover:bg-[#D4661F] hover:shadow-xl hover:shadow-[#E8772E]/30 hover:-translate-y-0.5
                       active:bg-[#B34F12] active:text-white active:translate-y-0 active:scale-[0.98]
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
          >
            <Plus className="h-4 w-4" />
            New quote
          </button>
        </div>

        {/* Content Grid */}
        {!itineraryData.length ? (
          <EmptyState onCreate={() => navigate(`${navigateHelper}/quote/create/gate/`)} />
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
                  className="group relative overflow-hidden rounded-md border border-[#E4DCCB] bg-white shadow-[0_1px_2px_rgba(15,42,46,0.04)] transition-all duration-500 hover:border-[#E8772E]/40 hover:shadow-[0_20px_50px_-20px_rgba(232,119,46,0.3)]"
                >
                  {/* Top hover glow line */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E8772E]/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="flex flex-col md:flex-row">

                    {/* LEFT: Visual & Client Info */}
                    <div className="relative flex flex-col items-center border-b border-[#E4DCCB] bg-gradient-to-b from-[#FCE9DA]/60 to-transparent p-6 md:w-2/5 md:border-b-0 md:border-r">

                      <div className="w-full text-center md:text-left">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B6459]">
                          Quote for
                        </p>
                        <h3 className="mt-1 line-clamp-2 text-lg font-bold leading-tight text-[#0F2A2E]">
                          {active.client_name || 'Unknown Client'}
                        </h3>
                        <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-[#6B6459]">
                          <MapPin className="h-3.5 w-3.5 text-[#E8772E]" />
                          {country || 'Location TBD'}
                        </p>
                      </div>

                      {/* 3D Book Cover */}
                      <div className="relative mt-6 aspect-[3/4] w-32 [perspective:1000px] md:w-40">
                        <div className="relative h-full w-full rounded-r-lg rounded-l-sm bg-[#0F2A2E] shadow-[0_15px_40px_-15px_rgba(15,42,46,0.5)] transition-all duration-500 ease-out [transform-style:preserve-3d] [transform:rotateY(-15deg)] group-hover:[transform:rotateY(0deg)_scale(1.02)]">

                          {/* Cover Image / Placeholder */}
                          <div className="absolute inset-0 overflow-hidden rounded-r-lg rounded-l-sm">
                            {heroImage ? (
                              <img
                                src={heroImage}
                                alt={active.snapshot_tour_title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            ) : (
                              <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#E8772E] via-[#B34F12] to-[#0F2A2E]">
                                <MapPin className="h-8 w-8 text-[#F6F1E7]/50" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#F6F1E7]/60">
                                  No cover
                                </span>
                              </div>
                            )}
                            {/* Gloss Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-white/10" />
                          </div>

                          {/* Spine & Pages Effect */}
                          <div className="absolute inset-y-0 left-0 w-2 rounded-l-sm bg-gradient-to-r from-black/70 to-transparent" />
                          <div className="absolute inset-y-1 right-0 w-1.5 translate-x-1 rounded-r-sm bg-[#E4DCCB]/90" />

                          {/* Title Plate */}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0F2A2E] via-[#0F2A2E]/70 to-transparent p-3 pt-8">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#F2B544]">
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
                        <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ring-1 ${getStatusStyle(active.status)}`}>
                          {active.status}
                        </span>
                        <span className="rounded-md border border-[#E4DCCB] bg-[#F6F1E7] px-2.5 py-0.5 text-[10px] font-bold text-[#6B6459]">
                          v{active.version_number}
                        </span>
                        {isCurrent && (
                          <span className="rounded-md border border-[#1E5A3B]/25 bg-[#E3F1E8] px-2.5 py-0.5 text-[10px] font-bold text-[#1E5A3B]">
                            Current
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h2 className="line-clamp-2 text-xl font-bold text-[#0F2A2E]">
                        {active.snapshot_tour_title}
                      </h2>

                      {/* Meta row */}
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-medium text-[#6B6459]">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-[#E8772E]" />
                          {formatDateTime(active.created_at)}
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                          <Send className="h-3.5 w-3.5 text-[#E8772E]" />
                          Sent {active.sent_count ?? 0}×
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-[#E8772E]" />
                          Created by{' '}
                          <span className="font-semibold text-[#0F2A2E]">
                            {active.created_by || 'System'}
                          </span>
                        </span>
                      </div>

                      {/* Stats Grid */}
                      <div className="mt-5 grid grid-cols-3 gap-2.5">
                        <StatBox
                          label="Duration"
                          value={`${active.snapshot_tour_length} Day${Number(active.snapshot_tour_length) > 1 ? 's' : ''}`}
                        />
                        <StatBox
                          label="Total"
                          value={`$${formatMoney(active.grand_total)}`}
                          accent
                        />
                        <StatBox
                          label="Per Pax"
                          value={`$${formatMoney(active.price_per_person)}`}
                        />
                      </div>

                      {/* Version Switcher */}
                      {versions.length > 1 && (
                        <div className="mt-5">
                          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#6B6459]">
                            Versions
                          </p>
                          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {versions.map((v) => {
                              const isActive = v.id === active.id;
                              return (
                                <button
                                  key={v.id}
                                  type="button"
                                  onClick={() =>
                                    setSelectedVersions((prev) => ({ ...prev, [data.id]: v.id }))
                                  }
                                  className={`shrink-0 inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[11px] font-bold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E] ${
                                    isActive
                                      ? 'border-[#E8772E]/40 bg-[#FCE9DA] text-[#B34F12] shadow-sm'
                                      : 'border-[#E4DCCB] bg-white text-[#6B6459] hover:bg-[#F6F1E7] hover:text-[#0F2A2E] hover:border-[#E8772E]/30'
                                  }`}
                                >
                                  v{v.version_number}
                                  {v.is_current && (
                                    <span
                                      className={`h-1.5 w-1.5 rounded-full ${
                                        isActive ? 'bg-[#B34F12]' : 'bg-[#1E5A3B]'
                                      }`}
                                    />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="mt-6 flex items-center gap-2 border-t border-[#E4DCCB] pt-4">
                        <button
                          type="button"
                          onClick={() => handleViewMore(data, active)}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-[#E8772E] px-4 py-2.5 text-xs font-bold text-[#0F2A2E]
                                     shadow-lg shadow-[#E8772E]/25 transition-all duration-300
                                     hover:bg-[#D4661F] hover:shadow-xl hover:shadow-[#E8772E]/30 hover:-translate-y-0.5
                                     active:bg-[#B34F12] active:text-white active:translate-y-0 active:scale-[0.98]
                                     focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEditVersion(active.id, data.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-md border border-[#E4DCCB] bg-white px-4 py-2.5 text-xs font-bold text-[#0F2A2E] transition-all duration-300 hover:bg-[#FCE9DA] hover:border-[#E8772E]/40 hover:text-[#B34F12] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
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
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#0F2A2E]/75 backdrop-blur-sm [animation:fadeIn_.2s_ease-out]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-t-3xl border-t border-[#E4DCCB] bg-white p-6 pb-9 shadow-[0_-20px_60px_-15px_rgba(15,42,46,0.3)] [animation:slideUp_.32s_cubic-bezier(.16,1,.3,1)]"
          >
            {/* Drag handle */}
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-[#E4DCCB]" />

            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B6459]">
                  More options
                </p>
                <h3 className="line-clamp-2 text-base font-bold text-[#0F2A2E]">
                  {moreSheet.version.snapshot_tour_title}
                </h3>
                <p className="mt-0.5 font-mono text-[11px] font-semibold text-[#B34F12]">
                  {moreSheet.version.tour_code} · v{moreSheet.version.version_number}
                </p>
              </div>
              <button
                onClick={() => setMoreSheet(null)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E4DCCB] bg-white text-[#6B6459] transition hover:bg-[#F6F1E7] hover:text-[#0F2A2E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              {[
                {
                  icon: Send,
                  label: 'Send quote to client',
                  desc: 'Email this version to the traveller',
                  action: () => handleSendQuote(moreSheet.data, moreSheet.version),
                },
                {
                  icon: BellRing,
                  label: 'Follow up',
                  desc: 'Schedule a reminder to chase this quote',
                  action: () => { setMoreSheet(null); toast.success('Follow-up scheduled'); },
                },
                {
                  icon: UserPlus,
                  label: 'Assign to',
                  desc: 'Hand this quote over to a team member',
                  action: () => { setMoreSheet(null); toast.success('Assignment updated'); },
                },
                {
                  icon: FileText,
                  label: 'Duplicate version',
                  desc: 'Create a copy of this itinerary version',
                  action: () => { setMoreSheet(null); toast.warning('Coming soon...'); },
                },
              ].map(({ icon: Icon, label, desc, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="group flex w-full items-center gap-4 rounded-2xl border border-[#E4DCCB] bg-[#F6F1E7]/50 p-4 text-left transition-all duration-300 hover:border-[#E8772E]/40 hover:bg-[#FCE9DA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FCE9DA] text-[#B34F12] ring-1 ring-[#E8772E]/20 transition-transform group-hover:scale-110">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-[#0F2A2E]">
                      {label}
                    </span>
                    <span className="block truncate text-[11px] text-[#6B6459]">
                      {desc}
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[#6B6459] transition-colors group-hover:text-[#B34F12]" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------- DELETE CONFIRMATION MODAL ------------------- */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F2A2E]/75 p-4 backdrop-blur-sm [animation:fadeIn_.2s_ease-out]">
          <div className="w-full max-w-sm rounded-3xl border border-[#E4DCCB] bg-white p-6 text-center shadow-[0_20px_60px_-15px_rgba(15,42,46,0.3)] [animation:popIn_.25s_cubic-bezier(.16,1,.3,1)]">

            {/* Icon with glow */}
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-[#8E2A1F]/25 blur-md" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-[#8E2A1F]/25 bg-[#FBE5E2] text-[#8E2A1F]">
                  <Trash2 className="h-7 w-7" />
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-[#0F2A2E]">
              Delete version {deleteTarget.version.version_number}?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#6B6459]">
              This will permanently remove{' '}
              <span className="font-semibold text-[#0F2A2E]">
                "{deleteTarget.version.snapshot_tour_title}"
              </span>
              . This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={actionLoading}
                className="w-1/2 rounded-xl border border-[#E4DCCB] bg-white py-3 text-sm font-bold text-[#0F2A2E] transition hover:bg-[#F6F1E7] disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={actionLoading}
                className="inline-flex w-1/2 min-w-[120px] items-center justify-center gap-2 rounded-xl bg-[#8E2A1F] py-3 text-sm font-bold text-white shadow-md shadow-[#8E2A1F]/20 transition hover:bg-[#7A2419] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
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

      {/* ------------------- SEND EMAIL MODAL ------------------- */}
      {showSendQuoteModel && emailQuoteData && (
        <SendEmailToClientGlobalPopUp
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
            toast.success('Itinerary sent successfully!');
          }}
        />
      )}
    </div>
  );
}