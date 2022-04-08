import Dashboard from "./views/Dashboard.jsx";
import RecruiterDashboard from "./views/RecruiterDashboard";
import VendorDashboard from "./views/VendorDashboard";
import UserProfile from "./views/UserProfile.jsx";
import AdminAttributes from "./views/adminAttributes.jsx";
import AttributeDetails from "./views/AttributeDetails.jsx";
import UsersListings from "./views/UsersListings.jsx";
import clientsListings from "./views/ClientsListings.jsx";
import VendorsListings from "./views/VendorsListings.jsx";
import Candidates from "./views/Candidates.jsx";
import emailTempalteManagement from "./views/MailTemplatesManagement.jsx"
import createNewEmailTemplate from "./views/createNewEmailTemplate.jsx";
import CreateNewClient from "./views/createNewClient.jsx";
import CreateNewVendor from "./views/createNewVendor.jsx";

import CreateCandidate from "./views/CreateCandidate.jsx";
import editCandidate from "./views/editCandidate";
import ViewCandidateDetails from "./views/viewCandidateDetails";
import SearchProfiles from "./views/SearchProfiles";
import JobManagement from "./views/JobManagement";
import createNewJob from "./views/CreateNewJob";
import ViewJobDetails from "./views/viewJobDetails";
import EditJobDetails from "./views/editJobDetails";
import VendorRequirements from "./views/VendorRequirements";
import VendorRequirmentDetails from "./views/vendors/viewJobDetails";
import VendorCandidates from "./views/vendors/vendorCandidates"
import JobApplicantDetails from "./views/vendors/JobApplicantDetails";
import vendorOnboardedCandidates from "./views/vendors/vendorOnboardedCandidates";
import onboardedCandidatesList from "./views/onboardedCandidatesList.jsx";
import applicantSources from "./views/applicantSourcesList.jsx"
import shortlistedCandidatesList from "./views/shortlistedCandidatesList.jsx";
import candidateInteriews from "./views/candidateInteriews.jsx";
import DepartmentDetails from "./views/DepartmentDetails.jsx";
import TaxTermDetails from "./views/TaxTermDetails.jsx";
import LanguageDetails from "./views/LanguageDetails.jsx";
import IndustryDetails from "./views/IndustryDetails.jsx";
import DegreeDetails from "./views/DegreeDetails.jsx";
import WorkAuthorizationDetails from "./views/WorkAuthorizationDetails.jsx";
//import Login from "views/Login.jsx";
//import Typography from "views/Typography.jsx";
//import Icons from "views/Icons.jsx";
//import Maps from "views/Maps.jsx";
//import Notifications from "views/Notifications.jsx";


const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary", 
    component: Dashboard,
    visibility: "admin",
    layout: "/admin",
    fullPath:"/admin/dashboard",
    svgCode: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-home align-self-center hori-menu-icon"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
    submenu: []
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: RecruiterDashboard,
    visibility: "recruiter",
    layout: "/recruiter",
    fullPath:"/recruiter/dashboard",
    svgCode: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-home align-self-center hori-menu-icon"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
    submenu: []
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: VendorDashboard,
    visibility: "vendor",
    layout: "/vendor",
    fullPath:"/vendor/dashboard",
    svgCode: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-home align-self-center hori-menu-icon"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
    submenu: []
  },


  {
    path: "/viewJobApplicationDetails",
    name: "JobApplicantDetails",
    icon: "",
    redirect: true,
    component: JobApplicantDetails,
    visibility: "vendor",
    layout: "/vendor", svgCode: '',
    fullPath:"/vendor/viewJobApplicationDetails",
    submenu: []
  },
  {
    path: "/manageJobs",
    name: "Job Management",
    icon: "ni ni-spaceship text-blue",
    component: JobManagement,
    fullPath:"/admin/manageJobs",
    visibility: "admin",
    layout: "/admin",
    svgCode: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-box align-self-center hori-menu-icon"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>',
    submenu: []
  }
  ,
  //viewJobApplicationDetails
  {
    path: "/candidates",
    name: "Candidates",
    icon: "ni ni-single-02 text-yellow",
    component: Candidates,
    fullPath:"admin/candidates",
    visibility: "admin",
    layout: "/admin",
    svgCode: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-grid align-self-center hori-menu-icon"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
    submenu: [
      {
        path: "/searchProfile",
        name: "Search Candidates",
        component: SearchProfiles,
        fullPath:"/admin/candidateInterviews",
        layout: "/admin"
      },

    ]
  },
  {
    path: "/searchProfile",
    name: "Candidate Management",
    icon: "",
    redirect: true,
    component: SearchProfiles,
    visibility: "admin",
    layout: "/admin", svgCode: '',
    fullPath:"/admin/candidateInterviews",
    submenu: []
  },


  {
    path: "/createCandidate",
    name: "Candidate Management",
    icon: "",
    redirect: true,
    component: CreateCandidate,
    visibility: "admin",
    layout: "/admin", svgCode: '',
    fullPath:"/admin/candidateInterviews",
    submenu: []
  },
  {
    path: "/onboardedCandidatesList",
    name: "Onboarded Candidates",
    component: onboardedCandidatesList,
    redirect: true,
    fullPath:"/admin/candidateInterviews",
    visibility: "admin",
    layout: "/admin",
  },
  {
    path: "/manageMailTemplates",
    name: "Email Templates",
    component: emailTempalteManagement,
    redirect: true,
    visibility: "admin",
    fullPath:"/admin/candidateInterviews",
    layout: "/admin",
  },

  {
    path: "/shortlistedCandidatesList",
    name: "Onboarded Candidates",
    component: shortlistedCandidatesList,
    redirect: true,
    visibility: "admin",
    fullPath:"/admin/candidateInterviews",
    layout: "/admin",
  },
    
  {
    path: "/candidateInterviews",
    name: "Interviews",
    component: candidateInteriews,
    fullPath:"/admin/candidateInterviews",
    layout: "/admin"
  },
  {
    path: "/editCandidate",
    name: "Candidate Management",
    icon: "",
    redirect: true,
    component: editCandidate,
    visibility: "admin",
    layout: "/admin", svgCode: '',
    fullPath:"/admin/candidateInterviews",
    submenu: []
  },
  {
    path: "/viewCandidateDetails",
    name: "Candidate Management",
    icon: "",
    redirect: true,
    component: ViewCandidateDetails,
    visibility: "admin",
    layout: "/admin", svgCode: '',
    fullPath:"/admin/candidateInterviews",
    submenu: []
  },

  //viewJobDetails
  {
    path: "/viewJobDetails",
    name: "Job Details",
    icon: "",
    redirect: true,
    component: ViewJobDetails,
    visibility: "admin",
    layout: "/admin", svgCode: '',
    fullPath:"/admin/candidateInterviews",
    submenu: []
  },
  //viewJobDetails
  {
    path: "/editJobDetails",
    name: "Job Details",
    icon: "",
    redirect: true,
    component: EditJobDetails,
    visibility: "admin",
    layout: "/admin", svgCode: '',
    fullPath:"/admin/candidateInterviews",
    submenu: []
  },
  
   
  {
    path: "/ClientsListings",
    name: "Clients",
    icon: "ni ni ni-badge text-pink",
    component: clientsListings,
    visibility: "admin",
    layout: "/admin", 
    fullPath:"/admin/ClientsListings",
    svgCode: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-lock align-self-center hori-menu-icon"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>',
    submenu: []
  },
   
  {
    path: "/vendorsListing",
    name: "Vendors",
    icon: "ni ni ni-badge text-pink",
    component: VendorsListings,
    visibility: "admin",
    layout: "/admin",
    fullPath:"/admin/vendorsListing",
    svgCode: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-lock align-self-center hori-menu-icon"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>',
    submenu: []
  }
  ,
  {
    path: "/usersListing",
    name: "Settings",
    icon: "ni ni ni-badge text-pink",
    component: UsersListings,
    visibility: "admin",
    layout: "/admin",
    fullPath:"/admin/candidateInterviews",
    svgCode: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-lock align-self-center hori-menu-icon"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>',
    submenu: [
      {
        path: "/degreeListing",
        name: "Degree Details",
        component: DegreeDetails,
        fullPath:"/admin/degreeListing",
        layout: "/admin"
      },
      {
        path: "/departmentListing",
        name: "Departments",
        component: DepartmentDetails,
        fullPath:"/admin/departmentListing",
        layout: "/admin"
      },
      {
        path: "/industryListing",
        name: "Industry Details",
        component: IndustryDetails,
        fullPath:"/admin/industryListing",
        layout: "/admin"
      },
      {
        path: "/languageListing",
        name: "Language Details",
        component: LanguageDetails,
        fullPath:"/admin/languageListing",
        layout: "/admin"
      },
      {
        path: "/teamsListing",
        name: "Teams",
        component: UsersListings,
        fullPath:"/admin/teamsListing",
        layout: "/admin"
      },
      {
        path: "/taxTermsListing",
        name: "Tax Terms",
        component: TaxTermDetails,
        fullPath:"/admin/taxTermsListing",
        layout: "/admin"
      },
      {
        path: "/usersListing",
        name: "Users",
        component: UsersListings,
        fullPath:"/admin/usersListing",
        layout: "/admin"
      },
      {
        path: "/userTypes",
        name: "User Roles",
        component: UsersListings,
        fullPath:"/admin/userTypes",
        layout: "/admin"
      },
   
      {
        path: "/WorkAuthorizationDetails",
        name: "Work Authorizations",
        component: WorkAuthorizationDetails,
        fullPath:"/admin/WorkAuthorizationDetails",
        layout: "/admin"
      },
     
    
      
    ]
  }
  ,
  {
    path: "/createEmailTemplate",
    name: "Add Template",
    icon: "",
    redirect: true,
    component: createNewEmailTemplate,
    visibility: "admin",
    layout: "/admin", svgCode: '',
    fullPath:"/admin/candidateInterviews",
    submenu: []
  },
  {
    path: "/addNewClient",
    name: "Add Client",
    icon: "",
    redirect: true,
    component: CreateNewClient,
    visibility: "admin",
    layout: "/admin", svgCode: '',
    fullPath:"/admin/candidateInterviews",
    submenu: []
  },
  
  {
    path: "/addNewVendor",
    name: "Add vendor",
    icon: "",
    redirect: true,
    component: CreateNewVendor,
    visibility: "admin",
    layout: "/admin", svgCode: '',
    fullPath:"/admin/candidateInterviews",
    submenu: []
  },

  
  
  {
    path: "/createNewJob",
    name: "Add Job",
    icon: "",
    redirect: true,
    component: createNewJob,
    visibility: "admin",
    layout: "/admin", svgCode: '',
    fullPath:"/admin/candidateInterviews",
    submenu: []
  }
  ,
  {
    path: "/myprofile",
    name: "My Profile",
    icon: "",
    redirect: true,
    component: UserProfile,
    visibility: "admin",
    layout: "/admin", svgCode: '',
    fullPath:"/admin/candidateInterviews",
    submenu: []
  }
  ,
  {
    path: "/configAttributes",
    name: "Configuration Attributes",
    icon: "",
    redirect: true,
    component: AdminAttributes,
    visibility: "admin",
    layout: "/admin", svgCode: '',
    fullPath:"/admin/candidateInterviews",
    submenu: []
  },
  {
    path: "/configAttributeDetails",
    name: "Attribute Details",
    icon: "",
    redirect: true,
    component: AttributeDetails,
    visibility: "admin",
    layout: "/admin", svgCode: '',
    fullPath:"/admin/candidateInterviews",
    submenu: []
  }
  //Recruiter Menu
  ,
  {
    path: "/candidates",
    name: "Candidates",
    icon: "ni ni-single-02 text-yellow",
    component: Candidates,
    visibility: "recruiter",
    layout: "/recruiter",
    fullPath:"/admin/candidateInterviews",
    svgCode: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-grid align-self-center hori-menu-icon"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
    submenu: [
      {
        path: "/usersListing",
        name: "Users",
        component: UsersListings,
        fullPath:"/admin/candidateInterviews",
        layout: "/admin"
      },
      {
        path: "/manageMailTemplates",
        name: "Email Templates",
        component: emailTempalteManagement,
        fullPath:"/admin/candidateInterviews",
        layout: "/admin"
      },
    ]
  },

  {
    path: "/createCandidate",
    name: "Candidate Management",
    icon: "",
    redirect: true,
    component: CreateCandidate,
    visibility: "recruiter",
    layout: "/recruiter", svgCode: '',
    fullPath:"/admin/candidateInterviews",
    submenu: []
  },
  {
    path: "/editCandidate",
    name: "Candidate Management",
    icon: "",
    redirect: true,
    component: editCandidate,
    visibility: "recruiter",
    layout: "/recruiter", svgCode: '',
    fullPath:"",
    submenu: []
  },
  {
    path: "/viewCandidateDetails",
    name: "Candidate Management",
    icon: "",
    redirect: true,
    component: ViewCandidateDetails,
    visibility: "recruiter",
    layout: "/recruiter", svgCode: '',
    fullPath:"",
    submenu: []
  },
  //viewJobDetails
  {
    path: "/viewJobDetails",
    name: "Job Details",
    icon: "",
    redirect: true,
    component: ViewJobDetails,
    visibility: "recruiter",
    layout: "/recruiter", svgCode: '',
    fullPath:"",
    submenu: []
  },
  {
    path: "/editJobDetails",
    name: "Job Details",
    icon: "",
    redirect: true,
    component: EditJobDetails,
    visibility: "recruiter",
    layout: "/recruiter", svgCode: '',
    fullPath:"",
    submenu: []
  },


  {
    path: "/searchProfile",
    name: "Search Profile",
    icon: "ni ni-planet text-orange",
    component: SearchProfiles,
    visibility: "recruiter",
    fullPath:"",
    layout: "/recruiter", svgCode: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-file-plus align-self-center hori-menu-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>',
    submenu: []
  },
  {
    path: "/manageJobs",
    name: "Job Management",
    icon: "ni ni-spaceship text-blue",
    component: JobManagement,
    visibility: "recruiter",
    layout: "/recruiter",
    fullPath:"recruiter/createNewJob",
    svgCode: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-box align-self-center hori-menu-icon"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>',
    submenu: []
  }
  ,
  {
    path: "/manageMailTemplates",
    name: "Email Templates",
    icon: "ni ni-archive-2 text-green",
    component: emailTempalteManagement,
    visibility: "recruiter",
    layout: "/recruiter",
    fullPath:"recruiter/manageMailTemplates",
    svgCode: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-file-plus align-self-center hori-menu-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>',
    submenu: []
  },
  {
    path: "/createEmailTemplate",
    name: "Add Template",
    fullPath:"recruiter/createEmailTemplate",
    icon: "",
    redirect: true,
    component: createNewEmailTemplate,
    visibility: "recruiter",
    layout: "/recruiter", svgCode: '',
    submenu: []
  },
  {
    path: "/createNewJob",
    name: "Add Job",
    icon: "",
    fullPath:"admin/createNewJob",
    redirect: true,
    component: createNewJob,
    visibility: "recruiter",
    layout: "/recruiter", svgCode: '',
    submenu: []
  }
  ,
  {
    path: "/myprofile",
    name: "My Profile",
    icon: "",
    redirect: true,
    component: UserProfile,
    fullPath:"",
    visibility: "recruiter",
    layout: "/admin",
    svgCode: '',
    submenu: []
  }
  ,
  {
    path: "/vendorRequirmentsList",
    name: "Requirements",
    icon: "ni ni-archive-2 text-green",
    component:VendorRequirements,
    visibility:"vendor",
    fullPath:"vendor/vendorRequirmentsList",
    layout: "/vendor",
    svgCode: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-file-plus align-self-center hori-menu-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>',
    submenu: []
  },
  {
    path: "/viewJobDetails",
    name: "Job Details",
    icon: "",
    fullPath:"vendor/viewJobDetails",
    redirect: true,
    component: VendorRequirmentDetails,
    visibility: "vendor",
    layout: "/vendor", svgCode: '',
    submenu: []
  },
  {
    path: "/vendorCandidatesList",
    name: "Candidates",
    fullPath:"vendor/vendorCandidatesList",
    icon: "ni ni-archive-2 text-green",
    component: VendorCandidates,
    visibility: "vendor",
    layout: "/vendor",
    svgCode: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-file-plus align-self-center hori-menu-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>',
    submenu: []
  },
  //vendorOnboardedCandidatesList
  {
    path: "/vendorOnboardedCandidatesList",
    name: "Job Details",
    fullPath:"vendor/vendorOnboardedCandidatesList",
    icon: "",
    redirect: true,
    component: vendorOnboardedCandidates,
    visibility: "vendor",
    layout: "/vendor", svgCode: '',
    submenu: []
  },
  {
    path: "/shortlistedCandidatesList",
    name: "Shortlisted Candidates",
    icon: "",
    redirect: true,
    fullPath:"vendor/shortlistedCandidatesList",
    component: shortlistedCandidatesList,
    visibility: "vendor",
    layout: "/vendor", svgCode: '',
    submenu: []
  },

];

export default dashboardRoutes;
