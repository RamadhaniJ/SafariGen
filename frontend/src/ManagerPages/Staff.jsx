// import api from "../../Apis/api";
// import { toast } from "sonner";
// import { Trash2 } from "lucide-react";
// import { useState } from "react";

// export default function ManageStaff() {
//     const [StaffData, setStaffData] = useState([]);

//     const [email, setEmail] = useState("")
//     const [emailEr, setEmailEr] = useState("")

//     const [password, setPassword] = useState("")
//     const [passwordEr, setPasswordEr] = useState("")

//     const [showPassword, setShowPassword] = useState(false);
//     const [loading, setLoading] = useState(false);

//     const [showAddStaffPopUp, setShowAddStaffPopUp] = useState(false);

//     const HandleAddStaff = async(e)=>{
//         e.preventDefault();
//         setShowAddStaffPopUp(true);

//         if (!email.trim()){
//             setEmailEr("Email address is required");
//             return;
//         }
//         if (!password.trim() || password.length< 8){
//             setPasswordEr("Please provide a strong password");
//             return;
//         }

//         setLoading(true);
//         try{
//             const resp = await api.post("account/create/staff/", {
//                 password: password,
//                 email: email
//             });
//             toast.success("Staff added Successfully!.")

//         }catch(error){
//             const errorMsg = error.response.data?.detail || "Something went wrong!";
//             toast.error(errorMsg);
//         }finally{
//             setLoading(false);
//         }


//     }

//     const fetchStaffUser = async ()=>{
//         setLoading(true);
//         try{
//             const resp = await api.get("account/create/staff/");
//             setStaffData(resp.data);
//         }catch(error){
//             const errorMsg = error.response.data?.detail || "Something went wrong when fetch Staff!";
//             toast.error(errorMsg);
//         }finally{
//             setLoading(false);
//         }
//     }

//     const Staffs = StaffData.length;

//     return(
//         <div>
//             <div className="flex items-center justify-between" >
//                 <h1>My Staff User</h1>
//                 {StaffData.length > 3? (
//                 <button disabled={true} className="">Max 3. Reached</button>
//                 <span>Explore our packages</span>
//                 ):(
//                 <button className="">Add New Staff up to 3</button>
//                 )}
//             </div>

//             <div className="grid grid-cols-4 items-center" >
//                 {StaffData.length === 0? (
//                     <div>
//                         <p>No any staff yet</p>
//                         <button>Add staff</button>
//                     </div>
//                 ):(
//                 {StaffData.map((staff)=>(
//                      <div>
//                     <div className="flex items-center space-x-4" >
//                         <img src={StaffData.avatar} alt="" srcset="" />
//                         <div >
//                             <h1>{StaffData.full_name}</h1>
//                             <p>created {new Date(StaffData.created_at).}</p>
//                         </div>
//                     </div>
//                     <div>
//                         <h2>Email {StaffData.email}</h2>
//                         <h2>Phone number {StaffData.phone}</h2>
//                     </div>
//                     <div>
//                     <button>
//                         <Trash2/> 
//                         Delete
//                     </button>
//                     </div>

//                 </div>
//                 ))}
//                  )}
               


//             </div>

//         </div>
//     )
    
// }













import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../Apis/api";
import { toast } from "sonner";
import { 
    Users, 
    UserPlus, 
    Trash2, 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    X, 
    Loader2, 
    Sparkles, 
    Calendar, 
    Phone, 
    AlertCircle,
    Crown
} from "lucide-react";

export default function ManageStaff() {
    const [staffData, setStaffData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Form inputs & errors
    const [email, setEmail] = useState("");
    const [emailEr, setEmailEr] = useState("");
    const [password, setPassword] = useState("");
    const [passwordEr, setPasswordEr] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Modal Visibility
    const [showAddStaffPopUp, setShowAddStaffPopUp] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const MAX_STAFF_LIMIT = 3;

    // Fetch staff on load
    const fetchStaffUser = async () => {
        setLoading(true);
        try {
            const resp = await api.get("account/create/staff/");
            setStaffData(resp.data || []);
        } catch (error) {
            const errorMsg = error.response?.data?.detail || "Something went wrong fetching staff members.";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaffUser();
    }, []);

    const handleAddStaff = async (e) => {
        e.preventDefault();

        // Clear errors
        setEmailEr("");
        setPasswordEr("");

        let isValid = true;

        if (!email.trim()) {
            setEmailEr("Email address is required.");
            isValid = false;
        }

        if (!password.trim() || password.length < 8) {
            setPasswordEr("Password must be at least 8 characters long.");
            isValid = false;
        }

        if (!isValid) return;

        setActionLoading(true);
        try {
            await api.post("account/create/staff/", {
                email: email.trim(),
                password: password,
            });

            toast.success("Staff member created successfully!");
            setEmail("");
            setPassword("");
            setShowAddStaffPopUp(false);
            fetchStaffUser(); // Refresh list
        } catch (error) {
             let apiMessage = "Network connection error. Please try again.";

            if (error?.response?.data) {
                const data = error.response.data;

                if (typeof data === "string") {
                    apiMessage = data;
                } else if (data.detail) {
                    // Kama imerudisha standard DRF detail string au array
                    apiMessage = Array.isArray(data.detail) ? data.detail.join(" ") : data.detail;
                } else if (typeof data === "object") {
                    const firstKey = Object.keys(data)[0];
                    if (firstKey) {
                        const firstError = data[firstKey];
                        const fieldName = "Error";
                        
                        if (Array.isArray(firstError)) {
                            apiMessage = `${fieldName}: ${firstError[0]}`;
                        } else if (typeof firstError === "string") {
                            apiMessage = `${fieldName}: ${firstError}`;
                        }
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

    const handleDeleteStaff = async (staffId) => {
        setActionLoading(true);
        try {
            await api.delete(`account/delete/staff/${staffId}/`);
            toast.success("Staff member removed successfully.");
            setStaffData(staffData.filter((s) => s.id !== staffId));
            setDeletingId(null);
        } catch (error) {
            let apiMessage = "Network connection error. Please try again.";

            if (error?.response?.data) {
                const data = error.response.data;

                if (typeof data === "string") {
                    apiMessage = data;
                } else if (data.detail) {
                    // Kama imerudisha standard DRF detail string au array
                    apiMessage = Array.isArray(data.detail) ? data.detail.join(" ") : data.detail;
                } else if (typeof data === "object") {
                    const firstKey = Object.keys(data)[0];
                    if (firstKey) {
                        const firstError = data[firstKey];
                        const fieldName = "Error"
                        
                        if (Array.isArray(firstError)) {
                            apiMessage = `${fieldName}: ${firstError[0]}`;
                        } else if (typeof firstError === "string") {
                            apiMessage = `${fieldName}: ${firstError}`;
                        }
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

    const isMaxReached = staffData.length >= MAX_STAFF_LIMIT;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-10 font-sans selection:bg-fuchsia-500 selection:text-white">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* HEADER & ACTION BAR */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-extrabold tracking-tight text-white">
                                My Staff
                            </h1>
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
                                {staffData.length} / {MAX_STAFF_LIMIT} Users
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm">
                            Manage team members and grant workspace operational access.
                        </p>
                    </div>

                    {/* Action Button / Limit Badge */}
                    <div className="flex items-center gap-3">
                        {isMaxReached ? (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    Limit Reached ({MAX_STAFF_LIMIT}/{MAX_STAFF_LIMIT})
                                </span>
                                <Link
                                    to="/subscriptions"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-semibold text-xs hover:from-fuchsia-500 hover:to-purple-500 shadow-md shadow-fuchsia-500/20 transition-all"
                                >
                                    <Crown className="w-3.5 h-3.5" />
                                    Upgrade Package
                                </Link>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowAddStaffPopUp(true)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-semibold text-sm hover:from-fuchsia-500 hover:to-purple-500 shadow-lg shadow-fuchsia-500/20 transition-all active:scale-95 cursor-pointer"
                            >
                                <UserPlus className="w-4 h-4" />
                                Add Staff User
                            </button>
                        )}
                    </div>
                </div>

                {/* STAFF GRID CONTENT */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-3">
                        <Loader2 className="w-8 h-8 text-fuchsia-500 animate-spin" />
                        <p className="text-xs text-slate-400 font-medium">Loading staff members...</p>
                    </div>
                ) : staffData.length === 0 ? (
                    /* EMPTY STATE */
                    <div className="p-12 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-5 max-w-lg mx-auto my-12">
                        <div className="w-16 h-16 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 mx-auto">
                            <Users className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-white">No Staff Members Yet</h3>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                                You haven't added any staff users to your team. Create access accounts for your sales managers or marketers.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAddStaffPopUp(true)}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
                        >
                            <UserPlus className="w-4 h-4" />
                            Add First Staff User
                        </button>
                    </div>
                ) : (
                    /* CARDS GRID */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {staffData.map((staff) => (
                            <div
                                key={staff.id || staff.email}
                                className="group relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between space-y-6"
                            >
                                <div className="space-y-4">
                                    {/* User Top Row */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center text-slate-200 font-bold text-base shadow-sm">
                                                {staff.avatar ? (
                                                    <img src={staff.avatar} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-fuchsia-400 font-black">
                                                        {(staff.full_name || staff.email).charAt(0).toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-sm font-bold text-white truncate">
                                                    {staff.full_name || "Staff User"}
                                                </h3>
                                                <span className="text-[10px] font-semibold text-fuchsia-400 bg-fuchsia-950/60 border border-fuchsia-500/20 px-2 py-0.5 rounded-md">
                                                    Staff Member
                                                </span>
                                            </div>
                                        </div>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => setDeletingId(staff.id)}
                                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                                            title="Remove Staff"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Contact Metadata */}
                                    <div className="space-y-2 pt-3 border-t border-slate-800/80 text-xs">
                                        <div className="flex items-center gap-2 text-slate-300 truncate">
                                            <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                            <span className="truncate">{staff.email}</span>
                                        </div>
                                        {staff.phone && (
                                            <div className="flex items-center gap-2 text-slate-300">
                                                <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                                <span>{staff.phone}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                                            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                            <span>
                                                Created {staff.joined_at ? new Date(staff.joined_at).toLocaleDateString() : "recently"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>

            {/* ADD STAFF MODAL POPUP */}
            {showAddStaffPopUp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-fuchsia-400" />
                                <h2 className="text-lg font-bold text-white">Add New Staff</h2>
                            </div>
                            <button
                                onClick={() => setShowAddStaffPopUp(false)}
                                className="p-1 text-slate-400 hover:text-white rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleAddStaff} className="space-y-4">
                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (emailEr) setEmailEr("");
                                        }}
                                        placeholder="staff@company.com"
                                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none transition-all ${
                                            emailEr ? "border-red-500" : "border-slate-800 focus:border-fuchsia-500"
                                        }`}
                                    />
                                </div>
                                {emailEr && <p className="text-xs text-red-400">{emailEr}</p>}
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                                    Initial Password
                                </label>
                                <div className="relative">
                                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (passwordEr) setPasswordEr("");
                                        }}
                                        placeholder="••••••••"
                                        className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none transition-all ${
                                            passwordEr ? "border-red-500" : "border-slate-800 focus:border-fuchsia-500"
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {passwordEr && <p className="text-xs text-red-400">{passwordEr}</p>}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-semibold text-sm hover:from-fuchsia-500 hover:to-purple-500 shadow-lg shadow-fuchsia-500/20 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {actionLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Creating Staff...
                                        </>
                                    ) : (
                                        "Create Staff User"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {deletingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 text-center shadow-2xl">
                        <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-white">Remove Staff Member?</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                This user will lose access to the manager platform immediately. This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                onClick={() => setDeletingId(null)}
                                className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteStaff(deletingId)}
                                disabled={actionLoading}
                                className="w-1/2 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-md shadow-red-500/20 transition-colors flex items-center justify-center gap-2"
                            >
                                {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}