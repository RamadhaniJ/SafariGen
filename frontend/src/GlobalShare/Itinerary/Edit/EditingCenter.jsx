import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import api from "../../../Apis/api";
import GlobalLoader from "../../../Component/Loader";
import { toast } from "react-toastify";
import { User2, Compass, Sparkles, Check, ArrowLeft } from "lucide-react";
import ClientRequestInformationEditingGlobal from "./EditClietRequest";
import ItinerariesEditingGlobal from "./EditItinerary";

export default function ItineraryEditingCenterGlobal() {
    const { versionId, clientId } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [editData, setEditData] = useState(null);
    const [currentStep, setCurrentStep] = useState(1); 

    const fetchItineraryToEdit = useCallback(async () => {
        setIsLoading(true);
        try {
            const resp = await api.get(`itinerary/edit/itinerary/${versionId}/`);
            setEditData(resp.data);
        } catch (error) {
            const errorMsg = error.response?.data;
            if (errorMsg?.detail){
            toast.error(errorMsg?.detail)
            }else if (errorMsg && typeof errorMsg === "object"){
            Object.entries(errorMsg).forEach(([val, msg])=>{
                const text = Array.isArray(msg) ? msg.join(", ") : String(msg);
                toast.error(`${val} : ${text}`);
            })
            }else{
                toast.error("Failed to load itinerary data");
            }
            navigate(-1);
        } finally {
            setIsLoading(false);
        }
    },[versionId, navigate])

    useEffect(() => {
        if (versionId) fetchItineraryToEdit();
    }, [versionId, fetchItineraryToEdit]);



    // Functions to update state from child components
    const updateClientInfo = useCallback((newClientInfo) => {
        setEditData(prev => ({ ...prev, client_info: newClientInfo }));
    },[]);

    const updateDayConfigs = useCallback((newDayConfigs) => {
        setEditData(prev => ({ ...prev, days: newDayConfigs }));
    },[]);


    if (isLoading) return <GlobalLoader />;
    if (!editData) {
        return (
            <div className="min-h-screen bg-[#F6F1E7] flex items-center justify-center p-8">
                <div className="bg-white border border-[#E4DCCB] rounded-2xl px-8 py-10 max-w-sm text-center shadow-[0_1px_2px_rgba(15,42,46,0.04)]">
                    <p className="text-sm font-semibold text-[#0F2A2E]">Data not found.</p>
                </div>
            </div>
        );
    }

    const steps = [
        { id: 1, label: "Client request information", icon: User2 },
        { id: 2, label: "Day by day itinerary", icon: Compass },
    ];

    return (
        <div className="min-h-screen bg-[#F6F1E7] text-[#0F2A2E] p-4 md:p-8 font-sans selection:bg-[#E8772E] selection:text-[#0F2A2E] relative overflow-x-hidden">

            {/* Ambient brand washes */}
            <div className="pointer-events-none fixed -top-40 -right-40 w-[520px] h-[520px] bg-[#E8772E]/10 blur-[150px] rounded-full" />
            <div className="pointer-events-none fixed -bottom-40 -left-40 w-[520px] h-[520px] bg-[#F2B544]/12 blur-[150px] rounded-full" />

            <div className="max-w-6xl mx-auto relative z-10 space-y-8">

                {/* ==========================================
                                        Page Header
                 ========================================== */}
                    <header className="space-y-4">
                    {/* Back */}
                    <div>
                        <button
                        type="button"
                        onClick={() => navigate(-1)}
                        aria-label="Go back"
                        className="group -ml-2 inline-flex items-center gap-1.5 rounded-full border border-transparent px-2 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#6B6459] transition-all duration-200 hover:bg-[#F5F1E8] hover:text-[#0F2A2E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8772E]/40 active:scale-[0.97]"
                        >
                        <ArrowLeft
                            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
                            strokeWidth={2.5}
                        />
                        Back
                        </button>
                    </div>

                    {/* Title row */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="space-y-1.5">
                        <h1 className="text-balance text-2xl font-extrabold leading-tight tracking-tight text-[#0F2A2E] sm:text-3xl">
                            Refine your itinerary
                        </h1>
                        <p className="max-w-prose text-sm leading-relaxed text-[#6B6459]">
                            Update client details and day-by-day plans in two simple steps.
                        </p>
                        </div>

                        {/* Version pill */}
                        {editData.version_number && (
                        <div className="inline-flex shrink-0 items-center gap-2 self-start rounded-sm border border-[#E4DCCB] bg-white px-3 py-2 shadow-[0_1px_2px_rgba(15,42,46,0.04)] transition-shadow duration-200 hover:shadow-[0_2px_8px_rgba(15,42,46,0.08)] sm:self-auto">
                            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6B6459]">
                              Version
                            </span>
                            <span className="font-mono text-xs font-bold text-[#B34F12]">
                            {editData.version_number}
                            </span>
                        </div>
                        )}
                    </div>
                    </header>


                {/* ==========================================
                    Step Progress Stepper
                    ========================================== */}
                <div className="bg-white border border-[#E4DCCB] rounded-sm p-2 shadow-[0_1px_2px_rgba(15,42,46,0.04)]">
                    <div className="grid grid-cols-2 gap-2">

                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = currentStep === step.id;
                            const isCompleted = currentStep > step.id;

                            return (
                                <button
                                    key={step.id}
                                    onClick={() => setCurrentStep(step.id)}
                                    className={`relative group flex items-center gap-3 px-4 py-3.5 rounded-sm transition-all duration-300 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E] ${
                                        isActive
                                            ? "bg-[#E8772E] text-[#0F2A2E] shadow-md shadow-[#E8772E]/25"
                                            : "bg-transparent text-[#6B6459] hover:bg-[#F6F1E7] hover:text-[#0F2A2E]"
                                    }`}
                                >
                                    {/* Step number / icon chip */}
                                    <span
                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-bold text-sm transition-all duration-300 ${
                                            isActive
                                                ? "bg-[#0F2A2E]/15 text-[#0F2A2E]"
                                                : isCompleted
                                                ? "bg-[#E3F1E8] text-[#1E5A3B]"
                                                : "bg-[#F6F1E7] text-[#6B6459] group-hover:bg-[#FCE9DA] group-hover:text-[#B34F12]"
                                        }`}
                                    >
                                        {isCompleted ? (
                                            <Check className="w-4 h-4" strokeWidth={3} />
                                        ) : (
                                            <Icon className="w-4 h-4" />
                                        )}
                                    </span>

                                    {/* Label */}
                                    <span className="flex-1 text-left min-w-0">
                                        <span
                                            className={`block text-[9.5px] font-bold uppercase tracking-widest transition-colors ${
                                                isActive ? "text-[#0F2A2E]/70" : "text-[#6B6459]/70"
                                            }`}
                                        >
                                            Step {step.id}
                                        </span>
                                        <span className="block truncate text-sm font-bold">
                                            {step.label}
                                        </span>
                                    </span>

                                    {/* Active indicator dot */}
                                    {isActive && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#0F2A2E] shrink-0" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ==========================================
                    Step Content
                    ========================================== */}
                <div className="relative">
                    {currentStep === 1 && (
                        <ClientRequestInformationEditingGlobal
                            dataToEdit={editData}
                            clientId={clientId}
                            onNext={() => setCurrentStep(2)}
                            onUpdate={updateClientInfo}
                        />
                    )}

                    {currentStep === 2 && (
                        <ItinerariesEditingGlobal
                            dataToEdit={editData}
                            clientId={clientId}
                            versionId={versionId}
                            onBack={() => setCurrentStep(1)}
                            onUpdateDays={updateDayConfigs}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}