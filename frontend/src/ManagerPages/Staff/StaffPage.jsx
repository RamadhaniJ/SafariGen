import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../Apis/api";
import { toast } from "sonner";
import ManagerCreateStaffPoUp from "./CreateStaff";
import ManagerEditStaffPoUp from "./EditStaff";
import {
  Users,
  UserPlus,
  Trash2,
  Mail,
  Calendar,
  AlertCircle,
  Crown,
  UserCircle,
  Building2,
  Pencil,
  Loader2,
  Sparkles,
  AlertTriangle,
  ArrowUpRight
} from "lucide-react";

const MAX_STAFF_LIMIT = 3;

export default function ManagerStaffPage() {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [showAddStaffPopUp, setShowAddStaffPopUp] = useState(false);
  const [showEditStaffPopUp, setShowEditStaffPopUp] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // ============ FETCH ============
  const fetchStaffUser = async () => {
    setLoading(true);
    try {
      const resp = await api.get("account/manager/staff/create/");
      setStaffData(resp.data || []);
    } catch (error) {
      const errorMsg =
        error.response?.data?.detail ||
        "Something went wrong fetching staff members.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffUser();
  }, []);

  // ============ DELETE ============
  const handleDeleteStaff = async (staffId) => {
    setActionLoading(true);
    try {
      await api.delete(`account/manager/staff/${staffId}/delete/`);
      toast.success("Staff member removed successfully.");
      setStaffData((prev) => prev.filter((s) => s.id !== staffId));
      setDeletingId(null);
    } catch (error) {
      let apiMessage = "Network connection error. Please try again.";
      if (error?.response?.data) {
        const data = error.response.data;
        if (typeof data === "string") apiMessage = data;
        else if (data.detail) {
          apiMessage = Array.isArray(data.detail)
            ? data.detail.join(" ")
            : data.detail;
        } else if (typeof data === "object") {
          const firstKey = Object.keys(data)[0];
          if (firstKey) {
            const firstError = data[firstKey];
            apiMessage = Array.isArray(firstError)
              ? firstError[0]
              : firstError;
          }
        }
      } else if (error?.message) {
        apiMessage = error.message;
      }
      toast.error(apiMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditClick = (staff) => {
    setSelectedStaff(staff);
    setShowEditStaffPopUp(true);
  };

  const isMaxReached = staffData.length >= MAX_STAFF_LIMIT;

  return (
    <div className="min-h-screen bg-[#F6F1E7] text-[#0F2A2E] font-sans">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-8 lg:py-12 space-y-8">
        {/* ========== HEADER ========== */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#0F2A2E] flex items-center justify-center shadow-lg shadow-[#0F2A2E]/10">
                <Users className="w-5 h-5 text-[#F2B544]" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  My Staff
                </h1>
                <p className="text-sm text-[#6B6459]">
                  Manage team members and their workspace access.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E4DCCB] text-xs font-semibold text-[#0F2A2E]">
                <Sparkles className="w-3 h-3 text-[#E8772E]" />
                {staffData.length} of {MAX_STAFF_LIMIT} slots used
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {isMaxReached ? (
              <>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F2B544]/15 border border-[#F2B544]/40 text-[#B34F12] text-xs font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  Limit reached
                </span>
                <Link
                  to="/subscriptions"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F2A2E] text-white text-sm font-semibold hover:bg-[#0F2A2E]/90 shadow-md transition-all active:scale-[0.98]"
                >
                  <Crown className="w-4 h-4 text-[#F2B544]" />
                  Upgrade plan
                </Link>
              </>
            ) : (
              <button
                onClick={() => setShowAddStaffPopUp(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E8772E] text-white text-sm font-semibold hover:bg-[#B34F12] shadow-lg shadow-[#E8772E]/25 transition-all active:scale-[0.98] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E8772E] focus:ring-offset-2 focus:ring-offset-[#F6F1E7]"
              >
                <UserPlus className="w-4 h-4" />
                Add Staff
              </button>
            )}
          </div>
        </header>

        {/* ========== CONTENT ========== */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#E4DCCB] flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-[#E8772E] animate-spin" />
            </div>
            <p className="text-xs text-[#6B6459] font-medium">
              Loading staff members...
            </p>
          </div>
        ) : staffData.length === 0 ? (
          <EmptyState onAdd={() => setShowAddStaffPopUp(true)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {staffData.map((staff) => (
              <StaffCard
                key={staff.id || staff.email}
                staff={staff}
                onEdit={() => handleEditClick(staff)}
                onDelete={() => setDeletingId(staff.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ========== DELETE MODAL ========== */}
      {deletingId && (
        <DeleteConfirmModal
          loading={actionLoading}
          onCancel={() => setDeletingId(null)}
          onConfirm={() => handleDeleteStaff(deletingId)}
        />
      )}

      {/* ========== CREATE MODAL ========== */}
      {showAddStaffPopUp && (
        <ManagerCreateStaffPoUp
          open={showAddStaffPopUp}
          onClose={() => setShowAddStaffPopUp(false)}
          onSuccess={() => {
            setShowAddStaffPopUp(false);
            fetchStaffUser();
          }}
        />
      )}

      {/* ========== EDIT MODAL ========== */}
      {showEditStaffPopUp && selectedStaff && (
        <ManagerEditStaffPoUp
          open={showEditStaffPopUp}
          staff={selectedStaff}
          onClose={() => {
            setShowEditStaffPopUp(false);
            setSelectedStaff(null);
          }}
          onSuccess={() => {
            setShowEditStaffPopUp(false);
            setSelectedStaff(null);
            fetchStaffUser();
          }}
        />
      )}
    </div>
  );
}

/* ============================================================
   STAFF CARD
   ============================================================ */
function StaffCard({ staff, onEdit, onDelete }) {
  const initial = (staff.full_name || staff.email || "?")
    .charAt(0)
    .toUpperCase();

  const companies = Array.isArray(staff.company_data)
    ? staff.company_data
    : staff.company_data
    ? [staff.company_data]
    : [];

  return (
    <article className="group relative bg-white rounded-2xl border border-[#E4DCCB] hover:border-[#E8772E]/40 hover:shadow-xl hover:shadow-[#E8772E]/5 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-[#E8772E] via-[#F2B544] to-[#0F2A2E]" />

      <div className="p-6 flex flex-col gap-5 flex-1">
        {/* Header: avatar + name + role pill */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="w-14 h-14 shrink-0 rounded-xl bg-[#F6F1E7] border border-[#E4DCCB] overflow-hidden flex items-center justify-center">
              {staff.avatar ? (
                <img
                  src={staff.avatar}
                  alt={staff.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-[#E8772E]">
                  {initial}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-[#0F2A2E] truncate">
                {staff.full_name || "Staff User"}
              </h3>
              <span className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0F2A2E] text-[#F2B544] text-[10px] font-bold uppercase tracking-wide">
                Staff
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onEdit}
              title="Edit staff"
              className="p-2 rounded-lg text-[#6B6459] hover:text-[#0F2A2E] hover:bg-[#F6F1E7] transition-colors cursor-pointer"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              title="Remove staff"
              className="p-2 rounded-lg text-[#6B6459] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-2.5 pt-1">
          {staff.full_name && (
            <MetaRow icon={<UserCircle className="w-3.5 h-3.5" />} label="Name">
              <span className="text-xs font-medium text-[#0F2A2E] truncate">
                {staff.full_name}
              </span>
            </MetaRow>
          )}

          {staff.email && (
            <MetaRow icon={<Mail className="w-3.5 h-3.5" />} label="Email">
              <span className="text-xs font-medium text-[#0F2A2E] truncate">
                {staff.email}
              </span>
            </MetaRow>
          )}

          {companies.length > 0 ? (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wide font-semibold text-[#6B6459]">
                    Assigned to
                  </span>
                  <span className="text-[10px] font-semibold text-[#B34F12] bg-[#FCE9DA] px-2 py-0.5 rounded-full">
                    {companies.length} {companies.length === 1 ? "company" : "companies"}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {companies.map((c) => {
                    const logoSrc =
                      typeof c.logo === "string" ? c.logo : c.logo?.url || null;
                    const cleanWebsite = (c.website || "")
                      .replace(/^https?:\/\//, "")
                      .replace(/\/$/, "");

                    return (
                      <div
                        key={c.id}
                        className="group/company flex items-center gap-2.5 p-2 rounded-xl bg-[#F6F1E7]/60 border border-[#E4DCCB] hover:bg-[#FCE9DA]/60 hover:border-[#E8772E]/40 transition-all duration-200"
                      >
                        {/* Logo */}
                        <div className="w-8 h-8 shrink-0 rounded-lg bg-white border border-[#E4DCCB] overflow-hidden flex items-center justify-center">
                          {logoSrc ? (
                            <img
                              src={logoSrc}
                              alt={c.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-bold text-[#E8772E]">
                              {(c.name || "?").charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>

                        {/* Name + website */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-[#0F2A2E] truncate leading-tight">
                            {c.name}
                          </h4>
                          {cleanWebsite && (
                            <a
                              href={c.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-0.5 text-[10px] font-medium text-[#B34F12] hover:text-[#E8772E] transition-colors truncate max-w-full"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span className="truncate">{cleanWebsite}</span>
                              <ArrowUpRight className="w-2.5 h-2.5 shrink-0" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F6F1E7]/60 border border-dashed border-[#E4DCCB]">
                <div className="w-8 h-8 shrink-0 rounded-lg bg-white border border-[#E4DCCB] flex items-center justify-center text-[#6B6459]">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs italic text-[#6B6459]">
                  No companies assigned yet
                </span>
              </div>
            )}


        </div>

        {/* Footer */}
        <div className="mt-auto pt-5 border-t border-[#E4DCCB] flex items-center justify-between text-[11px] text-[#6B6459]">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              Added{" "}
              {staff.joined_at
                ? new Date(staff.joined_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "recently"}
            </span>
          </div>
          {staff.created_by && (
            <span className="italic truncate max-w-[140px]">
              by {staff.created_by}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   META ROW
   ============================================================ */
function MetaRow({ icon, label, children }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 shrink-0 rounded-lg bg-[#F6F1E7] border border-[#E4DCCB] flex items-center justify-center text-[#6B6459]">
        {icon}
      </div>
      <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
        <span className="text-[10px] uppercase tracking-wide font-semibold text-[#6B6459]">
          {label}
        </span>
        <div className="min-w-0 truncate text-right">{children}</div>
      </div>
    </div>
  );
}

/* ============================================================
   EMPTY STATE
   ============================================================ */
function EmptyState({ onAdd }) {
  return (
    <div className="relative max-w-lg mx-auto my-12">
      <div className="relative bg-white rounded-3xl border border-[#E4DCCB] p-12 text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-[#F6F1E7] border border-[#E4DCCB] flex items-center justify-center text-[#E8772E] mx-auto">
          <Users className="w-8 h-8" />
        </div>
        <div className="mt-5 space-y-1.5">
          <h3 className="text-lg font-bold text-[#0F2A2E]">
            No staff members yet
          </h3>
          <p className="text-sm text-[#6B6459] max-w-sm mx-auto leading-relaxed">
            Add your first team member and give them operational access to your
            verified companies.
          </p>
        </div>
        <button
          onClick={onAdd}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E8772E] text-white text-sm font-semibold hover:bg-[#B34F12] shadow-lg shadow-[#E8772E]/20 transition-all active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E8772E] focus:ring-offset-2"
        >
          <UserPlus className="w-4 h-4" />
          Add first staff
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   DELETE CONFIRM MODAL
   ============================================================ */
function DeleteConfirmModal({ loading, onCancel, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2A2E]/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => !loading && onCancel()}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white border border-[#E4DCCB] rounded-2xl p-6 sm:p-7 space-y-5 text-center shadow-2xl animate-in zoom-in-95 duration-200"
      >
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-[#0F2A2E]">
            Remove staff member?
          </h3>
          <p className="text-xs text-[#6B6459] leading-relaxed">
            This user will lose access to the manager platform immediately.
            This action cannot be undone.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-white border border-[#E4DCCB] text-[#0F2A2E] font-semibold text-sm hover:bg-[#F6F1E7] transition-all disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 shadow-md shadow-red-500/20 transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Removing...
              </>
            ) : (
              "Remove"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}