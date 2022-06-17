import React, { Component } from "react";
import {
   Container,
   Row,
   Col,
   Card,
   CardHeader, CardBody,
} from "reactstrap";
import Cookies from 'universal-cookie';
import Swal from 'sweetalert2';
import NumberFormat from "react-number-format";
import ReactQuill from "react-quill";
import { candidatePostUrl, candidateResumeUpdateUrl, style,apiUrl } from "../../variables/Variables.jsx";
import Common from "../../views/commons/Common.jsx"

const userType = new Common().getUserType();


const axios = require("axios").default;
const cookies = new Cookies();

let fData = new FormData();
let config = {};

class CreateCandidate extends Component {
   constructor(props, context) {
      super(props, context);
      this.state = {
         firstName: "",
         lastName: "",
         phone: "",
         location: "",
         rate: "",
         gender: "",
         resumeDetails: "",
         country: "",
         zipcode: "",
         aboutMe: "",
         address: "",
         email: "",
         skills: "",
         candidateId: "",
         uploadedFileName: "",
         setLoading: false,
         showEducationAddFormCond: false,
         showExperienceAddFormCond: false,
         newExperienceDetails: [{
            title: "",
            employmentType: "",
            company: "",
            startYear: "",
            endYear: "",
            location: "",
            headLine: "",
            description: ""
         }],
         skillsList: [],
         experienceList: [],
         educationList: [],
         newEducationDetails: [{
            educationNewSchool: "",
            educationNewDegree: "",
            educationNewFieldofStudy: "",
            educationNewStartyear: "",
            educationNewEndyear: "",
            educationNewGrade: "",
            educationNewDescription: ""
         }],
         newSkillsDetails: [{
            domain: "",
            skills: ""
         }],
         SkillsDetails: [{
            domain: "",
            skills: ""
         }]
      };
      this.genderOptions = ["Select gender", "Male", "Female", "Others"];
      this.handleInput = this.handleInput.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleUpload = this.handleUpload.bind(this);
      this.completeUpload = this.completeUpload.bind(this);
      this.handleNewEducationSubmit = this.handleNewEducationSubmit.bind(this);
      this.handleNewExperienceSubmit = this.handleNewExperienceSubmit.bind(this);
      this.getEducationList = this.getEducationList.bind(this);
      this.getExperienceList = this.getExperienceList.bind(this);
      this.getSkillsList = this.getSkillsList.bind(this);
      axios.defaults.withCredentials = false;
      this.toggleUpload = this.toggleUpload.bind(this);
   }

   toggleUpload =()=>{
      document.querySelector("#input-file-now").click();
   }

   getSkillsList = (event) => {
      var thisObj = this;
      const params = new URLSearchParams(this.props.location.search);
      axios.get(apiUrl + "listCandidateSkills", { params: { candidateId: this.state.candidateId, sess_id: cookies.get("c_csrftoken") } }).then(({ data }) => {
         console.log(data);
         if (data.statusResponse) {
            thisObj.setState({ skillsList: data.skillsList });
         }
      }).catch(({ err }) => { });
   }
   handleNewSkillsSubmit = (event) => {
      const params = new URLSearchParams(this.props.location.search);
      if (this.state.candidateId == "") {
         alert("Candidate Id Error");
         return;
      }
      axios.post(apiUrl + "createNewTechnicalSkills", {
         candidateId: this.state.candidateId,
         sess_id: cookies.get("c_csrftoken"),
         domain: this.state.newSkillsDetails[0].domain,
         skills: this.state.newSkillsDetails[0].skills,
      })
         .then(({ data }) => {
            if (data.statusResponse) {
               this.getSkillsList();
               Swal.fire({
                  icon: 'Success',
                  title: 'Skill details added',
                  text: ""
               });
               this.setState({ showSkillsAddFormCond: false });
            } else { }
         });
   }

   handleNewExperienceSubmit = (event) => {
      if (this.state.candidateId == "") {
         alert("Candidate Id Error");
         return;
      }
      axios.post(apiUrl + "createNewExperience", {
         candidateId: this.state.candidateId,
         title: this.state.newExperienceDetails[0].title,
         employmentType: this.state.newExperienceDetails[0].employmentType,
         company: this.state.newExperienceDetails[0].company,
         startYear: this.state.newExperienceDetails[0].startYear,
         endYear: this.state.newExperienceDetails[0].endYear,
         location: this.state.newExperienceDetails[0].location,
         headLine: this.state.newExperienceDetails[0].headLine,
         description: this.state.newExperienceDetails[0].description,
         sess_id: cookies.get("c_csrftoken")
      })
         .then(({ data }) => {
            if (data.statusResponse) {
               this.getExperienceList();
               Swal.fire({
                  icon: 'Success',
                  title: 'Experience details added',
                  text: ""
               });
            } else {

            }

         });

   }
   getEducationList = (event) => {
      var thisObj = this;
      //+this.state.candidateId
      axios.get(apiUrl + "listEducation", { params: { sess_id: cookies.get("c_csrftoken"), candidateId: this.state.candidateId } }).then(({ data }) => {
         if (data.statusResponse) {
            // this.setState({educationList:res.educationList});
            if (data.educationList != null) {
               thisObj.setState({ educationList: data.educationList });
            }
         }
      }).catch(({ err }) => { });
   }
   getExperienceList = (event) => {
      var thisObj = this;
      axios.get(apiUrl + "listExperience", { params: { sess_id: cookies.get("c_csrftoken"), candidateId: this.state.candidateId } }).then(({ data }) => {
         if (data.statusResponse) {
            if (data.experienceList != null) {
               thisObj.setState({ experienceList: data.experienceList });
            }
         }
      }).catch(({ err }) => { });
   }
   handleNewEducationSubmit = (event) => {
      if (this.state.candidateId == "") {
         alert("Candidate Id Error");
         return;
      }
      axios.post(apiUrl + "createNewEducation", {
         candidateId: this.state.candidateId,
         schoolName: this.state.newEducationDetails[0].educationNewSchool,
         degreeName: this.state.newEducationDetails[0].educationNewDegree,
         fieldofStudy: this.state.newEducationDetails[0].educationNewFieldofStudy,
         startYear: this.state.newEducationDetails[0].educationNewStartyear,
         endYear: this.state.newEducationDetails[0].educationNewEndyear,
         grade: this.state.newEducationDetails[0].educationNewGrade,
         description: this.state.newEducationDetails[0].educationNewDescription,
         sess_id: cookies.get("c_csrftoken")
      })
         .then(({ data }) => {
            if (data.statusResponse) {
               this.getEducationList();
               Swal.fire({
                  icon: 'Success',
                  title: 'Education details added',
                  text: ""
               });
            } else {

            }
         });
   }
   //upload validation
   handleUpload = (event) => {
      var a = event.target.files[0].name.split(".");
      var allowedTypes = ["docx", "pdf", "txt", "doc"];
      let file = event.target.files[0];
      var fileExt = a[a.length - 1];
      if (allowedTypes.indexOf(fileExt) >= 0 && event.target.files[0].size <= 5000000) {
         fData.append("file", file);
         fData.append("candidateId", this.state.selectedUserId);
         fData.append("fileExtension", fileExt);
         fData.append("csrf-token", cookies.get('c_csrftoken'));
         fData.append("sess_id", cookies.get("c_csrftoken"));
         //console.log(fData);
         //console.log(event.target.files[0])
      } else {
         //addNotification(event,level,msg,position)
         event.target.value = null
      }
   }
   completeUpload = async (event) => {
      let responseJson = null;
      this.setState({ setLoading: true });
      const thisObj = this;
      await axios.post(apiUrl + "parseResumeFile", fData, config).then(({ data }) => {
         responseJson = (data);
         this.setState({ setLoading: false });
         if (data.statusResponse) {
            //this.showAlert("br","success","Candidate created successsfully","pe-7s-check");
            let timerInterval;
           
            Swal.fire({
               icon: 'success',
               title: data.message,
               html: 'Click ok to continue candidate details update',
               onConfirm:()=>{
                  window.location.href = "../admin/editCandidate?candidateId=" + data.candidateId;
               },
               onBeforeOpen: () => {
                  Swal.showLoading()
                  timerInterval = setInterval(() => {  alert(data.candidateId)
                     window.location.href = "../admin/editCandidate?candidateId=" + data.candidateId;
                  }, 100)
               },
               onClose: () => {
                  //clearInterval(timerInterval)
                 
                  //setTimeout(()=>this.props.history.push("../"+(userType)+"/candidates"),  500);
                  window.location.href = "../admin/editCandidate?candidateId=" + data.candidateId;
                 
               }
            }).then((result) => {  
               /* Read more about isConfirmed, isDenied below */  
                if (result.isConfirmed) {    
                  window.location.href = "../admin/editCandidate?candidateId=" + data.candidateId; 
                }
                  //Swal.fire('Saved!', '', 'success')  
               // } else if (result.isDenied) {    
              //     Swal.fire('Changes are not saved', '', 'info')  
              //  }
            });
         }
         if (!responseJson.statusResponse) {
            Swal.fire('Oops...', responseJson.message, 'error'); return;
         } else {
            this.setState({
               candidateId: responseJson.candidateId,
            });
         }
      });
      //if(responseJson != null)
      //this.setState({email:responseJson.email,firstName:responseJson.firstName,lastName:responseJson.lastName,phone:responseJson.phone,skills:responseJson.skills,candidateId:responseJson.candidateId,uploadedFileName:responseJson.uploadedFileName,resumeDetails:responseJson.resumeDetails});
   }


   handleInput(event) {
      this.setState({
         [event.target.name]: event.target.value
      });
   }
   handleSubmit(event) {
      if (this.state.firstName == "") {
         Swal.fire('Oops...', 'Enter alteast Firstname', 'error'); return;
      }
      const thisObj = this;
      //selectedUserId
      axios.post("", {
       
         sess_id: cookies.get("c_csrftoken"),
         candidateId: parseInt(this.state.candidateId)

      }).then(({ data }) => {
         console.log(data.statusResponse)
         console.log(data)
         if (data.statusResponse) {
            //this.showAlert("br","success","Candidate created successsfully","pe-7s-check");
            let timerInterval;
            Swal.fire({
               icon: 'success',
               title: data.message,
               html: '',
               timer: 1800,
               timerProgressBar: true,
               onBeforeOpen: () => {
                  Swal.showLoading()
                  timerInterval = setInterval(() => {
                     //    const content = Swal.getContent()
                     //   if (content) {
                     //  const b = content.querySelector('b')
                     // if (b) {
                     //   b.textContent = Swal.getTimerLeft()
                     //  }
                     //  }
                     window.location.href = "../" + userType + "/editCandidate?userId=" + data.candidateId;
                  }, 100)
               },
               onClose: () => {
                  clearInterval(timerInterval)
                  //            setTimeout(()=>this.props.history.push("../admin/candidates"),  500);
                  window.location.href = "../" + userType + "/editCandidate?userId=" + data.candidateId;
                  //window.location.reload();
               }
            });
         } else {
            Swal.fire('Oops...', 'Error creating', 'error'); return;
         }
      });//axios end
   }

   componentDidMount() {
      // this.getEducationList();
      //this.getExperienceList();
   }
   render() {
      //  this.getEducationList();
      // this.getExperienceList();
      const thisObj = this;
      let userType = "admin";
      userType = typeof userType === "undefined" ? "admin" : userType;


      return (<><div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
         <Container fluid>
            <div className="header-body">
               {/* Card stats */}
               <Row>
                  <div className="col-sm-12 mb-4">
                     <div className="d-flex justify-content-center">
                        <h3 className="float-left pl-0">Add Candidate</h3>
                     </div>
                 
                     <div className="d-flex justify-content-center bd-highlight mb-3">
                     <a className="" onClick={this.toggleUpload}>
                        <div className="file-box dropify-wrapper" >
                        <span className="d-flex justify-content-center sfile-icon" style={{paddingTop:"14%",paddingBottom:"14%"}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        </span>
          
                       
                        <small className="row d-flex justify-content-center text-center" style={{bottom:"23px"}}>
                            click to upload resume,<br/> Valid documents : docx, pdf, txt, doc</small>
                        <input type="file" style={{visibility:"hidden"}} onChange={this.handleUpload} name="file" id="input-file-now" className="dropify"/>                                                       
                        </div>
                        

                     </a>
                     </div>
                     <div className="mt-3 d-flex justify-content-center">
                  <button type="button" onClick={this.completeUpload} className="btn pull-left mr-2 btn btn-primary waves-effect waves-light">
                                 <span className="btn-inner--icon"><i className="fa fa-upload pr-2"></i></span>Upload</button>
                  <a href={'../' + userType + '/candidates'}
                        className="btn btn-secondary  waves-effect waves-light "
                     >Back</a>
                     </div>
     
                  
                  </div>
               </Row>
            </div>
         </Container>
      </div>
        
      </>);
   }
}
export default CreateCandidate;