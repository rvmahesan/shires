import React, { Component } from "react";
import {
    Container,
    Row,
    Tooltip,
    Card,
    CardHeader
} from "reactstrap";

import Swal from 'sweetalert2';

import { addNewJob, style } from "../variables/Variables.jsx";
import ReactQuill from "react-quill";

import { CKEditor } from 'ckeditor4-react';

import Cookies from 'universal-cookie';

import { Multiselect } from 'multiselect-react-dropdown';
import { apiUrl } from "../variables/Variables.jsx";

const axios = require("axios").default;
const cookies = new Cookies();

class CreateNewJob extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
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
            isRemoteJob: "False",
            jobStatus: "Active",
            clientId: "",
            jobClient: "",
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
            clientsList:[],
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
        this.onRemoveRequiredDocList = this.onRemoveRequiredDocList.bind(this);

    }

    
    componentDidMount() {
        // axios.get(apiUrl+"getAllStatesList")
        axios.get(apiUrl + "getAllStatesList")
            .then(({ data }) => {
                this.setState({ statesList: data })
            })
            .catch((err) => { })
        axios.get(apiUrl + "getAllCountriesList")
            .then(({ data }) => {
                this.setState({ countriesList: data })
            })
            .catch((err) => { })
        axios.get(apiUrl + "getJobCommonData")
            .then(({ data }) => {
                if (data.statusResponse) {
                    this.setState({ jobCode: data.jobCode, internalRef: data.internalRef })
                }
            })
            .catch((err) => { });
            //clientsList ,{ params: {  sess_id: this.state.sess_id,countryId:stateId } }
            axios.get(apiUrl + "listClients",{params:{sess_id:this.state.sess_id}})
            .then(({ data }) => {
                this.setState({ clientsList: data.results })
            })
            .catch((err) => { })


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
    onRemoveRequiredDocList(selectedList, selectedItem) {
        let sts = []
        for (var i = 0; i < selectedList.length; i++) {
            sts[i] = (selectedList[i].name);
        }
        let sts_ = sts.join(", ");
        this.state.jobRequiredDocuments = sts_;
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
        return (<>


            <div className="row ss">
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
                                <div className="">
                                    <a href={'../admin/manageJobs'} className="btn-icon btn btn-sm btn-outline-secondary" style={{ marginRight: 10 + 'px' }}>
                                        <span className="btn-inner--icon mr-1"><i className="far fa-arrow-alt-circle-left"></i></span>
                                        <span className="btn-inner--text">Cancel</span>
                                    </a>
                                    <button type="button" onClick={this.handleSubmit} className="btn-icon btn-sm btn btn-primary">

                                        <span className="btn-inner--icon mr-1"><i className="fas fa-save"></i></span>
                                        <span className="btn-inner--text">Save as Draft</span>
                                    </button>

                                    <button type="button" onClick={this.handleSubmit} className="btn-sm btn-icon ml-2 btn btn-primary">

                                        <span className="btn-inner--icon mr-1"><i className="fas fa-plus-circle"></i></span>
                                        <span className="btn-inner--text">Publish</span>
                                    </button>
                                </div>

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
                                                <input placeholder="" type="text" className="gray-bg form-control" defaultValue={this.state.jobCode} disabled />
                                            </div>
                                            <div className="form-group row mb-1">
                                                <label className="control-label job-label">Pay Rate / Salary</label>

                                                <div className="input-group form-group">
                                                    <select className="input-group-select  form-control-select gray-bg form-control-sm col-sm-2" name="payRateCurrency" onChange={(e) => { this.setState({ payRateCurrency: e.target.value }) }}>
                                                        <option value="">select</option>
                                                        <option value="USD">USD</option>
                                                    </select>

                                                    <input type="number" autoComplete="new" className="form-control gray-bg ml-1 form-control-sm col-sm-2" required name="payRateMinValue" placeholder="Min" defaultValue={this.state.clientBillRate} autoComplete="new" onChange={this.handleInput} />
                                                    <input type="number" autoComplete="new" placeholder="Max" className="form-control gray-bg ml-1 form-control-sm col-sm-2" required name="payRateMaxValue" defaultValue={this.state.clientBillRate} autoComplete="new" onChange={this.handleInput} />


                                                    <select className="input-group-select gray-bg form-control-select form-control-sm ml-2 col-sm-3" name="payRateFrequency" onChange={(e) => { this.setState({ payRateFrequency: e.target.value }) }}>
                                                        <option value="">select</option>
                                                        <option value="Hourly">Hourly</option>
                                                        <option value="Daily">Daily</option>
                                                        <option value="Weekly">Weekly</option>
                                                        <option value="Bi-Weekly">Bi-Weekly</option>
                                                        <option value="Monthly">Monthly</option>
                                                        <option value="Yearly">Yearly</option>
                                                    </select>

                                                    <select className="input-group-select gray-bg form-control-sm form-control-select ml-2 col-sm-3" name="payRateTaxTerms" onChange={(e) => { this.setState({ payRateTaxTerms: e.target.value }) }}>
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
                                                <select className="form-control form-control-select gray-bg" name="respondBy" defaultValue={this.state.respondBy} onChange={(e) => { this.setState({ respondBy: e.target.value }) }}>
                                                    <option value=""></option>
                                                    <option value="Open Untill Filled">Open Untill Filled</option>
                                                    <option value="Date Option">Date Option</option>
                                                </select>
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Country</label>
                                                <select className="form-control form-control-select gray-bg" name="country" onChange={(e) => { this.setState({ country: e.target.value }) }}>
                                                    <option value="">select</option>
                                                    {this.state.countriesList.map(function(data){
                                                        return <option value={data.id}>{data.name}</option>
                                                    })}
                                                </select>
                                            </div>

                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Zip Code</label>
                                                <input placeholder="" type="number" className="form-control gray-bg" name="zipcode" defaultValue={this.state.zipcode} onBlur={(e) => { this.state.zipcode = e.target.value; }} />
                                            </div>

                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Required Hours/Week</label>
                                                <input placeholder="" type="number" name="requiredHours" className="form-control gray-bg" defaultValue={this.state.requiredHours} onBlur={(e) => { this.state.requiredHours = e.target.value; }} />
                                            </div>

                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">End Client</label>
                                                <input placeholder="" type="text" name="endClient" className="form-control gray-bg" defaultValue={this.state.endClient} onBlur={this.handleInput} />


                                            </div>

                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Turnaround Time</label>
                                                <div className="input-group">
                                                    <input placeholder="" type="number" name="turnAroundTime" className="form-control gray-bg mr-2 col-sm-5 float-left" defaultValue={this.state.turnAroundTime} onBlur={(e) => { this.state.turnAroundTime = e.target.value; }} />

                                                    <select className="form-control col-sm-5 ml-2 gray-bg float-left" name="turnAroundTimeFrequency" onChange={this.handleInput}>
                                                        <option value="">select</option>
                                                        <option value="In Days">In Days</option>
                                                        <option value="In Hours">In Hours</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Duration</label>
                                                <input placeholder="" type="text" name="duration" className="form-control gray-bg" defaultValue={this.state.duration} onBlur={(e) => { this.state.duration = e.target.value; }} />
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Work Authorization</label>
                                                <select className="form-control float-left gray-bg" name="workAuthorization" onChange={this.handleInput}>
                                                    <option value="">select</option>
                                                    <option value="Citizen">Citizen</option>
                                                </select>
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Application Form</label>
                                                <select className="form-control float-left gray-bg" name="applicationForm" onBlur={this.handleInput}>
                                                    <option value="">select</option>
                                                    <option value="General Application">General Application</option>
                                                </select>

                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Placement Fee Percentage</label>
                                                <input placeholder="" type="number" className="form-control gray-bg" name="placementFeePercentage" defaultValue={this.state.placementFeePercentage} onBlur={(e) => { this.state.placementFeePercentage = e.target.value; }} />
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Project Type</label>
                                                <select className="form-control float-left gray-bg" name="projectType" onChange={this.handleInput}>
                                                    <option value="">select</option>
                                                </select>

                                            </div>

                                        </div>

                                        <div className="col-sm-4 mr-2 ml-5 float-left">
                                            <div className="form-group  mb-2">
                                                <label className="control-label job-label">Job Title<span className="text-danger pl-1">*</span></label>
                                                <input placeholder="" type="text" className="form-control gray-bg" name="jobTitle" defaultValue={this.state.jobTitle} onBlur={(e) => { this.state.jobTitle = e.target.value; }} />
                                            </div>
                                            <div className="form-group  mb-2">
                                                <label className="control-label job-label">Job Start Date</label>
                                                <input placeholder="" type="date" className="form-control gray-bg" defaultValue={this.state.jobStartDate} onBlur={(e) => { this.state.jobStartDate = e.target.value; }} />
                                            </div>

                                            <div className="form-group  mb-3 mt-3">
                                                <label className="control-label job-label">Remote Job<span className="text-danger pl-1">*</span></label>
                                                <div className="row pl-3">
                                                    <div className="form-check form-check-inline">
                                                        <input name="isRemoteJob" id="radio1" type="radio" className="form-check-input" onChange={this.handleInput} value="True" /> <label className="form-check-label form-label" for="radio1">Yes</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input name="isRemoteJob" type="radio" id="radio2" checked className="form-check-input" value="False" onChange={this.handleInput} /> <label className="form-check-label form-label" for="radio2" >No</label>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="form-group  mb-2">
                                                <label className="control-label job-label">States<span className="text-danger pl-1">*</span></label>
                                                <div className="row">
                                                    <Multiselect
                                                        options={this.state.statesList} // Options to display in the dropdown
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
                                                <select name="jobClient" className="form-control gray-bg" onChange={this.handleInput}>
                                                    <option value="">select</option>
                                                    {this.state.clientsList.map(function(data){
                                                        return <option value={data.id}>{data.clientName}</option>
                                                    })}
                                                </select>
                                            </div>
                                            <div className="form-group  row mb-2">
                                                <label className="control-label job-label">Client Job ID</label>
                                                <input placeholder="" type="text" className="form-control gray-bg" defaultValue={this.state.clientId} onBlur={(e) => { this.state.clientId = e.target.value; }} />
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Priority</label>
                                                <select className="form-control float-left gray-bg" name="jobPriority" onChange={this.handleInput}>
                                                    <option value="">select</option>
                                                    <option value="Critical">Critical</option>
                                                    <option value="High">High</option>
                                                    <option value="Low">Low</option>
                                                    <option value="Medium">Medium</option>
                                                </select>
                                            </div>

                                            <div className="form-group mb-2 row">
                                                <label className="control-label job-label">Additional Details</label>
                                                <input placeholder="" type="text" className="form-control gray-bg" defaultValue={this.state.addtnDetails} onBlur={(e) => { this.state.addtnDetails = e.target.value; }} />
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
                                                    <select className="input-group-select gray-bg form-control-select form-control-sm col-sm-3" name="clientBillRateCurrency" onChange={this.handleInput}>
                                                        <option value="">select</option>
                                                        <option value="USD">USD</option>
                                                    </select>

                                                    <input type="number" autoComplete="new" className="form-control ml-2 gray-bg form-control-sm col-sm-3" required name="clientBillRateValue" defaultValue={this.state.clientBillRate} autoComplete="new" onChange={this.handleInput} />

                                                    <select className="input-group-select form-control-select gray-bg form-control-select form-control-sm ml-2 col-sm-3" name="clientBillRateFrequency" onChange={this.handleInput}>
                                                        <option value="">select</option>
                                                        <option value="Hourly">Hourly</option>
                                                        <option value="Daily">Daily</option>
                                                        <option value="Weekly">Weekly</option>
                                                        <option value="Bi-Weekly">Bi-Weekly</option>
                                                        <option value="Monthly">Monthly</option>
                                                        <option value="Yearly">Yearly</option>
                                                    </select>

                                                    <select className="input-group-select form-control-select gray-bg form-control-sm ml-2 col-sm-3" name="clientBillRateTaxTerms" onChange={this.handleInput}>
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
                                                <input placeholder="" type="date" className="form-control gray-bg" defaultValue={this.state.endDate} onBlur={(e) => { this.state.endDate = e.target.value; }} onChange={this.handleInput} />
                                            </div>

                                            <div className="form-group row  mb-2">
                                                <label className="control-label job-label">Expenses Paid<span className="text-danger pl-1">*</span></label>

                                                <select className="form-control form-control-select gray-bg" name="jobExpensesPaid" onChange={this.handleInput}>
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
                                                <select className=" form-control-select form-control gray-bg" name="jobType" onChange={this.handleInput}>
                                                    <option value="">select</option>
                                                    <option value="Fulltime">Fulltime</option>
                                                    <option value="Contract">Contract</option>
                                                    <option value="Partime">Partime</option>
                                                </select>


                                            </div>
                                            <div className="form-group row mb-2 mt-3">
                                                <label className="control-label job-label">Client Manager</label>
                                                <input placeholder="" type="text" className="form-control gray-bg" defaultValue={this.state.clientManager} onBlur={(e) => { this.state.clientManager = e.target.value; }} />
                                            </div>
                                            <div className="form-group  row mb-2">
                                                <label className="control-label job-label">Required Documents</label>
                                                <div className="col-sm-12 p-0">
                                                    <Multiselect className="form-control-sm"
                                                        options={this.jobRequiredDocumentsList} // Options to display in the dropdown
                                                        //selectedValues={this.state.selectedStates} // Preselected value to persist in dropdown
                                                        onSelect={this.onSelectRequiredDocList} // Function will trigger on select event
                                                        onRemove={this.onRemoveRequiredDocList} // Function will trigger on remove event
                                                        displayValue="name" // Property name to display in the dropdown options
                                                        name="select"
                                                        showCheckbox="true"
                                                        placeholder="Select" className="w-100 gray-bg"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row mb-2 ">
                                                <label className="control-label job-label">Client Category</label>
                                                <input placeholder="" type="text" className="form-control gray-bg" defaultValue={this.state.clientCategory} onBlur={(e) => { this.state.clientCategory = e.target.value; }} />
                                            </div>
                                            <div className="form-group row mb-2 ">
                                                <label className="control-label job-label">Area Code</label>
                                                <input placeholder="" type="text" className="form-control gray-bg" defaultValue={this.state.areaCode} onBlur={(e) => { this.state.areaCode = e.target.value; }} />
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
                                                <input placeholder="" type="text" className="form-control gray-bg" defaultValue={this.state.domain} onBlur={(e) => { this.state.domain = e.target.value; }} name="domain" />
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
                                                <Multiselect className="form-control-sm"
                                                    options={this.jobRequiredDocumentsList} // Options to display in the dropdown
                                                    //selectedValues={this.state.selectedStates} // Preselected value to persist in dropdown
                                                    onSelect={this.onSelectRequiredDocList} // Function will trigger on select event
                                                    onRemove={this.onRemoveRequiredDocList} // Function will trigger on remove event
                                                    displayValue="name" // Property name to display in the dropdown options
                                                    name="skillsIndustry"
                                                    showCheckbox="true"
                                                    placeholder="Select" className=" gray-bg"
                                                />
                                            </div>

                                            <div className="form-group mb-2 ">
                                                <label className="control-label job-label">Evaluation Template</label>
                                                <input placeholder="" type="text" name="skillsEvaluationTemplate" className="form-control gray-bg" defaultValue={this.state.skillsEvaluationTemplate} onBlur={(e) => { this.state.skillsEvaluationTemplate = e.target.value; }} />
                                            </div>

                                            <div className="form-group mb-2 ">
                                                <label className="control-label job-label">Languages</label>
                                                <Multiselect className="form-control-sm"
                                                    options={this.jobRequiredDocumentsList} // Options to display in the dropdown
                                                    //selectedValues={this.state.selectedStates} // Preselected value to persist in dropdown
                                                    onSelect={this.onSelectRequiredDocList} // Function will trigger on select event
                                                    onRemove={this.onRemoveRequiredDocList} // Function will trigger on remove event
                                                    displayValue="name" // Property name to display in the dropdown options
                                                    name="skillsLanguage"
                                                    showCheckbox="true"
                                                    placeholder="Select"
                                                />
                                            </div>

                                        </div>


                                        <div className="col-sm-4 ml-5 float-left">
                                            <div className="form-group mb-2 skillsDegree">
                                                <label className="control-label job-label">Degree</label>
                                                <Multiselect className="form-control-sm"
                                                    options={this.jobRequiredDocumentsList} // Options to display in the dropdown
                                                    //selectedValues={this.state.selectedStates} // Preselected value to persist in dropdown
                                                    onSelect={this.onSelectRequiredDocList} // Function will trigger on select event
                                                    onRemove={this.onRemoveRequiredDocList} // Function will trigger on remove event
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
                                                    <input placeholder="Min" type="number" name="skillsMinExperience" className="form-control gray-bg col-sm-3 " defaultValue={this.state.skillsMinExperience} onBlur={(e) => { this.state.skillsMinExperience = e.target.value; }} />
                                                    <input placeholder="Max" type="number" name="skillsMaxExperience" className="form-control gray-bg col-sm-3 ml-3" defaultValue={this.state.skillsMaxExperience} onBlur={(e) => { this.state.skillsMaxExperience = e.target.value; }} />
                                                    <label className="col-sm-3 ml-3">Years</label>
                                                </div>
                                            </div>
                                            <div className="form-group row mb-2 mt-1">
                                                <label className="control-label job-label">Secondary Skills</label>
                                                <input placeholder="" type="text" name="skillsSecondarySkills" className="form-control gray-bg" defaultValue={this.state.skillsSecondarySkills} onBlur={(e) => { this.state.skillsSecondarySkills = e.target.value; }} />
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
                                                <input placeholder="" name="orgInfoNoOfPositions" type="number" className="form-control gray-bg" defaultValue={this.state.orgInfoNoOfPositions} onBlur={(e) => { this.state.orgInfoNoOfPositions = e.target.value; }} />
                                            </div>

                                            <div className="form-group mb-2 ">
                                                <label className="control-label job-label">Sales Manager</label>
                                                <select className="form-control gray-bg" name="orgInfoSalesManager" onChange={this.handleInput}>
                                                    <option value="">select</option>
                                                    <option value="manager1">manager1</option>
                                                </select>
                                            </div>

                                            <div className="form-group mb-2 ">
                                                <label className="control-label job-label">Account Manager<span className="text-danger pl-1">*</span></label>
                                                <select className="form-control gray-bg" name="orgInfoAccountManager" onChange={this.handleInput}>
                                                    <option value="">select</option>
                                                    <option value="user 1">User 1</option>
                                                </select>
                                            </div>

                                            <div className="form-group mb-2 ">
                                                <label className="control-label job-label">Comments</label>
                                                <input placeholder="" type="text" className="form-control gray-bg" name="orgInfoComments" defaultValue={this.state.orgInfoComments} onBlur={(e) => { this.state.orgInfoComments = e.target.value; }} />
                                            </div>

                                        </div>


                                        <div className="col-sm-4 pl-0 ml-4 float-left">
                                            <div className="form-group mb-2 ">
                                                <label className="control-label job-label">Maximum Allowed Submissions</label>
                                                <input placeholder="" type="text" className="form-control gray-bg" name="orgInfoMaxAllowedSubmissions" defaultValue={this.state.orgInfoMaxAllowedSubmissions} onBlur={(e) => { this.state.orgInfoMaxAllowedSubmissions = e.target.value; }} />
                                            </div>

                                            <div className="form-group mb-2 ">
                                                <label className="control-label job-label">Department</label>
                                                <select className="form-control gray-bg" name="orgInfoDepartment" onChange={this.handleInput}>
                                                    <option value="">select</option>
                                                    <option value="">User 1</option>
                                                </select>
                                            </div>

                                            <div className="form-group mb-2 ">
                                                <label className="control-label job-label">Assigned To</label>
                                                <select className="form-control gray-bg" name="orgInfoAssignedTo" onChange={this.handleInput}>
                                                    <option value="">select</option>
                                                    <option value="">User 1</option>
                                                </select>
                                            </div>

                                            <div className="form-group mb-2 orgInfoAddtionalNotification">
                                                <label className="control-label job-label">Additional Notifications</label>
                                                <Multiselect className="form-control-sm"
                                                    options={this.jobRequiredDocumentsList} // Options to display in the dropdown
                                                    //selectedValues={this.state.selectedStates} // Preselected value to persist in dropdown
                                                    onSelect={this.onSelectRequiredDocList} // Function will trigger on select event
                                                    onRemove={this.onRemoveRequiredDocList} // Function will trigger on remove event
                                                    displayValue="name" // Property name to display in the dropdown options
                                                    name="orgInfoAddtionalNotification"
                                                    showCheckbox="true"
                                                    placeholder="Select" className="w-100 gray-bg"
                                                />
                                            </div>

                                        </div>


                                        <div className="col-sm-4 pl-0  float-right">
                                            <div className="form-group mb-2 ">
                                                <label className="control-label job-label">Tax Terms</label>
                                                <Multiselect className="form-control-sm"
                                                    options={this.jobRequiredDocumentsList} // Options to display in the dropdown
                                                    //selectedValues={this.state.selectedStates} // Preselected value to persist in dropdown
                                                    onSelect={this.onSelectRequiredDocList} // Function will trigger on select event
                                                    onRemove={this.onRemoveRequiredDocList} // Function will trigger on remove event
                                                    displayValue="name" // Property name to display in the dropdown options
                                                    name="orgInfTaxTerms"
                                                    showCheckbox="true"
                                                    placeholder="Select" className="w-100 gray-bg"
                                                />
                                            </div>

                                            <div className="form-group mb-2 ">
                                                <label className="control-label job-label">Recruitment Manager<span className="text-danger pl-1">*</span></label>
                                                <select className="form-control gray-bg" name="orgInfoRecruitmentManager" onChange={this.handleInput}>
                                                    <option value="">select</option>
                                                    <option value="User">User 1</option>
                                                </select>
                                            </div>


                                            <div className="form-group mb-2 ">
                                                <label className="control-label job-label">Primary Recruiter</label>
                                                <select className="form-control gray-bg" name="orgInfoPrimaryRecruiter" onChange={this.handleInput}>
                                                    <option value="">select</option>
                                                    <option value="">User 1</option>
                                                </select>
                                            </div>


                                            <div className="form-group mb-2 ">
                                                <label className="control-label job-label">Career Portal Published Date</label>
                                                <input placeholder="" type="date" className="form-control gray-bg" name="careerPortalPublishedDate" defaultValue={this.state.domain} onBlur={(e) => { this.state.domain = e.target.value; }} />
                                            </div>


                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12 mt-1  ">
                                        <label className="control-label">Job Description<span className="text-danger pl-1">*</span></label>
                                        <CKEditor
                                            initData={this.state.jobDescription}
                                            name="jobDescription"
                                            className="templateDescriptionEditor"
                                            onChange={this.handleJobDescription}
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                </div>
                                <div className="row col-sm-12 mt-3">
                                    <a href={'../admin/manageJobs'} className="btn-icon btn btn-sm btn-outline-secondary" style={{ marginRight: 10 + 'px' }}>
                                        <span className="btn-inner--icon mr-1"><i className="far fa-arrow-alt-circle-left"></i></span>
                                        <span className="btn-inner--text">Cancel</span>
                                    </a>
                                    <button type="button" onClick={this.handleSubmit} className="btn-icon btn-sm btn btn-primary">

                                        <span className="btn-inner--icon mr-1"><i className="fas fa-save"></i></span>
                                        <span className="btn-inner--text">Save as Draft</span>
                                    </button>

                                    <button type="button" onClick={this.handleSubmit} className="btn-sm btn-icon ml-2 btn btn-primary">

                                        <span className="btn-inner--icon mr-1"><i className="fas fa-plus-circle"></i></span>
                                        <span className="btn-inner--text">Publish</span>
                                    </button>
                                </div>
                                <div className="clearfix"></div>
                            </form>
                        </Card>
                    </div></Row></div></>);
    }
    handleInput(event) {

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



        axios.post(addNewJob, {
            jobCode: this.state.jobCode,
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
            jobClient: this.state.jobClient,
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
            sess_id: cookies.get("c_csrftoken")
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
export default CreateNewJob;