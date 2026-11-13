 import { Eye, EyeOff, Lock, ShieldCheck, Check, X, Loader2 } from "lucide-react";
 import { useState, useMemo } from "react";
 import { toast } from "react-toastify";
 import api from "../../Apis/api";
 
 // ─── Password rules ──────────────────────────────────────────────
 const PASSWORD_RULES = [
     { id: "length", label: "At least 8 characters", test: (p) => p.length >= 8 },
     { id: "upper",  label: "One uppercase letter",  test: (p) => /[A-Z]/.test(p) },
     { id: "lower",  label: "One lowercase letter",  test: (p) => /[a-z]/.test(p) },
     { id: "digit",  label: "One number",             test: (p) => /[0-9]/.test(p) },
     { id: "symbol", label: "One symbol (!@#$…)",    test: (p) => /[^A-Za-z0-9]/.test(p) },
 ];
 
 // ─── Password strength calculator ────────────────────────────────
 function getStrength(password) {
     if (!password) return { score: 0, label: "", color: "" };
     const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;
     if (passed <= 1) return { score: 1, label: "Very Weak", color: "bg-red-500" };
     if (passed === 2) return { score: 2, label: "Weak",      color: "bg-orange-500" };
     if (passed === 3) return { score: 3, label: "Fair",      color: "bg-yellow-500" };
     if (passed === 4) return { score: 4, label: "Good",      color: "bg-lime-500" };
     return { score: 5, label: "Strong", color: "bg-emerald-500" };
 }




// ─── Reusable field renderer ─────────────────────────────────
const PasswordField = ({ id, label, value, onChange, show, setShow, placeholder }) => (
         <div className="space-y-2">
             <label
                 htmlFor={id}
                 className="block text-xs font-semibold text-[#0F2A2E]/80 uppercase tracking-wider"
             >
                 {label} <span className="text-[#B34F12]">*</span>
             </label>
 
             <div className="relative">
                 <Lock
                     size={16}
                     className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6459]/60 pointer-events-none"
                 />
 
                 <input
                     id={id}
                     type={show ? "text" : "password"}
                     required
                     value={value}
                     onChange={(e) => onChange(e.target.value)}
                     placeholder={placeholder}
                     autoComplete="new-password"
                     className="w-full bg-white border px-4 py-3 pl-10 pr-11 text-sm text-[#0F2A2E]
                                placeholder:text-[#6B6459]/50 transition-all duration-200
                                focus:outline-none focus:ring-2
                                border-[#E4DCCB] focus:border-[#E8772E] focus:ring-[#E8772E]/20"
                 />
 
                 <button
                     type="button"
                     onClick={() => setShow((s) => !s)}
                     aria-label={show ? "Hide password" : "Show password"}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6459]/70
                                hover:text-[#E8772E] transition-colors p-1 rounded"
                 >
                     {show ? <EyeOff size={18} /> : <Eye size={18} />}
                 </button>
             </div>
         </div>
     );
 
 
 export default function ChangePasswordComponentGlobal() {
     const [currentPassword, setCurrentPassword] = useState("");
     const [newPassword, setNewPassword] = useState("");
     const [confirmNewPassword, setConfirmNewPassword] = useState("");
     const [isSubmit, setIsSubmit] = useState(false);
 
     // Show/hide per field
     const [showCurrent, setShowCurrent] = useState(false);
     const [showNew, setShowNew] = useState(false);
     const [showConfirm, setShowConfirm] = useState(false);
 
     // Live validation flags
     const ruleStatus = useMemo(
         () => PASSWORD_RULES.map((r) => ({ ...r, passed: r.test(newPassword) })),
         [newPassword]
     );
     const strength = useMemo(() => getStrength(newPassword), [newPassword]);
     const passwordsMatch = newPassword.length > 0 && newPassword === confirmNewPassword;
     const passwordsMismatch = confirmNewPassword.length > 0 && newPassword !== confirmNewPassword;
 
     // ─── Validation ──────────────────────────────────────────────
     const validate = () => {
         if (!currentPassword) {
             toast.error("Current password is required.");
             return false;
         }
         const allPassed = ruleStatus.every((r) => r.passed);
         if (!allPassed) {
             toast.error("New password does not meet all requirements.");
             return false;
         }
         if (newPassword !== confirmNewPassword) {
             toast.error("Passwords do not match.");
             return false;
         }
         if (currentPassword === newPassword) {
             toast.error("New password must be different from the current one.");
             return false;
         }
         return true;
     };
 
     // ─── Submit ──────────────────────────────────────────────────
     const handleChangePassword = async (e) => {
         e.preventDefault();
         if (!validate()) return;
 
         setIsSubmit(true);
         const payload = {
             current_password: currentPassword,
             new_password: newPassword,
             confirm_new_password: confirmNewPassword,
         };
 
         try {
             const { data } = await api.post("account/change/password/", payload);
             toast.success(data?.message || "Password changed successfully.");
 
             // Reset form
             setCurrentPassword("");
             setNewPassword("");
             setConfirmNewPassword("");
         } catch (error) {
             const res = error?.response?.data;
 
             if (!error.response) {
                 toast.error("Network error. Please try again.");
             } else if (typeof res === "string") {
                 toast.error(res);
             } else if (res && typeof res === "object") {
                 // DRF: { field: ["err1", "err2"], non_field_errors: [...] }
                 Object.entries(res).forEach(([field, messages]) => {
                     const text = Array.isArray(messages) ? messages.join(" ") : String(messages);
                     toast.error(`${field.replace(/_/g, " ")}: ${text}`);
                 });
             } else {
                 toast.error("Something went wrong. Try again.");
             }
         } finally {
             setIsSubmit(false);
         }
     };
 

     return (
         <div className="w-full max-w-xl">
             {/* Header */}
             <div className="mb-6 flex items-center gap-3">
                 <div className="p-2.5 rounded-2xl bg-[#E8772E]/10">
                     <ShieldCheck className="text-[#E8772E]" size={22} />
                 </div>
                 <div>
                     <h1 className="text-2xl font-bold text-[#0F2A2E]">Update Your Password</h1>
                     <p className="text-sm text-[#6B6459]">
                         Choose a strong password to keep your account secure.
                     </p>
                 </div>
             </div>
 
             <form
                 onSubmit={handleChangePassword}
                 className="space-y-5 bg-white border border-[#E4DCCB] p-6 shadow-sm"
             >
                 {/* Current */}
                 <PasswordField
                     id="current-password"
                     label="Current Password"
                     value={currentPassword}
                     onChange={setCurrentPassword}
                     show={showCurrent}
                     setShow={setShowCurrent}
                     placeholder="Enter current password"
                 />
 
                 {/* New + strength */}
                 <div className="space-y-2">
                     <PasswordField
                         id="new-password"
                         label="New Password"
                         value={newPassword}
                         onChange={setNewPassword}
                         show={showNew}
                         setShow={setShowNew}
                         placeholder="Enter new password"
                     />
 
                     {newPassword && (
                         <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                             {/* Strength bar */}
                             <div className="flex items-center gap-2">
                                 <div className="flex-1 h-1.5 bg-[#E4DCCB] rounded-full overflow-hidden">
                                     <div
                                         className={`h-full ${strength.color} transition-all duration-300`}
                                         style={{ width: `${(strength.score / 5) * 100}%` }}
                                     />
                                 </div>
                                 <span className="text-xs font-semibold text-[#0F2A2E]/70 min-w-[70px] text-right">
                                     {strength.label}
                                 </span>
                             </div>
 
                             {/* Rules checklist */}
                             <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-1">
                                 {ruleStatus.map((r) => (
                                     <li
                                         key={r.id}
                                         className={`flex items-center gap-1.5 text-xs transition-colors ${
                                             r.passed ? "text-emerald-600" : "text-[#6B6459]"
                                         }`}
                                     >
                                         {r.passed ? (
                                             <Check size={13} className="shrink-0" />
                                         ) : (
                                             <X size={13} className="shrink-0 opacity-50" />
                                         )}
                                         {r.label}
                                     </li>
                                 ))}
                             </ul>
                         </div>
                     )}
                 </div>
 
                 {/* Confirm */}
                 <div className="space-y-1">
                     <PasswordField
                         id="confirm-password"
                         label="Confirm New Password"
                         value={confirmNewPassword}
                         onChange={setConfirmNewPassword}
                         show={showConfirm}
                         setShow={setShowConfirm}
                         placeholder="Re-enter new password"
                     />
 
                     {confirmNewPassword && (
                         <p
                             className={`text-xs flex items-center gap-1.5 ${
                                 passwordsMatch ? "text-emerald-600" : "text-red-500"
                             }`}
                         >
                             {passwordsMatch ? (
                                 <>
                                     <Check size={13} /> Passwords match
                                 </>
                             ) : passwordsMismatch ? (
                                 <>
                                     <X size={13} /> Passwords do not match
                                 </>
                             ) : null}
                         </p>
                     )}
                 </div>
 
                 {/* Submit */}
                 <button
                     type="submit"
                     disabled={isSubmit}
                     className="w-full flex items-center justify-center gap-2
                                bg-[#E8772E] hover:bg-[#cf6622] active:bg-[#b85819]
                                text-white font-semibold py-3 
                                transition-all duration-200
                                disabled:opacity-60 disabled:cursor-not-allowed
                                focus:outline-none focus:ring-2 focus:ring-[#E8772E]/40"
                 >
                     {isSubmit ? (
                         <>
                             <Loader2 size={18} className="animate-spin" />
                             Updating…
                         </>
                     ) : (
                         <>
                             <ShieldCheck size={18} />
                             Change Password
                         </>
                     )}
                 </button>
 
                 <p className="text-[11px] text-center text-[#6B6459]">
                     You'll stay signed in on this device. Other sessions may need to log in again.
                 </p>
             </form>
         </div>
     );
 }