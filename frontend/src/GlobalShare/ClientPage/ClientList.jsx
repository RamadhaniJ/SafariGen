import { useState, useEffect, useRef, useContext, useMemo, use } from "react";
import api from "../../Apis/api";
import GlobalLoader from "../../Component/Loader";
import { toast } from "sonner";
import EditClientInfoComponentGlobal from "./EditClientInfo";
import {
    Edit3,
    Mail,
    PhoneCall,
    Trash2,
    Globe,
    ChevronDown,
    CheckCircle2,
    Phone, 
    User,
    Calendar,
    X,
    Search,
    AlertTriangle,
    Plus,
    GitFork,
    MoveRight,
    Building2,
    Milestone
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../../Apis/AuthProvider";

export default function ClientListGlobal() {

    const navigate = useNavigate();
    const {refreshAuth} = useContext(AuthenticationContext);
    
 
    

    // Data State
    const [clients, setClients] = useState([]);
    //____COMPANY DATA____
    const [companyData, setCompanyData] = useState([]);
    const [load, setLoad] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Active Selection State
    const [selectedClient, setSelectedClient] = useState(null); 
    const [showDeletePop, setShowDeletePop] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [showEditPop, setShowEditPop] = useState(false);

    const [userRole, setUserRole] = useState(null);

    const navigateHelper = useMemo(()=>{
        if (userRole === "MANAGER") return '/dashboard/manager';
        if (userRole === "STAFF") return '/staff/dashboard';
        return null;
    }, [userRole])

    // Fetch Clients List
    const fetchClientsAndCompanyData = async () => {
        setLoad(true);
        try {
            const [clientResp, companyResp] = await Promise.all([
                api.get("clients/list/clients/"),
                api.get("clients/company/list/"),
                ]);
            setClients(clientResp.data);
            setCompanyData(companyResp.data);

             const user = await  refreshAuth();

            if (user?.role === "MANAGER" || user?.role === "STAFF"){
                    setUserRole(user.role);
               }else{
                  navigate("/", {replace: true});
               }
 
            
        } catch (err) {
            toast.error(err.response?.data?.detail?.error?.message || "Failed to load clients.");
        } finally {
            setLoad(false);
        }
    };

    useEffect(() => {
        fetchClientsAndCompanyData();
    }, []);



    // Open Edit Modal
const openEditModal = (client) => {
    setSelectedClient(client);
    setShowEditPop(true);
};



    // Open Delete Modal
    const openDeleteModal = (client) => {
        setSelectedClient(client);
        setShowDeletePop(true);
    };

    // Execute Delete
    const handleDelete = async () => {
        if (!selectedClient) return;
        setIsDeleting(true);
        try {
            await api.delete(`clients/update/clients/${selectedClient.id}/`);
            toast.success("Client record deleted successfully.");
            setClients((prev) => prev.filter((c) => c.id !== selectedClient.id));
            setShowDeletePop(false);
            setSelectedClient(null);
        } catch (err) {
            toast.error(err.response?.data?.detail || "Could not delete client.");
        } finally {
            setIsDeleting(false);
        }
    };


    // Search Filter
    const filteredClients = clients.filter((client) => {
        const query = searchTerm.toLowerCase();
        return (
            client.first_name?.toLowerCase().includes(query) ||
            client.last_name?.toLowerCase().includes(query) ||
            client.email?.toLowerCase().includes(query) ||
            client.country?.toLowerCase().includes(query)
        );
    });

    if (load) return <GlobalLoader />;

    return (
        <div className="min-h-screen bg-[#F6F1E7] text-[#0F2A2E] p-4 sm:p-8 font-sans antialiased selection:bg-[#E8772E] selection:text-[#0F2A2E] relative overflow-x-hidden">

            {/* Ambient brand washes */}
            <div className="pointer-events-none fixed top-0 left-1/4 w-[600px] h-[600px] bg-[#E8772E]/8 blur-[140px] rounded-full" />
            <div className="pointer-events-none fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-[#F2B544]/10 blur-[140px] rounded-full" />

            <div className="relative z-10">

                {/* Header Section */}
                   {/* ── Header Section ─────────────────────────────────────── */}
                        <div className="max-w-7xl mx-auto mb-10">
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                                {/* Left: Title block */}
                                <div className="min-w-0 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F2A2E]">
                                            Client Directory
                                        </h1>

                                        {/* Count badge */}
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4DCCB] bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-[#6B6459] backdrop-blur-sm">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#E8772E]" />
                                            {clients.length} {clients.length === 1 ? "client" : "clients"}
                                        </span>
                                    </div>

                                    <p className="max-w-xl text-xs sm:text-sm leading-relaxed text-[#6B6459]">
                                        Manage, edit, and track your active clients and leads — all in one place.
                                    </p>
                                </div>

                                {/* Right: Search + CTA */}
                                <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">

                                    {/* Search Bar */}
                                    <div className="relative w-full sm:w-72 lg:w-80 group">
                                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6459] transition-colors group-focus-within:text-[#E8772E]" />

                                        <input
                                            type="text"
                                            placeholder="Search clients..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full rounded-xl border border-[#E4DCCB] bg-white/80 py-2.5 pl-10 pr-16 text-sm text-[#0F2A2E] placeholder:text-[#6B6459]/50 backdrop-blur-sm transition-all
                                                    hover:border-[#E8772E]/40
                                                    focus:outline-none focus:border-[#E8772E] focus:ring-4 focus:ring-[#E8772E]/10 focus:bg-white"
                                        />

                                        {/* Keyboard hint (⌘K style) */}
                                        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-md border border-[#E4DCCB] bg-[#F6F1E7] px-1.5 py-0.5 font-sans text-[10px] font-semibold text-[#6B6459] sm:inline-flex">
                                            ⌘K
                                        </kbd>
                                    </div>

                                    {/* CTA Button — "New Lead" */}
                                    {navigateHelper && (
                                    <button
                                        type="button"
                                        onClick={() => navigate(`${navigateHelper}/clients/create/`)}
                                        className="group/cta inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0F2A2E] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_-4px_rgba(15,42,46,0.35)] transition-all duration-200
                                                hover:-translate-y-0.5 hover:bg-[#1C444A] hover:shadow-[0_8px_22px_-6px_rgba(15,42,46,0.45)]
                                                active:translate-y-0 active:scale-[0.98]
                                                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                                    >
                                        <Plus className="h-4 w-4 transition-transform duration-200 group-hover/cta:rotate-90" />
                                        <span>New Lead</span>
                                    </button>
                                    )}
                                </div>
                            </div>

                            {/* Subtle divider with gradient edges */}
                            <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-[#E4DCCB] to-transparent" />
                        </div>

                {/* Main Content Area */}
                <div className="max-w-7xl mx-auto">
                   {filteredClients.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {filteredClients.map((client) => (
                                    <article
                                        key={client.id}
                                        className="group relative flex flex-col justify-between overflow-hidden rounded-sm border border-[#E4DCCB] bg-white p-5 shadow-[0_1px_2px_rgba(15,42,46,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E8772E]/40 hover:shadow-[0_16px_34px_-18px_rgba(232,119,46,0.45)]"
                                    >
                                        {/* Hover accent line */}
                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#E8772E] via-[#F2B544] to-[#E8772E] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                        />

                                        <div className="min-w-0 flex-1">
                                            {/* ── Header ───────────────────────────────── */}
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    {/* Initials avatar */}
                                                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#0F2A2E] to-[#1C444A] text-[11px] font-bold uppercase tracking-wider text-[#F6F1E7] ring-1 ring-[#0F2A2E]/10">
                                                        {(client.first_name?.[0] || "").toUpperCase()}
                                                        {(client.last_name?.[0] || "").toUpperCase()}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <h2 className="truncate text-base font-bold leading-tight text-[#0F2A2E]">
                                                            {client.salutation ? `${client.salutation}. ` : ""}
                                                            {client.first_name} {client.last_name}
                                                        </h2>

                                                        <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-sm border border-[#F2B544]/30 bg-[#FDF4DD] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#7A4E08]">
                                                            <span className="h-1 w-1 shrink-0 rounded-sm bg-[#E8772E]" />
                                                            <span className="truncate">{client.source || "Direct"}</span>
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Action buttons */}
                                                <div className="flex shrink-0 items-center gap-0.5 rounded-sm border border-[#E4DCCB] bg-[#F6F1E7] p-1 transition-colors duration-200 group-hover:border-[#E8772E]/25">
                                                    <button
                                                        onClick={() => openEditModal(client)}
                                                        title="Edit Client"
                                                        aria-label="Edit Client"
                                                        className="rounded-lg p-1.5 text-[#6B6459] transition-colors hover:bg-[#FCE9DA] hover:text-[#B34F12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(client)}
                                                        title="Delete Client"
                                                        aria-label="Delete Client"
                                                        className="rounded-lg p-1.5 text-[#6B6459] transition-colors hover:bg-[#FBE5E2] hover:text-[#8E2A1F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* ── Contact details ──────────────────────── */}
                                            <div className="mt-4 space-y-2 text-xs text-[#0F2A2E]">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-[#FCE9DA] text-[#B34F12]">
                                                        <Mail className="h-3.5 w-3.5" />
                                                    </span>
                                                    <span className="min-w-0 truncate font-medium" title={client.email}>
                                                        {client.email}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2.5">
                                                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-[#FCE9DA] text-[#B34F12]">
                                                        <PhoneCall className="h-3.5 w-3.5" />
                                                    </span>
                                                    <span className="truncate font-medium">{client.phone}</span>
                                                </div>

                                                <div className="flex items-center gap-2.5">
                                                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-[#FCE9DA] text-[#B34F12]">
                                                        <Globe className="h-3.5 w-3.5" />
                                                    </span>
                                                    <span className="truncate font-medium">{client.country}</span>
                                                </div>

                                                <div className="flex items-center gap-2.5">
                                                   {/* Label with icon */}
                                                    <div className="flex shrink-0 items-center gap-1.5">
                                                        <span className="grid h-6 w-6 place-items-center rounded-md bg-[#FCE9DA] text-[#B34F12]">
                                                            <Building2 className="h-3.5 w-3.5" />
                                                        </span>
                                                        <span className="text-[#6B6459]">Lead from</span>
                                                    </div>

                                                    {/* Logo and company name */}
                                                    <div className="flex min-w-0 items-center gap-2">
                                                        <span className="grid h-6 w-6 shrink-0 place-items-center overflow-hidden rounded-md bg-[#FCE9DA]">
                                                            <img
                                                                src={client.company_logo}
                                                                alt=""
                                                                loading="lazy"
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </span>
                                                        <span className="truncate font-medium">{client.company_name}</span>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        {/* ── Footer ───────────────────────────────────── */}
                                        <div className="mt-5 border-t border-[#E4DCCB] pt-3">
                                            <div className="flex items-center justify-between gap-2 text-[11px] text-[#6B6459]">
                                                <div className="flex min-w-0 items-center gap-1">
                                                    <Calendar className="h-3 w-3 shrink-0" />
                                                    <span className="truncate">
                                                        Added {new Date(client.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <span className="min-w-0 truncate text-right">
                                                    By  {"   "} {client.created_by} · <span className="text-[#000000] font-semibold" ></span> {client.user_role}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => navigate(`${navigateHelper}/clients/create/request/${client.id}`)}
                                                className="group/btn mt-3 flex w-full items-center justify-center gap-1.5 border border-[#E8772E]/25 bg-[#FCE9DA]/60 px-3 py-2 text-xs font-semibold text-[#B34F12] transition-all duration-200 hover:border-transparent hover:bg-[#E8772E] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                                            >
                                                <span>Continue</span>
                                                <MoveRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) :  (
                        <div className="bg-white border border-[#E4DCCB] border-dashed rounded-3xl p-12 text-center max-w-md mx-auto my-12">
                            <div className="relative inline-block mb-4">
                                <div className="absolute inset-0 rounded-2xl bg-[#E8772E]/20 blur-md" />
                                <div className="relative w-14 h-14 bg-[#FCE9DA] border border-[#E8772E]/25 rounded-2xl flex items-center justify-center">
                                    <User className="w-6 h-6 text-[#B34F12]" />
                                </div>
                            </div>
                            <h3 className="text-base font-bold text-[#0F2A2E]">
                                No clients found
                            </h3>
                            {searchTerm ? (
                                <p className="text-xs text-[#6B6459] mt-1.5">
                                    No clients match your search criteria.
                                </p>
                            ) : (
                                <div className="mt-3 space-y-4">
                                    <p className="text-xs text-[#6B6459]">
                                        You haven't created any client records yet.
                                    </p>
                                    {navigateHelper && (
                                    <button
                                        onClick={() => navigate(`${navigateHelper}/clients/create/`)}
                                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#E8772E] text-[#0F2A2E] font-semibold text-xs
                                                   hover:bg-[#D4661F] shadow-lg shadow-[#E8772E]/25 transition-all
                                                   hover:shadow-xl hover:shadow-[#E8772E]/30 hover:-translate-y-0.5
                                                   active:bg-[#B34F12] active:text-white active:translate-y-0 active:scale-[0.99]
                                                   cursor-pointer
                                                   focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Create your first client
                                    </button>
                                 )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* DELETE CONFIRMATION MODAL */}
            {showDeletePop && selectedClient && (
                <div className="fixed inset-0 z-50 bg-[#0F2A2E]/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white border border-[#E4DCCB] rounded-2xl p-6 max-w-sm w-full shadow-[0_20px_60px_-15px_rgba(15,42,46,0.3)] space-y-4 animate-in zoom-in-95 duration-200">

                        {/* Icon badge with soft glow */}
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-xl bg-[#8E2A1F]/20 blur-md" />
                                <div className="relative w-12 h-12 bg-[#FBE5E2] border border-[#8E2A1F]/25 rounded-xl flex items-center justify-center text-[#8E2A1F]">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                            </div>
                        </div>

                        <div className="text-center space-y-1.5">
                            <h3 className="text-base font-bold text-[#0F2A2E]">
                                Delete client?
                            </h3>
                            <p className="text-xs text-[#6B6459] leading-relaxed">
                                Are you sure you want to delete{" "}
                                <strong className="text-[#0F2A2E]">
                                    {selectedClient.salutation}. {selectedClient.first_name} {selectedClient.last_name}
                                </strong>
                                ? This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                onClick={() => setShowDeletePop(false)}
                                disabled={isDeleting}
                                className="px-4 py-2 text-xs font-semibold text-[#0F2A2E] bg-white border border-[#E4DCCB] hover:bg-[#F6F1E7] rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 text-xs font-semibold text-white bg-[#8E2A1F] hover:bg-[#7A2419] rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                            >
                                {isDeleting ? "Deleting..." : "Delete permanently"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT CLIENT MODAL */}
                <EditClientInfoComponentGlobal
                    isOpen={showEditPop}
                    client={selectedClient}
                    companyData={companyData}
                    loadingCompanies={load}
                    onClose={() => {
                        setShowEditPop(false);
                        setSelectedClient(null);
                    }}
                    onUpdate={(updatedClient) => {
                        setClients((prev) =>
                            prev.map((c) => (c.id === updatedClient.id ? updatedClient : c))
                        );
                    }}
                />

            {/* Custom scrollbar */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e4dccb;
                    border-radius: 999px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #d4c9b0;
                }
            `}</style>
        </div>
    );
}