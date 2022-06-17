import React, { Component } from "react";
import {
    Container,
    Row,
    Col,
    Card, Spinner
} from "reactstrap";
import ReactQuill from "react-quill";
import { Multiselect } from 'multiselect-react-dropdown';
import Cookies from 'universal-cookie';
import { CKEditor } from 'ckeditor4-react';
import Swal from 'sweetalert2';
import { jobDetailsURL, apiUrl, addNewJob, updateJobDetails, candidateGetUrl } from "../../variables/Variables.jsx";
import Common from "../commons/Common"



const userType = new Common().getUserType();

const axios = require("axios").default;
const cookies = new Cookies();
class EditJobDetails extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            clientManagerError:false,
            jobCode: "",
            payRateCurrency: "",
            payRateMinValue: 0.0,
            payRateMaxValue: 0.0,
            payRateFrequency: "",
            payRateTaxTerms: "",
            respondBy: "",
            country: "",
            zipcode: 0,
            requiredHours: 0.0,
            endClient: "",
            turnAroundTime: 0.0,
            duration: "",
            workAuthorization: "",
            applicationForm: "",
            placementFeePercentage: 0.0,
            projectType: "",
            jobTitle: "",
            jobStartDate: "",
            jobClient: "",
            isRemoteJob: "False",
            jobStatus: "Active",
            clientId: "",
            client: "",
            clientJobId: "",
            jobPriority: "",
            addtnDetails: "",
            internalRef: "",
            jobTvop: "",
            clientBillRateCurrency: "",
            clientBillRateValue: 0.0,
            clientBillRateFrequency: "",
            clientBillRateTaxTerms: "",
            endDate: "",
            jobExpensesPaid: "",
            jobLocationCity: "",
            jobType: "",
            clientManager: "",
            jobRequiredDocuments: "",
            clientCategory: "",
            areaCode: "",
            interviewMode: "",
            address: "",
            domain: "",
            jobDescription: "",
            selectedStates: "",
            turnAroundTimeFrequency: "",
            skillsIndustry: "",
            skillsEvaluationTemplate: "",
            skillsLanguage: "",
            skillsDegree: "",
            skillsPrimary: "",
            skillsMinExperience: 0,
            skillsMaxExperience: 0,
            skillsSecondarySkills: "",
            orgInfoNoOfPositions: 0,
            orgInfoSalesManager: "",
            orgInfoAccountManager: "",
            orgInfoComments: "",
            orgInfoMaxAllowedSubmissions: 0,
            orgInfoDepartment: "",
            orgInfoAssignedTo: "",
            orgInfoAddtionalNotification: "",
            orgInfoTaxTerms: "",
            orgInfoRecruitmentManager: "",
            orgInfoPrimaryRecruiter: "",
            careerPortalPublishedDate: "",
            statesList: [],//axios.get(apiUrl+"getAllStatesList"),
            countriesList: [],//axios.get(apiUrl+"getAllCountriesList"),
            usersList:[],
            degreesList:[],
            sess_id:cookies.get("c_csrftoken")

        }
        this.jobRequiredDocumentsList = [{ "name": "Driving License" }, { "name": "EML File" }, { "name": "Passport" }, { "name": "Resume" }, { "name": "SSN" }, { "name": "Transcripts" }];

        this.genderOptions = ["Select gender", "Male", "Female", "Others"];
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleJobDescription = this.handleJobDescription.bind(this);
        this.onSelectList = this.onSelectList.bind(this);
        this.onRemoveList = this.onRemoveList.bind(this);
        this.onSelectRequiredDocList = this.onSelectRequiredDocList.bind(this);
        this.onSelectRequiredTaxTerms = this.onSelectRequiredTaxTerms.bind(this);
        this.setSelectedValue = this.setSelectedValue.bind(this);
        this.onSelectAddtnNotifications = this.onSelectAddtnNotifications.bind(this);
        this.onSelectDocList = this.onSelectDocList.bind(this);
        this.onSelectRequiredIndustryList = this.onSelectRequiredIndustryList.bind(this);
        this.onSelectRequiredLanguageList = this.onSelectRequiredLanguageList.bind(this);
        this.setDateFormat = this.setDateFormat.bind(this);
        this.zeroPad = this.zeroPad.bind(this);
        this.filterState = this.filterState.bind(this);
    }
    setDateFormat(toSetDate) {
        if (toSetDate !== "" && toSetDate !== null) {
            var daObj = new Date(toSetDate);
            return daObj.getFullYear() + '-' + this.zeroPad((daObj.getMonth() + 1), 2) + '-' + this.zeroPad(daObj.getDate(), 2);
        }
    }
    zeroPad(num, places) {
        var zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    }
    setSelectedValue(values) {
        if (values !== "") {
            var splits_ = [];
            values.split(', ').forEach(function (ind, val) {
                splits_.push({ name: ind, id: val });
            });
            return splits_;
            //this.state.orgInfoTaxTerms
        }
    }
    filterState(countryId){
        if(countryId !== null || typeof countryId !=="undefined")
            axios.get(apiUrl + "getAllStatesList",{params:{countryId:countryId}})
            .then(({ data }) => {
                this.setState({ statesList: data })
            })
            .catch((err) => { })
    }
    componentDidMount() {
        axios.all([
            axios.get(apiUrl + "getAllDegreesLsit",{//1
                params: {
                    sess_id: this.state.sess_id
                }
            }),
            axios.get(apiUrl + "getSelectClientsList",{//2
                params: {
                    sess_id: this.state.sess_id
                }
            }),
            axios.get(apiUrl + "getSelectUsersList",{//3
                params: {
                    sess_id: this.state.sess_id
                }
            }),
            axios.get(apiUrl + "getAllStatesList"),//4
            axios.get(apiUrl + "getAllCountriesList"),//5
            axios.get(apiUrl + "getJobCommonData"),//6
            axios.get(apiUrl + "getJobDetails", {//7
                params: {
                    jobId: (new URLSearchParams(window.location.search)).get("jobId"),
                    sess_id: this.state.sess_id
                }
            })
        ]).then(axios.spread((degreesList, clientsList, usersList, statesList, countriesList, jobCommonData, jobDetails) =>{
         
                if(usersList.status == 200 && usersList.data.statusResponse){
                  //  this.setState({usersList:usersList.data.degreeList});
                    this.setState({usersList:usersList.data.data});
                }
                if(degreesList.status == 200 && degreesList.data.statusResponse){
                    //  this.setState({usersList:usersList.data.degreeList});
                      this.setState({degreesList:degreesList.data.degreeList});
                  }

                if(clientsList.status == 200 && clientsList.data.statusResponse){
                    this.setState({clientsList:clientsList.data.data});
                }

                if(statesList.status == 200){
                    this.setState({statesList:statesList.data});
                }
              
                if(countriesList.status == 200){
                    this.setState({countriesList:countriesList.data});
                }
                if(jobCommonData.status == 200 && jobCommonData.data.statusResponse){
                    this.setState({ jobCode: jobCommonData.jobCode, internalRef: jobCommonData.internalRef })
                }
             

                if(jobDetails.status == 200 && jobDetails.data.statusResponse){
                    let timerInterval;
                    let jobdets = jobDetails.data.jobDetails;
                    var start = new Date().getTime();

                    this.setState({
                        id:jobdets.id
                        ,jobCode:jobdets.jobCode
                        ,payRateCurrency:jobdets.payRateCurrency
                        ,payRateMinValue:jobdets.payRateMinValue
                        ,payRateMaxValue:jobdets.payRateMaxValue
                        ,payRateFrequency:jobdets.payRateFrequency
                        ,payRateTaxTerms:jobdets.payRateTaxTerms
                        ,respondBy:jobdets.respondBy
                        ,country:jobdets.country
                        ,zipcode:jobdets.zipcode
                        ,requiredHours:jobdets.requiredHours
                        ,endClient:jobdets.endClient
                        ,duration:jobdets.duration
                        ,workAuthorization:jobdets.workAuthorization
                        ,applicationForm:jobdets.applicationForm
                        ,placementFeePercentage:jobdets.placementFeePercentage
                        ,projectType:jobdets.projectType
                        ,jobTitle:jobdets.jobTitle
                        ,jobStartDate:jobdets.jobStartDate
                        ,isRemoteJob:jobdets.isRemoteJob
                        ,jobStatus:jobdets.jobStatus
                        ,clientId:jobdets.clientId
                        ,jobClient:jobdets.jobClient
                        ,clientJobId:jobdets.clientJobId
                        ,jobPriority:jobdets.jobPriority
                        ,addtnDetails:jobdets.addtnDetails
                        ,internalRef:jobdets.internalRef
                        ,jobTvop:jobdets.jobTvop
                        ,clientBillRateCurrency:jobdets.clientBillRateCurrency
                        ,clientBillRateValue:jobdets.clientBillRateValue
                        ,clientBillRateFrequency:jobdets.clientBillRateFrequency
                        ,clientBillRateTaxTerms:jobdets.clientBillRateTaxTerms
                        ,endDate:jobdets.endDate
                        ,jobExpensesPaid:jobdets.jobExpensesPaid
                        ,jobLocationCity:jobdets.jobLocationCity
                        ,jobType:jobdets.jobType
                        ,clientManager:jobdets.clientManager
                        ,clientManagerId:jobdets.clientManagerId
                        ,jobRequiredDocuments:jobdets.jobRequiredDocuments
                        ,clientCategory:jobdets.clientCategory
                        ,areaCode:jobdets.areaCode
                        ,interviewMode:jobdets.interviewMode
                        ,address:jobdets.address
                        ,domain:jobdets.domain
                        ,jobDescription:jobdets.jobDescription
                        ,selectedStates:jobdets.selectedStates
                        ,turnAroundTime:jobdets.turnAroundTime
                        ,turnAroundTimeFrequency:jobdets.turnAroundTimeFrequency
                        ,skillsIndustry:jobdets.skillsIndustry
                        ,skillsEvaluationTemplate:jobdets.skillsEvaluationTemplate
                        ,skillsLanguage:jobdets.skillsLanguage
                        ,skillsDegree:jobdets.skillsDegree
                        ,skillsPrimary:jobdets.skillsPrimary
                        ,skillsMaxExperience:jobdets.skillsMaxExperience
                        ,skillsMaxExperience:jobdets.skillsMaxExperience
                        ,skillsSecondarySkills:jobdets.skillsSecondarySkills
                        ,orgInfoNoOfPositions:jobdets.orgInfoNoOfPositions
                        ,orgInfoSalesManager:jobdets.orgInfoSalesManager
                        ,orgInfoSalesManagerId:jobdets.orgInfoSalesManagerId
                        ,orgInfoAccountManager:jobdets.orgInfoAccountManager
                        ,orgInfoAccountManagerId:jobdets.orgInfoAccountManagerId
                        ,orgInfoComments:jobdets.orgInfoComments
                        ,orgInfoMaxAllowedSubmissions:jobdets.orgInfoMaxAllowedSubmissions
                        ,orgInfoDepartment:jobdets.orgInfoDepartment
                        ,orgInfoAssignedTo:jobdets.orgInfoAssignedTo
                        ,orgInfoAddtionalNotification:jobdets.orgInfoAddtionalNotification
                        ,orgInfoTaxTerms:jobdets.orgInfoTaxTerms
                        ,orgInfoRecruitmentManager:jobdets.orgInfoRecruitmentManager
                        ,orgInfoRecruitmentManagerId:jobdets.orgInfoRecruitmentManagerId
                        ,orgInfoPrimaryRecruiter:jobdets.orgInfoPrimaryRecruiter
                        ,orgInfoPrimaryRecruiterId:jobdets.orgInfoPrimaryRecruiterId
                        ,careerPortalPublishedDate:jobdets.careerPortalPublishedDate
                    });

                }else{
                    var errMsg = "";
                    Swal.fire('Error', "Error fetching details", 'error'); return;
                }
        }));
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
    onSelectRequiredDocList(selectedList, selectedItem) {
        let sts = []
        for (var i = 0; i < selectedList.length; i++) {
            sts[i] = (selectedList[i].name);
        }
        let sts_ = sts.join(", ");
        this.state.jobRequiredDocuments = sts_;
    }
    onSelectRequiredTaxTerms(selectedList, selectedItem) {
        let sts = []
        for (var i = 0; i < selectedList.length; i++) {
            sts[i] = (selectedList[i].name);
        }
        let sts_ = sts.join(", ");
        this.state.orgInfoTaxTerms = sts_;
    }

    onSelectAddtnNotifications(selectedList, selectedItem) {
        let sts = []
        for (var i = 0; i < selectedList.length; i++) {
            sts[i] = (selectedList[i].name);
        }
        let sts_ = sts.join(", ");
        this.state.orgInfoAddtionalNotification = sts_;
    }
    onSelectDocList(selectedList, selectedItem) {
        let sts = []
        for (var i = 0; i < selectedList.length; i++) {
            sts[i] = (selectedList[i].name);
        }
        let sts_ = sts.join(", ");
        this.state.skillsDegree = sts_;
    }
    onSelectRequiredIndustryList(selectedList, selectedItem) {
        let sts = []
        for (var i = 0; i < selectedList.length; i++) {
            sts[i] = (selectedList[i].name);
        }
        let sts_ = sts.join(", ");
        this.state.skillsIndustry = sts_;
    }
    onSelectRequiredLanguageList(selectedList, selectedItem) {
        let sts = []
        for (var i = 0; i < selectedList.length; i++) {
            sts[i] = (selectedList[i].name);
        }
        let sts_ = sts.join(", ");
        this.state.skillsLanguage = sts_;
    }

    onSelectList(selectedList, selectedItem) {
        let sts = []
        for (var i = 0; i < selectedList.length; i++) {
            sts[i] = (selectedList[i].name);
        }
        let sts_ = sts.join(", ");
        this.state.selectedStates = sts_;
    }

    onRemoveList(selectedList, removedItem) {
        let sts = []
        for (var i = 0; i < selectedList.length; i++) {
            sts[i] = (selectedList[i].name);
        }
        let sts_ = sts.join(", ");
        this.state.selectedStates = sts_;
    }

    render() {
        return this.state.jobTitle === "" ? (<div className="header bg-gradient-info pb-2 pt-5 pt-md-8">
        <Container fluid>
            
            <div className="header-body">
                <Row>
                    <Col lg="12" xl="12"><center><Spinner style={{ width: '3rem', height: '3rem' }} type="grow" /></center>
                    </Col>
                </Row>
            </div>
        </Container>
    </div>) :<> <div className="row ss" >
                <div className="col-sm-12">
                    <div className="page-title-box">
                        <div className="row pl-2">
                            <div className="col ">
                                <h4 className="page-title ">Job Management</h4>
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="javascript:void(0);">Update Jobdetails</a></li>
                                </ol>
                            </div>
                            <div className="col-auto align-self-center">
                                <a href={'../admin/manageJobs'} className="btn-icon btn btn-sm btn-outline-secondary" style={{ marginRight: 10 + 'px' }}>
                                    <span className="btn-inner--icon mr-1"><i className="far fa-arrow-alt-circle-left"></i></span>
                                    <span className="btn-inner--text">Cancel</span>
                                </a>
                                <button type="button" onClick={this.handleSubmit} className="btn-icon btn-sm btn btn-primary">

                                    <span className="btn-inner--icon mr-1"><i className="fas fa-save"></i></span>
                                    <span className="btn-inner--text">Update</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Container fluid >
                <div className="header-body">
                    {/* Card stats */}
                </div>
            </Container>
            <div className="mb-5">
                {/* Table */}
                <Row>
                    <div className="col p-0">
                        <Card className="p-2">
                            <form className="p-3">
                                <div className="row pt-1">
                                    <div className="col-sm-12">
                                        <h5>Job Details</h5>
                                    </div>
                                </div>
                                <div className="row ">
                                    <div className="col-sm-12">
                                        <div className="col-sm-3 mr-lg-4 float-left">
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Job Code<span className="text-danger pl-1">*</span></label>
                                                <input placeholder="" type="text" className="gray-bg form-control" value={this.state.jobCode} disabled />
                                            </div>
                                            <div className="form-group row mb-1">
                                                <label className="control-label job-label">Pay Rate / Salary</label>
                                                <div className="input-group form-group">
                                                    <select className="input-group-select  form-control-select gray-bg form-control-sm col-sm-2" name="payRateCurrency" value={this.state.payRateCurrency} onChange={this.handleInput}>
                                                        <option value="">select</option>
                                                        <option value="USD">USD</option>
                                                    </select>
                                                    <input type="number" autoComplete="new" className="form-control gray-bg ml-1 form-control-sm col-sm-2" required name="payRateMinValue" placeholder="Min" value={this.state.payRateMinValue} onChange={this.handleInput} />
                                                    <input type="number" autoComplete="new" placeholder="Max" className="form-control gray-bg ml-1 form-control-sm col-sm-2" required name="payRateMaxValue" value={this.state.payRateMaxValue} onChange={this.handleInput} />
                                                    <select className="input-group-select gray-bg form-control-select form-control-sm ml-2 col-sm-3" name="payRateFrequency" value={this.state.payRateFrequency} onChange={this.handleInput}>
                                                        <option value="">select</option>
                                                        <option value="Hourly">Hourly</option>
                                                        <option value="Daily">Daily</option>
                                                        <option value="Weekly">Weekly</option>
                                                        <option value="Bi-Weekly">Bi-Weekly</option>
                                                        <option value="Monthly">Monthly</option>
                                                        <option value="Yearly">Yearly</option>
                                                    </select>
                                                    <select className="input-group-select gray-bg form-control-sm form-control-select ml-2 col-sm-3" name="payRateTaxTerms" value={this.state.payRateTaxTerms} onChange={this.handleInput}>
                                                        <option value="">select</option>
                                                        <option value="1099">1099</option>
                                                        <option value="C2C">C2C</option>
                                                        <option value="C2H">C2H</option>
                                                        <option value="Fulltime">Fulltime</option>
                                                        <option value="Intern">Intern</option>
                                                        <option value="Other">Other</option>
                                                        <option value="Part Time">Part Time</option>
                                                        <option value="Other">Other</option>
                                                        <option value="W2">W2</option>
                                                    </select>
                                                </div>



                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Respond By</label>
                                                <select className="form-control form-control-select gray-bg" name="respondBy" value={this.state.respondBy} onChange={this.handleInput}>
                                                    <option value=""></option>
                                                    <option value="Open Untill Filled">Open Untill Filled</option>
                                                    <option value="Date Option">Date Option</option>
                                                </select>
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Country</label>
                                                <select className="form-control form-control-select gray-bg" name="country" value={this.state.country} onChange={this.handleInput} onBlur={(e)=>this.filterState(e.target.value)}>
                                                    <option value="">select</option>
                                                    {this.state.countriesList.map((data)=>{
                                                        return <option value={data.id}>{data.name}</option>
                                                    })}
                                                </select>
                                            </div>

                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Zip Code</label>
                                                <input placeholder="" type="number" className="form-control gray-bg" name="zipcode" value={this.state.zipcode} onChange={this.handleInput} />
                                            </div>

                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Required Hours/Week</label>
                                                <input placeholder="" type="number" name="requiredHours" className="form-control gray-bg" value={this.state.requiredHours} onChange={this.handleInput} />
                                            </div>

                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">End Client</label>
                                                <input placeholder="" type="text" name="endClient" className="form-control gray-bg" value={this.state.endClient} onChange={this.handleInput} />


                                            </div>

                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Turnaround Time</label>
                                                <div className="input-group">
                                                    <input placeholder="" type="number" name="turnAroundTime" className="form-control gray-bg mr-2 col-sm-5 float-left" value={this.state.turnAroundTime} onChange={this.handleInput} />

                                                    <select className="form-control col-sm-5 ml-2 gray-bg float-left" value={this.state.turnAroundTimeFrequency} name="turnAroundTimeFrequency" onChange={this.handleInput}>
                                                        <option value="">select</option>
                                                        <option value="In Days">In Days</option>
                                                        <option value="In Hours">In Hours</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Duration</label>
                                                <input placeholder="" type="text" name="duration" className="form-control gray-bg" value={this.state.duration} onChange={this.handleInput} />
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Work Authorization</label>
                                                <select className="form-control float-left gray-bg" value={this.state.workAuthorization} name="workAuthorization" onChange={this.handleInput}>
                                                    <option value="">select</option>
                                                    <option value="H1-B">H1-B</option>
                                                    <option value="L1-B">L1-B</option>
                                                    <option value="L1-A">L1-A</option>
                                                    <option value="L2-EAD">L2-EAD</option>
                                                </select>
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Application Form</label>
                                                <select className="form-control float-left gray-bg" name="applicationForm" value={this.state.applicationForm} onBlur={this.handleInput}>
                                                    <option value="">select</option>
                                                    <option value="General Application">General Application</option>
                                                </select>

                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Placement Fee Percentage</label>
                                                <input placeholder="" type="number" className="form-control gray-bg" name="placementFeePercentage" value={this.state.placementFeePercentage} onChange={this.handleInput} />
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Project Type</label>
                                                <select className="form-control float-left gray-bg" name="projectType" value={this.state.projectType} onChange={this.handleInput}>
                                                    <option value="">select</option>
                                                </select>

                                            </div>

                                        </div>

                                        <div className="col-sm-4 mr-2 ml-5 float-left">
                                            <div className="form-group  mb-2">
                                                <label className="control-label job-label">Job Title<span className="text-danger pl-1">*</span></label>
                                                <input placeholder="" type="text" className="form-control gray-bg" name="jobTitle" value={this.state.jobTitle} onChange={this.handleInput} />
                                            </div>
                                            <div className="form-group  mb-2">
                                                <label className="control-label job-label">Job Start Date</label>
                                                <input placeholder="" type="date" className="form-control gray-bg" name="jobStartDate" value={this.setDateFormat(this.state.jobStartDate) || ''} onChange={this.handleInput} />

                                            </div>

                                            <div className="form-group  mb-3 mt-3">
                                                <label className="control-label job-label">Remote Job<span className="text-danger pl-1">*</span></label>
                                                <div className="row pl-3">
                                                    <div className="form-check form-check-inline">
                                                        <input name="isRemoteJob" id="radio1" type="radio" className="form-check-input" onChange={this.handleInput} value="True" /> <label className="form-check-label form-label" htmlFor="radio1">Yes</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input name="isRemoteJob" type="radio" id="radio2" checked className="form-check-input" value="False" onChange={this.handleInput} /> <label className="form-check-label form-label" htmlFor="radio2" >No</label>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="form-group  mb-2">
                                                <label className="control-label job-label">States<span className="text-danger pl-1">*</span></label>
                                                <div className="row">
                                                    <Multiselect
                                                        options={this.state.statesList} // Options to display in the dropdown
                                                        selectedValues={this.setSelectedValue(this.state.selectedStates)} // Preselected value to 
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
                                            <div className="form-group row mb-3">
                                                <label className="control-label job-label">Job Status<span className="text-danger pl-1">*</span></label>
                                                <select className="form-control float-left gray-bg" name="jobStatus" onChange={this.handleInput}>
                                                    <option value="">select</option>
                                                    <option value="Active" selected>Active</option>
                                                    <option value="Closed">Closed</option>
                                                    <option value="Filled">Filled</option>
                                                    <option value="Hold by Client">Hold by Client</option>
                                                    <option value="On Hold">On Hold</option>
                                                </select>

                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Client<span className="text-danger pl-1">*</span></label>
                                                <select className="form-control float-left gray-bg" name="jobClient"value={this.state.jobClient} onChange={this.handleInput}>
                                                    <option value="">select</option>
                                                 
                                                    {this.state.clientsList.length >=1?this.state.clientsList.map(function(data){
                                                        return <option value={data.pk}>{data.fields.clientName}</option>
                                                    }):""}

                                                </select>
                                            </div>
                                            <div className="form-group  row mb-2">
                                                <label className="control-label job-label">Client Job ID</label>
                                                <input placeholder="" type="text" name="clientJobId" className="form-control gray-bg" value={this.state.clientJobId} onChange={this.handleInput} />
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Priority</label>
                                                <select className="form-control float-left gray-bg" name="jobPriority" value={this.state.jobPriority} onChange={this.handleInput}>
                                                    <option value="">select</option>
                                                    <option value="Critical">Critical</option>
                                                    <option value="High">High</option>
                                                    <option value="Low">Low</option>
                                                    <option value="Medium">Medium</option>
                                                </select>
                                            </div>

                                            <div className="form-group mb-2 row">
                                                <label className="control-label job-label">Additional Details</label>
                                                <input placeholder="" type="text" className="form-control gray-bg" name="addtnDetails" value={this.state.addtnDetails} onChange={this.handleInput} />
                                            </div>
                                            <div className="form-group mb-2  row">
                                                <label className="control-label job-label">Internal Ref #</label>
                                                <input placeholder="" type="text" className="form-control gray-bg" defaultValue={this.state.internalRef} disabled />
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">TVOP</label>
                                                <input placeholder="" type="text" className="form-control gray-bg" defaultValue={this.state.jobTvop} onBlur={(e) => { this.state.jobTvop = e.target.value; }} />
                                            </div>

                                        </div>
                                        <div className="col-sm-4 float-right mb-0">
                                            <div className="form-group row mb-0 ">
                                                <label className="control-label job-label">Client Bill Rate / Salary</label>

                                                <div className="input-group form-group">
                                                    <select className="input-group-select gray-bg form-control-select form-control-sm col-sm-3" name="clientBillRateCurrency" value={this.state.clientBillRateCurrency} onChange={this.handleInput}>
                                                        <option value="">select</option>
                                                        <option value="USD">USD</option>
                                                    </select>

                                                    <input type="number" autoComplete="new" className="form-control ml-2 gray-bg form-control-sm col-sm-3" required name="clientBillRateValue" value={this.state.clientBillRateValue} autoComplete="new" onChange={this.handleInput} />

                                                    <select className="input-group-select form-control-select gray-bg form-control-select form-control-sm ml-2 col-sm-3" name="clientBillRateFrequency" value={this.state.clientBillRateFrequency} onChange={this.handleInput}>
                                                        <option value="">select</option>
                                                        <option value="Hourly">Hourly</option>
                                                        <option value="Daily">Daily</option>
                                                        <option value="Weekly">Weekly</option>
                                                        <option value="Bi-Weekly">Bi-Weekly</option>
                                                        <option value="Monthly">Monthly</option>
                                                        <option value="Yearly">Yearly</option>
                                                    </select>

                                                    <select className="input-group-select form-control-select gray-bg form-control-sm ml-2 col-sm-3" name="clientBillRateTaxTerms" value={this.state.clientBillRateTaxTerms} onChange={this.handleInput}>
                                                        <option value="">select</option>
                                                        <option value="1099">1099</option>
                                                        <option value="C2C">C2C</option>
                                                        <option value="C2H">C2H</option>
                                                        <option value="Fulltime">Fulltime</option>
                                                        <option value="Intern">Intern</option>
                                                        <option value="Other">Other</option>
                                                        <option value="Part Time">Part Time</option>
                                                        <option value="Other">Other</option>
                                                        <option value="W2">W2</option>
                                                    </select>



                                                </div>

                                            </div>

                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Job End Date</label>
                                                <input placeholder="" type="date" className="form-control gray-bg" name="endDate" value={this.setDateFormat(this.state.endDate) || ''} onChange={this.handleInput} />
                                            </div>

                                            <div className="form-group row  mb-2">
                                                <label className="control-label job-label">Expenses Paid<span className="text-danger pl-1">*</span></label>

                                                <select className="form-control form-control-select gray-bg" name="jobExpensesPaid" value={this.state.jobExpensesPaid} onChange={this.handleInput}>
                                                    <option value="" selected>select</option>
                                                    <option value="Yes">Yes</option>
                                                    <option value="No" >No</option>
                                                </select>


                                            </div>
                                            <div className="form-group row  mb-2">
                                                <label className="control-label job-label">City<span className="text-danger pl-1">*</span></label>
                                                <input placeholder="" type="text" className="form-control gray-bg" defaultValue={this.state.jobLocationCity} onBlur={(e) => { this.state.jobLocationCity = e.target.value; }} onChange={this.handleInput} />
                                            </div>
                                            <div className="form-group  row mb-2 ">
                                                <label className="control-label job-label">Job Type</label>
                                                <select className=" form-control-select form-control gray-bg" name="jobType" value={this.state.jobType} onChange={this.handleInput}>
                                                    <option value="">select</option>
                                                    <option value="Fulltime">Fulltime</option>
                                                    <option value="Contract">Contract</option>
                                                    <option value="Partime">Partime</option>
                                                </select>


                                            </div>
                                            <div className="form-group row mb-2 mt-3">
                                                <label className="control-label job-label">Client Manager</label>
                                                <input placeholder="" name="clientManager" type="text" className="form-control gray-bg" defaultValue={this.state.clientManager} onBlur={this.handleInput} />
                                            
                                            </div>

                                            <div className="form-group  row mb-2">
                                                <label className="control-label job-label">Required Documents</label>
                                                <div className="col-sm-12 p-0">
                                                    <Multiselect className="form-control-sm w-100 gray-bg"
                                                        options={this.jobRequiredDocumentsList} // Options to display in the dropdown
                                                        selectedValues={this.setSelectedValue(this.state.jobRequiredDocuments)} // Preselected value to 
                                                        //selectedValues={this.state.selectedStates} // Preselected value to persist in dropdown
                                                        onSelect={this.onSelectRequiredDocList} // Function will trigger on select event
                                                        onRemove={this.onSelectRequiredDocList} // Function will trigger on remove event
                                                        displayValue="name" // Property name to display in the dropdown options
                                                        name="select"
                                                        showCheckbox="true"
                                                        placeholder="Select"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row mb-2 ">
                                                <label className="control-label job-label">Client Category</label>
                                                <input placeholder="" type="text" className="form-control gray-bg" name="clientCategory" value={this.state.clientCategory} onChange={this.handleInput} />
                                            </div>
                                            <div className="form-group row mb-2 ">
                                                <label className="control-label job-label">Area Code</label>
                                                <input placeholder="" type="text" className="form-control gray-bg" name="areaCode" value={this.state.areaCode} onChange={this.handleInput} />
                                            </div>
                                            <div className="form-group row mb-2 ">
                                                <label className="control-label job-label">Interview Mode</label>
                                                <input placeholder="" type="text" className="form-control gray-bg" defaultValue={this.state.interviewMode} onBlur={(e) => { this.state.interviewMode = e.target.value; }} />
                                            </div>
                                            <div className="form-group row mb-2 ">
                                                <label className="control-label job-label">Address</label>
                                                <input placeholder="" type="text" className="form-control gray-bg" defaultValue={this.state.address} onBlur={(e) => { this.state.address = e.target.value; }} />
                                            </div>
                                            <div className="form-group row mb-2 ">
                                                <label className="control-label job-label">Domain</label>
                                                <input placeholder="" type="text" className="form-control gray-bg" value={this.state.domain} onChange={this.handleInput} name="domain" />
                                            </div>

                                        </div>


                                    </div>

                                </div>

                                <div className="row pt-3 pl-1">
                                    <div className="col-sm-12">
                                        <h5>Skills</h5>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12 p-2">
                                        <div className="col-sm-3 pl-0 mr-3 float-left">
                                            <div className="form-group mb-2 ">
                                                <label className="control-label job-label">Industry</label>
                                                <Multiselect className="form-control-sm gray-bg"
                                                    options={this.jobRequiredDocumentsList} // Options to display in the dropdown
                                                    selectedValues={this.setSelectedValue(this.state.skillsIndustry)}
                                                    onSelect={this.onSelectRequiredIndustryList} // Function will trigger on select event
                                                    onRemove={this.onSelectRequiredIndustryList} // Function will trigger on remove event
                                                    displayValue="name" // Property name to display in the dropdown options
                                                    name="skillsIndustry"
                                                    showCheckbox="true"
                                                    placeholder="Select"
                                                />
                                            </div>

                                            <div className="form-group mb-2 ">
                                                <label className="control-label job-label">Evaluation Template</label>
                                                <input placeholder="" type="text" name="skillsEvaluationTemplate" className="form-control gray-bg" value={this.state.skillsEvaluationTemplate} onChange={this.handleInput} />
                                            </div>

                                            <div className="form-group mb-2 ">
                                                <label className="control-label job-label">Languages</label>
                                                <Multiselect className="form-control-sm w-100 gray-bg"
                                                    options={this.jobRequiredDocumentsList} // Options to display in the dropdown
                                                    selectedValues={this.setSelectedValue(this.state.skillsLanguage)}
                                                    onSelect={this.onSelectRequiredLanguageList} // Function will trigger on select event
                                                    onRemove={this.onSelectRequiredLanguageList} // Function will trigger on remove event
                                                    displayValue="name" // Property name to display in the dropdown options
                                                    name="skillsLanguage"
                                                    showCheckbox="true"
                                                    placeholder="Select" 
                                                />
                                            </div>

                                        </div>


                                        <div className="col-sm-4 ml-5 float-left">
                                            <div className="form-group mb-2 ">
                                                <label className="control-label job-label">Degree</label>
                                                <Multiselect className="form-control-sm w-100 gray-bg"
                                                    options={this.jobRequiredDocumentsList} // Options to display in the dropdown
                                                    selectedValues={this.setSelectedValue(this.state.skillsDegree)}
                                                    onSelect={this.onSelectDocList} // Function will trigger on select event
                                                    onRemove={this.onSelectDocList} // Function will trigger on remove event
                                                    displayValue="name" // Property name to display in the dropdown options
                                                    name="skillsDegree"
                                                    showCheckbox="true"
                                                    placeholder="Select"
                                                />
                                            </div>
                                            <div className="form-group mb-2 ">
                                                <label className="control-label job-label">Primary Skills</label>
                                                <input placeholder="" name="skillsPrimary" type="text" className="form-control gray-bg" defaultValue={this.state.skillsPrimary} onBlur={(e) => { this.state.skillsPrimary = e.target.value; }} />


                                            </div>
                                        </div>

                                        <div className="col-sm-4 float-right">
                                            <div className="form-group row mb-2 ">
                                                <label className="control-label job-label">Experience<span className="text-danger pl-1">*</span></label>
                                                <div className="input-group ">
                                                    <input placeholder="Min" type="number" name="skillsMinExperience" className="form-control gray-bg col-sm-3 " value={this.state.skillsMinExperience} onChange={this.handleInput} />
                                                    <input placeholder="Max" type="number" name="skillsMaxExperience" className="form-control gray-bg col-sm-3 ml-3" value={this.state.skillsMaxExperience} onChange={this.handleInput} />
                                                    <label className="col-sm-3 ml-3">Years</label>
                                                </div>
                                            </div>
                                            <div className="form-group row mb-2 mt-1">
                                                <label className="control-label job-label">Secondary Skills</label>
                                                <input placeholder="" type="text" name="skillsSecondarySkills" className="form-control gray-bg" value={this.state.skillsSecondarySkills} onChange={this.handleInput} />
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <div className="row pt-3">
                                    <div className="col-sm-12">
                                        <h5>Organizational Information</h5>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-12 p-2">
                                        <div className="col-sm-3 pl-0 mr-5 float-left">
                                            <div className="form-group mb-2 ">
                                                <label className="control-label job-label">Number of Positions<span className="text-danger pl-1">*</span></label>
                                                <input name="orgInfoNoOfPositions" type="number" className="form-control gray-bg" value={this.state.orgInfoNoOfPositions} onChange={this.handleInput} />
                                            </div>

                                            <div className="form-group mb-2 ">
                                                <label className="control-label job-label">Sales Manager</label>
                                     
                                                <select className="form-control gray-bg" name="orgInfoSalesManager" defaultValue={this.state.orgInfoSalesManager} onChange={this.handleInput}>
                                                    <option value="">select</option>
                                                    {this.state.usersList.length >=1?this.state.usersList.map(function(data){
                          return <option value={data.pk}>{data.fields.firstName} {data.fields.firstName} ({data.fields.email})</option>
                      }):""}
                                                </select>
                                            </div>

                                            <div className="form-group mb-2 ">
                                                <label className="control-label job-label">Account Manager<span className="text-danger pl-1">*</span></label>
                                                <select className="form-control gray-bg" name="orgInfoAccountManager" value={this.state.orgInfoAccountManager} onChange={this.handleInput}>
                                                    <option value="">select</option>
                                                    {this.state.usersList.length >=1?this.state.usersList.map(function(data){
                          return <option value={data.pk}>{data.fields.firstName} {data.fields.firstName} ({data.fields.email})</option>
                      }):""}
                                                </select>
                                            </div>

                                            <div className="form-group mb-2 ">
                                                <label className="control-label job-label">Comments</label>
                                                <input placeholder="" type="text" className="form-control gray-bg" name="orgInfoComments" value={this.state.orgInfoComments} onChange={this.handleInput} />
                                            </div>

                                        </div>


                                        <div className="col-sm-4 pl-0 ml-4 float-left">
                                            <div className="form-group mb-2 ">
                                                <label className="control-label job-label">Maximum Allowed Submissions</label>
                                                <input placeholder="" type="number" className="form-control gray-bg" name="orgInfoMaxAllowedSubmissions" value={this.state.orgInfoMaxAllowedSubmissions} onChange={this.handleInput} />
                                            </div>

                                            <div className="form-group mb-2 ">
                                                <label className="control-label job-label">Department</label>
                                                <select className="form-control gray-bg" name="orgInfoDepartment" value={this.state.orgInfoDepartment} onChange={this.handleInput}>
                                                    <option value="">select</option>
                                                    <option value="Dept1">Dept1</option>
                                                    <option value="Dept2">Dept2</option>
                                                </select>
                                            </div>

                                            <div className="form-group mb-2 ">
                                                <label className="control-label job-label">Assigned To</label>
                                                <select className="form-control gray-bg" value={this.state.orgInfoAssignedTo} name="orgInfoAssignedTo" onChange={this.handleInput}>
                                                    <option value="">select</option>
                                                    {this.state.usersList.length >=1?this.state.usersList.map(function(data){
                          return <option value={data.pk}>{data.fields.firstName} {data.fields.firstName} ({data.fields.email})</option>
                      }):""}
                                                </select>
                                            </div>

                                            <div className="form-group mb-2 ">
                                                <label className="control-label job-label">Additional Notifications</label>
                                                <Multiselect className="form-control-sm"
                                                    options={this.jobRequiredDocumentsList} // Options to display in the dropdown
                                                    selectedValues={this.setSelectedValue(this.state.orgInfoAddtionalNotification)}
                                                    onSelect={this.onSelectAddtnNotifications} // Function will trigger on select event
                                                    onRemove={this.onSelectAddtnNotifications} // Function will trigger on remove event
                                                    displayValue="name" // Property name to display in the dropdown options
                                                    name="orgInfoAddtionalNotification"
                                                    showCheckbox="true"
                                                    placeholder="Select"
                                                />
                                            </div>

                                        </div>


                                        <div className="col-sm-4 pl-0  float-right">
                                            <div className="form-group mb-2 ">{this.state.orgInfoTaxTerms}
                                                <label className="control-label job-label">Tax Terms</label>
                                                <Multiselect className="form-control-sm w-100 gray-bg"
                                                    options={this.jobRequiredDocumentsList} // Options to display in the dropdown
                                                    selectedValues={this.setSelectedValue(this.state.orgInfoTaxTerms)} // Preselected value to persist in dropdown
                                                    onSelect={this.onSelectRequiredTaxTerms} // Function will trigger on select event
                                                    onRemove={this.onSelectRequiredTaxTerms} // Function will trigger on remove event
                                                    displayValue="name" // Property name to display in the dropdown options
                                                    name="orgInfoTaxTerms"
                                                    showCheckbox="true"
                                                    placeholder="Select"
                                                />
                                            </div>

                                            <div className="form-group mb-2 ">
                                                <label className="control-label job-label">Recruitment Manager<span className="text-danger pl-1">*</span></label>
                                                <select className="form-control gray-bg" name="orgInfoRecruitmentManager" value={this.state.orgInfoRecruitmentManager} onChange={this.handleInput}>
                                                    <option value="">select</option>
                                                    {this.state.usersList.length >=1?this.state.usersList.map(function(data){
                          return <option value={data.pk}>{data.fields.firstName} {data.fields.firstName} ({data.fields.email})</option>
                      }):""}
                                                </select>
                                            </div>


                                            <div className="form-group mb-2 ">
                                                <label className="control-label job-label">Primary Recruiter</label>
                                                <select className="form-control gray-bg" name="orgInfoPrimaryRecruiter" value={this.state.orgInfoPrimaryRecruiter} onChange={this.handleInput}>
                                                    <option value="">select</option>
                                                    {this.state.usersList.length >=1?this.state.usersList.map(function(data){
                          return <option value={data.pk}>{data.fields.firstName} {data.fields.firstName} ({data.fields.email})</option>
                      }):""}
                                                </select>
                                            </div>


                                            <div className="form-group mb-2 ">
                                                <label className="control-label job-label">Career Portal Published Date</label>
                                                <input placeholder="" type="date" className="form-control gray-bg" name="careerPortalPublishedDate" value={this.setDateFormat(this.state.careerPortalPublishedDate) || ''} onChange={this.handleInput} />
                                            </div>


                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12 mt-1  ">
                                        <label className="control-label">Job Description<span className="text-danger pl-1">*</span></label>
                                        {this.state.jobDescription !== "" ? <CKEditor
                                            initData={this.state.jobDescription !== "" ? this.state.jobDescription : "Hi"}
                                            defaultValue={this.state.jobDescription}
                                            name="jobDescription"
                                            className="templateDescriptionEditor"
                                            onChange={this.handleJobDescription}
                                            style={{ width: "100%" }}
                                        /> : <i className="la la-refresh text-secondary la-spin progress-icon-spin"></i>}

                                    </div>
                                </div>
                                <div className="row col-sm-12 mt-3">
                                    <a href={'../admin/manageJobs'} className="btn-icon btn btn-sm btn-outline-secondary" style={{ marginRight: 10 + 'px' }}>
                                        <span className="btn-inner--icon mr-1"><i className="far fa-arrow-alt-circle-left"></i></span>
                                        <span className="btn-inner--text">Cancel</span>
                                    </a>
                                    <button type="button" onClick={this.handleSubmit} className="btn-icon btn-sm btn btn-primary">

                                        <span className="btn-inner--icon mr-1"><i className="fas fa-save"></i></span>
                                        <span className="btn-inner--text">Update</span>
                                    </button>


                                </div>
                                <div className="clearfix"></div>
                            </form>
                        </Card>
                    </div></Row></div></>;
    }
    handleInput(event) {
        if(event.target.name === "clientManager")
            if(event.target.value.length < 3)
                this.setState({clientManagerError:true});
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    handleJobDescription = (text) => {
        this.setState({
            jobDescription: text.editor.getData()
        });
    }
    handleSubmit(event) {

        axios.put(apiUrl + "updateJobDetails", {
            id: parseInt((new URLSearchParams(window.location.search)).get("jobId")),
            jobCode: this.state.jobCode,
            jobClient: this.state.jobClient,
            payRateCurrency: this.state.payRateCurrency,
            payRateMinValue: this.state.payRateMinValue != "" ? parseFloat(this.state.payRateMinValue) : 0.0,
            payRateMaxValue: this.state.payRateMaxValue != "" ? parseFloat(this.state.payRateMaxValue) : 0.0,
            payRateFrequency: this.state.payRateFrequency,
            payRateTaxTerms: this.state.payRateTaxTerms,
            respondBy: this.state.respondBy,
            country: this.state.country,
            zipcode: this.state.zipcode != "" ? parseInt(this.state.zipcode) : 0,
            requiredHours: this.state.requiredHours != "" ? parseFloat(this.state.requiredHours) : 0.0,
            endClient: this.state.endClient,
            turnAroundTime: this.state.turnAroundTime != "" ? parseFloat(this.state.turnAroundTime) : 0.0,
            duration: this.state.duration,
            workAuthorization: this.state.workAuthorization,
            applicationForm: this.state.applicationForm,
            placementFeePercentage: this.state.placementFeePercentage != "" ? parseFloat(this.state.placementFeePercentage) : 0.0,
            projectType: this.state.projectType,
            jobTitle: this.state.jobTitle,
            jobStartDate: this.state.jobStartDate,
            isRemoteJob: this.state.isRemoteJob,
            jobStatus: this.state.jobStatus,
            clientId: this.state.clientId,
            client: this.state.client,
            clientJobId: this.state.clientJobId,
            jobPriority: this.state.jobPriority,
            addtnDetails: this.state.addtnDetails,
            internalRef: this.state.internalRef,
            jobTvop: this.state.jobTvop,
            clientBillRateCurrency: this.state.clientBillRateCurrency,
            clientBillRateValue: this.state.clientBillRateValue != "" ? parseFloat(this.state.clientBillRateValue) : 0.0,
            clientBillRateFrequency: this.state.clientBillRateFrequency,
            clientBillRateTaxTerms: this.state.clientBillRateTaxTerms,
            endDate: this.state.endDate,
            jobExpensesPaid: this.state.jobExpensesPaid,
            jobLocationCity: this.state.jobLocationCity,
            jobType: this.state.jobType,
            clientManager: this.state.clientManager,
            jobRequiredDocuments: this.state.jobRequiredDocuments,
            clientCategory: this.state.clientCategory,
            areaCode: this.state.areaCode,
            interviewMode: this.state.interviewMode,
            address: this.state.address,
            domain: this.state.domain,
            jobDescription: this.state.jobDescription,
            selectedStates: this.state.selectedStates,
            turnAroundTimeFrequency: this.state.turnAroundTimeFrequency,
            skillsIndustry: this.state.skillsIndustry,
            skillsEvaluationTemplate: this.state.skillsEvaluationTemplate,
            skillsLanguage: this.state.skillsLanguage,
            skillsDegree: this.state.skillsDegree,
            skillsPrimary: this.state.skillsPrimary,
            skillsMinExperience: this.state.skillsMinExperience != "" ? parseInt(this.state.skillsMinExperience) : 0,
            skillsMaxExperience: this.state.skillsMaxExperience != "" ? parseInt(this.state.skillsMaxExperience) : 0,
            skillsSecondarySkills: this.state.skillsSecondarySkills,
            orgInfoNoOfPositions: this.state.orgInfoNoOfPositions != "" ? parseInt(this.state.orgInfoNoOfPositions) : 0,
            orgInfoSalesManager: this.state.orgInfoSalesManager,
            orgInfoAccountManager: this.state.orgInfoAccountManager,
            orgInfoComments: this.state.orgInfoComments,
            orgInfoMaxAllowedSubmissions: this.state.orgInfoMaxAllowedSubmissions != "" ? parseInt(this.state.orgInfoMaxAllowedSubmissions) : 0,
            orgInfoDepartment: this.state.orgInfoDepartment,
            orgInfoAssignedTo: this.state.orgInfoAssignedTo,
            orgInfoAddtionalNotification: this.state.orgInfoAddtionalNotification,
            orgInfoTaxTerms: this.state.orgInfoTaxTerms,
            orgInfoRecruitmentManager: this.state.orgInfoRecruitmentManager,
            orgInfoPrimaryRecruiter: this.state.orgInfoPrimaryRecruiter,
            careerPortalPublishedDate: this.state.careerPortalPublishedDate,
            sess_id:  this.state.sess_id
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
                            //    const content = Swal.getContent()
                            //   if (content) {
                            //  const b = content.querySelector('b')
                            // if (b) {
                            //   b.textContent = Swal.getTimerLeft()
                            //  }
                            //  }
                            // window.location.href = "../admin/manageJobs";
                        }, 100)
                    },
                    onClose: () => {
                        clearInterval(timerInterval)
                        // setTimeout(()=>this.props.history.push("../admin/candidates"),  500);
                        ///  window.location.href = "../admin/manageJobs";
                    }
                });
            } else {
                var errMsg = "";
                //  Object.keys(data.message).map((e, i) => {
                // errMsg += "<br/>- " + (data.message[e]);

                //  });
                Swal.fire('Error', data.message, 'error'); return;
            }
        });//axios end
    }
    //  setTimeout(()=>this.props.history.push("../admin/candidates"),  1200);
    //window.location.href = "../admin/candidates";

    /*  fetch(candidatePostUrl,{
          method:"POST",
          body:JSON.stringify(this.state),
          header:{
              Accept:"application/json",
              "Content-type":"application/json"
          }
      }).then(function(response){
          return response.text();
      }).then((responseJson) => {
         console.log(responseJson);
         if(responseJson.status){
             this.showAlert("br","success","Candidate created successsfully","pe-7s-check");
             setTimeout(()=>this.props.history.push("../admin/candidates"),  1200);
          }
       });
      /*
      .then(response=>{
          response.json().then(data=>{
              console.log(data);   
          })
      });
      */


}
export default EditJobDetails;

