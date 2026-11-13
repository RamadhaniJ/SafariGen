import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../Apis/api";
import GlobalLoader from "../../Component/Loader";
import ManagerCreateCompanyPoUp from "./createCompany";
import ManagerEditCompanyPoUp from "./editCompany";

import { toast } from "react-toastify";
import {
  Building2,
  Plus,
  AlertCircle,
  Crown,
  Link2,
  Pencil,
  Calendar,
  FileText,
  Hash,
  Sparkles,
  ArrowUpRight,
  Globe,
  Mail,
  Phone,
} from "lucide-react";

const MAX_COMPANY_LIMIT = 3;

const STATUS_STYLES = {
  PENDING: {
    bg: "bg-[#F2B544]/15",
    text: "text-[#B34F12]",
    border: "border-[#F2B544]/40",
    dot: "bg-[#F2B544]",
    label: "Pending",
  },
  VERIFIED: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    label: "Verified",
  },
  REJECTED: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
    label: "Rejected",
  },
};

export default function ListCompaniesToManagerPage() {
  const [companiesData, setCompaniesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddCompanyPopUp, setShowAddCompanyPopUp] = useState(false);
  const [showEditCompanyPopUp, setShowEditCompanyPopUp] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const fetchCompaniesData = async () => {
    setLoading(true);
    try {
      const resp = await api.get("account/users/list/company");
      setCompaniesData(resp.data || []);
    } catch (error) {
      const errorMsg =
        error.response?.data?.detail?.error ||
        "Something went wrong fetching companies.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompaniesData();
  }, []);

  const isMaxReached = companiesData.length >= MAX_COMPANY_LIMIT;

  const handleEditClick = (company) => {
    setSelectedCompany(company);
    setShowEditCompanyPopUp(true);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const getFileName = (fileField) => {
    if (!fileField) return null;
    const url = typeof fileField === "string" ? fileField : fileField?.url || "";
    const parts = url.split("/").filter(Boolean);
    return parts[parts.length - 1] || null;
  };

  if (loading) return <GlobalLoader />;

  return (
    <div className="min-h-screen bg-[#F6F1E7] text-[#0F2A2E] font-sans">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-8 lg:py-12 space-y-8">
        {/* ========== HEADER ========== */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#0F2A2E] flex items-center justify-center shadow-lg shadow-[#0F2A2E]/10">
                <Building2 className="w-5 h-5 text-[#F2B544]" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {companiesData.length === 1 ? "My Company" : "My Companies"}
                </h1>
                <p className="text-sm text-[#6B6459]">
                  Manage everything about your businesses in one place.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E4DCCB] text-xs font-semibold text-[#0F2A2E]">
                <Sparkles className="w-3 h-3 text-[#E8772E]" />
                {companiesData.length} of {MAX_COMPANY_LIMIT} slots used
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
                onClick={() => setShowAddCompanyPopUp(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E8772E] text-white text-sm font-semibold hover:bg-[#B34F12] shadow-lg shadow-[#E8772E]/25 transition-all active:scale-[0.98] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E8772E] focus:ring-offset-2 focus:ring-offset-[#F6F1E7]"
              >
                <Plus className="w-4 h-4" />
                Add Company
              </button>
            )}
          </div>
        </header>

        {/* ========== CONTENT ========== */}
        {companiesData.length === 0 ? (
          <EmptyState onAdd={() => setShowAddCompanyPopUp(true)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {companiesData.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onEdit={() => handleEditClick(company)}
                formatDate={formatDate}
                getFileName={getFileName}
              />
            ))}
          </div>
        )}
      </div>

      {/* ========== MODALS ========== */}
      {showAddCompanyPopUp && (
        <ManagerCreateCompanyPoUp
          open={showAddCompanyPopUp}
          onClose={() => setShowAddCompanyPopUp(false)}
          onSuccess={() => {
            setShowAddCompanyPopUp(false);
            fetchCompaniesData();
          }}
        />
      )}

      {showEditCompanyPopUp && selectedCompany && (
        <ManagerEditCompanyPoUp
          open={showEditCompanyPopUp}
          company={selectedCompany}
          onClose={() => {
            setShowEditCompanyPopUp(false);
            setSelectedCompany(null);
          }}
          onSuccess={() => {
            setShowEditCompanyPopUp(false);
            setSelectedCompany(null);
            fetchCompaniesData();
          }}
        />
      )}
    </div>
  );
}

/* ============================================================
   COMPANY CARD
   ============================================================ */
function CompanyCard({ company, onEdit, formatDate, getFileName }) {
  const statusStyle = STATUS_STYLES[company.status] || STATUS_STYLES.PENDING;
  const isVerified = company.status === "VERIFIED";

  const certName = getFileName(company.certificate_of_incorporation);
  const taxName = getFileName(company.tax_id_certificate);

  return (
    <article className="group relative bg-white rounded-sm border border-[#E4DCCB] hover:border-[#E8772E]/40 hover:shadow-xl hover:shadow-[#E8772E]/5 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-[#E8772E] via-[#F2B544] to-[#0F2A2E]" />

      <div className="p-6 flex flex-col gap-5 flex-1">
        {/* Header: logo + name + status */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 shrink-0 rounded-xl bg-[#F6F1E7] border border-[#E4DCCB] overflow-hidden flex items-center justify-center">
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-[#E8772E]">
                {(company.name || "?").charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-[#0F2A2E] truncate">
              {company.name || "Unnamed Company"}
            </h3>

            <div className="mt-1.5 flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
              >
                {/* <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} /> */}
                {statusStyle.label}
              </span>

              {company.country && (
                <span className="inline-flex items-center gap-1 text-xs text-[#6B6459]">
                  <Globe className="w-3 h-3" />
                  {company.country}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* About */}
        {company.about && (
          <p className="text-sm text-[#6B6459] leading-relaxed line-clamp-2">
            {company.about}
          </p>
        )}

        {/* Meta info */}
        <div className="space-y-2.5 pt-1">
          {company.website && (
            <MetaRow
              icon={<Link2 className="w-3.5 h-3.5" />}
              label="Website"
            >
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#B34F12] hover:text-[#E8772E] font-medium text-xs truncate max-w-full transition-colors"
              >
                {company.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                <ArrowUpRight className="w-3 h-3 shrink-0" />
              </a>
            </MetaRow>
          )}


          {company.email && (
            <MetaRow icon={<Mail className="w-3.5 h-3.5" />} label="Email">
              <span className="text-xs font-medium text-[#0F2A2E] truncate">
                {company.email}
              </span>
            </MetaRow>
          )}

          {company.phone_number && (
            <MetaRow icon={<Phone className="w-3.5 h-3.5" />} label="Phone Number">
              <span className="text-xs font-medium text-[#0F2A2E] truncate">
                {company.phone_number}
              </span>
            </MetaRow>
          )}


          {company.tax_id_number && (
            <MetaRow icon={<Hash className="w-3.5 h-3.5" />} label="Tax ID">
              <span className="text-xs font-medium text-[#0F2A2E] truncate">
                {company.tax_id_number}
              </span>
            </MetaRow>
          )}



          {certName && (
            <MetaRow
              icon={<FileText className="w-3.5 h-3.5" />}
              label="Incorporation"
            >
              <span className="text-xs font-medium text-[#0F2A2E] truncate">
                {certName}
              </span>
            </MetaRow>
          )}

          {taxName && (
            <MetaRow
              icon={<FileText className="w-3.5 h-3.5" />}
              label="Tax Cert."
            >
              <span className="text-xs font-medium text-[#0F2A2E] truncate">
                {taxName}
              </span>
            </MetaRow>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-5 border-t border-[#E4DCCB] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#6B6459]">
            <Calendar className="w-3.5 h-3.5" />
            <span>Created {formatDate(company.created_at)}</span>
          </div>

          <button
            onClick={onEdit}
            disabled={isVerified}
            title={
              isVerified
                ? "Verified companies cannot be edited"
                : "Edit company"
            }
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isVerified
                ? "bg-[#F6F1E7] text-[#6B6459]/60 cursor-not-allowed"
                : "bg-[#0F2A2E] text-white hover:bg-[#E8772E] cursor-pointer active:scale-95"
            }`}
          >
            <Pencil className="w-3 h-3" />
            Edit
          </button>
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   META ROW — reusable
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
          <Building2 className="w-8 h-8" />
        </div>

        <div className="mt-5 space-y-1.5">
          <h3 className="text-lg font-bold text-[#0F2A2E]">
            No company yet
          </h3>
          <p className="text-sm text-[#6B6459] max-w-sm mx-auto leading-relaxed">
            Get started by adding your first company. It only takes a minute to
            set up.
          </p>
        </div>

        <button
          onClick={onAdd}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E8772E] text-white text-sm font-semibold hover:bg-[#B34F12] shadow-lg shadow-[#E8772E]/20 transition-all active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E8772E] focus:ring-offset-2"
        >
          <Plus className="w-4 h-4" />
          Add your first company
        </button>
      </div>
    </div>
  );
}