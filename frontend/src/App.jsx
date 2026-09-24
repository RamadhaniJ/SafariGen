import { useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';


import HomePage from './HomePage/HomePage';




// AUTH PAGES.........
import SignUpPage from './Authentication/SignUp';
import LogInPage from './Authentication/Login';
import AuthProvider from './Apis/AuthProvider';
import ProtectPages from './Apis/protect_pages';




// SIDE BARS-----
import ManagerSideBar from './SideBars/ManagerSB';
import StaffSideBar from './SideBars/StaffSideBar';



// OUTLATES ----
import ManagerOutlets from './Outlet/Manager';
import PublicOutlets from './Outlet/Public';
import StaffOutlets from './Outlet/Staff';


// MANAGER PAGES 
import ManagerDashboardPage from './ManagerPages/DashBoard';
import ManagerProfilePage from './ManagerPages/Profile';
import ManageStaff from './ManagerPages/Staff';


// STAFF PAGES 
import StaffDashboardPage from './StaffPages/Dashboard';
import StaffProfilePage from './StaffPages/Profile';
import CreateQuotePage from './StaffPages/Clients/CreateQuote';

import QuoteClientInformationPage from './StaffPages/Clients/QuotePage1';
import QuoteClientRequestPage from './StaffPages/Clients/QuotePage2';

import ListOfAllClientsPage from './StaffPages/Clients/ClientList';
import PreviewAllInformationOfClientPage from './StaffPages/Clients/PreviewClient';
import ItineraryMainPage from './StaffPages/Itinerary/ItineraryMain';

import ListAllItineraryWithVersionPage from './StaffPages/ListItinerary/ListPage';


// EDIT ITINERARY.
import MainItineraryEditorPage from './StaffPages/EditItinerary/MainEditor';



// Preview Safari Itinerary
import PreviewDayByDayItineraryPage from './PreviewSafari/PreviewItinerary';
import PreviewDigitalPageDayByDayItinerary from './PreviewSafari/PreviewDigital';


import PrintPdfPage from './PreviewSafari/pdfDownload';
import PdfPricingDownload from './PreviewSafari/DigitalSection/Pricing/pdfPrint';


import PricingBreakdownToStaff from './PreviewSafari/DigitalSection/Pricing/PricingBreakDown';




function App() {


  return (
    <>
    <BrowserRouter>
    <AuthProvider> 
        <Routes>

          <Route path="/print/:client_id/:version_id" element={<PrintPdfPage />}/>
          <Route path="/print/pricing/:client_id/:version_id" element={<PdfPricingDownload />}/>


          <Route path='/register' element={<SignUpPage/>} />
          <Route path='/login' element={<LogInPage/>} />


          <Route path='preview/safari/itinerary/:client_id/:version_id' element={<PreviewDigitalPageDayByDayItinerary/>} />
          <Route path='/'  element={<PublicOutlets/>} >
              <Route index element={<HomePage/>} />



          </Route>



          {/* MANAGER Routes  */}
          <Route path='dashboard/manager' element={
                <ProtectPages allowedRole="MANAGER">
                    <ManagerOutlets/>
                </ProtectPages>
             } >

               <Route index element={<ManagerDashboardPage/>} />
               <Route path='profile/manager/' element={<ManagerProfilePage/>} />
               <Route path='staff/' element={<ManageStaff/>} />

          </Route>






          {/* STAFF Routes  */}
          <Route path='staff/dashboard' element={
            <ProtectPages allowedRole="STAFF"> 
                 <StaffOutlets/>
            </ProtectPages>
          } >

            <Route index element={<StaffDashboardPage/>} />
            <Route path='profile/' element={<StaffProfilePage/>} />
            
            <Route path='create/quote/' element={<CreateQuotePage/>} />
            <Route path='create/client/information/' element={<QuoteClientInformationPage/>} />
            <Route path='create/client/request/:clientId' element={<QuoteClientRequestPage/>} />

            <Route path='list/clients/information/' element={<ListOfAllClientsPage/>} />

            <Route path='client/preview/information/:clientId' element={<PreviewAllInformationOfClientPage/>} />

            <Route path='itinerary/build/page/:clientId' element={<ItineraryMainPage/>} />


            <Route path='itinerary/list' element={<ListAllItineraryWithVersionPage/>} />



            <Route path='itinerary/edit/:clientId/:versionId' element={<MainItineraryEditorPage/>} />

            {/* <Route path='view/client/:clientId' element={<ViewClientsDetailsPage/>} />
            <Route path='create/new/' element={<StaffCreateClientsPage/>} />
            <Route path='new/quotes/:clientID' element={<DayByDayMainPage/>} />

            <Route path='preview/itininerary/:clientID' element={<ItinineryPreviewPage/>} /> */}

          </Route>


        </Routes>
    <Toaster richColors position='top-left' />
    </AuthProvider>
    </BrowserRouter>
    

    </>
  )
}

export default App
