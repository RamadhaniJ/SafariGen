import { useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';

// ========================= 1.AUTH , LOGINS & REGISTRATION PAGES.........
import LogInPage from './Authentication/Login';
import AuthProvider from './Apis/AuthProvider';
import ProtectPages from './Apis/protect_pages';
import AutoRedirectorAuthenticatedUsers from './Apis/Redirector';

//==========================1.1 REGISTRATIONS======================
import PersonalDetailStep1Page from './Authentication/ManagerReg/PersonalReg';
import VerifyEmailByOTPpage from './Authentication/ManagerReg/OptPage';
import CompanyDetailsStep3Page from './Authentication/ManagerReg/CompanyReg';
 
  
  




//==================== 2.==FORGOT PASSWORD====================
import EnterEmailToResetPasswordPage from './Authentication/ForgotPassword/EnterEmail';
import EnterOTPToResetPasswordPage from './Authentication/ForgotPassword/EnterOTP';
import PasswordResetPage from './Authentication/ForgotPassword/ResetPassword';







//=======================3. OUTLATES   ============================
import ManagerOutlets from './Outlet/Manager';
import StaffOutlets from './Outlet/Staff';







//========================4. GLOBAL SHARES PAGES (ACCESS BY BOTH ROLES)=============
import ClientListGlobal from './GlobalShare/ClientPage/ClientList';   // 1. Clients 
import CreateClientInformationGlobal from './GlobalShare/ClientPage/CreateClient';
import CreateClientRequestInformationGlobal from './GlobalShare/ClientPage/CreateRequest';
import PreviewClientInformationGlobal from './GlobalShare/ClientPage/PreviewClient';

import ItineraryMainGlobal from './GlobalShare/Itinerary/MainPage'; // 2. Itineraries
import CreateQuoteGlobal from './GlobalShare/Itinerary/Create/CreateItinerary';// 3. Create new 
import ListItinerariesWithVersionGlobal  from './GlobalShare/Itinerary/List/ListItinerary';// 4. List
import ItineraryEditingCenterGlobal from './GlobalShare/Itinerary/Edit/EditingCenter'; // 3 Editing












//======================4. MANAGER PAGES=================================== 
import ManagerDashboardPage from './ManagerPages/DashBoard';
import ManagerProfilePage from './ManagerPages/Profile';
import ManagerStaffPage from './ManagerPages/Staff/StaffPage';
import ListCompaniesToManagerPage from './ManagerPages/Companies/listCompany';
import MainManagerSettingPage from './ManagerPages/Settings/MainSettings';




//=======================5.STAFF PAGES =======================
import StaffDashboardPage from './StaffPages/Dashboard';
import StaffProfilePage from './StaffPages/Profile';
import MainStaffSettingPage from './StaffPages/Settings/MainSetting';



//=============================================================
//              --        PREVIEW       ----
//=============================================================
import PreviewDigitalPageItineraryMain from './SafariPreview/DigitalPage/MainPage/MainDigitalPreview';

//=============================================================
//              --        DOWNLOADING       ----
//=============================================================
import PricingDownloadToPdf from './SafariPreview/Pricing/DownloadPdf';
import ItineraryDownloadToPdf from './SafariPreview/PdfPage/MainPdf/DownloadPdf';


function App() {


  return (
    <>
    <BrowserRouter>
    <AuthProvider> 
        <Routes>


          {/* registrations and logins  */}
          <Route path='/register' element={
            <AutoRedirectorAuthenticatedUsers>
                    <PersonalDetailStep1Page/>
            </AutoRedirectorAuthenticatedUsers>
            } />
          <Route path="/verify-email" element={
            <AutoRedirectorAuthenticatedUsers>
                  <VerifyEmailByOTPpage />
            </AutoRedirectorAuthenticatedUsers>
            } />
          <Route path="/company-details" element={
            <AutoRedirectorAuthenticatedUsers>
                   <CompanyDetailsStep3Page /> 
            </AutoRedirectorAuthenticatedUsers>
            } />
 
          <Route path='/' element={
            <AutoRedirectorAuthenticatedUsers>
                    <LogInPage/>   
            </AutoRedirectorAuthenticatedUsers>
            } />


 




          {/* forgot Password  */}
          <Route path='/reset-password' element={
            <AutoRedirectorAuthenticatedUsers>
                  <EnterEmailToResetPasswordPage/>
            </AutoRedirectorAuthenticatedUsers>
            } />
          <Route path='/validate-email-otp' element={
            <AutoRedirectorAuthenticatedUsers>
                 <EnterOTPToResetPasswordPage/>
            </AutoRedirectorAuthenticatedUsers>
            } />
          <Route path='/reset-password-confirmation' element={
            <AutoRedirectorAuthenticatedUsers>
                        <PasswordResetPage/>
            </AutoRedirectorAuthenticatedUsers>
            } />







       
          {/* system public pages  */}
          {/* ================FOR PREVIEW =================  */}
          <Route path='preview/safari/itinerary/:client_id/:version_id' element={<PreviewDigitalPageItineraryMain/>} />
         
          {/* ================FOR DOWNLOADING =================  */}
          <Route path="/print/:client_id/:version_id" element={<ItineraryDownloadToPdf />}/>
          <Route path="/print/pricing/:client_id/:version_id" element={<PricingDownloadToPdf />}/>

 



   
 
          {/* MANAGER Routes  */}
          <Route path='dashboard/manager' element={
                <ProtectPages allowedRole="MANAGER">
                    <ManagerOutlets/>
                </ProtectPages>  
             } >

               <Route index element={<ManagerDashboardPage/>} />
               <Route path='profile/manager/' element={<ManagerProfilePage/>} />
               <Route path='settings/' element={<MainManagerSettingPage/>} />
               <Route path='staff/' element={<ManagerStaffPage/>} />
               <Route path='companies/' element={<ListCompaniesToManagerPage/>} />
      
               {/* clients  */}
               <Route path='clients/list/' element={<ClientListGlobal/>} />
               <Route path='clients/create/' element={<CreateClientInformationGlobal/>} />
               <Route path='clients/create/request/:clientId' element={<CreateClientRequestInformationGlobal/>} />
               <Route path='clients/preview/:clientId' element={<PreviewClientInformationGlobal/>} />

               {/* Itinerary  */}
               <Route path='itinerary/create/:clientId' element={<ItineraryMainGlobal/>} />
               <Route path='quote/create/gate/' element={<CreateQuoteGlobal/>} />
               <Route path='quotes/list/' element={<ListItinerariesWithVersionGlobal/>} />
               <Route path='quotes/editing/:clientId/:versionId' element={<ItineraryEditingCenterGlobal/>} />


          </Route>






          {/* STAFF Routes  */}
          <Route path='staff/dashboard' element={
            <ProtectPages allowedRole="STAFF"> 
                 <StaffOutlets/>
            </ProtectPages>
          } >

            <Route index element={<StaffDashboardPage/>} />
            <Route path='profile/' element={<StaffProfilePage/>} />
            <Route path='settings/' element={<MainStaffSettingPage/>} />


            {/* clients  */}
              <Route path='clients/list/' element={<ClientListGlobal/>} />
              <Route path='clients/create/' element={<CreateClientInformationGlobal/>} />
              <Route path='clients/create/request/:clientId' element={<CreateClientRequestInformationGlobal/>} />
              <Route path='clients/preview/:clientId' element={<PreviewClientInformationGlobal/>} />



             {/* Itinerary  */}
               <Route path='itinerary/create/:clientId' element={<ItineraryMainGlobal/>} />
               <Route path='quote/create/gate/' element={<CreateQuoteGlobal/>} />
               <Route path='quotes/list/' element={<ListItinerariesWithVersionGlobal/>} />
               <Route path='quotes/editing/:clientId/:versionId' element={<ItineraryEditingCenterGlobal/>} />


          </Route>


        </Routes>
    <Toaster richColors position='top-left' />
    </AuthProvider>
    </BrowserRouter>
    

    </>
  )
}

export default App
