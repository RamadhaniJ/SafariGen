import { useState, useEffect, useRef } from "react";
import api from "../../Apis/api";
import GlobalLoader from "../../Component/Loader";
import { toast } from "react-toastify";
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
    MoveLeft,
    MoveRight
} from "lucide-react";
import { COUNTRIES } from "../../Constants/Countries";
import { useNavigate } from "react-router-dom";

export default function ClientListPage() {
    const SALUTATIONS = ["Mr", "Mrs", "Ms", "Prof", "Dr"];
    const SOURCE_OPTIONS = ["Website", "Facebook", "Instagram", "Agent"];

    const navigate = useNavigate();

    // Data State
    const [clients, setClients] = useState([]);
    const [load, setLoad] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Active Selection State
    const [selectedClient, setSelectedClient] = useState(null);
    const [showDeletePop, setShowDeletePop] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [showEditPop, setShowEditPop] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Edit Form State
    const [salutation, setSalutation] = useState("");
    const [fName, setFName] = useState("");
    const [lName, setLName] = useState("");
    const [email, setEmail] = useState("");
    const [country, setCountry] = useState("");
    const [phone, setPhone] = useState("");
    const [source, setSource] = useState("");

    // Dropdown UI State
    const [isCountryOpen, setIsCountryOpen] = useState(false);
    const countryRef = useRef(null);

    // Fetch Clients List
    const fetchClientsData = async () => {
        setLoad(true);
        try {
            const resp = await api.get("clients/list/clients/");
            setClients(resp.data);
        } catch (error) {
        const data = error.response?.data;
        if (data?.detail) {
          toast.error(data.detail);
        } else if (data && typeof data === "object") {
          Object.entries(data).forEach(([field, msgs]) => {
            const text = Array.isArray(msgs) ? msgs.join(", ") : String(msgs);
            toast.error(`${field}: ${text}`);
          });
        } else {
          toast.error("Something went wrong. Please try again.");
        }
        } finally {
            setLoad(false);
        } 
    };

    useEffect(() => {
        fetchClientsData();
    }, []);

    // Handle Country Selection Outside Click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (countryRef.current && !countryRef.current.contains(event.target)) {
                setIsCountryOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredCountries = (COUNTRIES || []).filter((c) =>
        c.toLowerCase().includes(country.toLowerCase())
    );

    const handleSelectCountry = (selected) => {
        setCountry(selected);
        setIsCountryOpen(false);
    };

    // Open Edit Modal with Pre-filled Data
    const openEditModal = (client) => {
        setSelectedClient(client);
        setSalutation(client.salutation || "");
        setFName(client.first_name || "");
        setLName(client.last_name || "");
        setEmail(client.email || "");
        setCountry(client.country || "");
        setPhone(client.phone || "");
        setSource(client.source || "");
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

    // Execute Edit Update
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!selectedClient) return;
        setIsEditing(true);

        const payload = {
            salutation,
            first_name: fName,
            last_name: lName,
            email,
            country,
            phone,
            source,
        };

        try {
            const resp = await api.put(`clients/update/clients/${selectedClient.id}/`, payload);
            toast.success("Client updated successfully.");
            setClients((prev) =>
                prev.map((c) => (c.id === selectedClient.id ? resp.data : c))
            );
            setShowEditPop(false);
            setSelectedClient(null);
        } catch (err) {
            if (err.response?.data) {
                const errors = err.response.data;
                const errorMsg = typeof errors === 'object' 
                    ? Object.values(errors).flat().join(" ") 
                    : "Update failed";
                toast.error(errorMsg);
            } else {
                toast.error("Check your internet connection");
            }
        } finally {
            setIsEditing(false);
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
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans antialiased">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/80 pb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                        Client Directory
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                        Manage, edit, and track your active clients and leads.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30 focus:border-fuchsia-500 transition-all"
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto">
                {filteredClients.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredClients.map((client) => (
                            <div
                                key={client.id}
                                className="group relative bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-800 hover:bg-slate-900 transition-all duration-200 flex flex-col justify-between shadow-xl shadow-black/20"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-2 mb-3">
                                        <div>
                                            <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-fuchsia-400 bg-fuchsia-950/60 border border-fuchsia-800/40 rounded-md mb-1.5 uppercase tracking-wider">
                                                {client.source || "Direct"}
                                            </span>
                                            <h2 className="text-base font-bold text-white group-hover:text-fuchsia-300 transition-colors">
                                                {client.salutation}. {client.first_name} {client.last_name}
                                            </h2>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 p-1 rounded-xl">
                                            <button
                                                onClick={() => openEditModal(client)}
                                                title="Edit Client"
                                                className="p-1.5 text-slate-400 hover:text-fuchsia-400 hover:bg-slate-800 rounded-lg transition-colors"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(client)}
                                                title="Delete Client"
                                                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Contact Details */}
                                    <div className="space-y-2 text-xs text-slate-300 mt-4">
                                        <div className="flex items-center gap-2.5">
                                            <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                            <span className="truncate">{client.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <PhoneCall className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                            <span>{client.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                            <span>{client.country}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="mt-6 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3" />
                                        <span>
                                            Added {new Date(client.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="cursor-pointer hover:text-slate-400
                                    flex items-center space-x-3 hover:scale-100 transition-all hover:bg-slate-800 py-1 px-2 rounded-2xl " >
                                        <span
                                        className=""
                                        onClick={()=>navigate(`/staff/dashboard/create/client/request/${client.id}`)}
                                        >Continue with
                                        </span>
                                        <MoveRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-3xl p-12 text-center max-w-md mx-auto my-12">
                        <div className="w-12 h-12 bg-slate-800/80 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <User className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-slate-200">No clients found</h3>
                        <p className="text-xs text-slate-500 mt-1">
                            {searchTerm
                                ? "No clients match your search criteria."
                                : "You haven't created any client records yet."}
                        </p>
                    </div>
                )}
            </div>

            {/* DELETE CONFIRMATION MODAL */}
            {showDeletePop && selectedClient && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
                        <div className="w-10 h-10 bg-red-950/50 border border-red-800/50 rounded-xl flex items-center justify-center text-red-400">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white">Delete Client</h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Are you sure you want to delete{" "}
                                <strong className="text-slate-200">
                                    {selectedClient.salutation}. {selectedClient.first_name} {selectedClient.last_name}
                                </strong>
                                ? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                onClick={() => setShowDeletePop(false)}
                                disabled={isDeleting}
                                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl transition-colors disabled:opacity-50"
                            >
                                {isDeleting ? "Deleting..." : "Delete Permanently"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT CLIENT MODAL */}
            {showEditPop && selectedClient && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6  max-w-xl w-full shadow-2xl space-y-6 my-8 overflow-y-auto max-h-screen ">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white">Edit Client Information</h3>
                                <p className="text-xs text-slate-400">Update personal and source profile details.</p>
                            </div>
                            <button
                                onClick={() => setShowEditPop(false)}
                                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            {/* Salutation */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Salutation <span className="text-fuchsia-500">*</span>
                                </label>
                                <select
                                    required
                                    value={salutation}
                                    onChange={(e) => setSalutation(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all"
                                >
                                    <option value="" disabled className="text-slate-500">
                                        Select Salutation…
                                    </option>
                                    {SALUTATIONS.map((s) => (
                                        <option key={s} value={s} className="bg-slate-950 text-slate-100">
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Names */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                        First Name <span className="text-fuchsia-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={fName}
                                        onChange={(e) => setFName(e.target.value)}
                                        required
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                        Last Name <span className="text-fuchsia-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={lName}
                                        onChange={(e) => setLName(e.target.value)}
                                        required
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Email Address <span className="text-fuchsia-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all"
                                />
                            </div>

                            {/* Country Auto-complete */}
                            <div className="relative" ref={countryRef}>
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Country <span className="text-fuchsia-500">*</span>
                                </label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        type="text"
                                        value={country}
                                        onChange={(e) => {
                                            setCountry(e.target.value);
                                            setIsCountryOpen(true);
                                        }}
                                        onFocus={() => setIsCountryOpen(true)}
                                        required
                                        placeholder="Search or select country..."
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-10 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all"
                                    />
                                    <ChevronDown
                                        className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 transition-transform duration-200 pointer-events-none ${
                                            isCountryOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </div>

                                {isCountryOpen && (
                                    <ul className="absolute z-30 w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl max-h-48 overflow-y-auto shadow-2xl py-1">
                                        {filteredCountries.length > 0 ? (
                                            filteredCountries.map((c) => (
                                                <li
                                                    key={c}
                                                    onClick={() => handleSelectCountry(c)}
                                                    className="px-4 py-2 text-sm text-slate-300 hover:bg-fuchsia-600 hover:text-white cursor-pointer transition-colors flex items-center justify-between"
                                                >
                                                    <span>{c}</span>
                                                    {c === country && (
                                                        <CheckCircle2 className="w-4 h-4 text-fuchsia-400" />
                                                    )}
                                                </li>
                                            ))
                                        ) : (
                                            <li className="px-4 py-2.5 text-xs text-slate-500 italic">
                                                No country found
                                            </li>
                                        )}
                                    </ul>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Phone Number <span className="text-fuchsia-500">*</span>
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                        placeholder="+1 234 567 8900"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Acquisition Source */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    How did they hear about us? <span className="text-fuchsia-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {SOURCE_OPTIONS.map((src) => {
                                        const isSelected = source === src;
                                        return (
                                            <button
                                                type="button"
                                                key={src}
                                                onClick={() => setSource(src)}
                                                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                                                    isSelected
                                                        ? "bg-fuchsia-950/40 border-fuchsia-500/70 text-white ring-1 ring-fuchsia-500/40"
                                                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                                                }`}
                                            >
                                                <span className="text-xs font-medium">{src}</span>
                                                <div
                                                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                                        isSelected
                                                            ? "border-fuchsia-500 bg-fuchsia-500"
                                                            : "border-slate-700 bg-slate-950"
                                                    }`}
                                                >
                                                    {isSelected && (
                                                        <div className="w-1 h-1 rounded-full bg-white" />
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Submit Actions */}
                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setShowEditPop(false)}
                                    className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isEditing}
                                    className="px-5 py-2.5 text-xs font-semibold text-white bg-fuchsia-600 hover:bg-fuchsia-500 rounded-xl transition-all shadow-lg shadow-fuchsia-600/20 disabled:opacity-50"
                                >
                                    {isEditing ? "Saving Changes..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}