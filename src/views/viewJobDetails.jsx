import React, { Component } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardFooter, Button,
    Modal, ModalHeader, ModalBody, ModalFooter, Tooltip, Spinner, Table
} from "reactstrap";
import Swal from 'sweetalert2';
import { jobDetailsURL, apiUrl, updateJobDetails, candidateGetUrl } from "../variables/Variables.jsx";
import ReactQuill from "react-quill";
import classNames from "classnames";
import Cookies from 'universal-cookie';
import ProfileBoxList from "../views/ProfileBoxList";

import common from "../views/commons/Common.jsx";
import IFrame from "../components/iFrame/IFrame.jsx"
import { Multiselect } from 'multiselect-react-dropdown';
 
const axios = require("axios").default;
const cookies = new Cookies();
let fData = new FormData();
let config = {
    headers: {
        'content-type': 'multipart/form-data'
    }
};
const userType = new common().getUserType();
class ViewJobDetails extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            activeTab: 'jobdetails',
            lessJobDescription: "",
            fullJobDescription: "",
            showMoreDescription: false,
            interviewCandidateId: "",
            interviewDate: "",
            interviewAttendees: "",
            interviewChannel: "",
            interviewTimezone: "",
            interviewComments: "",
            scheduleInterviewModal: false,
            jobApplicationsList: [],
            fnameRef: React.createRef(),
            jobDesRef: React.createRef(),
            oldcandidateDetails: "",
            oldcandidateId: "",
            submissionId: "",

            seletedCandidateId: "",
            selectedCandidateBillRate: "",
            selectedCandidateBillRateType: "",


            oldProfileSubmitModal: false,
            oldcandidateDetailsRef: React.createRef(),
            oldcandidateDetailsSbmtBtn: false,
            submitNewCandidate: false,
            submitOldCandidate: false,
            profiles: [],
            showResumeModal: false,
            selectedProfiles: [],
            pagingArray: [],
            revPagingArray: [],
            pageNumber: 1,
            page_size: 20, pagingText: "",
            searchingProfile: false,
            loadMorePaging: true,
            numberOfProfiles: 0,
            templatesList: [],
            sendEmailWindow: false,
            selectedEmailTemplate: "",
            loading: false,
            error: null,
            isPageloading: false,
            resumeContains: "",
            searchingProfile: false,
            newCandInfo: {
                firstName: "",
                lastName: "",
                email: "",
                c_email: "",
                country: "",
                phone: "",
                b_rate: 0,
                b_rate_type: "",
                s_rate: 0,
                s_rate_type: "",
                cl_rate: 0,
                cl_rate_type: ""
            },
            searchCandidateDetails: [],
            jobDetails: {
                id: "",
                jobTitle: "",
                jobId: "",
                jobSkills: "",
                maxSubmittals: "",
                noOfOpenings: "",
                positionType: "",
                requirementOT: "",
                requirementReferences: "",
                requirementSecurityClearance: "",
                requirementTravel: "",
                startDate: "",
                state: "",
                zip: "",
                additionalReferenceNumber: "",
                addressLine1: "",
                addressLine2: "",
                billRate: "",
                billRateType: "",
                city: "",
                country: "",
                endDate: "",
                jobContact: "",
                jobDescription: "",
                sendEmail: null,
                sendEmailHandler: null,
                next: "",
                previous: "",
            },
            searchFactors: {
                keywords: '',
                jobTitle: '',
                minExperience: '',
                maxExperience: '',
            },
            countriesList:[],
            statesList:[],
            selectedStates1:[],
            jobApplications:[],
            jobApplicationPrevUrl:"",
            jobApplicationNextUrl:"",
            jobApplicationCount:0,
            jobApplicationList:null
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
        this.handleJobDescription = this.handleJobDescription.bind(this);
        axios.defaults.withCredentials = false;
        this.closeNewCandForm = this.closeNewCandForm.bind(this);
        this.submitNewCandidateForm = this.submitNewCandidateForm.bind(this);
        this.closeOldCandForm = this.closeOldCandForm.bind(this);
        this.findCandidateDetails = this.findCandidateDetails.bind(this);
        this.startSubmission = this.startSubmission.bind(this);
        this.completeUpload = this.completeUpload.bind(this);
        this.approveCandidate = this.approveCandidate.bind(this);
        this.rejectCandidte = this.rejectCandidte.bind(this);
        this.getcandidatesList = this.getcandidatesList.bind(this);
        this.scheduleInterview = this.scheduleInterview.bind(this);
        this.showMoreDescritionContent = this.showMoreDescritionContent.bind(this);
        this.showLessDescritionContent = this.showLessDescritionContent.bind(this);
        this.setJobDefaultSearchCriteria = this.setJobDefaultSearchCriteria.bind(this);
        this.setSelectedValue = this.setSelectedValue.bind(this);
        this.onSelectList = this.onSelectList.bind(this);
        this.onRemoveList = this.onRemoveList.bind(this);
    }
    setSelectedValue(values) {
        if(values.length == 0)
            return [];

        if (values !== "") {
            var splits_ = [];
            values.split(', ').forEach(function (ind, val) {
                splits_.push({ name: ind, id: val });
            });
            return splits_;
            //this.state.orgInfoTaxTerms
        }
    }
    onSelectList(selectedList, selectedItem) {
        let sts = []
        for (var i = 0; i < selectedList.length; i++) {
            sts[i] = (selectedList[i].name);
        }
        let sts_ = sts.join(", ");
        this.state.selectedStates1 = sts_;
    }

    onRemoveList(selectedList, removedItem) {
        let sts = []
        for (var i = 0; i < selectedList.length; i++) {
            sts[i] = (selectedList[i].name);
        }
        let sts_ = sts.join(", ");
        this.state.selectedStates1 = sts_;
    }
    setJobDefaultSearchCriteria() {
        axios.get(apiUrl + "getJobDefaultSearchCriteria", {
            params: {
                jobId: (new URLSearchParams(window.location.search)).get("jobId"), sess_id: cookies.get("c_csrftoken")
            }
        }).then(({ data }) => {
            this.setState({ searchFactors: data });

            /*searchFactors:{
                keywords:'',
                jobTitle:'',
                minExperience:'',
                maxExperience:''
            }
            */
        });
    }
    showMoreDescritionContent() {
        this.setState({ showMoreDescription: true });
    }
    showLessDescritionContent() {
        this.setState({ showMoreDescription: false });
    }
    scheduleInterview() {
        if (this.state.interviewCandidateId == "") {
            Swal.fire('Oops...', 'Error occured refresh the page and try again', 'error'); return;
        }

        axios.post(apiUrl + "scheduleInterview", {
            candidateId: this.state.interviewCandidateId,
            channel: this.state.interviewChannel,
            date: this.state.interviewDate,
            comments: this.state.interviewComments,
            attendees: this.state.interviewAttendees,
            timeZone: this.state.interviewTimezone,
            sess_id: cookies.get("c_csrftoken"),
            recruitmentId: this.state.jobDetails.id,
            submissionId: this.state.submissionId
        }).then(({ data }) => {
            if (data.statusResponse) {
                //this.showAlert("br","success","Candidate created successsfully","pe-7s-check");
                let timerInterval;
                Swal.fire({
                    icon: 'success',
                    title: data.message,
                    html: '',
                    timer: 600,
                    timerProgressBar: true,
                    onBeforeOpen: () => {
                        Swal.showLoading()
                        timerInterval = setInterval(() => {
                        }, 100)
                    },
                    onClose: () => {
                        clearInterval(timerInterval)
                        // setTimeout(()=>this.props.history.push("../admin/candidates"),  500);
                        //window.location.href = "../admin/manageJobs";
                        this.setState({ scheduleInterviewModal: false });
                    }
                });
            } else {
                Swal.fire('Error', "", 'error'); return;
            }
        });//axios end
    }


    getcandidatesList(e) {
        if (this.state.searchCandidateDetails.length >= 1) {
            const self = this;
            return <table className="table">
                <tr><td>Name</td><td>Email</td><td style={{ width: "40%" }}>Skills</td><td>BillRate</td><td>Action</td></tr>
                {this.state.oldcandidateDetails !== "" ? <>{(this.state.searchCandidateDetails.length) >= 1 ? <>{this.state.searchCandidateDetails.map(function (obj, index) {
                    return <tr><td>{obj.firstName} {obj.lastName} </td><td>{obj.email}</td><td>{obj.skills}</td><td>{obj.rate} {obj.rateType}</td><td className=" "><Button title="Submit new candidate" className=" btn btn-sm bg-blue-primary" onClick={(e) => {
                        self.setState({ oldProfileSubmitModal: true, seletedCandidateId: obj.id, selectedCandidateBillRate: obj.rate, selectedCandidateBillRateType: obj.rateType });
                    }}>
                        <span className="btn-inner--icon mr-1"><i className="fas fa-12x fa-user-astronaut" ></i></span><span className="btn-inner--text">Submit</span>
                    </Button></td></tr>

                })}</> : <>No profiles found</>}</> : ""}
            </table>;
        } else {
            return "";
        }
    }
    approveCandidate(canId, reqId, e) {
        axios.get(apiUrl + "approveVendorCandidate", {
            params: {
                candidateId: canId,
                submissionId: reqId,
                sess_id: cookies.get("c_csrftoken")
            }
        }).then(({ data }) => {
            // this.state = data;
            if (data.statusResponse) {
                Swal.fire({
                    icon: 'success',
                    title: data.message,
                    html: '',
                    timer: 800,
                    timerProgressBar: true,
                    onBeforeOpen: () => {
                        Swal.showLoading()
                    }
                }).then((result) => {
                    /* Read more about handling dismissals below */
                    window.location.reload();
                });

            } else {
                alert(data.message);
            }
        }).catch((err) => { });
    }


    rejectCandidte(canId, reqId, e) {
        axios.get(apiUrl + "rejectVendorCandidate", {
            params: {
                candidateId: canId,
                submissionId: reqId,
                sess_id: cookies.get("c_csrftoken")
            }
        }).then(({ data }) => {
            // this.state = data;
            if (data.statusResponse) {
                Swal.fire({
                    icon: 'success',
                    title: data.message,
                    html: '',
                    timer: 800,
                    timerProgressBar: true,
                    onBeforeOpen: () => {
                        Swal.showLoading()
                    }
                }).then((result) => {
                    /* Read more about handling dismissals below */
                    window.location.reload();
                });
            } else {
                alert(data.message);
            }
        }).catch((err) => { });
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
                [targetName]: {
                    tooltipOpen: !this.state[targetName].tooltipOpen
                }
            });
        }
    };

    handleJobDescription(text) {
        this.state.jobDetails.jobDescription = text;
    }

    componentDidMount() {
        console.log(this.state.fnameRef);
        this.setJobDetails();
        this.setJobDefaultSearchCriteria();
    }
    componentDidUpdate() {
        if (this.state.fnameRef.current !== null) {
            this.state.fnameRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            //this.state.fnameRef.current.focus();
        }
        if (this.state.oldcandidateDetailsRef.current !== null) {
            this.state.oldcandidateDetailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            this.state.oldcandidateDetailsRef.current.focus();
        }

    }
    findCandidateDetails = (e) => {
        axios.get(apiUrl + "searchCandidateDetails", {
            params: {
                candidateDetails: this.state.oldcandidateDetails,
                sess_id: cookies.get("c_csrftoken")
            }
        }).then(({ data }) => {
            // this.state = data;
            if (data.statusResponse) {
                this.setState({ searchCandidateDetails: data.candidateDetails })
            }
        }).catch((err) => { });
    }
    setJobDetails = async () => {
        const params = new URLSearchParams(window.location.search);
        await axios.get(jobDetailsURL, {
            params: {
                jobId: params.get('jobId'),
                sess_id: cookies.get("c_csrftoken")
            }
        }).then(({ data }) => {
            // this.state = data;
            if (data.statusResponse) {
                data.jobDetails.billRate = data.jobDetails.billRate == "0" ? "" : data.jobDetails.billRate;
                data.jobDetails.noOfOpenings = data.jobDetails.noOfOpenings == "0" ? "" : data.jobDetails.noOfOpenings;
                data.jobDetails.maxSubmittals = data.jobDetails.maxSubmittals == "0" ? "" : data.jobDetails.maxSubmittals;
                this.setState({
                    jobDetails: data.jobDetails,
                    jobApplicationsList: data.jobApplicants
                });
           
                let lessJobDescription = this.state.jobDetails.jobDescription.replace(/<\/?[^>]+(>|$)/g, "");

                if (lessJobDescription.length > 300)
                    this.setState({ lessJobDescription: lessJobDescription.substring(0, 300) });
                else
                    this.setState({ lessJobDescription: lessJobDescription });

                this.setState({ fullJobDescription: this.state.jobDetails.jobDescription.replace(/<\/?[^>]+(>|$)/g, "") });


            }
        }).catch((err) => { });
        //get states list
        axios.all([
            axios.get(apiUrl + "getAllCountriesList"),
            axios.get(apiUrl + "getAllStatesList"),
            axios.get(apiUrl + "getJobSubmissionDetails",{
                params: {
                    search: params.get('jobId'),
                    sess_id: cookies.get("c_csrftoken")
                }
            }),
            ])
            .then(axios.spread((countriesList, statesList,submissionDetails) =>{
                    this.setState({countriesList : countriesList.data, statesList : statesList.data});
                    this.setState({jobApplicationPrevUrl :submissionDetails.data.previous, jobApplicationNextUrl:submissionDetails.data.next,jobApplicationList:submissionDetails.data.results, jobApplicationCount : submissionDetails.data.count});
                  

            }));
            
    }
    closeResumeModal = () => {
        this.setState({ showResumeModal: false });


    }

    viewResume(id, e) {
        this.setState({
            candidateResumeDetails: apiUrl + "generateSystemResume?userId=" + id + "&sess_id=" + cookies.get("c_csrftoken"), showResumeModal: true
        });
    }
    updateJobDetails(event) {
        if (this.state.jobDetails.jobDescription === "") {
            Swal.fire('Oops...', 'Enter jobdescription', 'error'); return;
        }
        axios.put(updateJobDetails, {
            jobTitle: this.state.jobDetails.jobTitle,
            additionalReferenceNumber: this.state.jobDetails.additionalReferenceNumber,
            jobContact: this.state.jobDetails.jobContact,
            addressLine1: this.state.jobDetails.addressLine1,
            city: this.state.jobDetails.city,
            country: this.state.jobDetails.country,
            billRate: this.state.jobDetails.billRate !== "" ? this.state.jobDetails.billRate : 0,
            billRateType: this.state.jobDetails.billRateType,
            startDate: this.state.jobDetails.startDate,
            noOfOpenings: this.state.jobDetails.noOfOpenings !== "" ? this.state.jobDetails.noOfOpenings : 0,
            maxSubmittals: this.state.jobDetails.maxSubmittals !== "" ? this.state.jobDetails.maxSubmittals : 0,
            positionType: this.state.jobDetails.positionType,
            jobSkills: this.state.jobDetails.jobSkills,
            addressLine2: this.state.jobDetails.addressLine2,
            state: this.state.jobDetails.state,
            zip: this.state.jobDetails.zip,
            endDate: this.state.jobDetails.endDate,
            requirementOT: this.state.jobDetails.requirementOT,
            requirementReferences: this.state.jobDetails.requirementReferences,
            requirementTravel: this.state.jobDetails.requirementTravel,
            requirementSecurityClearance: this.state.jobDetails.requirementSecurityClearance,
            jobDescription: this.state.jobDetails.jobDescription,
            id: this.state.jobDetails.id,
            sess_id: cookies.get("c_csrftoken")
        }).then(function (res) {
            if (res.data.statusResponse) {
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
                    }, onClose: () => {
                        clearInterval(timerInterval)
                        window.location.reload()
                    }
                });
            } else {
                var errMsg = "";
                Object.keys(res.data.message).map((e, i) => {
                    errMsg += "<br/>- " + (res.data.message[e]);

                });
                Swal.fire('Error', errMsg, 'error'); return;
            }
        });//axios end
    }
    selectProfiles = (id, e) => {
        if (e) {
            if (e.target.checked === true) {
                let profiless = this.state.selectedProfiles;
                profiless.push(id);
                this.setState({ selectedProfiles: profiless });
            }
        }
        if (e.target.checked === false) {
            let profiless = this.state.selectedProfiles;
            let indx = profiless.indexOf(id);
            if (indx !== -1) {
                profiless.splice(indx, 1);
                this.setState({ selectedProfiles: profiless });
            }
        }
    }
    sendEmailToCandidate = () => {
        this.setState({ sendEmailWindow: true });
        axios.get(apiUrl + "catalog/emailTemplateList", {
            params: {
                userId: window.sessionStorage.getItem("userId"), page_size: 100, pageNumber: 0, sess_id: cookies.get("c_csrftoken")
            }
        }).then(({ data }) => {
            //templatesList
            //selectedEmailTemplate
            const temTypes = data.templates;
            this.setState({ templatesList: data.templates });
        }).catch((err) => { });


        //get email templates list from server

    }
    sendEmail = () => {
        this.setState({ sendEmailWindow: false });
        //axios post send email here
    }
    closeEmailModal = () => {
        this.setState({ sendEmailWindow: false });
    }
    handleInput(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    handleJobDetailsInput(event) {
        //requirementTravel
        //requirementSecurityClearance
        if (event.target.name === "requirementOT" || event.target.name === "requirementTravel" || event.target.name === "requirementSecurityClearance") {
            this.state.jobDetails[event.target.name] = (event.target.checked).toString();
        } else {
            let jobDetails = this.state.jobDetails;
            jobDetails[event.target.name] = event.target.value;
            this.setState({ jobDetails: jobDetails });
        }
    }

    /////\\\\\JOB SEARCH FUNCTIONALITIES/////\\\\\/////////
    findProfiles = (event) => {
        this.setState({
            searchingProfile: true, loading: true
        });
        var elmnt = document.getElementById("searchProfilesByJob");
        //var y = elmnt.scrollHeight;
        //var x = elmnt.scrollWidth;
        axios.get(apiUrl + "searchProfilesByJob", {
            params: {
                jobId: this.state.jobDetails.id, page_size: this.state.page_size, pageNumber: this.state.pageNumber, sess_id: cookies.get("c_csrftoken")
            }
        }).then(({ data }) => {
            this.setState({ loading: false });
            if (data.results.count >= 1) {
                this.setState({
                    loading: false,
                    profiles: data.results.results,
                    numberOfProfiles: data.results.count,
                    searchingProfile: true,
                    previous: data.results.previous,
                    next: data.results.next,
                    pageNumber: data.pageNumber
                });
            }
        }).catch((err) => { });
    }
    loadPrevious = (pageNos, e) => {
        if (this.state.isPageloading)
            return "";
        this.setState({ loadMorePaging: true });
        this.setState({ isPageloading: true });
        document.body.style.cursor = 'progress';
        axios.get(this.state.previous).then(({ data }) => {
            this.setState({ isPageloading: false });
            this.setState({
                loading: false,
                profiles: data.results.results,
                numberOfProfiles: data.results.count,
                searchingProfile: true,
                previous: data.results.previous,
                next: data.results.next,
                pageNumber: data.pageNumber
            });
            //data.currentPageNumber
            document.body.style.cursor = 'default';
        })
            .catch((err) => { });
    }

    loadNext = (pageNos, e) => {
        if (this.state.isPageloading)
            return "";
        this.setState({ loadMorePaging: true });
        this.setState({ isPageloading: true });
        document.body.style.cursor = 'progress';
        axios.get(this.state.next).then(({ data }) => {
            this.setState({ isPageloading: false });
            this.setState({
                loading: false,
                profiles: data.results.results,
                numberOfProfiles: data.results.count,
                searchingProfile: true,
                previous: data.results.previous,
                next: data.results.next,
                pageNumber: data.pageNumber
            });
            //data.currentPageNumber
            document.body.style.cursor = 'default';
        })
            .catch((err) => { });
    }


    /////JOB SEARCH FUNCTIONALITIES/////////
    renderLoading() {
        return <Container className="mt-3" fluid><Row>
            <div className="col">
                <Card className="shadow p-3">
                    <div className="content profileBox">
                        <Col md={12}><center className="mt-4 mb-4"><i className="fa fa-45 fa-spinner fa-spin"></i></center></Col>
                    </div></Card></div></Row></Container>;
    }

    closeNewCandForm = () => {
        this.setState({ submitNewCandidate: false });
        window.scrollTo(0, 0);
    }
    closeOldCandForm = () => {
        this.setState({ submitOldCandidate: false });
        window.scrollTo(0, 0);
    }

    handleUpload = (event) => {
        var a = event.target.files[0].name.split(".");
        var allowedTypes = ["rtf", "docx", "pdf", "txt", "doc"];
        let file = event.target.files[0];
        var fileExt = a[a.length - 1];
        var errDets = "";
        if (event.target.files[0].size >= 2000000) {
            errDets = "- File size error"
        }

        if (allowedTypes.includes(fileExt) === false) {
            errDets = "- File type error"
        }
        //30367 < 2000000

        //alert(event.target.files[0].size <= 2000000)
        //alert(allowedTypes.indexOf(fileExt))
        if ((allowedTypes.includes(fileExt) === true) && event.target.files[0].size <= 2000000) {
            fData.append("file", file);
            fData.append("selectedRequirementId", this.state.jobDetails.id);
            fData.append("fileExtension", fileExt);
            fData.append("c_session_id", cookies.get("c_csrftoken"));
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "I can't process this file. Retry with specified extensions. " + errDets
            });
            //alert("This file can not be processed")
            event.target.value = null
        }
    }

    completeUpload = (event) => {
    }

    submitNewCandidateForm = () => {
        fData.append("firstName", this.state.newCandInfo.firstName);
        fData.append("lastName", this.state.newCandInfo.lastName);
        fData.append("email", this.state.newCandInfo.email);
        fData.append("c_email", this.state.newCandInfo.c_email);
        fData.append("country", this.state.newCandInfo.country);
        fData.append("phone", this.state.newCandInfo.phone);
        fData.append("selectedCandidateBillRate", this.state.newCandInfo.b_rate);
        fData.append("selectedCandidateBillRateType", this.state.newCandInfo.b_rate_type);
        fData.append("selectedCandidateSubmissionRate", this.state.newCandInfo.s_rate);
        fData.append("selectedCandidateSubmissionRateType", this.state.newCandInfo.s_rate_type);
        fData.append("selectedCandidateClientRate", this.state.newCandInfo.cl_rate);
        fData.append("selectedCandidateClientRateType", this.state.newCandInfo.cl_rate_type);

        fData.append("requirementId", this.state.jobDetails.id);
        if (this.state.newCandInfo.email !== this.state.newCandInfo.c_email) {
            return false;
        }
        axios.post(apiUrl + "vendorSubmitNewCandidate", fData, config).then(function (res) {

            var responseJson = (res.data);
            if (responseJson.statusResponse) {
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
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: responseJson.message
                });
            }
        }).catch(function (err) {
            //console.log(err);
        });
    }
    startSubmission = (profId, jobId) => {

        fData = new FormData();
        fData.append("candidateId", profId);
        fData.append("billRate", this.state.selectedCandidateBillRate);
        fData.append("billRateType", this.state.selectedCandidateBillRateType);
        fData.append("submissionRate", this.state.selectedCandidateSubmissionRate);
        fData.append("submissionRateType", this.state.selectedCandidateSubmissionRateType);
        fData.append("clientRate", this.state.selectedCandidateClientRate);
        fData.append("clientRateType", this.state.selectedCandidateClientRateType);

        fData.append("session_id", cookies.get("c_csrftoken"));
        fData.append("requirementId", jobId);
        let thisObj = this;
        axios.post(apiUrl + "vendorSubmitOldCandidate", fData, config).then(function (res) {
            thisObj.setState({ oldProfileSubmitModal: false });
            res = res.data;
            if (res.statusResponse) {
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
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: res.message
                });
            }
        }).catch(function (err) {
            //console.log(err);
        });
        this.setState({ oldcandidateId: 0 });
    }
    renderApplications() {
        if (this.state.loading) {
            document.body.style.cursor = 'wait';
            tableData = <tr><td colSpan="6" className="text-center p-5"><i className="fa fa-spinner fa-45 fa-spin"></i></td></tr>;
        }
        const thisClone = this;
        if (!this.state.loading) {
            document.body.style.cursor = 'default';
            var tableData = this.state.jobApplicationsList.map(function (obj, index) {
                var idValue = obj.candidateId;
                return <tr key={index}><td className="text-left">{obj.candidateName}</td><td className="text-left">{obj.email}</td><td className="text-center"> {obj.rate} {obj.rateType}</td><td className="text-center">{obj.phone}</td><td className="text-center">
                    {/*#1 - submitted,2 - approved/ shortlisted for interview , 0 - default, 3 - rejected, 4-interview scheduled, 5 - inter view completed*/}
                    {obj.status === 0 ? <span className="ml-1 text-primary">Submitted</span> : ""}
                    {obj.status === 1 ? <span className="ml-1 text-primary">Submitted</span> : ""}
                    {obj.status === 2 ? <span className="ml-1 text-primary">Shortlisted For Interview</span> : ""}
                    {obj.status === 3 ? <span className="ml-1 text-danger">Rejected</span> : ""}
                    {obj.status === 4 ? <span className="ml-1 text-primary">Interview scheduled</span> : ""}
                    {obj.status === 5 ? <span className="ml-1 text-primary">Interview Inprocess</span> : ""}

                    {obj.status === 6 ? <span className="ml-1 text-primary">Onboarded</span> : ""}

                </td>
                    <td>
                        <p className="text-right mb-0">{new Date(obj.submittedDate).toDateString()}</p>
                    </td><td className="text-center">
                        <a className="btn btn-sm btn-outline-info waves-effect waves-light" onClick={(e) => thisClone.viewResume(idValue, e)}>View</a>


                        {(obj.status == 0 || obj.status == 1) ? <a className="ml-1  btn btn-sm btn-outline-primary waves-effect waves-light" onClick={(e) => thisClone.approveCandidate(idValue, obj.submissionId, e)}>Shortlist</a> : <></>}

                        {obj.status == 2 ? <a className="ml-1 btn btn-sm btn-outline-primary waves-effect waves-light" onClick={(e) => thisClone.setState({ scheduleInterviewModal: true, interviewCandidateId: idValue, submissionId: obj.submissionId })}>Schedule Interview</a> : <></>}

                        {obj.status == 3 ? <a className="ml-1 btn btn-sm btn-outline-primary waves-effect waves-light" onClick={(e) => thisClone.approveCandidate(idValue, obj.submissionId, e)}>Shortlist Again</a> : <></>}

                        {obj.status == 4 ? <></> : <></>}



                        {(obj.status == 0 || obj.status == 1 || obj.status == 2) ? <a className="ml-1  btn btn-sm btn-outline-danger waves-effect waves-light" onClick={(e) => thisClone.rejectCandidte(idValue, obj.submissionId, e)}>Reject</a> : <></>}


                    </td></tr>;
            });
            if (this.state.jobApplicationsList.length == 0) {
                document.body.style.cursor = 'default';
                tableData = <tr><td colSpan="7" className="text-center p-5">No Records Found</td></tr>;
            }
        }
        return tableData;
    }

    render() {
        let profileList = '';
        let c_email_classes = ["form-control"];
        let jobApplicationsTbody = this.renderApplications();

        //,this.state.newCandInfo.c_email!=="abc"?"parsley-error":""
        if (this.state.newCandInfo.email !== this.state.newCandInfo.c_email) {
            c_email_classes.push("parsley-error");
        }
        const card_style = {
            overflowY: "scroll",
            maxHeight: ((window.innerHeight) - 320) + "px",
            minHeight: ((window.innerHeight) - 320) + "px"
        };

        if (this.state.profiles.length) {
            profileList = <div ><ProfileBoxList selectProfiles={this.selectProfiles} viewResume={this.viewResume} selectedProfiles={this.state.selectedProfiles} options={this.state.profiles} /></div>
        } else {
            profileList = "";
        }
        const thisObj = this;
        const editJobLink = '../admin/editJobDetails?jobId=' + (this.state.jobDetails.id);

        const date1 = new Date(this.state.jobDetails.createdDate);
        const now = new Date();
        const diffTime = Math.abs(now - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));



        return this.state.jobDetails.jobTitle === "" ? (<div className="header bg-gradient-info pb-2 pt-5 pt-md-8">
            <Container fluid>
                
                <div className="header-body">
                    <Row>
                        <Col lg="12" xl="12"><center><Spinner style={{ width: '3rem', height: '3rem' }} type="grow" /></center>
                        </Col>
                    </Row>
                </div>
            </Container>
        </div>) : (<>

            <div className="row ss" >
                <div className="col-sm-12">
                    <div className="page-title-box">
                        <div className="row pl-2">
                            <div className="col ">
                                <h4 className="page-title ">Job Management</h4>
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="javascript:void(0);">Job - Add New</a></li>
                                </ol>
                            </div>
                            <div className="col-auto align-self-center">
                                <div className="button-items float-right pr-0">
                                    <a title="Submit new candidate" className="btn btn-info waves-effect waves-light pull-left btn bg-blue-primary" href={"../submitNewCandidate?jobId="+this.state.jobDetails.id}>
                                        <span className="btn-inner--icon mr-1"><i className="fas fa-user-astronaut" ></i></span><span className="btn-inner--text">Submit New</span>
                                    </a>

                                    <Button title="select from profiles" className="pull-left btn btn-warning waves-effect waves-light"  href={"../submitOldCandidate?jobId="+this.state.jobDetails.id} >
                                        <span className="btn-inner--icon mr-1"><i className="fas fa-user-astronaut" ></i></span><span className="btn-inner--text">Select from profiles</span>
                                    </Button>
                                    <a href={"../" + userType + "/manageJobs"} className="float-right btn-icon btn btn-outline-secondary" >
                                        <span className="btn-inner--icon mr-1"><i className="far dripicons-backspace"></i></span>
                                        <span className="btn-inner--text">Back</span>
                                    </a>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row"></div>
            <div className="col-sm-12 p-0">
                <div className="col-sm-9 pl-0 float-left">
                    <Row>
                        <div className="col p-0 m-0">
                            <Card className="p-2 ">
                                <div className=" p-0">

                                    <div className="job-backbutton float-left">
                                        <a href={"../" + userType + "/manageJobs"} className="float-right btn-icon " >
                                            <span className="btn-inner--icon mr-1"><i className="gr-btn far dripicons-backspace"></i></span>
                                        </a>
                                    </div>
                                    <div className="job-content-section pt-2 float-right">
                                        <span className="title-priority-icon pr-2"><i class="gr-btn fas fa-cog"></i></span>
                                        <h4 className="mb-0 job-title">{this.state.jobDetails.jobCode} - {this.state.jobDetails.jobTitle}</h4>
                                        <h6 className="jpLocation">{this.state.jobDetails.jobClient} | <i class="fas fa-map-marker-alt"></i> {this.state.jobDetails.jobLocationCity}, {this.state.jobDetails.selectedStates}, {this.state.jobDetails.country}</h6>

                                        <span className="jpAssingInfo">Assigned To - {this.state.jobDetails.orgInfoAssignedTo}</span>




                                        <div className="row mt-2">
                                            <a href={editJobLink} className="btn btn-sm btn-outline-primary ml-2">Edit Job</a>

                                            <a href="" className="btn btn-sm btn-outline-primary ml-2">Matching Profiles</a>
                                        </div>
                                        <hr className="border-bottom-dashed mb-0" />

                                        <div className="col-sm-12 pt-2  pl-0 ml-0">
                                            <ul className="jpQViewList">
                                                <li>
                                                    <div className="jphLabel-1">Recruitment Manager</div>
                                                    <div className="jphLabel-2">{this.state.jobDetails.orgInfoRecruitmentManager}</div>
                                                </li>
                                                <li>
                                                    <div className="jphLabel-1">Client Bill Rate / Salary <a className="active" href="javascript:void(0);"><i className="fas fa-question-circle"></i></a></div>
                                                    <div className="jphLabel-2">{this.state.jobDetails.clientBillRateCurrency}  {this.state.jobDetails.clientBillRateValue} </div>
                                                </li>
                                                <li>
                                                    <div className="jphLabel-1">Pay Rate / Salary <a className="active" href="javascript:void(0);"><i className="fas fa-question-circle"></i></a></div>
                                                    <div className="jphLabel-2">{this.state.jobDetails.payRateCurrency} {this.state.jobDetails.payRateMinValue} to {this.state.jobDetails.payRateMaxValue} {this.state.jobDetails.payRateFrequency} {this.state.jobDetails.payRateTaxTerms} </div>
                                                </li>
                                                <li style={{paddingRight:'15px'}}>
                                                    <div className="jphLabel-1">Created On </div>
                                                    <div className="jphLabel-2">{new Date(this.state.jobDetails.createdDate).toLocaleString()}</div>
                                                </li>
                                                <li style={{paddingRight:'15px'}}>
                                                    <div className="jphLabel-1">Job Status </div>
                                                    <div className="jphLabel-2">{this.state.jobDetails.jobStatus}</div>
                                                </li>
                                                <li>
                                                    <div className="jphLabel-1">Job Age</div>
                                                    <div className="jphLabel-2">{diffDays} Days</div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="row col-sm-12 pt-2 ">
                                        <div className="row col-sm-12">
                                            <span className="jpDescrTitle ">Job Description</span>
                                            </div>
                                            <p className="p-1">
                                                {this.state.showMoreDescription ? <div dangerouslySetInnerHTML={{ __html: this.state.fullJobDescription }}></div>: <div dangerouslySetInnerHTML={{ __html: this.state.lessJobDescription }}></div>}
                                                {this.state.showMoreDescription ? <div className="row ml-0"><a className="link-btn " onClick={this.showLessDescritionContent}>Less<i className="fas fa-angle-up pl-1 "></i></a></div> : <div className="row ml-2"><a className="link-btn row" onClick={this.showMoreDescritionContent}>More<i className="fas fa-angle-down pl-1 pt-1"></i></a></div>}
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            </Card></div>
                    </Row>
                    <Row>
                        <div className="col p-0">
                            <Card className="p-2">



                                <ul className="nav nav-tabs" role="tablist">
                                    <li className="nav-item">
                                        <a className={`nav-link ${this.state.activeTab == 'jobdetails' ? 'active' : ''}`} data-toggle="tab" href="#jobdetails" onClick={() => { this.setState({ activeTab: "jobdetails" }) }} role="tab" aria-selected="true">Job Details</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className={`nav-link ${this.state.activeTab == 'snapshot' ? 'active' : ''}`} data-toggle="tab" onClick={() => { this.setState({ activeTab: "snapshot" }) }} href="#profile" role="tab" aria-selected="false">Applications ({this.state.jobApplicationCount})</a>
                                    </li>
                                    {/* <li className="nav-item">
                                            <a className={`nav-link ${this.state.activeTab=='jobdetails'?'active':''}`} data-toggle="tab" href="#settings" role="tab" aria-selected="false">Settings</a>
        </li>*/}
                                </ul>


                                <div className="tab-content">
                                    <div className={`tab-pane p-3 ${this.state.activeTab == 'jobdetails' ? 'active' : ''}`} id="home" role="tabpanel">




                                        <div className="p-1 card-body" >
                                            <div className="col-sm-12">
                                                <div className="col-sm-4 float-left pl-0">
                                                    <div className="form-group">
                                                        <label className="formLabel pr-1">Placement Fee Percentage : </label>
                                                        <span className="formValue">{this.state.jobDetails.placementFeePercentage}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel pr-1">Remote Job : </label>
                                                        <span className="formValue">{this.state.jobDetails.isRemoteJob}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel pr-1">Required Documents : </label>
                                                        <span className="formValue">{this.state.jobDetails.jobRequiredDocuments}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel pr-1">Additional Details : </label>
                                                        <span className="formValue">{this.state.jobDetails.addtnDetails}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel pr-1">Job End Date : </label>
                                                        <span className="formValue">{this.state.jobDetails.endDate}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel pr-1">Client : </label>
                                                        <span className="formValue">{this.state.jobDetails.jobClient}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel pr-1">Client Job ID</label>
                                                        <span className="formValue">{this.state.jobDetails.clientJobId}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel pr-1">CEIPAL Ref # : </label>
                                                        <span className="formValue">{this.state.jobDetails.internalRef}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel pr-1">Clearance : </label>
                                                        <span className="formValue">N/A</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel pr-1">Post Job on Career Portal : </label>
                                                        <span className="formValue">{this.state.jobDetails.careerPortalPublishedDate}</span>
                                                    </div>
                                                </div>


                                                <div className="col-sm-4 float-left">
                                                    <div className="form-group">
                                                        <label className="formLabel pr-1">TVOP : </label>
                                                        <span className="formValue">{this.state.jobDetails.jobTvop}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel pr-1">Required Hours/Week : </label>
                                                        <span className="formValue">{this.state.jobDetails.requiredHours}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel pr-1">End Client : </label>
                                                        <span className="formValue">{this.state.jobDetails.endClient}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel pr-1">Work Authorization : </label>
                                                        <span className="formValue">{this.state.jobDetails.workAuthorization}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel pr-1">Respond By : </label>
                                                        <span className="formValue">{this.state.jobDetails.respondBy}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel pr-1">Client Manager : </label>
                                                        <span className="formValue">{this.state.jobDetails.clientManager}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel pr-1">Client Category : </label>
                                                        <span className="formValue">{this.state.jobDetails.clientCategory}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel pr-1">Interview Mode : </label>
                                                        <span className="formValue">{this.state.jobDetails.interviewMode}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel pr-1">Post Job on Career Portal : </label>
                                                        <span className="formValue">{this.state.jobDetails.careerPortalPublishedDate}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel pr-1">Domain : </label>
                                                        <span className="formValue">{this.state.jobDetails.domain}</span>
                                                    </div>
                                                </div>


                                                <div className="col-sm-4 float-left">
                                                    <div className="form-group">
                                                        <label className="formLabel pr-1">Job Start Date : </label>
                                                        <span className="formValue">{this.state.jobDetails.jobStartDate}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel pr-1">Turnaround Time : </label>
                                                        <span className="formValue">{this.state.jobDetails.turnAroundTime}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel pr-1">Duration : </label>
                                                        <span className="formValue">{this.state.jobDetails.duration}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel pr-1">Application Form : </label>
                                                        <span className="formValue">{this.state.jobDetails.applicationForm}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel pr-1">Expenses Paid : </label>
                                                        <span className="formValue">{this.state.jobDetails.jobExpensesPaid}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel pr-1">Priority : </label>
                                                        <span className="formValue">{this.state.jobDetails.jobPriority}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel pr-1">Zip Code : </label>
                                                        <span className="formValue">{this.state.jobDetails.zipcode}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel pr-1">Address : </label>
                                                        <span className="formValue">{this.state.jobDetails.address}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel pr-1">Job Type : </label>
                                                        <span className="formValue">{this.state.jobDetails.jobType}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel pr-1">Project Type : </label>
                                                        <span className="formValue">{this.state.jobDetails.projectType}</span>
                                                    </div>
                                                </div>


                                            </div>
                                        </div>


                                    </div>
                                    <div className={`tab-pane pt-3 pb-3 ${this.state.activeTab == 'snapshot' ? 'active' : ''}`} id="profile" role="tabpanel">
                                        <div className="p-1 card-body" >
                                            <div className="col-sm-12 pt-0 p-2">
                                                <h5 className="mb-0">Submissions</h5>
                                            </div>

                                            <Table className="align-items-center table-flush " responsive>
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th scope="col">Name</th>
                                                        <th scope="col">SUBMITTED BY</th>
                                                        <th scope="col">SUBMITTED ON</th>
                                                        <th scope="col">CONTACT</th>
                                                        <th scope="col">LOCATION</th>
                                                        <th scope="col">PAY RATE</th>
                                                        <th scope="col">WORK AUTH</th>
                                                        <th scope="col">STATUS</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                            {this.state.jobApplicationCount >=1?this.state.jobApplicationList.map((data)=>{
                                                                return <tr><td><a target={"_blank"} href={"../admin/viewCandidateDetails?candDetails="+data.candidateId}>{data.candidateName}</a></td><td>{data.createdBy}</td><td>{new Date(data.createdDate).toLocaleDateString()} {new Date(data.createdDate).toLocaleTimeString()}</td><td>{data.candidatePhone}</td><td>{data.candidateLocation}</td><td>{data.submissionRate!=0?data.submissionRate:"--"} {data.submissionRateType?"- "+data.submissionRateType:""}</td><td>{data.workAuthorization!=""?data.workAuthorization:"--"}</td><td>{data.submissionStatus}</td></tr>;
                                                            }): <tr><td colSpan="5" className="text-center">No Data Available</td> </tr>}
                                                        
                                                    </tbody>
                                           

                                            </Table>

                                            <div className="col-sm-12 pt-0 p-2">
                                                <h5 className="mb-0">Notes</h5>
                                            </div>

                                            <Table className="align-items-center table-flush " responsive>
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th scope="col">ADDED BY / ON</th>
                                                        <th scope="col">NOTES / DESCRIPTION</th>
                                                        <th scope="col">ACTION</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td colSpan="3" className="text-center">No Data Available</td>
                                                    </tr>
                                                </tbody>
                                            </Table>


                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </Row>
                </div>

                <div className="col-sm-3 pl-3 w-100 pr-0 mr-0 float-left">
                    <Card className="p-2 w-100">
                        <div className="col-sm-12 p-2">
                            <h4 className="mb-0 job-title">Search Factors</h4>
                        </div>
                        <div className="p-1 card-body">
                            <div className="col-sm-12">
                                <div className="form-group row mb-2">
                                    <textarea className="gray-bg form-control" value={this.state.searchFactors.keywords}></textarea>
                                </div>

                                <div className="form-group row mb-0 mt-3">
                                    <label className="control-label job-label">JOB TITLE</label>
                                    <input placeholder="" type="text" className="gray-bg form-control form-control-sm" value={this.state.searchFactors.jobTitle} />
                                </div>


                                <div className="form-group row mb-0 mt-3">
                                    <label className="control-label job-label">LOCATION DETAILS</label>
                                </div>

                                <div className="form-group row mb-2">
                                    <label className="control-label job-label">Country</label>
                                    <select className="form-control float-left gray-bg form-control-sm" value={this.state.searchFactors.country} name="workAuthorization" onChange={this.handleInput}>
                                        <option value="">select</option>
                                        {this.state.countriesList.map((data)=>{
                                            return <option value={data.name} key={data.id}>{data.name}</option>
                                        })}
                                    </select>

                                </div>


                                <div className="form-group  mb-2">
                                                <label className="control-label job-label">States</label>
                                                <div className="row searchFormstatesList">
                                                    <Multiselect
                                                        options={this.state.statesList} // Options to display in the dropdown
                                                        selectedValues={this.setSelectedValue(this.state.selectedStates1)} // Preselected value to 
                                                        //selectedValues={this.state.selectedStates} // Preselected value to persist in dropdown
                                                        onSelect={this.onSelectList} // Function will trigger on select event
                                                        onRemove={this.onRemoveList} // Function will trigger on remove event
                                                        displayValue="name" // Property name to display in the dropdown options
                                                        name="states"
                                                        showCheckbox="true"
                                                        placeholder="Select" className="w-100 gray-bg "
                                                    />
                                                </div>
                                            </div>



                                <div className="form-group row mb-2">
                                    <label className="control-label job-label">Experience</label>
                                </div>

                                <div className=" row mb-2">
                                    <div className="col-sm-6 p-0">
                                        <div className="input-group">
                                            <input placeholder="Min" value={this.state.searchFactors.minExperience} type="text" className="form-control form-control-sm" />
                                            <span className="input-group-text pt-0 pb-0 gp-text-span">to</span>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 p-0 pl-3">
                                        <div className="input-group">
                                            <input placeholder="Max" value={this.state.searchFactors.maxExperience} type="text" className="form-control form-control-sm" />
                                            <span className="input-group-text  pt-0 pb-0 gp-text-span">years</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group row mb-2">
                                    <label className="control-label job-label">Educational Details</label>
                                    <select className="form-control float-left gray-bg form-control-sm" value={this.state.searchFactors.educationDetails} name="workAuthorization" onChange={this.handleInput}>
                                        <option value="">select</option>
                                        <option value="Citizen">States 1</option>
                                    </select>
                                </div>
                                <div className="form-group row mb-2">
                                    <label className="control-label job-label">Work Authorization</label>
                                    <select className="form-control float-left gray-bg form-control-sm" value={this.state.searchFactors.workAuthorization} name="workAuthorization" onChange={this.handleInput}>
                                        <option value="">select</option>
                                        <option value="Citizen">States 1</option>
                                    </select>
                                </div>
                                <div className="form-group row mb-2">
                                    <label className="control-label job-label pt-2">Willing to Relocate</label>
                                    <div className="row pl-3">
                                        <div className="form-check form-check-inline">
                                            <input name="relocateFactorTrue" id="relocateFactorTrue" type="checkbox" className="form-check-input" onChange={this.handleInput} value="True" />
                                            <label className="form-check-label form-label" htmlFor="relocateFactorTrue">Yes</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input name="relocateFactorFalse" type="checkbox" id="relocateFactorFalse" className="form-check-input" value="False" onChange={this.handleInput} />
                                            <label className="form-check-label form-label" htmlFor="relocateFactorFalse" >No</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group row mb-2">
                                    <label className="control-label job-label pt-2">Clearance</label>
                                    <div className="row pl-3">
                                        <div className="form-check form-check-inline">
                                            <input name="clearanceFactorTrue" id="clearanceFactorTrue" type="checkbox" className="form-check-input" onChange={this.handleInput} value="True" />
                                            <label className="form-check-label form-label" htmlFor="clearanceFactorTrue">Yes</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input name="clearanceFactorFalse" type="checkbox" id="clearanceFactorFalse" className="form-check-input" value="False" onChange={this.handleInput} />
                                            <label className="form-check-label form-label" htmlFor="clearanceFactorFalse" >No</label>
                                        </div>
                                    </div>

                                </div>
                                <div className="form-group row mb-2">
                                    <button type="button" onClick={this.jobSearchProfiles} className="btn-icon btn-sm btn btn-primary">

                                        <span className="btn-inner--icon mr-1"><i className="fas fa-search"></i></span>
                                        <span className="btn-inner--text">Search</span>
                                    </button>


                                </div>


                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {(this.state.numberOfProfiles >= 1) ? <div className=""><Container className="mt-3" fluid>
                <Card className="shadow">
                    <CardHeader className="border-1 col-sm-12">
                        <div className="pagination float-left col-sm-8 pt-1" id="searchProfilesByJob">
                            <h4>{thisObj.state.numberOfProfiles} profiles found</h4>
                        </div>
                        {<div className="col-sm-3 float-right">
                            <div className="btn-group float-right">
                                {this.state.previous !== null ? <button type="button" onClick={(e) => thisObj.loadPrevious()} className="btn btn-outline-secondary"><i className="typcn typcn-chevron-left-outline "></i></button> : ""}
                                {this.state.next !== null ? <button type="button" onClick={(e) => thisObj.loadNext()} className="btn btn-outline-secondary"><i className="typcn typcn-chevron-right-outline "></i></button> : ""}
                            </div>
                        </div>}
                    </CardHeader>
                </Card></Container></div> : ""}
            {this.state.loading ? this.renderLoading() : ""}
            {!this.state.isPageloading ? profileList : this.renderLoading()}
            {(this.state.numberOfProfiles >= 1) ? <div className="col-sm-12"><div className="container-fluid">
                <div className="p-3" >
                    <div className="pagination float-left col-sm-8 pt-1">
                        <h4>{thisObj.state.numberOfProfiles} profiles found</h4>
                    </div>
                    {<div className="col-sm-3 float-right">
                        <div className="btn-group float-right">
                            {this.state.previous !== null ? <button type="button" onClick={(e) => thisObj.loadPrevious()} className="btn btn-outline-secondary"><i className="typcn typcn-chevron-left-outline "></i></button> : ""}
                            {this.state.next !== null ? <button type="button" onClick={(e) => thisObj.loadNext()} className="btn btn-outline-secondary"><i className="typcn typcn-chevron-right-outline "></i></button> : ""}
                        </div>
                    </div>}
                </div></div></div> : ""}
            {(this.state.searchingProfile) ? (<>{this.state.selectedProfiles.length >= 1 ? (<Card><div className="card-body cardfooter_1 my-shadow"><div className="col-sm-12 float-left  pl-0"><div className="col-sm-3 float-left  pl-0"><button type="button" className="btn-fill float-left btn btn-primary mr-2" onClick={this.sendEmailToCandidate}>Submit Candidate</button> <button type="button" className="btn-fill float-left btn btn-primary" onClick={this.sendEmailToCandidate}>Send Email</button></div><div className="col-sm-8 float-left  pl-0"><h4 className="text-black text-left pl-3"> Selected {this.state.selectedProfiles.length} Candidate(s)</h4></div></div></div></Card>) : ""}</>) : ""}

            {this.state.submitNewCandidate ? <><div className="card my-shadow">
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
                                    <input id="firstName" ref={this.state.fnameRef} name="firstName" type="text" className="form-control" placeholder="Firstname"
                                        onBlur={(e) => { this.state.newCandInfo.firstName = e.target.value; }}
                                    />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="lastName" className="col-lg-3 col-form-label"><code className="highlighter-rouge">*</code>Last Name</label>
                                <div className="col-lg-9">
                                    <input id="lastName" name="lastName" placeholder="Lastname" type="text" className="form-control" onBlur={(e) => { this.state.newCandInfo.lastName = e.target.value; }} />
                                </div>
                            </div>

                            <div className="row form-group ">
                                <div className="col-sm-12 float-left">
                                    <div className="form-group ">
                                        <label htmlFor="c_email" className="col-lg-3 float-left col-form-label"><code className="highlighter-rouge">*</code>Candidate Rate</label>
                                        <div className="col-sm-9  p-0 m-0  float-left">
                                            <div className="col-sm-4 float-left">
                                                <input id="b_rate"
                                                    name="b_rate"
                                                    type="number" placeholder="Rate"
                                                    className={classNames(c_email_classes)}
                                                    onBlur={(e) => { this.state.newCandInfo.b_rate = e.target.value; }}
                                                />
                                            </div>
                                            <div className="col-sm-4 float-left">
                                                <select class="form-control" onBlur={(e) => { this.state.newCandInfo.b_rate_type = e.target.value; }}>
                                                    <option value="">--</option>
                                                    <option value="Hourly">Hourly</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row form-group ">
                                <div className="col-sm-12 float-left">
                                    <div className="form-group ">
                                        <label htmlFor="c_email" className="col-lg-3 float-left col-form-label"><code className="highlighter-rouge">*</code>Submission Rate</label>
                                        <div className="col-sm-9  p-0 m-0  float-left">
                                            <div className="col-sm-4 float-left">
                                                <input id="s_rate"
                                                    name="s_rate"
                                                    type="number" placeholder="Rate"
                                                    className={classNames(c_email_classes)}
                                                    onBlur={(e) => { this.state.newCandInfo.s_rate = e.target.value; }}
                                                />
                                            </div>
                                            <div className="col-sm-4 float-left">
                                                <select class="form-control" onBlur={(e) => { this.state.newCandInfo.s_rate_type = e.target.value; }}>
                                                    <option value="">--</option>
                                                    <option value="Hourly">Hourly</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row form-group ">
                                <div className="col-sm-12 float-left">
                                    <div className="form-group ">
                                        <label htmlFor="c_email" className="col-lg-3 float-left col-form-label"><code className="highlighter-rouge">*</code>Client Rate</label>
                                        <div className="col-sm-9  p-0 m-0  float-left">
                                            <div className="col-sm-4 float-left">
                                                <input id="cl_rate"
                                                    name="cl_rate"
                                                    type="number" placeholder="Rate"
                                                    className={classNames(c_email_classes)}
                                                    onBlur={(e) => { this.state.newCandInfo.cl_rate = e.target.value; }}
                                                />
                                            </div>
                                            <div className="col-sm-4 float-left">
                                                <select class="form-control" onBlur={(e) => { this.state.newCandInfo.cl_rate_type = e.target.value; }}>
                                                    <option value="">--</option>
                                                    <option value="Hourly">Hourly</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="form-group row">
                                <label htmlFor="email" className="col-lg-3 col-form-label"><code className="highlighter-rouge">*</code>Email Address</label>
                                <div className="col-lg-9">
                                    <input id="email" name="email" placeholder="Email" type="email" className="form-control" onBlur={(e) => { this.state.newCandInfo.email = e.target.value; }} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="c_email" className="col-lg-3 col-form-label"><code className="highlighter-rouge">*</code>Confirm Email</label>
                                <div className="col-lg-9">
                                    <input id="c_email"
                                        name="c_email"
                                        type="email" placeholder="Confirmemail"
                                        className={classNames(c_email_classes)}
                                        onBlur={(e) => { this.state.newCandInfo.c_email = e.target.value; }}
                                    />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="country" className="col-lg-3 col-form-label"><code className="highlighter-rouge">*</code>Country</label>
                                <div className="col-lg-9">
                                    <input id="country" name="country" type="text" className="form-control" onBlur={(e) => { this.state.newCandInfo.country = e.target.value; }} placeholder="Country" />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="phone" className="col-lg-3 col-form-label"><code className="highlighter-rouge">*</code>Phone</label>
                                <div className="col-lg-9">
                                    <input id="phone" name="phone" type="number" className="form-control" onBlur={(e) => { this.state.newCandInfo.phone = e.target.value; }} placeholder="Phone" />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-5 bl-files ml-1 p-3 pl-2">
                            <label htmlFor="files" className=" col-form-label text-muted mb-0"><code className="highlighter-rouge">*</code>Select Resume, The supported file formats are DOCX, DOC, PDF and TXT</label>
                            <div className="col-lg-9">
                                <input id="files" name="files" type="file" className="" onChange={this.handleUpload} />
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" className="btn-sm" onClick={this.submitNewCandidateForm}>Add Candidate</Button>
                    <Button color="secondary" className="btn-sm" onClick={this.closeNewCandForm}>Cancel</Button>
                </ModalFooter></div></> : ""}

            {this.state.submitOldCandidate ? <><div className="card my-shadow">
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
                                        <input type="text" id="firstName" ref={this.state.oldcandidateDetailsRef} name="example-input2-group2" className="form-control" onBlur={(e) => { this.state.oldcandidateDetails = e.target.value; }} placeholder="Candidate Details" />
                                        <span className="input-group-append">
                                            <button type="button" onClick={this.findCandidateDetails} className="btn  btn-primary">Search</button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.getcandidatesList()}


                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" className="btn-sm" onClick={this.closeOldCandForm}>Cancel</Button>
                </ModalFooter></div></> : ""}


            <Modal isOpen={this.state.showResumeModal}>
                <ModalHeader>Resume Details</ModalHeader>
                <ModalBody className="resHeader resPreview"><div className="modalCon">
                    <IFrame src={this.state.candidateResumeDetails} loading={true} />
                </div></ModalBody>
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
                            {this.state.templatesList.length >= 1 ? this.state.templatesList.map(function (obj, index) { return <option key={index} value={obj.templateId}>{obj.templateCode}-{obj.templateName}</option> }) : ""}
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
                    <div >
                        <div className="card-body p-0 auth-header-box row">
                            <div className="text-center p-3">
                                <h4 className="mt-3 mb-1 font-weight-semibold font-18">Confirm Submit</h4>
                                <p className="text-muted  mb-0">If you wish to update the existing CV with a newer version select this candidates latest CV.</p>
                            </div>
                        </div>
                        <div className="clearfix"></div>
                        <div className="row col-lg-12">
                            <h5></h5>
                            <span className="badge bg-soft-secondary"></span>
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="form-group"><label className="control-label">Resume update</label>
                                        <input type="file" onChange={this.handleUpload} name="file" className="form-control no-border" />
                                    </div>
                                </div>
                            </div>
                            <small className="text-muted ml-2">The supported file formats are PDF, Text, Doc/Docx</small>
                        </div>
                        <div className="clearfix"></div>
                        <div className="row mb-2">
                            <div className="col-sm-12 pl-0">
                                <div className=" ">
                                    <label htmlFor="c_email" className="col-lg-4 float-left col-form-label text-left"><code className="highlighter-rouge">*</code>Candidate Rate</label>
                                    <div className="col-sm-8  p-0 m-0  float-left">
                                        <div className="col-sm-5 float-left">
                                            <input id="b_rate"
                                                name="b_rate"
                                                defaultValue={this.state.selectedCandidateBillRate}
                                                type="number" placeholder="Rate"
                                                className={classNames(c_email_classes)}
                                                onBlur={(e) => { this.state.selectedCandidateBillRate = e.target.value; }}
                                            />
                                        </div>
                                        <div className="col-sm-6 float-left">

                                            <select defaultValue={this.state.selectedCandidateBillRateType} class="form-control" onBlur={(e) => { this.state.selectedCandidateBillRateType = e.target.value; }}>
                                                <option value="">--</option>
                                                <option value="Hourly">Hourly</option>
                                            </select>


                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="row mb-2">
                            <div className="col-sm-12 pl-0">
                                <div className=" ">
                                    <label htmlFor="c_email" className="col-lg-4 float-left col-form-label text-left"><code className="highlighter-rouge">*</code>Submission Rate</label>
                                    <div className="col-sm-8  p-0 m-0  float-left">
                                        <div className="col-sm-5 float-left">
                                            <input id="b_rate"
                                                name="s_rate"
                                                type="number" placeholder="Rate"
                                                className={classNames(c_email_classes)}
                                                onBlur={(e) => { this.state.selectedCandidateSubmissionRate = e.target.value; }}
                                            />
                                        </div>
                                        <div className="col-sm-6 float-left">

                                            <select class="form-control" onBlur={(e) => { this.state.selectedCandidateSubmissionRateType = e.target.value; }}>
                                                <option value="">--</option>
                                                <option value="Hourly">Hourly</option>
                                            </select>


                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="row ">
                            <div className="col-sm-12 pl-0">
                                <div className=" ">
                                    <label htmlFor="c_email" className="col-lg-4 float-left col-form-label text-left"><code className="highlighter-rouge">*</code>Client Rate</label>
                                    <div className="col-sm-8  p-0 m-0  float-left">
                                        <div className="col-sm-5 float-left">
                                            <input id="b_rate"
                                                name="cl_rate"
                                                type="number" placeholder="Rate"
                                                className={classNames(c_email_classes)}
                                                onBlur={(e) => { this.state.selectedCandidateClientRate = e.target.value; }}
                                            />
                                        </div>
                                        <div className="col-sm-6 float-left">

                                            <select class="form-control" onBlur={(e) => { this.state.selectedCandidateClientRateType = e.target.value; }}>
                                                <option value="">--</option>
                                                <option value="Hourly">Hourly</option>
                                            </select>


                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>



                    </div>

                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" className="btn-sm" onClick={(e) => { this.setState({ oldProfileSubmitModal: false, oldcandidateId: 0 }) }}>Close</Button>


                    <button type="submit" onClick={(e) => { this.startSubmission(this.state.seletedCandidateId, this.state.jobDetails.id); }} title="Upload new resume" className="pull-left btn btn-primary btn-square btn-outline-dashed waves-effect waves-light">
                        <span className="btn-inner--icon"><i className="fa fa-upload"></i></span> Submit</button>


                </ModalFooter>
            </Modal>
            <Modal isOpen={this.state.scheduleInterviewModal}>
                <ModalHeader>Schedule Interview</ModalHeader>
                <ModalBody>
                    <div className="form-group row">
                        <label className="control-label col-sm-4">Select Date</label>
                        <input type="datetime-local" className="form-control form-control-sm col-sm-8" name="selectedEmailTemplate" onChange={(e) => this.setState({ interviewDate: e.target.value })} />
                    </div>
                    <div className="form-group row">
                        <label className="control-label col-sm-4">Timezone</label>
                        <select className="form-control form-control-sm col-sm-8" name="interviewTimezone" onChange={(e) => this.setState({ interviewTimezone: e.target.value })}>
                            <option>-select-</option>
                            <option value='GMT Greenwich Mean Time	GMT'>GMT - Greenwich Mean Time - GMT</option>
                            <option value='UTC Universal Coordinated Time GMT'>UTC - Universal Coordinated Time - GMT</option>
                            <option value='ECT European Central Time GMT+1:00'>ECT - European Central Time - GMT+1:00</option>
                            <option value='EET Eastern European Time GMT+2:00'>EET - Eastern European Time - GMT+2:00</option>
                            <option value='ART (Arabic) Egypt Standard Time GMT+2:00'>ART - (Arabic) Egypt Standard Time - GMT+2:00</option>
                            <option value='EAT Eastern African Time GMT+3:00'>EAT - Eastern African Time - GMT+3:00</option>
                            <option value='MET Middle East Time GMT+3:30'>MET - Middle East Time - GMT+3:30</option>
                            <option value='NET Near East Time	GMT+4:00'>NET - Near East Time -GMT+4:00</option>
                            <option value='PLT Pakistan Lahore Time GMT+5:00'>PLT - Pakistan Lahore Time - GMT+5:00</option>
                            <option value='IST India Standard Time GMT+5:30'>IST - India Standard Time - GMT+5:30</option>
                            <option value='BST Bangladesh Standard Time GMT+6:00'>BST - Bangladesh Standard Time - GMT+6:00</option>
                            <option value='VST Vietnam Standard Time GMT+7:00'>VST - Vietnam Standard Time - GMT+7:00</option>
                            <option value='CTT China Taiwan Time GMT+8:00'>CTT - China Taiwan Time - GMT+8:00</option>
                            <option value='JST Japan Standard Time GMT+9:00'>JST - Japan Standard Time - GMT+9:00</option>
                            <option value='ACT Australia Central Time	GMT+9:30'>ACT - Australia Central Time - GMT+9:30</option>
                            <option value='AET Australia Eastern Time	GMT+10:00'>AET - Australia Eastern Time -	GMT+10:00</option>
                            <option value='SST Solomon Standard Time GMT+11:00'>SST - Solomon Standard Time - GMT+11:00</option>
                            <option value='NST New Zealand Standard Time GMT+12:00'>NST - New Zealand Standard Time - GMT+12:00</option>
                            <option value='MIT Midway Islands Time GMT-11:00'>MIT - Midway Islands Time - GMT-11:00</option>
                            <option value='HST Hawaii Standard Time GMT-10:00'>HST - Hawaii Standard Time - GMT-10:00</option>
                            <option value='AST Alaska Standard Time GMT-9:00'>AST - Alaska Standard Time - GMT-9:00</option>
                            <option value='PST Pacific Standard Time GMT-8:00'>PST - Pacific Standard Time - GMT-8:00</option>
                            <option value='PNT Phoenix Standard Time GMT-7:00'>PNT - Phoenix Standard Time - GMT-7:00</option>
                            <option value='MST Mountain Standard Time	GMT-7:00'>MST - Mountain Standard Time - GMT-7:00</option>
                            <option value='CST Central Standard Time GMT-6:00'>CST - Central Standard Time - GMT-6:00</option>
                            <option value='EST Eastern Standard Time GMT-5:00'>EST - Eastern Standard Time - GMT-5:00</option>
                            <option value='IET Indiana Eastern Standard Time	GMT-5:00'>IET - Indiana Eastern Standard Time -	GMT-5:00</option>
                            <option value='PRT Puerto Rico and US Virgin Islands Time	GMT-4:00'>PRT - Puerto Rico and US Virgin Islands Time - GMT-4:00</option>
                            <option value='CNT Canada Newfoundland Time GMT-3:30'>CNT - Canada Newfoundland Time - GMT-3:30</option>
                            <option value='AGT Argentina Standard Time GMT-3:00'>AGT - Argentina Standard Time - GMT-3:00</option>
                            <option value='BET Brazil Eastern Time GMT-3:00'>BET - Brazil Eastern Time - GMT-3:00</option>
                            <option value='CAT Central African Time	GMT-1:00'>CAT - Central African Time - GMT-1:00</option>

                        </select>
                    </div>

                    <div className="form-group row">
                        <label className="control-label col-sm-4">Attendees</label>
                        <input type="text" className="form-control form-control-sm col-sm-8" name="selectedEmailTemplate" onChange={(e) => this.setState({ interviewAttendees: e.target.value })} placeholder="Interview participants" />
                    </div>
                    <div className="form-group row">
                        <label className="control-label col-sm-4">Channel</label>
                        <input type="text" className="form-control form-control-sm col-sm-8" name="selectedEmailTemplate" onChange={(e) => this.setState({ interviewChannel: e.target.value })} placeholder="Mode of Interview" />
                    </div>
                    <div className="form-group row">
                        <label className="control-label col-sm-4">Comments</label>
                        <textarea type="text" className="form-control form-control-sm col-sm-8" name="selectedEmailTemplate" onChange={(e) => this.setState({ interviewComments: e.target.value })} placeholder="Comments any" />
                    </div>

                </ModalBody>
                <ModalFooter>
                    <Button color="primary" className="btn-sm" onClick={(e) => { this.scheduleInterview(); }}>Schedule</Button>
                    <Button color="secondary" className="btn-sm" onClick={() => this.setState({ scheduleInterviewModal: false })}>Close</Button>
                </ModalFooter>
            </Modal>
        </>);
    }
}
export default ViewJobDetails;