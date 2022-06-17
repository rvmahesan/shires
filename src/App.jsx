import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cookies from 'universal-cookie';
import AdminLayout from "./layouts/Admin.jsx";
import Login from "./layouts/Login.jsx";
import Dashboard from "./views/Misc/Dashboard"; 
import routes from "./routes.js";
//import Candidates from './views/Candidates/Candidates'; 
//import CreateCandidate from './views/Candidates/CreateCandidate';
//import SearchProfiles from './views/Candidates/SearchProfiles';
//import EditCandidate from './views/editCandidate';
//import ViewCandidateDetails from './views/viewCandidateDetails';
import { EditCandidate,Candidates,CreateCandidate,SearchProfiles,ViewCandidateDetails, CandidateSubmissions } from './views/Candidates';

// import JobManagement from './views/JobManagement';
// import ViewJobDetails from './views/viewJobDetails';
// import EditJobDetails from './views/editJobDetails';
// import CreateNewJob from './views/CreateNewJob';
// import JobSubmitNewCandidate from './views/JobSubmitNewCandidate';
// import JobSubmitOldCandidate from './views/JobSubmitOldCandidate';
import { JobManagement,ViewJobDetails,EditJobDetails,CreateNewJob,JobSubmitNewCandidate,JobSubmitOldCandidate } from './views/JobPostings';


// import ViewClientDetails from "./views/viewClientDetails";
// import CreateNewClient from "./views/createNewClient";
// import ClientsListings from "./views/ClientsListings";
// import EditClientDetails from './views/editClientDetails';
import { ViewClientDetails,CreateNewClient, ClientsListings, EditClientDetails } from './views/Clients';

// import VendorsListings from './views/VendorsListings';
// import CreateNewVendor from './views/createNewVendor';
// import ViewVendorDetails from './views/ViewVendorDetails';
// import EditVendorDetails from './views/EditVendorDetails';
import { VendorsListings,CreateNewVendor, ViewVendorDetails, EditVendorDetails } from './views/Vendors';


// import UsersListings from './views/UsersListings';
// import MailTemplatesManagement from './views/MailTemplatesManagement';
// import TeamDetails from './views/TeamDetails';
// import UserRoleDetails from './views/UserRoleDetails';
// import DepartmentDetails from './views/DepartmentDetails';
// import IndustryDetails from './views/IndustryDetails';
// import LanguageDetails from './views/LanguageDetails';
// import TaxTermDetails from './views/TaxTermDetails';
// import WorkAuthorizationDetails from './views/WorkAuthorizationDetails';
// import DegreeDetails from './views/DegreeDetails';

import  {ApplicantSources, DegreeDetails, DepartmentDetails,IndustryDetails,LanguageDetails,TaxTermDetails,TeamDetails,UserProfile,UserRoleDetails,UsersListings,WorkAuthorizationDetails,CreateNewEmailTemplate, MailTemplatesManagement} from './views/Settings';
import {SendEmailCandidates,SendJobListCandidates} from "./views/SendEmailCandidates";
import ValidateLogin from './layouts/ValidateLogin';
const cookies = new Cookies();
const App = () => {
  let authetication = false;
  const authToken = cookies.get('canAuthToken');

  if (typeof authToken == "undefined") {
    authetication = false;
    //window.location.href="../login";return;
  } else {

    var cookies_ = (authToken).split("==")
    // window.location.href ="../"+cookies_[1]+"/dashboard"; 
    authetication = true;
  }
  let currentPath = window.location.pathname;
  let loading = true;

  //let currentComponent ="";
  const currentComponent = routes.filter(path => path.fullPath.includes(currentPath)).map((prop) => {
    ////  if(currentPath === "/admin"+prop.path){
    loading = false;
    //console.log(prop.component)
    return <Route path={currentPath} element={<AdminLayout comp={prop.component} />} />;
    //   loading = false;
    //    this.setState({currentComponent:currentComponent});
    //   return <prop.component/>;

    //  }else{
    //   return <Dashboard/>;
    //  }

  });

  return (
    <>
      <BrowserRouter>
        <Routes>
          {authetication ? <>
            <Route path="/admin/candidateSubmissions" element={<AdminLayout comp={<CandidateSubmissions />} />} />
            <Route path="/submitOldCandidate" element={<AdminLayout comp={<JobSubmitOldCandidate />} />} />
            <Route path="/submitNewCandidate" element={<AdminLayout comp={<JobSubmitNewCandidate />} />} />
            
            <Route path="/admin/CreateNewClient" element={<AdminLayout comp={<CreateNewClient />} />} />
            <Route path="/admin/ViewClientDetails" element={<AdminLayout comp={<ViewClientDetails />} />} />
            <Route path="/admin/ClientsListings" element={<AdminLayout comp={<ClientsListings />} />} />
            
            
            <Route path="/admin/VendorsListing" element={<AdminLayout comp={<VendorsListings />} />} />
            <Route path="/admin/ViewVendorDetails" element={<AdminLayout comp={<ViewVendorDetails />} />} />


            <Route path="/admin/addNewVendor" element={<AdminLayout comp={<CreateNewVendor />} />} />
            <Route path="/admin/addNewClient" element={<AdminLayout comp={<CreateNewClient />} />} />
            <Route path="/admin/editClientDetails" element={<AdminLayout comp={<EditClientDetails/>}/>} />
            <Route path="/admin/editVendorDetails" element={<AdminLayout comp={<EditVendorDetails />} />} />

            <Route path="/admin/createNewJob" element={<AdminLayout comp={<CreateNewJob />} />} />
            <Route path="/admin/viewJobDetails" element={<AdminLayout comp={<ViewJobDetails />} />} />
            <Route path="/admin/editJobDetails" element={<AdminLayout comp={<EditJobDetails />} />} />
            <Route path="/admin/manageJobs" element={<AdminLayout comp={<JobManagement />} />} />

            <Route path="/admin/manageMailTemplates" element={<AdminLayout comp={<MailTemplatesManagement />} />} />
            <Route path="/admin/usersListing" element={<AdminLayout comp={<UsersListings />} />} />
            <Route path="/admin/teamsListing" element={<AdminLayout comp={<TeamDetails />} />} />
            <Route path="/admin/userTypes" element={<AdminLayout comp={<UserRoleDetails />} />} />
            <Route path="/admin/departmentListing" element={<AdminLayout comp={<DepartmentDetails />} />} />
            <Route path="/admin/industryListing" element={<AdminLayout comp={<IndustryDetails />} />} />
            <Route path="/admin/languageListing" element={<AdminLayout comp={<LanguageDetails />} />} />
            <Route path="/admin/taxTermsListing" element={<AdminLayout comp={<TaxTermDetails />} />} />
            <Route path="/admin/WorkAuthorizationDetails" element={<AdminLayout comp={<WorkAuthorizationDetails />} />} />
            <Route path="/admin/degreeListing" element={<AdminLayout comp={<DegreeDetails />} />} />
            <Route path="/sendEmailCandidates" element={<AdminLayout comp={<SendEmailCandidates/>}/>} /> 
            <Route path="/sendJobListCandidates" element={<AdminLayout comp={<SendJobListCandidates/>}/>} /> 
            
            {/*<Route path="/sendEmailCandidates/:pageId" element={<AdminLayout comp={<SendEmailCandidates/>}/>} /> */}
            <Route path="/admin/myprofile" element={<AdminLayout comp={<UserProfile />} />} />
            <Route path="/admin/searchProfile" element={<AdminLayout comp={<SearchProfiles />} />} />
            <Route path="/admin/viewCandidateDetails" element={<AdminLayout comp={<ViewCandidateDetails />} />} />
            <Route path="/admin/createCandidate" element={<AdminLayout comp={<CreateCandidate />} />} />
            <Route path="/admin/dashboard" element={<AdminLayout comp={<Dashboard />} />} />
            <Route path="/admin/editCandidate" element={<AdminLayout comp={<EditCandidate />} />} />
            <Route path="/admin/candidates" element={<AdminLayout comp={<Candidates />} />} /><Route path="/" element={<ValidateLogin />} /></> : <><Route path="/login" element={<Login />} /><Route path="*" element={<Login />} /> </>}
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
