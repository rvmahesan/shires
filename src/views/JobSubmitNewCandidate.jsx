import React, { Component } from "react";
import {
   Container,
   Row,
   Col,
   Card,
   CardHeader, Spinner, CardBody, Label, Modal, ModalHeader, ModalBody, ModalFooter, Button, Input
} from "reactstrap";

import classNames from "classnames";
import IFrame from "../components/iFrame/IFrame.jsx"
import Select from "../components/Select.jsx";
import NumberFormat from "react-number-format";
import Swal from 'sweetalert2';
import { style, candidateGetUrl, candidateDeleteUrl, candidateUpdateUrl, candidateResumeUpdateUrl, apiUrl } from "../variables/Variables.jsx";
import NotificationSystem from "react-notification-system";
import EducationAddForm from "../components/Candidates/educationAddForm.jsx";
import ExperienceAddForm from "../components/Candidates/experienceAddForm.jsx";
import SkillAddForm from "../components/Candidates/skillAddForm.jsx";
import { ToastContainer, toast } from 'react-toastify';
import LoadingBar from 'react-top-loading-bar'
import ReactQuill from "react-quill";
import successAlert from "../components/Alerts/successAlert.jsx";
import FailAlert from "../components/Alerts/failAlert.jsx";
import Cookies from 'universal-cookie';

import Common from "./commons/Common.jsx"
const axios = require("axios").default;
const cookies = new Cookies();


const userType = new Common().getUserType();
let selectedUserId = "";
let fData = new FormData();
let config = {
   headers: {
      'content-type': 'multipart/form-data'
   }
};
const params = new URLSearchParams(window.location.search);

/*Edit Candidate*/
class JobSubmitNewCandidate extends Component {
   constructor(props, context) {
      super(props, context);
      this.state = {
         jboId: params.get("jobId"),sess_id:cookies.get("c_csrftoken"),
         candidateDetails: {
            id: "",skills:"",
            firstName: "",
            lastName: "", middleName: "", gender: "", email: "", altemail: "",
            phone: "", altphone: "",
            rate: "", rateType: "", workAuthorization: "", location: "",
            jobTitle: "",

            address: "",
            country: "",
            zipcode: "", state: "", applicantStatus: "",
            aboutMe: "",
            resumeDetails: null,
            resumePath: "",
            skills: "", fileType: "", fileExists: false, resumePath: "", source: "", experienceMonths: "", experienceYears: ""
         },
         experienceList: [],
         educationList: [],
         skillsList: [],
         progressTimer: 0,
         showEducationAddFormCond: false,
         showExperienceAddFormCond: false,
         showSkillsAddFormCond: false,
         showskillUpdateModal: false,
         showEducationUpdateModal: false,
         showExperienceUpdateModal: false,
         skillDetails: {
            skills: "",
            id: ""
         },
         EducationDetails: {
            schoolName: "",
            degreeName: "",
            fieldofStudy: "",
            startYear: "",
            endYear: "",
            grade: "",
            description: "",
            id: "",
            candidateId: ""
         },
         educationLengh: 0,
         ExperienceDetails: {
            title: "",
            employmentType: "",
            company: "",
            startYear: "",
            endYear: "",
            location: "",
            headLine: "",
            description: "",
            responsibility: "",
            experienceId: "",
            id: ""
         },
         experienceLength: 0,
         educationLoading: false,
         skillloading: false,
         experienceLoading: false
      };
      this.genderOptions = ["", "Male", "Female", "Others"];
      this.rateOptions = ["", "Hourly"];
      this.handleInput = this.handleInput.bind(this);
      this.handleUpdate = this.handleUpdate.bind(this);
      this.handleDelete = this.handleDelete.bind(this);
      this.getEducationList = this.getEducationList.bind(this);
      this.getExperienceList = this.getExperienceList.bind(this);
      this.deleteAttribute = this.deleteAttribute.bind(this);
      this.getSkillsList = this.getSkillsList.bind(this);
      this.updateSkill = this.updateSkill.bind(this);
      this.updateSkillsForm = this.updateSkillsForm.bind(this);
      this.updateEducation = this.updateEducation.bind(this);
      this.updateExperience = this.updateExperience.bind(this);
      this.getEducationDetails = this.getEducationDetails.bind(this);
      this.closeEducationAddForm = this.closeEducationAddForm.bind(this);//componenet
      this.closeExperienceAddForm = this.closeExperienceAddForm.bind(this);//componenet
      this.closeSkillAddForm = this.closeSkillAddForm.bind(this);//componenet
      this.showLoadingBar = this.showLoadingBar.bind(this);
      axios.defaults.withCredentials = false;
   }

   applyHeight(cont) {
      let ros = 0;
      if (cont != "")
         ros = cont.split(/\r*\n/).length;
      if (ros <= 12)
         ros = 5;
      return ros;
   }
   updateExperience() {
      var thisObj = this;
      if (this.state.ExperienceDetails.title == "") {
         //<failAlert title='Experience Title required!'/>
         thisObj.renderFailAlert('Experience Title required!');
         return;
      }
      this.setState({ experienceLoading: true });
      axios.put(apiUrl + "updateExperienceDetails", {
         id: this.state.ExperienceDetails.id,
         candidateId: this.state.candidateDetails.candidateId,
         title: this.state.ExperienceDetails.title,
         employmentType: this.state.ExperienceDetails.employmentType,
         company: this.state.ExperienceDetails.company,
         startYear: this.state.ExperienceDetails.startYear,
         endYear: this.state.ExperienceDetails.endYear,
         location: this.state.ExperienceDetails.location,
         headLine: this.state.ExperienceDetails.headLine,
         description: this.state.ExperienceDetails.description,
         sess_id: this.state.sess_id
      }).then(function (res) {
         var responseJson = (res.data);
         thisObj.setState({ experienceLoading: false });
         if (responseJson.statusResponse) {
            thisObj.renderSuccessAlert('Experience details updated successfully!');
            thisObj.setState({ showExperienceUpdateModal: false });
            thisObj.getExperienceList();
         }
      }).catch(function (err) {
         console.log(err);
         thisObj.setState({ experienceLoading: false });
      });

   }
   //get single education details
   getExperienceDetails(objId) {
      var ExperienceDetails = {
         title: "",
         employmentType: "",
         company: "",
         startYear: "",
         endYear: "",
         location: "",
         headLine: "",
         description: "",
         id: ""
      };
      var ptTimer = 0;
      var thisObj = this;
      thisObj.setState({ progressTimer: 0 });
      var inter = setInterval(function () {
         ptTimer = ptTimer + 10;
         if (ptTimer <= 60)
            thisObj.setState({ progressTimer: ptTimer });
      }, 100);

      this.setState({ ExperienceDetails: ExperienceDetails });
      axios.get(apiUrl + "getExperienceDetails", { params: { experienceId: objId, sess_id: this.state.sess_id } }).then(({ data }) => {
         if (data.statusResponse) {
            this.setState({ ExperienceDetails: data.exeprienceDetails, showExperienceUpdateModal: true, progressTimer: 100 });
           // console.log(this.state.ExperienceDetails)
         }
      }).catch(({ err }) => {
         this.renderFailAlert('Error occured try again later!');
         thisObj.setState({ progressTimer: 100 });
      });
   }
   //update education
   updateEducation(vals) {
      var thisObj = this;
      this.setState({ educationLoading: true });
      axios.put(apiUrl + "updateEducationDetails", {
         id: this.state.EducationDetails.id,
         candidateId: this.state.EducationDetails.candidateId,
         schoolName: this.state.EducationDetails.schoolName,
         degreeName: this.state.EducationDetails.degreeName,
         fieldofStudy: this.state.EducationDetails.fieldofStudy,
         startYear: this.state.EducationDetails.startYear,
         endYear: this.state.EducationDetails.endYear,
         grade: this.state.EducationDetails.grade,
         description: this.state.EducationDetails.description,
         sess_id: this.state.sess_id
      }).then(function (res) {
         thisObj.setState({ educationLoading: false });
         var responseJson = (res.data);
         if (responseJson.statusResponse) {
            thisObj.renderSuccessAlert('Education details updated successfully!');
            thisObj.setState({ showEducationUpdateModal: false });
            thisObj.getEducationList();
         }
      }).catch(function (err) {
         console.log(err);
         thisObj.setState({ educationLoading: false });
      });

   }

   //get single education details
   getEducationDetails(objId) {
      var EducationDetails = {
         schoolName: "",
         degreeName: "",
         fieldofStudy: "",
         startYear: "",
         endYear: "",
         grade: "",
         description: "",
         educationId: ""
      };
      var ptTimer = 0;
      var thisObj = this;
      thisObj.setState({ progressTimer: 0 });
      var inter = setInterval(function () {
         ptTimer = ptTimer + 10;
         if (ptTimer <= 60)
            thisObj.setState({ progressTimer: ptTimer });
      }, 100);

      this.setState({ EducationDetails: EducationDetails, progressTimer: 100 });
      axios.get(apiUrl + "getEducationDetails", { params: { educationId: objId, sess_id:this.state.sess_id } }).then(({ data }) => {
         if (data.statusResponse) {
            this.setState({ showEducationUpdateModal: true });
            this.setState({ EducationDetails: data.educationDetail });
         }
      }).catch(({ err }) => {
         this.renderFailAlert('Error occured try again later!');
         thisObj.setState({ progressTimer: 100 });
      });
   }
   //list education details
   getEducationList = (event) => {
      var thisObj = this;
      //+this.state.candidateId 
      axios.get(apiUrl + "listEducation", { params: { candidateId: this.state.candidateId, sess_id:this.state.sess_id} }).then(({ data }) => {
         if (data.statusResponse) {
            // this.setState({educationList:res.educationList});
            thisObj.setState({ educationLength: data.educationLength });
            thisObj.setState({ educationList: data.educationList });
         }
      }).catch(({ err }) => {
         this.renderFailAlert('Error occured try again later!');

      });
   }
   getExperienceList = (event) => {
      var thisObj = this;
      axios.get(apiUrl + "listExperience", { params: { candidateId: this.state.candidateId, sess_id:this.state.sess_id } }).then(({ data }) => {
         if (data.statusResponse) {
            thisObj.setState({ experienceLength: data.experienceLength });
            thisObj.setState({ experienceList: data.experienceList });
         }
      }).catch(({ err }) => {
         this.renderFailAlert('Error occured try again later!');
      });
   }

   getSkillsList = (event) => {
      var thisObj = this;
      axios.get(apiUrl + "listCandidateSkills", { params: { candidateId: this.state.candidateId, __daa: Date.now(), sess_id: this.state.sess_id } }).then(({ data }) => {
         if (data.statusResponse) {
            this.setState({ skillsList: data.skillsList });
         }
      }).catch(({ err }) => {
         thisObj.renderFailAlert('Error occured try again later!');
      });
   }

   showLoadingBar(barValue) {
      this.setState({ progressTimer: barValue });
   }
   //get single skills details for edit pop up
   updateSkill = (event, objId) => {
      var ptTimer = 0;
      var thisObj = this;
      thisObj.setState({ progressTimer: 0 });
      var inter = setInterval(function () {
         ptTimer = ptTimer + 10;
         if (ptTimer <= 60)
            thisObj.setState({ progressTimer: ptTimer });
      }, 100);
      axios.get(apiUrl + "getCandidateSkillDetails", { params: { skillId: objId, sess_id: this.state.sess_id } }).then(({ data }) => {
         if (data.statusResponse) {
            this.setState({ showskillUpdateModal: true, skillDetails: data.skillDetails, progressTimer: 100 });
         }
      }).catch(({ err }) => {
         thisObj.renderFailAlert('Error occured try again later!'); this.setState({ progressTimer: 100 });
      });
   }
   //get single skills details updated submitted by pop up
   updateSkillsForm() {
      var thisObj = this;
      if (this.state.skillDetails.skills == "") {
         thisObj.renderFailAlert('Invalid Input!');
         return;
      }
      var ptTimer = 0;
      var thisObj = this;
      this.setState({ skillloading: true });
      var inter = setInterval(function () {
         ptTimer = ptTimer + 10;
         if (ptTimer <= 60)
            thisObj.showLoadingBar(ptTimer);
      }, 100);


      axios.put(apiUrl + "updateCandidateSkillDetails", {
         skills: this.state.skillDetails.skills,
         id: this.state.skillDetails.id,
         sess_id: this.state.sess_id
      }).then(({ data }) => {
         thisObj.setState({ showskillUpdateModal: false, skillloading: false, progressTimer: 0 });
         thisObj.showLoadingBar(100);
         if (data.statusResponse) {
            thisObj.renderSuccessAlert('Candidate details updated successfully!');
            thisObj.getSkillsList();
         } else {
            thisObj.renderFailAlert(data.message);
         }
      }).catch(function (err) {
         thisObj.setState({ skillloading: true });
         thisObj.renderFailAlert('Error occured try again later!');
      });

   }

   setCandidateData = async () => {

      await axios.get(apiUrl + "getCandidateDetails", {
         params: {
            candidateId: this.state.candidateId,
            sess_id:this.state.sess_id
         }
      }, { withCredentials: false }).then(({ data }) => {

         if (data.statusResponse) {
            var candDets = {
               firstName: data.candidateDetails.firstName,
               lastName: data.candidateDetails.lastName,
               middleName: data.candidateDetails.middleName,
               location: data.candidateDetails.location,
               rate: data.candidateDetails.rate,
               rateType: data.candidateDetails.rateType,
               gender: data.candidateDetails.gender,
               workAuthorization: data.candidateDetails.workAuthorization,
               experienceMonths: data.candidateDetails.experienceMonths,
               experienceYears: data.candidateDetails.experienceYears,
               state: data.candidateDetails.state,
               phone: data.candidateDetails.phone,
               altphone: data.candidateDetails.altphone,
               jobTitle: data.candidateDetails.jobTitle,
               applicantStatus: data.candidateDetails.applicantStatus,
               country: data.candidateDetails.country,
               zipcode: data.candidateDetails.zipcode,
               aboutMe: data.candidateDetails.aboutMe,
               address: data.candidateDetails.address,
               email: data.candidateDetails.email,
               altemail: data.candidateDetails.altemail,
               skills: data.candidateDetails.skills,
               fileType: data.fileType,
               fileExists: data.fileExists,
               resumeDetails: data.resumeDetails,
               resumePath: data.resumePath,

               id: data.candidateDetails.id,
               source: data.candidateDetails.source,
            }
            selectedUserId = this.state.userId;
            this.setState({
               candidateDetails: candDets, selectedUserId: selectedUserId
            });
         }else{
            this.setState({
               candidateDetails: null, selectedUserId: selectedUserId
            });
         }
      })
         .catch((err) => { });
   }
   componentDidMount() {
     // this.setCandidateData();
    //  this.getEducationList();
    //  this.getExperienceList();
    //  this.getSkillsList();
      //this.setState({ _notificationSystem: this.refs.notificationSystem });
   }
   getUserName() {
      var cookiePair = cookies.get("canAuthToken").split("==");
      return cookiePair[2];
   }
   renderFailAlert(title) {
      toast.error('😢 ' + (title), {
         position: "top-right",
         autoClose: 1800,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined
      })
   }
   renderSuccessAlert(title) {
      toast.success('😋 ' + (title), {
         position: "top-right",
         autoClose: 1800,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined
      })
   }

   render() {

      let fileUrl = apiUrl + "generateSystemResume?candidateId=" + (this.state.candidateId) + "&sess_id=" + cookies.get("c_csrftoken") + "#zoom100&toolbar=0&navpanes=0&scrollbar=1";
      let downloadUrl = apiUrl + "previewMyResume?candidateId=" + (this.state.candidateId) + "&sess_id=" + cookies.get("c_csrftoken") + "#zoom100&toolbar=0&navpanes=0&scrollbar=1";
      const educationAddForm = this.state.showEducationAddFormCond ? <EducationAddForm candidateId={this.state.candidateId} sess_id={this.state.sess_id}  showLoadingBar={this.showLoadingBar} closeEducationAddForm={this.closeEducationAddForm} candidateId={this.state.candidateId} /> : "";
      const experienceAddForm = this.state.showExperienceAddFormCond ? <ExperienceAddForm showLoadingBar={this.showLoadingBar} closeExperienceAddForm={this.closeExperienceAddForm} candidateId={this.state.candidateId} sess_id={this.state.sess_id} candidateId={this.state.candidateId} /> : "";
      const skillsAddForm = this.state.showSkillsAddFormCond ? <SkillAddForm candidateId={this.state.candidateId} sess_id={this.state.sess_id} showLoadingBar={this.showLoadingBar} closeSkillAddForm={this.closeSkillAddForm} candidateId={this.state.candidateId} sess_id={this.state.sess_id} /> : "";
      const thisObj = this;
     // console.log(this.state.candidateDetails);
 

      return  <><LoadingBar
      color='#1761fd'
      progress={this.state.progressTimer}
      onLoaderFinished={0}
   />
   <div className="header bg-gradient-info pb-1 pt-4 pt-md-8">

      <Container fluid>
         <div className="header-body">
            <Row>
               <Col lg="12" xl="12">
                  <h3 className="font-54 font-weight-bold mt-2 col-sm-8 float-left">Submit New Candidate</h3>
                  <div className="float-right">
                     <a href={'../' + userType + '/candidates#' + this.state.currentPageNumber}
                        className="btn btn btn-dark ml-2 btn-sm waves-effect waves-light ">Cancel</a>
                  </div>
               </Col>
            </Row>
         </div>
      </Container>
      <hr className="hr-dashed"></hr>
   </div>
   <div className="col-sm-12">

            <Container className="col-sm-12  float-left" fluid>
               <Row>
                  <div className="col">
                     <div>

                        <form>

                           <div className="row">
                              <div className="col-md-3">
                                 <div className="form-group">
                                    <label>First Name</label>
                                    <div className="input-group input-group-merge">
                                       <div className="input-group-prepend">
                                          <span className="input-group-text"><i className="fas fa-user"></i></span>
                                       </div>
                                       <input placeholder="First Name" type="text" className="form-control" name="firstName" defaultValue={this.state.candidateDetails.firstName} onChange={(e) => { this.state.candidateDetails.firstName = e.target.value }} />
                                    </div>
                                 </div>
                              </div>

                              <div className="col-md-3">
                                 <div className="form-group">
                                    <label>Middle Name</label>
                                    <div className="input-group input-group-merge">
                                       <div className="input-group-prepend">
                                          <span className="input-group-text"><i className="fas fa-user"></i></span>
                                       </div>
                                       <input placeholder="Middle Name" type="text" className="form-control" name="middleName" defaultValue={this.state.candidateDetails.middleName} onChange={(e) => { this.state.candidateDetails.middleName = e.target.value }} /></div>
                                 </div>
                              </div>



                              <div className="col-md-3">
                                 <div className="form-group">
                                    <label>Last Name</label>
                                    <div className="input-group input-group-merge">
                                       <div className="input-group-prepend">
                                          <span className="input-group-text"><i className="fas fa-user"></i></span>
                                       </div>
                                       <input placeholder="Last Name" type="text" className="form-control" name="lastName" defaultValue={this.state.candidateDetails.lastName} onChange={(e) => { this.state.candidateDetails.lastName = e.target.value }} /></div>
                                 </div>
                              </div>


                              <div className="col-md-3">
                                 <div className="form-group">
                                    <label>Gender</label>
                                    <select name={"candidateDetails.gender"} title={""} className="form-control"

                                       value={this.state.candidateDetails.gender}
                                       options={this.genderOptions} placeholder={""}
                                       className="form-control"
                                       onChange={this.handleInput}
                                       defaultValue={this.state.candidateDetails.gender}
                                    >
                                       <option value="">--Gender--</option>
                                       <option value="Male">Male</option>
                                       <option value="Female">Female</option>
                                       <option value="Others">Others</option>
                                    </select>
                                 </div>
                              </div>



                           </div>



                           <div className="row">

                              <div className="col-md-3">
                                 <div className="form-group">
                                    <label>Email</label>
                                    <div className="input-group input-group-merge">
                                       <div className="input-group-prepend">
                                          <span className="input-group-text"><i className="fas fa-envelope"></i></span>
                                       </div>
                                       <input placeholder="Email" type="text" className="form-control" name="email" defaultValue={this.state.candidateDetails.email} onChange={(e) => { this.state.candidateDetails.email = e.target.value }} /></div>
                                 </div>
                              </div>

                              <div className="col-md-3">
                                 <div className="form-group">
                                    <label>Alternate Email</label>
                                    <div className="input-group input-group-merge">
                                       <div className="input-group-prepend">
                                          <span className="input-group-text"><i className="fas fa-envelope"></i></span>
                                       </div>
                                       <input placeholder="Alternate Email" type="text" className="form-control" name="altemail" defaultValue={this.state.candidateDetails.altemail} onChange={(e) => { this.state.candidateDetails.altemail = e.target.value }} /></div>
                                 </div>
                              </div>



                              <div className="col-md-2">
                                 <div className="form-group">
                                    <label>Phone</label>
                                    <div className="input-group input-group-merge">
                                       <div className="input-group-prepend">
                                          <span className="input-group-text"><i className="fas fa-phone"></i></span>
                                       </div>
                                       <input placeholder="phone" type="text" className="form-control" name="phone" defaultValue={this.state.candidateDetails.phone} onChange={(e) => { this.state.candidateDetails.phone = e.target.value }} />
                                    </div>
                                    {/*<NumberFormat format="+1 (###) ###-####" mask="_" className="form-control" defaultValue={this.state.phone} name="phone" onChange={this.handleInput}/>*/}
                                 </div>
                              </div>

                              <div className="col-md-2">
                                 <div className="form-group">
                                    <label>Alternate Phone</label>
                                    <div className="input-group input-group-merge">
                                       <div className="input-group-prepend">
                                          <span className="input-group-text"><i className="fas fa-phone"></i></span>
                                       </div>
                                       <input placeholder="Alternate Phone" type="text" className="form-control" name="altphone" defaultValue={this.state.candidateDetails.altphone} onChange={(e) => { this.state.candidateDetails.altphone = e.target.value }} />
                                    </div>
                                    {/*<NumberFormat format="+1 (###) ###-####" mask="_" className="form-control" defaultValue={this.state.phone} name="phone" onChange={this.handleInput}/>*/}
                                 </div>
                              </div>
                              <div className="col-md-2">
                                 <div className="form-group">
                                    <label>Work Authorization</label>
                                    <select name={"candidateDetails.workAuthorization"} title={""} className="form-control" onChange={this.handleInput} defaultValue={this.state.candidateDetails.workAuthorization} value={this.state.candidateDetails.workAuthorization} placeholder={"Rate Type"}>
                                       <option value="">Select</option>
                                       <option value="B1">B1</option>
                                       <option value="Can work for any employer">Can work for any employer</option>
                                       <option value="Canada Authorized">Canada Authorized</option>
                                       <option value="Canadian Citizen">Canadian Citizen</option>
                                       <option value="Citizen">Citizen</option>
                                       <option value="Current Employer Only">Current Employer Only</option>
                                       <option value="Employment Auth. Document">Employment Auth. Document</option>
                                       <option value="Employment Authorization Document">Employment Authorization Document</option>
                                       <option value="GC">GC</option>
                                       <option value="GC-EAD">GC-EAD</option>
                                       <option value="Green Card Holder">Green Card Holder</option>
                                       <option value="H1-B">H1-B</option>
                                       <option value="Have H1 Visa">Have H1 Visa</option>
                                       <option value="India Authorized">India Authorized</option>
                                       <option value="L1-">L1-A</option>
                                       <option value="L1-B">L1-B</option>
                                       <option value="US Citizen">US Citizen</option>
                                    </select>
                                 </div>
                              </div>





                              <div className="col-md-3">
                                 <div className="form-group">
                                    <label>City</label>
                                    <div className="input-group input-group-merge">
                                       <div className="input-group-prepend">
                                          <span className="input-group-text"><i className="fas fa-map-marker-alt"></i></span>
                                       </div>
                                       <input placeholder="Location" type="text" className="form-control" name="location" defaultValue={this.state.candidateDetails.location} onChange={(e) => { this.state.candidateDetails.location = e.target.value }} />
                                    </div>
                                 </div>
                              </div>
                              <div className="col-md-1">
                                 <div className="form-group">
                                    <label>Expected Pay</label>
                                    <div className="input-group input-group-merge">
                                       <div className="input-group-prepend">
                                          <span className="input-group-text"><i className="fas fa-dollar-sign"></i></span>
                                       </div>
                                       <NumberFormat placeholder="Rate" 
                                       type="text" 
                                       className="form-control" name="rate" value={this.state.candidateDetails.rate}
                                       onChange={(e) => { this.state.candidateDetails.rate = e.target.value }} />
                                    </div>
                                 </div>
                              </div>
                              <div className="col-md-2">
                                 <div className="form-group">
                                    <label>&nbsp;</label>
                                    <select
                                       name={"candidateDetails.rateType"}
                                       value={this.state.candidateDetails.rateType}
                                       defaultValue={this.state.candidateDetails.rateType}
                                       placeholder={"Rate Type"}
                                       className="form-control"
                                       onChange={this.handleInput}

                                    >
                                       <option value="">--select--</option>
                                       <option value="Hourly">Hourly</option>
                                    </select>
                                 </div>
                              </div>

                              <div className="col-md-2">
                                 <div className="form-group">
                                    <label>Job Title</label>
                                    <div className="input-group input-group-merge">
                                       <div className="input-group-prepend">
                                          <span className="input-group-text"><i className="fas fa-suitcase"></i></span>
                                       </div>
                                       <input placeholder="Job Title" type="text" className="form-control" name="jobTitle" defaultValue={this.state.candidateDetails.jobTitle} onChange={(e) => { this.state.candidateDetails.jobTitle = e.target.value }} />
                                    </div>
                                 </div>
                              </div>
                              <div className="col-md-2">
                                 <div className="form-group">
                                    <label>Source</label>
                                    <div className="input-group input-group-merge">
                                       <div className="input-group-prepend">
                                          <span className="input-group-text"><i className="fas fa-suitcase"></i></span>
                                       </div>
                                       <input placeholder="Source" type="text" className="form-control" name="source" defaultValue={this.state.candidateDetails.source} onChange={(e) => { this.state.candidateDetails.source = e.target.value }} />
                                    </div>
                                 </div>
                              </div>

                              <div className="col-md-2">
                                 <div className="form-group">
                                    <label>Experience</label>
                                    <div className="col-sm-12 p-0 w-100">
                                       <div className="col-sm-6 float-left p-0">
                                          <select
                                             name={"candidateDetails.experienceYears"}
                                             value={this.state.candidateDetails.experienceYears}
                                             defaultValue={this.state.candidateDetails.experienceYears}
                                             placeholder={"Experience Years"}
                                             className="form-control"
                                             onChange={this.handleInput}
                                          >
                                             <option value="">Years</option>
                                             {Array.apply(0, Array(50)).map(function (x, i) {
                                                return <option value={i}>{i} Yrs</option>
                                             })}
                                          </select>

                                       </div>
                                       <div className="col-sm-6 float-left p-0">
                                          <select
                                             name={"candidateDetails.experienceMonths"}
                                             value={this.state.candidateDetails.experienceMonths}
                                             defaultValue={this.state.candidateDetails.experienceMonths}
                                             placeholder={"Experience Months"}
                                             className="form-control"
                                             onChange={this.handleInput}
                                          >
                                             <option value="">Months</option>
                                             {Array.apply(0, Array(12)).map(function (x, i) {
                                                return <option value={i}>{i} Months</option>
                                             })}
                                          </select>

                                       </div>

                                    </div>


                                 </div>
                              </div>

                           </div>

                           <div className="row">
                              <div className="col-md-3">
                                 <div className="form-group">
                                    <label>Address</label>
                                    <div className="input-group input-group-merge">
                                       <div className="input-group-prepend">
                                          <span className="input-group-text"><i className="fas fa-location-arrow"></i></span>
                                       </div>
                                       <input placeholder="Address" type="text" className="form-control" name="address" defaultValue={this.state.candidateDetails.address} onChange={(e) => { this.state.candidateDetails.address = e.target.value }} />
                                    </div>
                                 </div>
                              </div>
                              <div className="col-md-3">
                                 <div className="form-group">
                                    <label>Country</label>
                                    <div className="input-group input-group-merge">
                                       <div className="input-group-prepend">
                                          <span className="input-group-text"><i className="fas fa-globe"></i></span>
                                       </div>
                                       <input placeholder="Country" type="text" className="form-control" name="country" defaultValue={this.state.candidateDetails.country} onChange={(e) => { this.state.candidateDetails.country = e.target.value }} />
                                    </div>
                                 </div>
                              </div>
                              <div className="col-md-2">
                                 <div className="form-group">
                                    <label>Zip Code</label>
                                    <div className="input-group input-group-merge">
                                       <div className="input-group-prepend">
                                          <span className="input-group-text"><i className="fas fa-address-book"></i></span>
                                       </div>
                                       <input placeholder="ZIP Code" type="number" name="zipcode" defaultValue={this.state.candidateDetails.zipcode} className="form-control" onChange={(e) => { this.state.candidateDetails.zipcode = e.target.value }} />
                                    </div>
                                 </div>
                              </div>

                              <div className="col-md-2">
                                 <div className="form-group">
                                    <label>State</label>
                                    <div className="input-group input-group-merge">
                                       <div className="input-group-prepend">
                                          <span className="input-group-text"><i className="fas fa-address-book"></i></span>
                                       </div>
                                       <input placeholder="State" type="text" name="state" defaultValue={this.state.candidateDetails.state} className="form-control" onChange={(e) => { this.state.candidateDetails.state = e.target.value }} />
                                    </div>
                                 </div>
                              </div>

                              <div className="col-md-2">
                                 <div className="form-group">
                                    <label>Applicant Status</label>
                                    <select name={"candidateDetails.applicantStatus"}
                                       value={this.state.candidateDetails.applicantStatus}
                                       defaultValue={this.state.candidateDetails.applicantStatus}
                                       placeholder={"Rate Type"}
                                       className="form-control"
                                       onChange={this.handleInput}

                                    >
                                       <option value="">Select Status</option>
                                       <option value="Do Not call">Do Not call (Allowed to submit)</option>
                                       <option value="Do Not Submit">Do Not Submit (Not allowed to submit)</option>
                                       <option value="New lead">New lead (Allowed to submit)</option>
                                       <option value="Out of market">Out of market (Allowed to submit)</option>
                                       <option value="Placed">Placed (Allowed to submit)</option>


                                    </select>
                                 </div>
                              </div>


                           </div>
                           <div className="col-sm-12 p-0">
                  <div className="form-group">
                     <label className="control-label">Skills</label>
                     <textarea placeholder="Ex: HTML5, SAAS, CSS3, ES5" type="text" className="form-control" onChange={(e)=>{ this.state.candidateDetails.skills=e.target.value; }}/>
                  </div>
            </div>

                           <div className="row">
                              <div className="col-md-12">
                                 <div className="form-group"><label className="control-label">Profile Summary</label>

                                    <ReactQuill theme="snow"
                                       value={this.state.candidateDetails.aboutMe}
                                       name="aboutMe"
                                       className="templateDescriptionEditor templateDescriptionEditorMini bg-white w-100"
                                       onChange={(text) => {
                                          this.state.candidateDetails.aboutMe = text
                                       }} />
                                 </div>
                              </div>
                           </div>

                           <div className="row pl-3">
                              <input type="hidden" name="selectedUserId" value={this.state.selectedUserId} />
                              <a href={'../' + userType + '/manageJobs'} className="btn btn-secondary waves-effect waves-light" style={{ marginRight: 10 + 'px' }}>
                                 {/*  <FontAwesomeIcon icon={faAngleLeft} className="mr-2"/>*/} Back </a>
                              <button type="button" onClick={(e) => this.handleUpdate(e, false)} className="btn btn-info  waves-effect waves-light">
                                 {/*<FontAwesomeIcon icon={faSave}/>*/}<span className="btn-inner--icon"><i className="fas fa-save mr-2"></i></span>  Save </button>
                            

                           </div>

                           <div className="clearfix"></div>
                        </form><NotificationSystem ref="notificationSystem" style={style} />
                     </div>
                  </div></Row>
               <Card className="mt-4">
                  <CardHeader>
                     <div className="row align-items-center">
                        <Col>
                           <h3 className="card-title"> <i className="dripicons-checklist pr-2 fa-10"></i>EDUCATION</h3>
                        </Col>
                        <div className="col-auto">
                           {(this.state.candidateDetails.resumePath !== "")?<button onClick={(e) => this.setState({ showEducationAddFormCond: true })} className="btn btn-sm btn-info d-inline-block">Add</button>:""}
                        </div>
                     </div>
                  </CardHeader>
                  <CardBody className="pt-1 pl-0 pr-0">
                     {this.state.educationList.length != 0 ? <ul className="list-group-flush list-group mb-0 mt-0 pt-0"> {this.state.educationList.map(function (obj, index) {

                        return <li className="list-group-item">
                           <div className="row justify-content-between align-items-left">
                              <h6 className="card-subtitle font-14 mt-1 float-left"><i className="float-left  fa-10 text-info dripicons-graduation mr-2 pt-1"></i><span className="offer-1"> {obj.schoolName}</span> </h6>
                           </div>
                           <span className="badge  badge-pill float-right button-items">
                              <button className="btn btn-sm btn-soft-success btn-circle" onClick={(e) => thisObj.getEducationDetails(obj.id)}><i className="dripicons-pencil" aria-hidden="true"></i></button>


                              <button type="button" className="btn btn-sm btn-soft-danger btn-circle" onClick={(e) => thisObj.deleteAttribute(e, "education", obj.id)}><i className="dripicons-trash"></i></button>
                           </span>
                           <p className="card-text text-muted float-left col-sm-10 float-left">
                              {obj.degreeName}, {obj.fieldofStudy}, {obj.grade}<br />
                              {typeof obj.startYear !== "undefined"?obj.startYear:"--"} {typeof obj.endYear !== "undefined"?obj.endYear:"--"}  <br />
                              {typeof obj.description !== "undefined"?obj.description:"--"}<br />
                           </p></li>
                     })}</ul> : <center>No Records found</center>}

                     {educationAddForm}
                  </CardBody>
               </Card>
               <Card>
                  <CardHeader>
                     <div className="row align-items-center">
                        <Col>
                           <h3 className="card-title"><i className="dripicons-checklist pr-2 fa-10"></i> PROFESSIONAL EXPERIENCE</h3>
                        </Col>
                        <div className="col-auto">
                        {(this.state.candidateDetails.resumePath !== "")?<button className="btn btn-sm btn-info d-inline-block" onClick={(e) => this.setState({ showExperienceAddFormCond: true })}>Add</button>:""}
                        </div>
                     </div>
                  </CardHeader>
                  <CardBody>
                     {this.state.experienceList.length != 0 ? <ul className="list-group-flush list-group mb-0  p-0 m-0"> {this.state.experienceList.map(function (obj, index) {
                        return <li className="list-group-item  p-0 m-0 mb-2">
                           <div className="row justify-content-between align-items-left">
                              <h6 className="card-subtitle font-14 mt-1 float-left"><i className="float-left  fa-10 text-info dripicons-wallet mr-2 pt-1"></i><span className="offer-1"> {obj.title}</span> </h6>
                           </div>

                           <span className="badge  badge-pill float-right button-items">
                              <button className="btn btn-sm btn-soft-success btn-circle" onClick={(e) => thisObj.getExperienceDetails(obj.id)}><i className="dripicons-pencil" aria-hidden="true"></i></button>

                              <button type="button" className="btn btn-sm btn-soft-danger btn-circle" onClick={(e) => thisObj.deleteAttribute(e, "experience", obj.id)}><i className="dripicons-trash"></i></button>
                           </span>
                           <p className="card-text float-left col-sm-10">{obj.company}, {obj.employmentType}<br />
                              {obj.startYear} - {obj.endYear}<br />
                              {obj.location}
                           </p>
                           <div className="row col-sm-10 pl-2">
                              {obj.responsibility}
                              {(obj.description !== "") ? <><h6 className="mt-0 mb-1 w-100">Description</h6>
                                 <ReactQuill
                                    value={obj.description}
                                    readOnly={true}
                                    theme={"bubble"}
                                 />
                              </> : ""}

                           </div>
                        </li>
                     })}</ul> : <center>No Records found</center>}
                     {experienceAddForm}
                  </CardBody>
               </Card>
            </Container>
         </div>
         <div className="row p-0 m-0 col-sm-12 mb-5">
            <div className="col-sm-12">
               <Container className="mt-3" fluid>
                  <Row>
                     <div className="col">
                        <Card className="shadow">
                           <div className="p-3 mptt-2">
                              <div className="content profileBox">

                                 <div className="row">
                                    <div className="col-md-8">
                                       <div className="form-group"><label className="control-label">Resume File</label>
                                          <input type="file" onChange={this.handleUpload} name="file" className="form-control no-border" />
                                       </div>
                                    </div>
                                    <div className="col-md-2 mt-4 pt-1 pl-0">
                                       <button type="submit" onClick={this.completeUpload} title="Upload new resume" className="pull-left btn btn-primary btn-square btn-outline-dashed waves-effect waves-light">
                                          <span className="btn-inner--icon"><i className="fa fa-upload"></i></span> Upload</button>
                                    </div>
                                    <div className="col-md-2 float-left mt-4 pt-1">
                                       {(this.state.candidateDetails.resumePath !== "") ? <a download title="Download the current resume file" href={`${apiUrl}downloadResume?candidateId=${this.state.candidateId}&sess_id=${cookies.get("c_csrftoken")}`} className="btn  btn-warning  btn-square btn-outline-dashed waves-effect waves-light">
                                          <i className="fa fa-download" ></i> Download</a> : ""}
                                    </div>
                                 </div>
                                 {(this.state.candidateDetails.resumePath !== "") ?<button type="button" onClick={this.handleDelete} title="Delete old resume" className="btn btn btn-danger waves-effect waves-light btn-icon"><span className="btn-inner--icon"><i className="fa fa-trash"></i></span> Delete</button>:<></>}
                              </div> </div>
                           <NotificationSystem ref={this.notificationSystem} /></Card></div></Row></Container></div>
         </div>
         <Modal isOpen={this.state.showskillUpdateModal}>
            <div className="modal-header">
               <h6 className="modal-title m-0" id="exampleModalDefaultLabel">Skill Details - Update</h6>
               <button type="button" className="close float-right" onClick={(e) => { this.setState({ showskillUpdateModal: false, progressTimer: 0 }); }}>
                  <span aria-hidden="true"><i className="la la-times"></i></span>
               </button>

            </div>
            <ModalBody>

               <form className="p-1">
                  <div className="col-sm-12 p-0">
                     <div className="form-group">
                        <label className="control-label">Skills</label>
                        <textarea placeholder="Ex: HTML5, SAAS, CSS3, ES5" type="text"
                           className="form-control"
                           defaultValue=""
                           rows={this.applyHeight(this.state.skillDetails.skills)}
                           value={this.state.skillDetails.skills}
                           onChange={(e) => {

                              var _skillsDetails = {
                                 skills: e.target.value, id: this.state.skillDetails.id
                              };
                              this.setState({ skillDetails: _skillsDetails });
                           }} />
                     </div>
                  </div>
               </form>
            </ModalBody><ModalFooter>
               <button type="button" onClick={this.updateSkillsForm} className="btn-sm btn-fill pull-left btn btn-primary">
                  <span className="btn-inner--icon mr-2">{this.state.skillloading ? <Spinner
                     as="span"
                     animation="border"
                     size="sm"
                     role="status"
                     aria-hidden="true"
                  /> : <i className="fas fa-plus "></i>}</span>
                  Update </button>
               <Button color="secondary" className="btn-sm" onClick={(e) => { this.setState({ showskillUpdateModal: false, progressTimer: 0 }); }}>Close</Button>
            </ModalFooter>
         </Modal>
         <Modal isOpen={this.state.showEducationUpdateModal}>
            <div className="modal-header">
               <h6 className="modal-title m-0" id="exampleModalDefaultLabel">Education details - update</h6>
               <button type="button" className="close float-right" onClick={(e) => { this.setState({ showEducationUpdateModal: false }); this.setState({ progressTimer: 0 }); }}>
                  <span aria-hidden="true"><i className="la la-times"></i></span>
               </button>
            </div>

            <ModalBody>
               <form className="p-1">
                  <div className="col-sm-12 p-0">
                     <div className="col-sm-4 p-0 float-left">
                        <div className="form-group">
                           <label className="control-label">School</label>
                           <input placeholder="Ex: Web Development" type="text" className="form-control" defaultValue={this.state.EducationDetails.schoolName} onBlur={(e) => { this.state.EducationDetails.schoolName = e.target.value; }} autoFocus={this.state.showEducationUpdateModal} />
                        </div>
                     </div>
                     <div className="col-sm-4 float-left">
                        <div className="form-group">
                           <label className="control-label">Degree</label>
                           <input placeholder="Ex: Bachelor's" type="text" defaultValue={this.state.EducationDetails.degreeName} className="form-control" onBlur={(e) => { this.state.EducationDetails.degreeName = e.target.value; }} />
                        </div>
                     </div>
                     <div className="col-sm-4 float-left">
                        <div className="form-group">
                           <label className="control-label">Field of study</label>
                           <input placeholder="Ex: Business" type="text" className="form-control" onBlur={(e) => { this.state.EducationDetails.fieldofStudy = e.target.value; }} defaultValue={this.state.EducationDetails.fieldofStudy} />
                        </div>
                     </div>
                  </div>
                  <div className="col-sm-12 p-0 row">
                     <div className="col-sm-4  float-left">
                        <div className="form-group">
                           <label className="control-label">Start year</label>
                           <input placeholder="Year" type="text" defaultValue={this.state.EducationDetails.startYear} className="form-control"
                              onBlur={(e) => { this.state.EducationDetails.startYear = e.target.value; }}
                           />
                        </div>
                     </div>
                     <div className="col-sm-4 float-left">
                        <div className="form-group">
                           <label className="control-label">End year</label>
                           <input placeholder="Year" type="text" className="form-control"
                              defaultValue={this.state.EducationDetails.endYear}
                              onBlur={(e) => { this.state.EducationDetails.endYear = e.target.value; }}
                           />
                        </div>
                     </div>
                     <div className="col-sm-4">
                        <div className="form-group">
                           <label className="control-label">Grade</label>
                           <input placeholder="" type="text" defaultValue={this.state.EducationDetails.grade} className="form-control" onBlur={(e) => { this.state.EducationDetails.grade = e.target.value; }} />
                        </div>
                     </div>
                  </div>
                  <div className="col-sm-12 p-0">
                     <div className="form-group">
                        <label className="control-label">Description</label>
                        <Input type="textarea" className="form-control" value={this.state.EducationDetails.description} onBlur={(e) => {
                           var EducationDetails =
                           {
                              schoolName: this.state.EducationDetails.schoolName,
                              degreeName: this.state.EducationDetails.degreeName,
                              fieldofStudy: this.state.EducationDetails.fieldofStudy,
                              startYear: this.state.EducationDetails.startYear,
                              endYear: this.state.EducationDetails.endYear,
                              grade: this.state.EducationDetails.grade,
                              description: e.target.value,
                              candidateId: this.state.EducationDetails.candidateId,
                              id: this.state.EducationDetails.id
                           };
                           this.setState({ EducationDetails: EducationDetails });
                        }}
                           onChange={(e) => {
                              var EducationDetails =
                              {
                                 schoolName: this.state.EducationDetails.schoolName,
                                 degreeName: this.state.EducationDetails.degreeName,
                                 fieldofStudy: this.state.EducationDetails.fieldofStudy,
                                 startYear: this.state.EducationDetails.startYear,
                                 endYear: this.state.EducationDetails.endYear,
                                 grade: this.state.EducationDetails.grade,
                                 description: e.target.value,
                                 candidateId: this.state.EducationDetails.candidateId,
                                 id: this.state.EducationDetails.id
                              };
                              this.setState({ EducationDetails: EducationDetails });
                           }}
                        />
                     </div>
                  </div>
               </form>
            </ModalBody><ModalFooter>
               <button type="button" onClick={this.updateEducation} disabled={this.state.educationLoading ? "disabled" : ""} className="btn-sm btn-fill pull-left btn btn-primary">

                  <span className="btn-inner--icon mr-2">{this.state.educationLoading ? <Spinner
                     as="span"
                     animation="border"
                     size="sm"
                     role="status"
                     aria-hidden="true"
                  /> : <i className="fas fa-plus "></i>}</span>

                  Update </button>

               <Button color="secondary" className="btn-sm"
                  disabled={this.state.educationLoading ? "disabled" : ""}
                  onClick={(e) => { this.setState({ showEducationUpdateModal: false, progressTimer: 0 }); }}>Close</Button>
            </ModalFooter></Modal>
         <Modal isOpen={this.state.showExperienceUpdateModal} className="modal-lg">
            <div className="modal-header">
               <h6 className="modal-title m-0" id="exampleModalDefaultLabel">Experience details - Update</h6>
               <button type="button" className="close float-right" onClick={(e) => { this.setState({ showExperienceUpdateModal: false, progressTimer: 0 }); }}>
                  <span aria-hidden="true"><i className="la la-times"></i></span>
               </button>
            </div>
            <ModalBody>
               <form className="p-1">
                  <div className="col-sm-12 row p-0">

                     <div className="col-sm-4 float-left">
                        <div className="form-group">
                           <label className="control-label">Title</label>
                           <input placeholder="Ex: Retail Sales Manager" type="text" className="form-control" defaultValue={this.state.ExperienceDetails.title} onBlur={(e) => { this.state.ExperienceDetails.title = e.target.value; }} autoFocus={this.state.showExperienceUpdateModal} />
                        </div>
                     </div>
                     <div className="col-sm-4 float-left">
                        <div className="form-group">
                           <label>Employment Type</label>
                           <select className="form-control" onChange={(e) => {
                              this.state.ExperienceDetails.employmentType = e.target.value;
                           }} defaultValue={this.state.ExperienceDetails.employmentType}>
                              <option value=""></option>
                              {(["Permanent", "Contract", "Trainee"]).map(function (key) { return (key == thisObj.state.ExperienceDetails.employmentType) ? <option value={key} selected>{key}</option> : <option value={key}>{key}</option> })}
                           </select>
                        </div>
                     </div>
                     <div className="col-sm-4 float-left">
                        <div className="form-group">
                           <label className="control-label">Company</label>
                           <input placeholder="Ex: Business" type="text" className="form-control" onBlur={(e) => { this.state.ExperienceDetails.company = e.target.value; }} defaultValue={this.state.ExperienceDetails.company} />
                        </div>
                     </div>
                  </div>
                  <div className="col-sm-12 row  p-0">
                     <div className="col-sm-6 float-left">
                        <div className="form-group">
                           <label className="control-label">Start Date</label>
                           <input placeholder="Year" type="text" className="form-control" defaultValue={this.state.ExperienceDetails.startYear} onBlur={(e) => { this.state.ExperienceDetails.startYear = e.target.value; }} />
                        </div>
                     </div>
                     <div className="col-sm-6 float-left">
                        <div className="form-group">
                           <label className="control-label">End Date</label>
                           <input placeholder="Year" type="text" className="form-control" defaultValue={this.state.ExperienceDetails.endYear} onBlur={(e) => { this.state.ExperienceDetails.endYear = e.target.value; }} />
                        </div>
                     </div>
                  </div>
                  <div className="col-sm-12 p-0">
                     <div className="col-sm-6 pl-0 float-left">
                        <div className="form-group">
                           <label className="control-label">Location</label>
                           <input placeholder="" type="text" className="form-control" defaultValue={this.state.ExperienceDetails.location} onBlur={(e) => { this.state.ExperienceDetails.location = e.target.value; }} />
                        </div>
                     </div>
                     <div className="col-sm-6 pl-0 float-left d-none">
                        <div className="form-group">
                           <label className="control-label">Headline</label>
                           <input placeholder="" type="text" className="form-control" defaultValue={this.state.ExperienceDetails.headLine} onBlur={(e) => {
                              this.state.ExperienceDetails.headLine = e.target.value;
                           }} />
                        </div>
                     </div>
                  </div>
                  <div className="col-sm-12 row">
                     <div className="form-group w-100">
                        <label className="control-label">Description</label>
                        <ReactQuill theme="snow"
                           value={this.state.ExperienceDetails.description}
                           name="jobDescription"
                           className="templateDescriptionEditor"
                           onChange={(text) => {
                              var expeDetails = {
                                 company: this.state.ExperienceDetails.company,
                                 description: text,
                                 employmentType: this.state.ExperienceDetails.employmentType,
                                 endYear: this.state.ExperienceDetails.endYear,
                                 experienceId: this.state.ExperienceDetails.experienceId,
                                 headLine: this.state.ExperienceDetails.headLine,
                                 location: this.state.ExperienceDetails.location,
                                 responsibility: this.state.ExperienceDetails.responsibility,
                                 startYear: this.state.ExperienceDetails.startYear,
                                 title: this.state.ExperienceDetails.title,
                                 id: this.state.ExperienceDetails.id
                              };
                              this.setState({ ExperienceDetails: expeDetails });

                           }}
                        />
                     </div>
                  </div>
               </form>
            </ModalBody><ModalFooter>
               <button type="button" onClick={this.updateExperience} disabled={this.state.experienceLoading ? "disabled" : ""} className="btn-sm btn-fill pull-left btn btn-primary">
                  <span className="btn-inner--icon mr-1">{this.state.experienceLoading ? <Spinner
                     as="span"
                     animation="border"
                     size="sm"
                     role="status"
                     aria-hidden="true"
                  /> : <i className="fas fa-plus "></i>}</span> Update
               </button>
               <Button disabled={this.state.experienceLoading ? "disabled" : ""} color="secondary" className="btn-sm" onClick={(e) => { this.setState({ showExperienceUpdateModal: false }); this.setState({ progressTimer: 0 }); }}>Close</Button>
            </ModalFooter></Modal>

         <Modal isOpen={this.state.documentPreviewMain}>
            <div className="modal-header">
               <h6 className="modal-title m-0" id="exampleModalDefaultLabel">Preview Resume</h6>
               <button type="button" className="close float-right" onClick={(e) => { this.setState({ documentPreviewMain: false }); this.setState({ progressTimer: 0 }); }}>
                  <span aria-hidden="true"><i className="la la-times"></i></span>
               </button>
            </div>

            <ModalBody>
               <IFrame src={fileUrl} loading={true} />
            </ModalBody><ModalFooter>
               <Button color="secondary" className="btn-sm" onClick={(e) => { this.setState({ documentPreviewMain: false }); this.setState({ progressTimer: 0 }); }}>Close</Button>
            </ModalFooter>
         </Modal>
         <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
         /></>;
   }

   handleInput(event) {
      //alert(eval("this.state."+event.target.name))
      const thisObj = this;
      if (event.target.name.includes("candidateDetails.")) {
         var keyToRemove = event.target.name.replace("candidateDetails.", "");
         var candidateDetailsNew = {};
         Object.keys(this.state.candidateDetails).forEach(function (i, d) {
            var vv = {};
            var kry = `thisObj.state.candidateDetails.${i}`;
            var prevValue = eval(kry);
            if (keyToRemove !== i)
               candidateDetailsNew[i] = prevValue;
            else
               candidateDetailsNew[i] = event.target.value;

            thisObj.setState({ candidateDetails: candidateDetailsNew });
         });
      } else {
         this.setState({
            [event.target.name]: event.target.value
         });
      }

   }
   //upload validation
   handleUpload = (event) => {
      var a = event.target.files[0].name.split(".");
      var allowedTypes = ["docx", "pdf", "txt", "doc"];
      let file = event.target.files[0];
      var fileExt = a[a.length - 1];
      if (allowedTypes.indexOf(fileExt) > 0 && event.target.files[0].size <= 2000000) {
         fData.append("file", file);
         fData.append("candidateId", this.state.candidateId);
         fData.append("fileExtension", fileExt);
         fData.append("sess_id", cookies.get("c_csrftoken"));
      } else {
         Swal.fire({ 
            icon: 'error',
            title: 'Oops...',
            text: "I can't process this file. Retry with pdf, doc, docx, txt files"
         });
         //alert("This file can not be processed")
         event.target.value = null
      }
   }
   //processing upload
   completeUpload = (event) => {
      let thisObj = this;
      axios.post(apiUrl+"updateResumeFile", fData, config).then(function (res) {
         var responseJson = (res.data);
         if (responseJson.statusResponse) {
            Swal.fire({
               icon: 'success',
               title: responseJson.message,
               html: '',
               timer: 1800,
               timerProgressBar: true,
               onBeforeOpen: () => {
                  Swal.showLoading()
               }
            }).then((result) => {
               /* Read more about handling dismissals below */
             window.location.reload();
               //  window.location.href = "../" + userType + "/candidates";
            });
         } else {
            Swal.fire({
               icon: 'error',
               title: 'Oops...',
               text: typeof responseJson.message !== "undefined" ? responseJson.message : "Error updating",
            });
         }
      }).catch(function (err) {
         //console.log(err);
      });
   }
   //profile delete
   handleDelete = (event) => { 
      const swalWithBootstrapButtons = Swal.mixin({
         customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
         },
         buttonsStyling: false
      })
      let thisObj = this;
      swalWithBootstrapButtons.fire({
         title: 'Are you sure?',
         text: "You won't be able to revert this!",
         icon: 'warning',
         showCancelButton: true,
         confirmButtonText: 'Yes, delete it!',
         cancelButtonText: 'No, cancel!',
         reverseButtons: true
      }).then((result) => {
         if (result.value) {
            axios.delete(candidateDeleteUrl, { data: { id: this.state.candidateId, sess_id:this.state.sess_id } }, { withCredentials: false }).then(({ data }) => {
               if (data.statusResponse == true) {
                  thisObj.renderSuccessAlert('Candidate deleted successfully!');
                  window.location.href = "../" + userType + "/candidates";
               }
            }).catch(function (err) {
               console.log(err);
            });
         } else if (result.dismiss === Swal.DismissReason.cancel) {

         }
      })
   }
   //modal close action for skills
   closeSkillAddForm(status) {
      this.setState({ showSkillsAddFormCond: false });
      if (status)
         this.getSkillsList();
   }
   closeEducationAddForm(status) {
      this.setState({ showEducationAddFormCond: false });
      this.showLoadingBar(100);
      if (status)
         this.getEducationList();
   }
   closeExperienceAddForm(status) {
      this.setState({ showExperienceAddFormCond: false });
      if (status)
         this.getExperienceList();
   }
   //profile update section main profile details
   handleUpdate(event, reload) {
      var thisObj = this;
      var ptTimer = 0;
      var thisObj = this;
      thisObj.setState({ progressTimer: 0 });
      var inter = setInterval(function () {
         ptTimer = ptTimer + 5;
         if (ptTimer <= 60)
            thisObj.setState({ progressTimer: ptTimer });
      }, 100);
      
      axios.post(apiUrl+"jobSubmitNewCandidate", {
         jobId:params.get("jobId"),
         firstName: this.state.candidateDetails.firstName,
         lastName: this.state.candidateDetails.lastName,
         middleName: this.state.candidateDetails.middleName,
         gender: this.state.candidateDetails.gender,
         email: this.state.candidateDetails.email,
         altemail: this.state.candidateDetails.altemail,
         skills:this.state.candidateDetails.skills,
         phone: this.state.candidateDetails.phone,
         altphone: this.state.candidateDetails.altphone,
         workAuthorization: this.state.candidateDetails.workAuthorization,
         experienceMonths: this.state.candidateDetails.experienceMonths,
         experienceYears: this.state.candidateDetails.experienceYears,
         location: this.state.candidateDetails.location,
         rate: this.state.candidateDetails.rate,
         rateType: this.state.candidateDetails.rateType,
         jobTitle: this.state.candidateDetails.jobTitle,
         address: this.state.candidateDetails.address,
         country: this.state.candidateDetails.country,
         zipcode: this.state.candidateDetails.zipcode,
         state: this.state.candidateDetails.state,
         applicantStatus: this.state.candidateDetails.applicantStatus,
         aboutMe: this.state.candidateDetails.aboutMe,
         source: this.state.candidateDetails.source,
         updatedBy: this.getUserName(),
         skills:this.state.candidateDetails.skills,
         sess_id:this.state.sess_id
      }, { withCredentials: false }).then(function (res) {
         var responseJson = (res.data);
         thisObj.setState({ progressTimer: 100 });
         if (responseJson.statusResponse) {
            thisObj.renderSuccessAlert(responseJson.message + '!');
            setTimeout(function () {
               if (reload) {
             //     window.location.reload(true);
               } else {
               //   window.location.href = '../' + userType + '/candidates#' + thisObj.state.currentPageNumber;
               }
            }, 1200);
         } else {
            thisObj.renderFailAlert(typeof responseJson.message !== "undefined" ? responseJson.message : "Error updating",);
            thisObj.setState({ progressTimer: 100 });
         }
      }).catch(function (err) {
         //<failAlert title='Error updating try again later'/>
         thisObj.renderFailAlert('Error updating try again later');
         thisObj.setState({ progressTimer: 100 });
      })
   }

   deleteAttribute = (e, type, id) => {
      const swalWithBootstrapButtons = Swal.mixin({
         customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
         },
         buttonsStyling: false
      });
      var actionUrl = "";
      var thisObj = this;
      if (type === "experience")
         actionUrl = apiUrl + "deleteExperience";
      else if (type === "education")
         actionUrl = apiUrl + "deleteEducation";
      else if (type === "skills")
         actionUrl = apiUrl + "deleteSkills";

      swalWithBootstrapButtons.fire({
         title: 'Are you sure?',
         text: "You won't be able to revert this!",
         icon: 'warning',
         showCancelButton: true,
         confirmButtonText: 'Yes, delete it!',
         cancelButtonText: 'No, cancel!',
         reverseButtons: true
      }).then((result) => {
         if (result.value) {
            var ptTimer = 0;
            var inter = setInterval(function () {
               ptTimer = ptTimer + 10;
               if (ptTimer <= 60)
                  thisObj.showLoadingBar(ptTimer);
               //thisObj.setState({progressTimer:ptTimer});
            }, 100);
            axios.delete(actionUrl, { data: { id: id, sess_id: cookies.get("c_csrftoken") } }, { withCredentials: false }).then(({ data }) => {
               thisObj.showLoadingBar(100);
               if (data.statusResponse) {
                  if (type === "experience") {
                     thisObj.getExperienceList();
                  } else if (type === "education") {
                     thisObj.getEducationList();
                  } else if (type === "skills") {
                     this.getSkillsList();
                     thisObj.showLoadingBar(100);
                  }
                  thisObj.renderSuccessAlert(data.message + '!');

               } else {
                  thisObj.renderFailAlert(data.message);
               }
            }).catch(function (err) {
            });

         }
      });
   }
}
export default JobSubmitNewCandidate;