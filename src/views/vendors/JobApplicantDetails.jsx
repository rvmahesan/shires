import React, { Component, useRef } from "react";
import {
   Container,
   Row,
   Col,
   Card,
   CardHeader,
   CardFooter,Button,
    Modal, ModalHeader, ModalBody, ModalFooter, Tooltip, Spinner
 } from "reactstrap";
import Swal from 'sweetalert2';
import {jobDetailsURL,apiUrl,updateJobDetails,candidateGetUrl} from "../../variables/Variables.jsx";
import ReactQuill from "react-quill";
import classNames from "classnames";
import Cookies from 'universal-cookie';
import ProfileBoxList from "../../views/ProfileBoxList";

const axios = require("axios").default;
const cookies = new Cookies();
let fData = new FormData();
let config = {
    headers: {
        'content-type': 'multipart/form-data'
    }
 };
class VendorRequirements extends Component{
    constructor(props,context){
        super(props,context);
        this.state = {
            jobApplicationsList:[],
            fnameRef:React.createRef(),
            jobDesRef:React.createRef(),
            oldcandidateDetails:"",
            oldcandidateId:"",
            seletedCandidateId:"",
            oldProfileSubmitModal:false,
            oldcandidateDetailsRef:React.createRef(),
            oldcandidateDetailsSbmtBtn:false,
            submitNewCandidate:false,
            submitOldCandidate:false,
            profiles:[],
            showResumeModal:false,
            selectedProfiles:[],
            pagingArray:[],
            revPagingArray:[],
            pageNumber:1,
            page_size:20,pagingText:"",
            searchingProfile:false,
            loadMorePaging:true,
            numberOfProfiles:0,
            templatesList :[],
            sendEmailWindow:false,
            selectedEmailTemplate:"",
            loading:false,
            error:null,
            isPageloading:false,
            resumeContains:"",
            searchingProfile:false,
            newCandInfo:{
                firstName:"",
                lastName:"",
                email:"",
                c_email:"",
                country:"",
                phone:""
            },
            searchCandidateDetails:[],
            jobDetails: {
               id:"",
               jobTitle:"",
               jobId:"",
               jobSkills:"",
               maxSubmittals:"",
               noOfOpenings:"",
               positionType:"",
               requirementOT:"",
               requirementReferences:"",
               requirementSecurityClearance:"",
               requirementTravel:"",
               startDate:"",
               state:"",
               zip:"",
               additionalReferenceNumber:"",
               addressLine1:"",
               addressLine2:"",
               billRate:"",
               billRateType:"",
               city:"",
               country:"",
               endDate:"",
               jobContact:"",
               jobDescription:"",
               sendEmail:null,
               sendEmailHandler:null,
               next:"",
               previous:"",
            }
        };
        //  this.genderOptions = ["Select","Male", "Female", "Others"];
        this.handleInput = this.handleInput.bind(this);
        this.handleJobDetailsInput = this.handleJobDetailsInput.bind(this);
        // this.handleUpdate = this.handleUpdate.bind(this);
        //this.handleDelete = this.handleDelete.bind(this);
        this.updateJobDetails = this.updateJobDetails.bind(this);
        this.findProfiles = this.findProfiles.bind(this);
        this.selectProfiles = this.selectProfiles.bind(this);
        this.sendEmailToCandidate = this.sendEmailToCandidate.bind(this);
        this.viewResume = this.viewResume.bind(this);
        this.closeResumeModal = this.closeResumeModal.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
        this.closeEmailModal = this.closeEmailModal.bind(this);
        this.isToolTipOpen = this.isToolTipOpen.bind(this);
        this.loadPrevious = this.loadPrevious.bind(this);
        this.loadNext = this.loadNext.bind(this);
        this.handleJobDescription= this.handleJobDescription.bind(this);
        axios.defaults.withCredentials = false;
        this.closeNewCandForm = this.closeNewCandForm.bind(this);
        this.submitNewCandidateForm = this.submitNewCandidateForm.bind(this);
        this.closeOldCandForm = this.closeOldCandForm.bind(this);
        this.findCandidateDetails = this.findCandidateDetails.bind(this);
        this.startSubmission = this.startSubmission.bind(this);
        this.completeUpload = this.completeUpload.bind(this);
        this.approveCandidate = this.approveCandidate.bind(this);
        this.rejectCandidte = this.rejectCandidte.bind(this);
    }
    approveCandidate(canId,reqId,e){
        axios.get(apiUrl+"approveVendorCandidate",{
            params:{
               candidateId:canId,
               submissionId:reqId,
               sess_id:cookies.get("c_csrftoken")
            }
        }).then(({data}) =>{
          // this.state = data;
            if(data.statusResponse){
               alert(data.message);
               window.location.reload();
            }else{
                alert(data.message);
            }
       }).catch((err)=>{});
    }


    rejectCandidte(canId,reqId,e){
        axios.get(apiUrl+"rejectVendorCandidate",{
            params:{
               candidateId:canId,
               submissionId:reqId,
               sess_id:cookies.get("c_csrftoken")
            }
        }).then(({data}) =>{
          // this.state = data;
            if(data.statusResponse){
               alert(data.message);
               window.location.reload();
            }else{
                alert(data.message);
            }
       }).catch((err)=>{});
    }


    isToolTipOpen = targetName => {
        return this.state[targetName] ? this.state[targetName].tooltipOpen : false;
    };
    toggle = targetName => {
        if (!this.state[targetName]) {
          this.setState({
            ...this.state,
            [targetName]: {
              tooltipOpen: true
            }
          });
        } else {
          this.setState({
            ...this.state,
            [targetName]:{
              tooltipOpen: !this.state[targetName].tooltipOpen
            }
          });
        }
    };

    handleJobDescription(text){
       this.state.jobDetails.jobDescription = text;
    }

    componentDidMount(){
        console.log(this.state.fnameRef);
        this.setJobDetails();
    }
    componentDidUpdate(){
        if(this.state.fnameRef.current !== null){
            this.state.fnameRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
            //this.state.fnameRef.current.focus();
        } 
        if(this.state.oldcandidateDetailsRef.current !== null){
            this.state.oldcandidateDetailsRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
            this.state.oldcandidateDetailsRef.current.focus();
        }
       
    }
    findCandidateDetails = (e)=>{
        axios.get(apiUrl+"searchCandidateDetails",{
            params:{
               candidateDetails:this.state.oldcandidateDetails,
               sess_id:cookies.get("c_csrftoken")
            }
        }).then(({data}) =>{
          // this.state = data;
            if(data.statusResponse){
                this.setState({searchCandidateDetails:data.candidateDetails})
            }
       }).catch((err)=>{});
    }
    setJobDetails = async() =>{
      const params = new URLSearchParams(this.props.location.search); 
      await axios.get(jobDetailsURL,{
          params:{
             jobId:params.get('jobId'),
             sess_id:cookies.get("c_csrftoken")
          }
      }).then(({data}) =>{
        // this.state = data;
        if(data.statusResponse){
            data.jobDetails.billRate = data.jobDetails.billRate=="0"?"":data.jobDetails.billRate;
            data.jobDetails.noOfOpenings = data.jobDetails.noOfOpenings=="0"?"":data.jobDetails.noOfOpenings;
            data.jobDetails.maxSubmittals = data.jobDetails.maxSubmittals=="0"?"":data.jobDetails.maxSubmittals;
            this.setState({  
                jobDetails:data.jobDetails,
                jobApplicationsList:data.jobApplicants
                }); 
            }
     }).catch((err)=>{});
   }
   closeResumeModal = ()=>{
        this.setState({showResumeModal:false});

        
   }
  
   viewResume(id,e){
        this.setState({  
            candidateResumeDetails:this.renderLoading(),showResumeModal:true
        }); 
        axios.get(candidateGetUrl,{
            params:{
            candidateId:id,
            sess_id:cookies.get("c_csrftoken")
            }
        }).then(({data}) =>{
            this.setState({  
                candidateResumeDetails:data.candidateDetails[0].resumeDetails
            }); 
        }).catch((err)=>{});
   }
  updateJobDetails(event){ 
        if(this.state.jobDetails.jobDescription === ""){
        Swal.fire('Oops...', 'Enter jobdescription', 'error');  return;
        }
        axios.put(updateJobDetails,{
            jobTitle                      :this.state.jobDetails.jobTitle,
            additionalReferenceNumber     :this.state.jobDetails.additionalReferenceNumber,
            jobContact                    :this.state.jobDetails.jobContact,
            addressLine1                  :this.state.jobDetails.addressLine1,
            city                          :this.state.jobDetails.city,
            country                       :this.state.jobDetails.country,
            billRate                      :this.state.jobDetails.billRate!==""?this.state.jobDetails.billRate:0,
            billRateType                  :this.state.jobDetails.billRateType,
            startDate                     :this.state.jobDetails.startDate,
            noOfOpenings                  :this.state.jobDetails.noOfOpenings!==""?this.state.jobDetails.noOfOpenings:0,
            maxSubmittals                 :this.state.jobDetails.maxSubmittals!==""?this.state.jobDetails.maxSubmittals:0,
            positionType                  :this.state.jobDetails.positionType,
            jobSkills                     :this.state.jobDetails.jobSkills,
            addressLine2                  :this.state.jobDetails.addressLine2,
            state                         :this.state.jobDetails.state,
            zip                           :this.state.jobDetails.zip,
            endDate                       :this.state.jobDetails.endDate,
            requirementOT                 :this.state.jobDetails.requirementOT,
            requirementReferences         :this.state.jobDetails.requirementReferences,
            requirementTravel             :this.state.jobDetails.requirementTravel,
            requirementSecurityClearance  :this.state.jobDetails.requirementSecurityClearance,
            jobDescription                :this.state.jobDetails.jobDescription,
            id                           :this.state.jobDetails.id,
            sess_id:cookies.get("c_csrftoken")
        }).then(function(res){
            if(res.data.statusResponse){
                //this.showAlert("br","success","Candidate created successsfully","pe-7s-check");
            let timerInterval;
            Swal.fire({
                icon: 'success',
                title: res.data.message,
                html: '',
                timer: 800,
                timerProgressBar: true,
            onBeforeOpen: () => {
                Swal.showLoading()
                timerInterval = setInterval(() => {
                }, 100)
            },onClose: () => {
                clearInterval(timerInterval)
                window.location.reload()
            }
            });
            }else{
                var errMsg = "";
                Object.keys(res.data.message).map((e, i) => {
                    errMsg += "<br/>- "+(res.data.message[e]);

                });
                Swal.fire('Error', errMsg, 'error');  return;
            }
        });//axios end
    }
   selectProfiles = (id,e) =>{
    if(e){
        if(e.target.checked === true){
            let profiless = this.state.selectedProfiles;
            profiless.push(id);
            this.setState({selectedProfiles:profiless});
        }
      }
      if(e.target.checked === false){
        let profiless = this.state.selectedProfiles;
        let indx = profiless.indexOf(id);
        if(indx !== -1){
          profiless.splice(indx,1);
          this.setState({selectedProfiles:profiless });
        }
      }
    }
    sendEmailToCandidate = ()=>{
        this.setState({sendEmailWindow:true});
        axios.get(apiUrl+"catalog/emailTemplateList",{
            params:{
                userId:window.sessionStorage.getItem("userId"),page_size:100,pageNumber:0,sess_id:cookies.get("c_csrftoken")
                }
            }).then(({data}) =>{
                //templatesList
                //selectedEmailTemplate
                const temTypes = data.templates;
               this.setState({templatesList:data.templates});
            }).catch((err)=>{});

        
        //get email templates list from server

    }
    sendEmail=()=>{
        this.setState({sendEmailWindow:false});
        alert(this.state.selectedEmailTemplate);
        //axios post send email here
    }
    closeEmailModal =()=>{
        this.setState({sendEmailWindow:false});
    }
    handleInput(event){
        this.setState({
            [event.target.name]:event.target.value
        });
    }
    handleJobDetailsInput(event){  
        //requirementTravel
        //requirementSecurityClearance
        if(event.target.name === "requirementOT" || event.target.name === "requirementTravel" ||  event.target.name === "requirementSecurityClearance"){
            this.state.jobDetails[event.target.name]=(event.target.checked).toString();
        }else{
            let jobDetails = this.state.jobDetails;
            jobDetails[event.target.name] = event.target.value;
            this.setState({jobDetails:jobDetails});
        }
    }

    /////\\\\\JOB SEARCH FUNCTIONALITIES/////\\\\\/////////
    findProfiles = (event) =>{
        this.setState({  
            searchingProfile:true,loading:true
        });   
        var elmnt = document.getElementById("searchProfilesByJob");
        //var y = elmnt.scrollHeight;
        //var x = elmnt.scrollWidth;
        axios.get(apiUrl+"searchProfilesByJob",{
            params:{
              jobId:this.state.jobDetails.id,page_size:this.state.page_size,pageNumber:this.state.pageNumber,sess_id:cookies.get("c_csrftoken")
             }
          }).then(({data}) =>{
            this.setState({loading:false});
            if(data.results.count>=1){
                this.setState({ 
                    loading:false,
                    profiles: data.results.results,
                    numberOfProfiles:data.results.count,
                    searchingProfile:true,
                    previous:data.results.previous,
                    next:data.results.next,
                    pageNumber:data.pageNumber
                });
            }
        }).catch((err)=>{});
    }
    loadPrevious = (pageNos,e) =>{
        if(this.state.isPageloading)
          return "";
        this.setState({loadMorePaging:true});
        this.setState({isPageloading:true});
        document.body.style.cursor='progress';
        axios.get(this.state.previous).then(({data}) =>{
            this.setState({isPageloading:false});
            this.setState({ 
                loading:false,
                profiles: data.results.results,
                numberOfProfiles:data.results.count,
                searchingProfile:true,
                previous:data.results.previous,
                next:data.results.next,
                pageNumber:data.pageNumber
            });
              //data.currentPageNumber
          document.body.style.cursor='default';
        })
        .catch((err)=>{});
    }

    loadNext = (pageNos,e) =>{
        if(this.state.isPageloading)
          return "";
        this.setState({loadMorePaging:true});
        this.setState({isPageloading:true});
        document.body.style.cursor='progress';
        axios.get(this.state.next).then(({data}) =>{
            this.setState({isPageloading:false});
            this.setState({ 
                loading:false,
                profiles: data.results.results,
                numberOfProfiles:data.results.count,
                searchingProfile:true,
                previous:data.results.previous,
                next:data.results.next,
                pageNumber:data.pageNumber
            });
              //data.currentPageNumber
          document.body.style.cursor='default';
        })
        .catch((err)=>{});
    }


    /////JOB SEARCH FUNCTIONALITIES/////////
    renderLoading(){
        return <Container className="mt-3" fluid><Row> 
                <div className="col">
                <Card className="shadow p-3">
                <div className="content profileBox">
                <Col md={12}><center className="mt-4 mb-4"><i className="fa fa-45 fa-spinner fa-spin"></i></center></Col>
            </div></Card></div></Row></Container>;
    }
    
    closeNewCandForm = ()=>{
        this.setState({submitNewCandidate:false});
        window.scrollTo(0,0);
    }
    closeOldCandForm = ()=>{
        this.setState({submitOldCandidate:false});
        window.scrollTo(0,0);
    }

    handleUpload =(event)=>{
        var a = event.target.files[0].name.split(".");
        var allowedTypes = ["rtf","docx","pdf","txt","doc"];
        let file = event.target.files[0];
        var fileExt = a[a.length-1];
        var errDets = "";
        if(event.target.files[0].size >= 2000000) {
            errDets = "- File size error"
        }
      
        if(allowedTypes.includes(fileExt) === false) {
            errDets = "- File type error"
        }
        //30367 < 2000000
        
        //alert(event.target.files[0].size <= 2000000)
        //alert(allowedTypes.indexOf(fileExt))
        if((allowedTypes.includes(fileExt) === true) && event.target.files[0].size <= 2000000) {
            fData.append("file",file);
            fData.append("selectedRequirementId",this.state.jobDetails.id); 
            fData.append("fileExtension",fileExt);  
            fData.append("c_session_id",cookies.get("c_csrftoken"));
        }else{
            Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "I can't process this file. Retry with specified extensions. "+errDets
            });
            //alert("This file can not be processed")
            event.target.value = null
        }
    }

    completeUpload = (event) =>{ 
    }

    submitNewCandidateForm = ()=>{
        fData.append("firstName",this.state.newCandInfo.firstName);
        fData.append("lastName",this.state.newCandInfo.lastName);
        fData.append("email",this.state.newCandInfo.email);
        fData.append("c_email",this.state.newCandInfo.c_email);
        fData.append("country",this.state.newCandInfo.country);
        fData.append("phone",this.state.newCandInfo.phone);
        fData.append("requirementId",this.state.jobDetails.id);
        if(this.state.newCandInfo.email !== this.state.newCandInfo.c_email)
        {
            return false;
        }
        axios.post(apiUrl+"vendorSubmitNewCandidate",fData,config).then(function(res){
            var responseJson = (res.data);
              if(responseJson.statusResponse){
                  Swal.fire({
                     icon: 'success',
                     title: responseJson.message,
                     html: '',
                     timer: 600,
                     timerProgressBar: true,
                  onBeforeOpen: () => {
                     Swal.showLoading()
                  }
                  }).then((result) => {
                  /* Read more about handling dismissals below */
                     window.location.href = "../vendor/vendorRequirmentsList";
                  });
               }else{
                  Swal.fire({
                     icon: 'error',
                     title: 'Oops...',
                     text: responseJson.message
                   });
               }
        }).catch(function(err){
            //console.log(err);
        });
    }
    startSubmission =(profId,jobId)=>{
        fData = new FormData();
        fData.append("candidateId",profId);
        fData.append("session_id",cookies.get("c_csrftoken"));
        fData.append("requirementId",jobId);
        let thisObj = this;
        axios.post(apiUrl+"vendorSubmitOldCandidate",fData,config).then(function(res){
            thisObj.setState({oldProfileSubmitModal:false});
                res= res.data;
              if(res.statusResponse){
                  Swal.fire({
                     icon: 'success',
                     title: res.message,
                     html: '',
                     timer: 600,
                     timerProgressBar: true,
                  onBeforeOpen: () => {
                     Swal.showLoading()
                  }
                  }).then((result) => {
                   
                  /* Read more about handling dismissals below */
                     //window.location.href = "../vendor/vendorRequirmentsList";
                  });
               }else{
                  Swal.fire({
                     icon: 'error',
                     title: 'Oops...',
                     text: res.message
                   });
               }
        }).catch(function(err){
            //console.log(err);
        });
        this.setState({oldcandidateId:0});
    }
    renderApplications() {
      if(this.state.loading) {
        document.body.style.cursor='wait';
        tableData = <tr><td colSpan="6" className="text-center p-5"><i className="fa fa-spinner fa-45 fa-spin"></i></td></tr>;
      }
      const thisClone = this;
      if(!this.state.loading){
            document.body.style.cursor='default';
          var tableData = this.state.jobApplicationsList.map(function(obj,index){
            var idValue = obj.candidateId;
          return <tr key={index}><td className="text-left">{obj.candidateName}</td><td className="text-left">{obj.email}</td><td className="text-center"> {obj.rate}</td><td className="text-center">{obj.phone}</td><td className="text-center">
          {obj.statusDetails=="Rejected"?<span className="ml-1 text-danger">Rejected</span>:""}
          {obj.statusDetails=="Approved"?<span className="ml-1 text-success">Approved</span>:""}
          </td>
          <td>
          <p className="text-right mb-0">{new Date(obj.submittedDate).toDateString()}</p>
          </td><td className="text-center">
              <a  className="cursor-pointer"><u>Download</u></a> 
          <a className="ml-1 cursor-pointer" onClick={(e)=>thisClone.viewResume(idValue,e)}><u>View</u></a> 
          {obj.statusDetails=="Approved"?<span className="ml-1">Approved</span>:<a className="ml-1 cursor-pointer" onClick={(e)=>thisClone.approveCandidate(idValue,obj.submissionId,e)}><u>Approve</u></a>}

          {obj.statusDetails=="Rejected"?<span className="ml-1">Rejected</span>:<a className="ml-1 cursor-pointer" onClick={(e)=>thisClone.rejectCandidte(idValue,obj.submissionId,e)}><u>Reject</u></a>}

          </td></tr>;
          });
          if(this.state.jobApplicationsList.length == 0) {
            document.body.style.cursor='default';
            tableData = <tr><td colSpan="7" className="text-center p-5">No Records Found</td></tr>;
          }
      }
      return tableData;
    }

    render(){
        let profileList = '';
        let c_email_classes = ["form-control"];
        let jobApplicationsTbody = this.renderApplications();

       //,this.state.newCandInfo.c_email!=="abc"?"parsley-error":""
        if(this.state.newCandInfo.email !== this.state.newCandInfo.c_email){
            c_email_classes.push("parsley-error");
        }
        const card_style = {
            overflowY:"scroll",
            maxHeight:((window.innerHeight)-320)+"px",
            minHeight:((window.innerHeight)-320)+"px"
        };

        if(this.state.profiles.length) {   
            profileList = <div ><ProfileBoxList selectProfiles={this.selectProfiles} viewResume={this.viewResume} selectedProfiles={this.state.selectedProfiles} options={this.state.profiles}/></div>
        }else{
            profileList = "";
        }
        const thisObj = this;
       return this.state.jobDetails.id === ""?(<div id="searchProfilesByJob" className="header bg-gradient-info pb-2 pt-5 pt-md-8">
       <Container fluid>
         <div className="header-body">
           <Row>
             <Col lg="12" xl="12"><center><Spinner style={{ width: '3rem', height: '3rem' }} type="grow" /></center>
             </Col>
           </Row>
         </div>
       </Container>
     </div>):(<>
        <div className="row">
      <div className="col-sm-12">
        <div className="page-title-box">
          <div className="row">
            <div className="col">
              <h4 className="page-title"  ref="jobDesRef">Requirement Detail</h4>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="javascript:void(0);">Dashboard</a></li>
                <li className="breadcrumb-item active">Requirement Detail</li>
              </ol>
            </div>
            <div className="col-auto align-self-center">
            </div>
          </div>
        </div>
      </div>
    </div>

   


    <Row>
      <div className="col p-0">
        <Card className="p-2 my-shadow">
        <CardHeader className="border-1 pr-1 ">
            <div className="col-sm-9 float-left">
                <h4 className="mb-0 card-title">{this.state.jobDetails.jobTitle}</h4>
                <div className="text-muted mb-0">
                    <div className="col-sm-12 pt-2  pl-0 ml-0">
                        <div className="col-sm-2 float-left pl-0 ml-0">Ref#:  
                        <b className="pl-1">{this.state.jobDetails.additionalReferenceNumber}</b></div>
                        <div className="col-sm-2 float-left">Start Date:  
                        <b className="pl-1">{this.state.jobDetails.startDate}</b></div>
                        <div className="col-sm-2 float-left">End Date:  
                        <b className="pl-1">{this.state.jobDetails.endDate}</b></div>
                    </div>
                </div>
            </div>
            {/*onClick={this.findProfiles}*/}
            <div className="button-items float-right pr-0">
            <Button title="Submit new candidate" className=" pull-left btn bg-blue-primary" onClick={()=>{ this.setState({submitNewCandidate:true,submitOldCandidate:false});if(this.state.fnameRef.current !== null) this.state.fnameRef.current.focus(); }}>
                        <span className="btn-inner--icon mr-1"><i className="fas fa-user-astronaut" ></i></span><span className="btn-inner--text">Submit New</span>
                    </Button>

                    <Button title="select from profiles"  className="pull-left btn bg-blue-secondary"  onClick={()=>{ this.setState({submitOldCandidate:true,submitNewCandidate:false}); }}>
                        <span className="btn-inner--icon mr-1"><i className="fas fa-user-astronaut" ></i></span><span className="btn-inner--text">Select from profiles</span>
                    </Button>
                    <a href="../vendor/vendorRequirmentsList"  className="float-right btn-icon btn btn-outline-secondary" >
                    <span className="btn-inner--icon mr-1"><i className="far dripicons-backspace"></i></span>
                    <span className="btn-inner--text">Back</span>
                </a>

            </div>
            
            <div className="col-sm-12 float-left pt-4">
                <h4 className="mb-0 card-title">Applications</h4>
            </div>
        </CardHeader>
        <div className="card-body" >
                    <div className="row ">
                      <div className="col-md-12">
                        <table className="table w-100 mb-0 table-borderless ">
                            <thead>
                              <tr>
                                <th scope="col" className="text-left">Candidate Name</th>
                                <th scope="col" className="text-left">Email</th>
                                <th scope="col" className="text-center">Rate</th>
                                <th scope="col" className="text-center">Phone</th>
                                
                                <th scope="col" className="text-center">Status</th>
                                <th scope="col" className="text-center">Submitted Date</th>
                                <th scope="col" className="text-center">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {jobApplicationsTbody}
                            </tbody>
                        </table>
                      </div>
                    </div>
        </div>

</Card></div>


</Row>


<div className="mb-2">
    <Row>
      <div className="col p-0">
        <Card className="p-2 my-shadow">
        <CardHeader className="border-1 pr-1 ">
            <div className="col-sm-9 float-left">
                <h4 className="mb-0 card-title">Description</h4>
                
            </div>
            {/*onClick={this.findProfiles}*/}
            
        </CardHeader>
        <div className="card-body" style={card_style}>
                    <div className="row ">
                        <div className="col-md-6">
                            <table className="table mb-0 table-borderless">
                                            <tbody>
                                                <tr className="d-none">
                                                    <td className="payment-title">Contact</td>
                                                    <td>
                                                    <strong>{this.state.jobDetails.jobContact}</strong>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="payment-title">Location</td>
                                                    <td>
                                                        {this.state.jobDetails.addressLine1!==""?<strong>{this.state.jobDetails.addressLine1}, </strong>:""}
                                                        {this.state.jobDetails.city!==""?<strong>{this.state.jobDetails.city}, </strong>:""}
                                                        {this.state.jobDetails.state!==""?<strong>{this.state.jobDetails.state}, </strong>:""}
                                                        {this.state.jobDetails.country!==""?<strong>{this.state.jobDetails.country}</strong>:""}
                                                        {this.state.jobDetails.zip!==""?<strong> - {this.state.jobDetails.zip}</strong>:""}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="payment-title">Bill Rate</td>
                                                    <td><strong>{this.state.jobDetails.billRate}- 
                    {this.state.jobDetails.billRateType}</strong></td>
                                                </tr>
                                                <tr>
                                                    <td className="payment-title">No.Of.Openings: <strong>{this.state.jobDetails.noOfOpenings}</strong></td>
                                                    <td> <span className="payment-title">Max Allowed Submittals</span>: <strong>{this.state.jobDetails.maxSubmittals}</strong></td>
                                                </tr>
                                            </tbody>
                                        </table>
                      
                    </div>
                    <div className="col-md-6 pl-4 pr-4">
                    <table className="table mb-0 table-borderless">
                                            <tbody>
                                                <tr>
                                                    <td className="payment-title">Position Type</td>
                                                    <td>
                                                    <strong>{this.state.jobDetails.positionType}</strong>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="payment-title">Skills</td>
                                                    <td><strong>{this.state.jobDetails.jobSkills}</strong></td>
                                                </tr>
                                             
                                                <tr>
                                                    <td className="payment-title">Requirements: </td>
                                                    <td>
                                                   
    {this.state.jobDetails.requirementOT==="true"?<span className="label pt-0 pr-1" htmlFor="requirementTravel"><strong>Overtime</strong> </span>:""}

{this.state.jobDetails.requirementTravel==="true"?<span className="label pt-0 pr-1" htmlFor="requirementTravel"> - <strong>Travel & Expense</strong> </span>:""}

{this.state.jobDetails.requirementSecurityClearance==="true"?<span className="label text-bold" htmlFor="requirementSecurityClearance">  - <strong>Security Clearance</strong> </span>:""}
                                                    </td>
                                                </tr>
                                                
                                            </tbody>
                                        </table>


                    </div>
                    </div>
                    <div className="row col-md-12 ">
                        <label className="control-label">Job Description</label>
                        </div>
                        <div className="row col-md-12"> 
                       <ReactQuill
                  value={this.state.jobDetails.jobDescription}
                  readOnly={true}
                  theme={"bubble"}
               />

                    </div>
</div>
</Card></div></Row></div>



        {(this.state.numberOfProfiles >= 1)?<div className=""><Container className="mt-3" fluid>
                    <Card className="shadow">
                    <CardHeader className="border-1 col-sm-12">
                        <div className="pagination float-left col-sm-8 pt-1" id="searchProfilesByJob"> 
                            <h4>{thisObj.state.numberOfProfiles} profiles found</h4>
                        </div>
                        {<div className="col-sm-3 float-right">
                            <div className="btn-group float-right">
                            {this.state.previous!==null?<button type="button" onClick={(e)=>thisObj.loadPrevious()} className="btn btn-outline-secondary"><i className="typcn typcn-chevron-left-outline "></i></button>:""}
                            {this.state.next!==null?<button type="button" onClick={(e)=>thisObj.loadNext()} className="btn btn-outline-secondary"><i className="typcn typcn-chevron-right-outline "></i></button>:""}
                            </div>
                        </div>}
                    </CardHeader>
        </Card></Container></div>:""}
        {this.state.loading?this.renderLoading():""}
        {!this.state.isPageloading?profileList:this.renderLoading()}
        {(this.state.numberOfProfiles >= 1)?<div className="col-sm-12"><div className="container-fluid">
            <div className="p-3" >
                        <div className="pagination float-left col-sm-8 pt-1"> 
                            <h4>{thisObj.state.numberOfProfiles} profiles found</h4>
                        </div>
                        {<div className="col-sm-3 float-right">
                            <div className="btn-group float-right">
                            {this.state.previous!==null?<button type="button" onClick={(e)=>thisObj.loadPrevious()} className="btn btn-outline-secondary"><i className="typcn typcn-chevron-left-outline "></i></button>:""}
                            {this.state.next!==null?<button type="button" onClick={(e)=>thisObj.loadNext()} className="btn btn-outline-secondary"><i className="typcn typcn-chevron-right-outline "></i></button>:""}
                            </div>
                        </div>}
                    </div></div></div>:""}
        {(this.state.searchingProfile)?(<>{this.state.selectedProfiles.length>=1?(<Card><div className="card-body cardfooter_1 my-shadow"><div className="col-sm-12 float-left  pl-0"><div className="col-sm-3 float-left  pl-0"><button type="button" className="btn-fill float-left btn btn-primary mr-2" onClick={this.sendEmailToCandidate}>Submit Candidate</button> <button type="button" className="btn-fill float-left btn btn-primary" onClick={this.sendEmailToCandidate}>Send Email</button></div><div className="col-sm-8 float-left  pl-0"><h4 className="text-black text-left pl-3"> Selected {this.state.selectedProfiles.length} Candidate(s)</h4></div></div></div></Card>):""}</>):""}

        {this.state.submitNewCandidate?<><div className="card my-shadow">
             <ModalHeader>Add New</ModalHeader>
             <ModalBody>
                <div className="row mb-2">
                    <span className="text-center col-sm-2"><code className="highlighter-rouge">*</code>Indicates a mandatory field</span>
                </div>
                 <div className="row">

                     <div className="col-md-6 mr-1">
                         <div className="form-group row">
                             <label htmlFor="firstName" className="col-lg-3 col-form-label"><code className="highlighter-rouge">*</code>First Name</label>
                             <div className="col-lg-9">
                                 <input id="firstName"  ref={this.state.fnameRef} name="firstName" type="text" className="form-control"
                                 onBlur={(e)=>{ this.state.newCandInfo.firstName = e.target.value; }}
                                 />
                             </div>
                         </div>
                         <div className="form-group row">
                             <label htmlFor="lastName" className="col-lg-3 col-form-label"><code className="highlighter-rouge">*</code>Last Name</label>
                             <div className="col-lg-9">
                                 <input id="lastName" name="lastName" type="text" className="form-control" onBlur={(e)=>{ this.state.newCandInfo.lastName = e.target.value; }}/>
                             </div>
                         </div>
                         <div className="form-group row">
                             <label htmlFor="email" className="col-lg-3 col-form-label"><code className="highlighter-rouge">*</code>Email Address</label>
                             <div className="col-lg-9">
                                 <input id="email" name="email" type="email" className="form-control" onBlur={(e)=>{ this.state.newCandInfo.email = e.target.value; }}/>
                             </div>
                         </div>
                         <div className="form-group row">
                             <label htmlFor="c_email" className="col-lg-3 col-form-label"><code className="highlighter-rouge">*</code>Confirm Email</label>
                             <div className="col-lg-9">
                                 <input id="c_email" 
                                 name="c_email" 
                                 type="email" 
                                 className={classNames(c_email_classes)} 
                                 onBlur={(e)=>{ this.state.newCandInfo.c_email = e.target.value;}}
                                 />
                             </div>
                         </div>
                         <div className="form-group row">
                             <label htmlFor="country" className="col-lg-3 col-form-label"><code className="highlighter-rouge">*</code>Country</label>
                             <div className="col-lg-9">
                                 <input id="country" name="country" type="text" className="form-control" onBlur={(e)=>{ this.state.newCandInfo.country = e.target.value; }}/>
                             </div>
                         </div>
                         <div className="form-group row">
                             <label htmlFor="phone" className="col-lg-3 col-form-label"><code className="highlighter-rouge">*</code>Phone</label>
                             <div className="col-lg-9">
                                 <input id="phone" name="phone"  type="number" className="form-control" onBlur={(e)=>{ this.state.newCandInfo.phone = e.target.value; }}/>
                             </div>
                         </div>
                     </div>
                     <div className="col-md-5 bl-files ml-1 p-3 pl-2">
                        <label htmlFor="files" className=" col-form-label text-muted mb-0"><code className="highlighter-rouge">*</code>Select Resume, The supported file formats are DOCX, DOC, PDF and TXT</label>
                        <div className="col-lg-9">
                            <input id="files" name="files" type="file" className="" onChange={this.handleUpload}/>
                        </div>
                     </div>
                 </div>
             </ModalBody>
             <ModalFooter>
                 <Button color="secondary" className="btn-sm" onClick={this.submitNewCandidateForm}>Add Candidate</Button>
                 <Button color="secondary" className="btn-sm" onClick={this.closeNewCandForm}>Cancel</Button>
             </ModalFooter></div></>:""}

             {this.state.submitOldCandidate?<><div className="card my-shadow">
             <ModalHeader>Select Existing Candidate</ModalHeader>
             <ModalBody>
                <div className="row mb-2">
                    <span className="text-center col-sm-4">Select existing candidate Name/Email/Phone No.</span>
                </div>
                 <div className="row">

                    <div className="col-md-6 mr-1">
                        <div className="form-group row">
                             <label htmlFor="firstName" className="col-lg-3 col-form-label"><code className="highlighter-rouge">*</code>Candidate Details</label>
                             <div className="col-lg-9">
                                <div className="input-group"> 
                                    <input type="text" id="firstName"  ref={this.state.oldcandidateDetailsRef}  name="example-input2-group2" className="form-control" onBlur={(e)=>{ this.state.oldcandidateDetails = e.target.value; }} placeholder="Candidate Details" />
                                    <span className="input-group-append"> 
                                    <button type="button" onClick={this.findCandidateDetails} className="btn  btn-primary">Search</button>
                                    </span>
                                </div>
                            </div>
                        </div>
                     </div>
                     <div className="col-md-5 bl-files ml-1 p-3 pl-2 d-none">
                        <label htmlFor="files" className=" col-form-label text-muted mb-0"><code className="highlighter-rouge">*</code>Select Resume, The supported file formats are DOCX, DOC, PDF and TXT</label>
                        <div className="col-lg-9">
                            <input id="files" name="files" type="file" className="" onChange={this.handleUpload}/>
                        </div>
                     </div>
                 </div>
                 <div className="row">
                

                     {this.state.oldcandidateDetails!==""?<>{(this.state.searchCandidateDetails.length)>=1?<>{this.state.searchCandidateDetails.map(function(obj,index){
                           return  <div className="card pl-2 ml-2">
                           <div className="card-body">  
                               <div className="media mb-5">
                                   <div className="avatar-box thumb-sm align-self-center mr-2"><span className="avatar-title bg-blue-primary rounded-circle rounded-circle thumb-sm">MY</span></div>                                     
                                   <div className="media-body align-self-center text-truncate ml-3">
                                    <h6 className="mt-0 mb-0 font-weight-semibold text-dark font-16">{obj.firstName} {obj.lastName} </h6> 
                                       <p className="text-muted mb-0 font-11 text-uppercase">{obj.email} {obj.phone}</p>
                                       <ul className="list-inline mb-0 text-muted">
                                            <li className="list-inline-item mr-2"><span><i class="fas fa-map-marker-alt mr-2 text-secondary font-14"></i></span>{obj.phone}</li>
                                            <li className="list-inline-item mr-2"><span><i class="far fa-envelope mr-2 text-secondary font-14"></i></span>{obj.email}</li>
                                        </ul>

                                                                                
                                   </div>
                               </div>
                               <div className=" justify-content-between ">                                        
                                   <div>
                                       <span className="badge badge-light">{obj.skills} </span>
                                   </div>
                                   <small className="d-none font-weight-semibold font-13 align-self-center">dummy text 45min</small>
                               </div>
                               <div className="mt-2">
                                   <div className="progress mt-3" >
                                       <div className="progress-bar bg-secondary" role="progressbar" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100"></div>
                                   </div>
                               </div>
                               <div className="row mt-4 d-none">
                                   <div className="col-4 text-center align-items-center">
                                       <h5 className="mb-0 font-weight-semibold font-20">5</h5>
                                       <p className="font-12 mb-1 text-muted">Assigned</p>                                                                              
                                   </div>
                                   <div className="col-4 text-center align-items-center">
                                       <h5 className="mb-0 font-weight-semibold font-20">3</h5>
                                       <p className="font-12 mb-1 text-muted">Started</p>
                                   </div>
                                   <div className="col-4 text-center align-items-center">
                                       <h5 className="mb-0 font-weight-semibold font-20">7</h5>
                                       <p className="font-12 mb-1 text-muted">Completed</p>
                                   </div>
                               </div>
                               <div className="mt-4 d-none justify-content-between">
                                   <p className="mb-0 font-weight-semibold">Start Date : <span className="text-muted  font-weight-normal ml-2">20 june 2019</span> </p>
                                   <p className="mb-0 text-danger font-weight-semibold">Deadline : <span className="text-muted font-weight-normal ml-2">08 Aug 2019</span></p>
                               </div>
                           </div>       
                           <div className="card-footer">
                           <Button title="Submit new candidate" className=" pull-left btn bg-blue-primary" onClick={(e)=>{
                               thisObj.setState({oldProfileSubmitModal:true,seletedCandidateId:obj.id});
                               //thisObj.startSubmission(obj.id,thisObj.state.jobDetails.id);
                               }}>
                                    <span className="btn-inner--icon mr-1"><i className="fas fa-user-astronaut" ></i></span><span className="btn-inner--text">Submit</span>
                                </Button>

                        


                            </div>                        
                       </div>
                     })}</>:<>No profiles found</>}</>:""}
                 </div>
             </ModalBody>
             <ModalFooter>
                 <Button color="secondary" className="btn-sm" onClick={this.closeOldCandForm}>Cancel</Button>
             </ModalFooter></div></>:""}


        <Modal isOpen={this.state.showResumeModal}>
            <ModalHeader>Resume Details</ModalHeader>
            <ModalBody className="resHeader"><pre className="modalCon">{this.state.candidateResumeDetails}</pre></ModalBody>
            <ModalFooter>
                <Button color="secondary" className="btn-sm" onClick={this.closeResumeModal}>Close</Button>
            </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.sendEmailWindow}>
                <ModalHeader>Send Email</ModalHeader>
                <ModalBody>
                    <div className="form-group row">
                        <label className="control-label col-sm-4">Template</label>
                        <select className="form-control form-control-sm col-sm-8" name="selectedEmailTemplate" onChange={this.handleInput}>
                            <option value="">select</option>
                    {this.state.templatesList.length>=1?this.state.templatesList.map(function(obj,index){return <option key={index} value={obj.templateId}>{obj.templateCode}-{obj.templateName}</option>}):""}
                        </select>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" className="btn-sm" onClick={this.sendEmail}>Send</Button>
                    <Button color="secondary" className="btn-sm" onClick={this.closeEmailModal}>Close</Button>
                </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.oldProfileSubmitModal}>
            <ModalHeader>Confirm Action</ModalHeader>
            <ModalBody>
            <div className="row">
                <div className="card-body p-0 auth-header-box">
                    <div className="text-center p-3">
                        <h4 className="mt-3 mb-1 font-weight-semibold font-18">Confirm Submit</h4>   
                        <p className="text-muted  mb-0">If you wish to update the existing CV with a newer version select this candidates latest CV.</p>  
                    </div>
                </div>

                                                        <div className="col-lg-12">
                                                            <h5></h5>
                                                            <span className="badge bg-soft-secondary"></span>

                                                            <div className="row">
            <div className="col-md-8">
               <div className="form-group"><label className="control-label">Resume update</label>
                  <input type="file" onChange={this.handleUpload} name="file" className="form-control no-border"/>
               </div>
            </div>
          
            </div>
                                                            <small className="text-muted ml-2">The supported file formats are below,</small>
                                                            <ul className="mt-1 mb-0">
                                                                <li>PDF</li>
                                                                <li>Text</li>
                                                                <li>Doc / Docx</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" className="btn-sm" onClick={(e)=>{ this.setState({oldProfileSubmitModal:false,oldcandidateId:0}) }}>Close</Button>
            
              
               <button type="submit" onClick={(e)=>{this.startSubmission(this.state.seletedCandidateId,this.state.jobDetails.id);}} title="Upload new resume"  className="pull-left btn btn-primary btn-square btn-outline-dashed waves-effect waves-light">
               <span className="btn-inner--icon"><i className="fa fa-upload"></i></span> Submit</button>
            

            </ModalFooter>
        </Modal>
        </>);
    }
}
export default VendorRequirements;

