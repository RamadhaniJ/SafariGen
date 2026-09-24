// import { useEffect, useState } from "react"
// import api from '../../Apis/api';
// import GlobalLoader from "../../Component/Loader";
// import { useNavigate, useParams} from 'react-router-dom'
// import { toast } from "sonner";
// import EditClientRequestInformationPage from "./EditClientRequest";
// import EditItinerariesPage from "./EditItineraries";

// export default function MainItineraryEditorPage() {
//     const { versionId, clientId } =  useParams();
//     const navigate = useNavigate();
//     const [dataToEdit, setDataToEdit]  = useState([]);
//     const [isLoading, setIsLoading] = useState(false);

//     const [showClientRequestForm, setShowClientRequestForm] = useState(true) // default.
//     const [showDayByDayForm, setShowDayByDayForm] = useState(false);


//     const fetchItineraryToEdit = async ()=>{
//         setIsLoading(true);

//         try{
//             const resp = await api.get(`itinerary/edit/itinerary/${versionId}/`)
//             setDataToEdit(resp.data);
//         }catch(error){
//             const errorMsg = error.response?.data?.detail?.message || "Something went wrong";
//             toast.error(errorMsg);
//         }finally{
//             setIsLoading(false);
//         }
//     }

//     useEffect(()=>{
//         fetchItineraryToEdit();
//     }, [versionId])

//     if (isLoading){
//         return <GlobalLoader/>;
//     }

//     return(
//         <div>
//             <div className="flex items-center">  this is a navigation header?
//                 <button
//                 className={`${isActive ? 'bg-fuchsia-700':'bg-gray-500'}`}
//                 onClick={()=> {
//                      setShowClientRequestForm(true);
//                      setShowDayByDayForm(false);
//                       }
//                     }
//                 >
//                     Client Request
//                 </button>

//                 <button
//                 onClick={()=> {
//                     setShowDayByDayForm(true);
//                     setShowClientRequestForm(false);
//                 }}
//                 >
//                     Day by Day 
//                 </button>
//             </div>

//             {showClientRequestForm && (
//                 <EditClientRequestInformationPage dataToEdit={dataToEdit} />
//             )}

//             { showDayByDayForm && (
//                 <EditItinerariesPage dataToEdit={dataToEdit} clientId={clientId} versionId={versionId} />
//             )
//      }

//         </div>
//     )
    
// }








import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../Apis/api';
import GlobalLoader from "../../Component/Loader";
import { toast } from "sonner";
import EditClientRequestInformationPage from "./EditClientRequest";
import EditItinerariesPage from "./EditItineraries";

export default function MainItineraryEditorPage() {
    const { versionId, clientId } = useParams();
    const navigate = useNavigate();
    
    const [isLoading, setIsLoading] = useState(true);
    const [editData, setEditData] = useState(null);
    const [currentStep, setCurrentStep] = useState(1); // 1 = Client Info, 2 = Day by Day

    const fetchItineraryToEdit = async () => {
        setIsLoading(true);
        try {
            const resp = await api.get(`itinerary/edit/itinerary/${versionId}/`);
            setEditData(resp.data);
        } catch (error) {
            const errorMsg = error.response?.data?.detail || "Failed to load itinerary data";
            toast.error(errorMsg);
            navigate(-1);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (versionId) fetchItineraryToEdit();
    }, [versionId]);

    if (isLoading) return <GlobalLoader />;
    if (!editData) return <div className="p-8 text-center text-white">Data not found.</div>;

    // Functions to update state from child components
    const updateClientInfo = (newClientInfo) => {
        setEditData(prev => ({ ...prev, client_info: newClientInfo }));
    };

    const updateDayConfigs = (newDayConfigs) => {
        setEditData(prev => ({ ...prev, days: newDayConfigs }));
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Navigation Header */}
                <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-4">
                    <button
                        onClick={() => setCurrentStep(1)}
                        className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                            currentStep === 1 
                            ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-900/30' 
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                    >
                        Step 1: Client Request Info
                    </button>

                    <button
                        onClick={() => setCurrentStep(2)}
                        className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                            currentStep === 2 
                            ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-900/30' 
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                    >
                        Step 2: Day by Day Itinerary
                    </button>
                </div>

                {/* Step 1: Client Info */}
                {currentStep === 1 && (
                    <EditClientRequestInformationPage 
                        dataToEdit={editData}
                        clientId={clientId}
                        onNext={() => setCurrentStep(2)}
                        onUpdate={updateClientInfo}
                    />
                )}

                {/* Step 2: Day by Day */}
                {currentStep === 2 && (
                    <EditItinerariesPage 
                        dataToEdit={editData}
                        clientId={clientId}
                        versionId={versionId}
                        onBack={() => setCurrentStep(1)}
                        onUpdateDays={updateDayConfigs}
                    />
                )}
            </div>
        </div>
    );
}