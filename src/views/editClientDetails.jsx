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
import LoadingGrow from "../components/LoadingGrow.jsx";
const axios = require("axios").default;
const cookies = new Cookies();
const params = new URLSearchParams(window.location.search);

class EditClientDetails extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            allUsers:[],
            aboutClient: "",
            clientName: "",
            contactNo: "",
            
            clientShortName: "",formLoading:false,
            clientSendRequirement: "",
            clientSendHotlist: "", clientEmailId: "",
            clientLead: "",
            category: "",
            clientAddress: "",
            country: "",
            fax: "", federalId: "",
            webSite: "",
            isNearByClientLocation: "", industry: "",
            ownership: "",
            displayOnJobPosting: "",
            vmsClientName: "",
            practice: "",
            postalCode: "", paymentTerms: "", primaryOwner: "",
            postalCity: "",
            requiredDocuments: "",
            state: "",
            status: "",
            sendNotification: "",

            childClients: "",
            

            statesList: [],//axios.get(apiUrl+"getAllStatesList"),
            countriesList: [],//axios.get(apiUrl+"getAllCountriesList"),

            clientRequiredDocuments:[],
            clientsList:[],
            clientOwnershipList:"",
            clientLeadsList:[],
            clientLeadIds:[],
            clientId:params.get("clientId"),
            sess_id:cookies.get("c_csrftoken")
        }
        this.clientRequiredDocumentsListArray = [{ "name": "Driving License" }, { "name": "EML File" }, { "name": "Passport" }, { "name": "Resume" }, { "name": "SSN" }, { "name": "Transcripts" }];

        this.clientsListArray = [{ "name": "client 1" }, { "name": "client2 " }, { "name": "client3" }];
        this.usersListArray = [{ "name": "User 1" }, { "name": "User 2" }, { "name": "User 3" }];


        this.genderOptions = ["", "Male", "Female", "Others"];
        this.statusOptions = ["Active", "Archive", "DNC", "Inactive", "Negotiation", "New Lead"];
        this.industryList = [];
        this.childClientsList =[];
        this.usersList=[];

        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleJobDescription = this.handleJobDescription.bind(this);
        this.onSelectRequiredDocList = this.onSelectRequiredDocList.bind(this);
        this.onRemoveRequiredDocList = this.onRemoveRequiredDocList.bind(this);

        this.onSelectClientsList = this.onSelectClientsList.bind(this);
        this.onRemoveClientsList = this.onRemoveClientsList.bind(this);

        this.onSelectOwnershipList = this.onSelectOwnershipList.bind(this);
        this.onRemoveOwnershipList = this.onRemoveOwnershipList.bind(this);

        this.onSelectClientLeadList = this.onSelectClientLeadList.bind(this);
        this.onRemoveClientLeadList = this.onRemoveClientLeadList.bind(this);

        this.setClientData = this.setClientData.bind(this);
        this.setSelectedValue = this.setSelectedValue.bind(this);

    }
    setSelectedValue(values) {
        
        if (values !== null && values !== "" && values.length >=1) {
            var splits_ = [];
            values.split(', ').forEach(function (ind, val) {
                splits_.push({ name: ind, id: val });
            });
            return splits_;
            //this.state.orgInfoTaxTerms
        }
    }
    setClientData(){
        axios.get(apiUrl+"getClientDetails",{params:{
            clientId:this.state.clientId,
            sess_id:this.state.sess_id
        }}).then(({data})=>{
            if(data.statusResponse){
                if(data.clientDetails.childClients == null || data.clientDetails.childClients == "[]"){
                    data.clientDetails.childClients  = "";
                }
            
                if(data.clientDetails.ownership == null || data.clientDetails.ownership == "[]")
                    data.clientDetails.ownership  = "";

                if(data.clientDetails.requiredDocuments == null || data.clientDetails.requiredDocuments == "[]")
                    data.clientDetails.requiredDocuments  = "";

                
                this.setState({
                    clientName:data.clientDetails.clientName,
                    contactNo:data.clientDetails.contactNo,
                    country:data.clientDetails.country,
                    fax:data.clientDetails.fax,
                    webSite:data.clientDetails.webSite,
                    status:data.clientDetails.status,

                    clientOwnershipList:data.clientDetails.ownership,
                    clientRequiredDocuments:data.clientDetails.requiredDocuments,
                    childClients:data.clientDetails.childClients,
                    clientLeadsList:data.clientDetails.clientLead,



                    aboutClient:data.clientDetails.aboutClient,
                    category:data.clientDetails.category,
                    displayOnJobPosting:data.clientDetails.displayOnJobPosting,
                    vmsClientName:data.clientDetails.vmsClientName,
                    clientEmailId:data.clientDetails.clientEmailId,
                    isNearByClientLocation:data.clientDetails.isNearByClientLocation,
                    state:data.clientDetails.state,
                    clientSendRequirement:data.clientDetails.clientSendRequirement,
                    clientSendHotlist:data.clientDetails.clientSendHotlist,
                    paymentTerms:data.clientDetails.paymentTerms,
                    federalId:data.clientDetails.federalId,
                    clientAddress:data.clientDetails.clientAddress,
                    postalCode:data.clientDetails.postalCode,
                    postalCity:data.clientDetails.postalCity,
                    industry:data.clientDetails.industry,
                
                    practice:data.clientDetails.practice,
                    clientShortName:data.clientDetails.clientShortName,
                    sendNotification:data.clientDetails.sendNotification,
                    primaryOwner:data.clientDetails.primaryOwner,
                    formLoading:false,
                });
                // this.setState({formLoading:false});
            }
        });
    }
    componentDidMount() {
        // axios.get(apiUrl+"getAllStatesList")

        axios.all([
            axios.get(apiUrl + "getAllStatesList"),
            axios.get(apiUrl + "getAllCountriesList"),
            axios.get(apiUrl + "getTeamDetailsById",{ params:{sess_id:this.state.sess_id,teamId:"000"}}),
            axios.get(apiUrl + "getSelectClientsList",{ params:{sess_id:this.state.sess_id}}),
            axios.get(apiUrl + "getAllConfigLists",{ params:{sess_id:this.state.sess_id,configType:"industry"}})
            ]).then(axios.spread((
                statesList, 
                countriesList,
                allUsers,
                clientsListsData,
                industryList
                )=>{
                    if(statesList.status==200)
                        this.setState({ statesList: statesList.data });
                    if(countriesList.status==200)
                        this.setState({ countriesList: countriesList.data });
    
                    if(allUsers.status==200 && allUsers.data.statusResponse)
                    {
                        this.setState({ allUsers: allUsers.data.allUsers })
                        let usersList = []
                        this.state.allUsers.map(function(data){
                            usersList.push({"name":data.firstName+" "+data.lastName,value:data.userId})
                        });
                        this.usersList =usersList;
                    }
                    
                    if (clientsListsData.status==200 && clientsListsData.data.statusResponse) {
                        let clientsLists_ = [];
                        clientsListsData.data.data.map(function(row){
                            clientsLists_.push({"name":row.fields.clientName, "value":row.pk});
                        });
                        this.childClientsList =clientsLists_;
                    }
                    if(industryList.status==200 && industryList.data.statusResponse){
                        let indLst = [];
                        industryList.data.list.map(function(data){
                        indLst.push({"name":data.ConfigName,"value":data.ConfigId});
                        });
                        this.industryList =indLst;
                    }
                   
                })
            );
      
        this.setClientData();

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
    //required document list
    onSelectRequiredDocList(selectedList, selectedItem) {
        let sts = []
        for (var i = 0; i < selectedList.length; i++) {
            sts[i] = (selectedList[i].name);
        }
        let sts_ = sts.join(", ");
        this.state.clientRequiredDocuments = sts_;
    }
    onRemoveRequiredDocList(selectedList, selectedItem) {
        let sts = []
        for (var i = 0; i < selectedList.length; i++) {
            sts[i] = (selectedList[i].name);
        }
        let sts_ = sts.join(", ");
        this.state.clientRequiredDocuments = sts_;
    }

    //client list
    onSelectClientsList(selectedList, selectedItem) {
        let sts = []
        for (var i = 0; i < selectedList.length; i++) {
            sts[i] = (selectedList[i].name);
        }
        let sts_ = sts.join(", ");
        this.state.clientsList = sts_;
    }
    onRemoveClientsList(selectedList, selectedItem) {
        let sts = []
        for (var i = 0; i < selectedList.length; i++) {
            sts[i] = (selectedList[i].name);
        }
        let sts_ = sts.join(", ");
        this.state.clientsList = sts_;
    }

    //client ownership list
    onSelectOwnershipList(selectedList, selectedItem) {
        let sts = []
        for (var i = 0; i < selectedList.length; i++) {
            sts[i] = (selectedList[i].name);
        }
        let sts_ = sts.join(", ");
        this.state.clientOwnershipList = sts_;
    }
    onRemoveOwnershipList(selectedList, selectedItem) {
        let sts = []
        for (var i = 0; i < selectedList.length; i++) {
            sts[i] = (selectedList[i].name);
        }
        let sts_ = sts.join(", ");
        this.state.clientOwnershipList = sts_;
    }


    onSelectClientLeadList(selectedList, selectedItem) {
        let sts = [];
        let clientLeadIds = [];
        for (var i = 0; i < selectedList.length; i++) {
            sts[i] = (selectedList[i].name);
            clientLeadIds[i] = selectedList[i].value;
        }
        let sts_ = sts.join(", ");
        this.state.clientLeadsList = sts_;
        this.state.clientLeadIds = clientLeadIds;
    }
    onRemoveClientLeadList(selectedList, selectedItem) {
        let sts = [];
        let clientLeadIds = [];
        for (var i = 0; i < selectedList.length; i++) {
            sts[i] = (selectedList[i].name);
            clientLeadIds[i] = selectedList[i].value;
        }
        let sts_ = sts.join(", ");
        this.state.clientLeadsList = sts_;
        this.state.clientLeadIds = clientLeadIds;
    }


    

    render() {
        var countryOptions = this.state.countriesList.map((country) => {
            return <option value={country.name}>{country.name}</option>
        });
        return this.state.formLoading?<LoadingGrow/>:(<>
            <div className="row ss" style={{ marginTop: "12px" }}>
                <div className="col-sm-12">
                    <div className="page-title-box">
                        <div className="row pl-2">
                            <div className="col ">
                                <h4 className="page-title ">Update Clientdetails</h4>
                            </div>
                            <div className="col-auto align-self-center">
                                <div className="">
                                    <a href={'../admin/ClientsListings'} className="btn-icon btn btn-sm btn-outline-secondary" style={{ marginRight: 10 + 'px' }}>
                                        <span className="btn-inner--icon mr-1"><i className="far fa-arrow-alt-circle-left"></i></span>
                                        <span className="btn-inner--text">Cancel</span>
                                    </a>
                                    <button type="button" onClick={this.handleSubmit} className="btn-sm btn-icon ml-2 btn btn-primary">

                                        <span className="btn-inner--icon mr-1"><i className="fas fa-plus-circle"></i></span>
                                        <span className="btn-inner--text">Save</span>
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
                        <Card className="p-2 my-shadow">


                            <form className="p-3">
                                <div className="row pt-1">
                                    <div className="col-sm-12">
                                        <h5>Business Information - Primary Info</h5>
                                    </div>
                                </div>

                                <div className="row ">
                                    <div className="col-sm-12">
                                        <div className="col-sm-3 mr-sm-1 float-left">
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Client Name<span className="text-danger pl-1">*</span></label>
                                                <input placeholder="" onBlur={this.handleInput} name="clientName" type="text" className="gray-bg form-control" defaultValue={this.state.clientName} />
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Contact Number</label>
                                                <input placeholder="" type="text" className="form-control gray-bg" name="contactNo" onBlur={this.handleInput}  defaultValue={this.state.contactNo} />
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Child Clients</label>
                                                <div className="row pl-2 w-100">
                                                    <Multiselect
                                                        className="w-100 gray-bg "
                                                        options={this.clientsListArray} // Options to display in the dropdown
                                                        selectedValues={this.setSelectedValue(this.state.childClients)} // Preselected value to persist in dropdown
                                                        onSelect={this.onSelectClientsList} // Function will trigger on select event
                                                        onRemove={this.onRemoveClientsList} // Function will trigger on remove event
                                                        displayValue="name" // Property name to display in the dropdown options
                                                        name="childClients"
                                                        showCheckbox="true"
                                                        placeholder="Select" 
                                                    />

                                                </div>
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Country<span className="text-danger pl-1">*</span></label>
                                                <select className="form-control float-left gray-bg" name="country" onChange={this.handleInput} value={this.state.country}>
                                                    <option value="">select</option>
                                                    {this.state.countriesList.map((country) => {
                                                        return <option value={country.id}>{country.name}</option>
                                                    })}
                                                </select>
                                            </div>


                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Website<span className="text-danger pl-1">*</span></label>
                                                <input placeholder="" type="text" name="webSite" className="form-control gray-bg" defaultValue={this.state.webSite} onBlur={this.handleInput} />

                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Status<span className="text-danger pl-1">*</span></label>
                                                <select className="form-control float-left gray-bg" name="status" onChange={this.handleInput} value={this.state.status}>
                                                    <option value="">select</option>
                                                    {this.statusOptions.map((data) => {
                                                        return <option value={data}>{data}</option>;
                                                    })}
                                                </select>

                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Ownership<span className="text-danger pl-1">*</span></label>
                                                <div className="row pl-2  w-100">
                                                    <Multiselect 
                                                        options={this.usersList} // Options to display in the dropdown
                                                        selectedValues={this.setSelectedValue(this.state.clientOwnershipList)} // Preselected value to persist in dropdown
                                                        onSelect={this.onSelectOwnershipList} // Function will trigger on select event
                                                        onRemove={this.onRemoveOwnershipList} // Function will trigger on remove event
                                                        displayValue="name" // Property name to display in the dropdown options
                                                        name="ownership"
                                                        showCheckbox="true"
                                                        placeholder="Select" className="w-100 gray-bg"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Display on Jop Posting</label>
                                                <select className="form-control float-left gray-bg" name="displayOnJobPosting" value={this.state.displayOnJobPosting} onChange={this.handleInput}>
                                                    <option key="1" value="">select</option>
                                                    <option key="2" value="Yes">Yes</option>
                                                    <option key="3" value="No">No</option>
                                                </select>

                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">About</label>

                                                <textarea name="aboutClient" onChange={this.handleInput} className="form-control" value={this.state.aboutClient} style={{ height: "100px" }}></textarea>

                                            </div>

                                        </div>
                                        <div className="col-sm-4 ml-5 float-left">
                                            <div className="form-group row mb-1">
                                                <label className="control-label job-label">VMS Client Name</label>
                                                <input placeholder="" onBlur={this.handleInput} type="text" name="vmsClientName" className="gray-bg form-control" defaultValue={this.state.vmsClientName} />
                                            </div>
                                            <div className="form-group row mb-3">
                                                <label className="control-label job-label">Email ID</label>
                                                <input placeholder="" type="text" onBlur={this.handleInput} className="form-control gray-bg" name="clientEmailId" defaultValue={this.state.clientEmailId} />
                                            </div>


                                            <div className="form-group row mb-4 pt-4">
                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox"  onClick={(e)=>{ (e.target.checked)?this.setState({isNearByClientLocation:"on"}):this.setState({isNearByClientLocation:"off"}) }} name="isNearByClientLocation" className="custom-control-input " id="InlineCheckbox" defaultChecked={this.state.isNearByClientLocation=="on"?"checked":null}/>
                                                    <label className="custom-control-label control-label job-label" htmlFor="InlineCheckbox">Notify user if he/she is near by the client location (Mobile Only)</label>
                                                </div>
                                            </div>



                                            <div className="form-group row mb-4">
                                                <label className="control-label job-label">State</label>
                                                <select className="form-control float-left gray-bg" onBlur={this.handleInput} name="state" value={this.state.state} onChange={this.handleInput}>
                                                    <option value="">select</option>
                                                    {this.state.statesList.map((data,$index) => {
                                                        return <option  value={data.id}>{data.name}</option>
                                                    })}


                                                </select>
                                            </div>

                                            <div className="form-group row mb-4 pt-4">
                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox" className="custom-control-input " onClick={(e)=>{ (e.target.checked)?this.setState({clientSendRequirement:"on"}):this.setState({clientSendRequirement:"off"}) }} defaultChecked={this.state.clientSendRequirement==="on"?"checked":null} id="clientSendRequirement" name="clientSendRequirement" />
                                                    <label className="custom-control-label control-label job-label" htmlFor="clientSendRequirement">Send Requirement</label>
                                                </div>
                                            </div>


                                            <div className="form-group row mb-3 pt-4 mb-3">
                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox" name="clientSendHotlist" onClick={(e)=>{ (e.target.checked)?this.setState({clientSendHotlist:"on"}):this.setState({clientSendHotlist:"off"}) }} defaultChecked={this.state.clientSendHotlist=="on"?"checked":null} className="custom-control-input " id="clientSendHotlist" />
                                                    <label className="custom-control-label control-label job-label" htmlFor="clientSendHotlist">Send Hotlist</label>
                                                </div>
                                            </div>


                                            <div className="form-group row mb-2">{this.state.paymentTerms} 
                                                <label className="control-label job-label">Payment Terms</label>
                                                <select name="paymentTerms" value={this.state.paymentTerms} className="form-control gray-bg" onBlur={this.handleInput}>
                                                    <option value="">select</option>
                                                    <option value="Net 10">Net 10</option>
                                                    <option value="Net 15">Net 15</option>
                                                    <option value="Net 30">Net 30</option>
                                                    <option value="Net 45">Net 45</option>
                                                    <option value="Net 60">Net 60</option>
                                                    <option value="Net 7">Net 7</option>
                                                    <option value="Net 90">Net 90</option>
                                                </select>
                                            </div>
                                            <div className="form-group clientLeadRow mb-3 mt-2">
                                                <label className="control-label job-label">Client Lead</label>
                                                <div className="row">
                                                    <Multiselect
                                                        options={this.usersList} // Options to display in the dropdown
                                                        selectedValues={this.setSelectedValue(this.state.clientLeadsList)} // Preselected value to persist in dropdown
                                                        onSelect={this.onSelectClientLeadList} // Function will trigger on select event
                                                        onRemove={this.onRemoveClientLeadList} // Function will trigger on remove event
                                                        displayValue="name" // Property name to display in the dropdown options
                                                        name="clientLead"
                                                        showCheckbox="true"
                                                        placeholder="Select" className="w-100 gray-bg "
                                                    />
                                                </div>
                                            </div>



                                            <div className="form-group row mb-1">
                                                <label className="control-label job-label">Category</label>
                                                <input placeholder="" type="text" onBlur={this.handleInput} name="category" className="gray-bg form-control" defaultValue={this.state.category} />
                                            </div>

                                            <div className="form-group row mb-1">
                                                <label className="control-label job-label">Fax</label>
                                                <input placeholder="" type="text" onBlur={this.handleInput} name="fax" className="gray-bg form-control" defaultValue={this.state.fax} />
                                            </div>



                                        </div>

                                        <div className="col-sm-4 float-right">
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Federal ID</label>
                                                <input placeholder="" type="text" onBlur={this.handleInput} className="form-control gray-bg" name="federalId" defaultValue={this.state.federalId}  />
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Address</label>
                                                <input placeholder="" type="text" onBlur={this.handleInput} className="form-control gray-bg" name="clientAddress" defaultValue={this.state.clientAddress}/>
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Postal Code</label>
                                                <input placeholder="" type="number" onBlur={this.handleInput} className="form-control gray-bg" name="postalCode" defaultValue={this.state.postalCode}  />
                                            </div>
                                            <div className="form-group row mb-3">
                                                <label className="control-label job-label">City</label>
                                                <input placeholder="" type="text" onBlur={this.handleInput} className="form-control gray-bg" name="postalCity" defaultValue={this.state.postalCity} />

                                            </div>

                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Industry</label>
                                                <select className="form-control float-left gray-bg" onBlur={this.handleInput} name="industry" value={this.state.industry} onChange={this.handleInput}>
                                                    <option value="">select</option>
                                                    {this.industryList.map(function(data,index){
                                                        return <option key={index} value={data.value}>{data.name}</option>
                                                    })}
                                                </select>
                                            </div>

                                            <div className="form-group row mb-1">
                                                <label className="control-label job-label">Primary Owner</label>
                                               
                                                <select className="form-control float-left gray-bg" onBlur={this.handleInput} name="primaryOwner" value={this.state.primaryOwner} onChange={this.handleInput}>
                                                    <option value="">select</option>
                                                    {this.state.allUsers.map(function(data,index){
                                                        return <option key={index} value={data.userId}>{data.firstName} {data.lastName}</option>
                                                    })}
                                                </select>


                                            </div>

                                            <div className="form-group reqDocuments mb-2">
                                                <label className="control-label job-label">Required Documents  </label>
                                                <div className="row">
                                                    <Multiselect className="w-100 gray-bg "
                                                        options={this.clientRequiredDocumentsListArray} // Options to display in the dropdown
                                                        selectedValues={this.setSelectedValue(this.state.clientRequiredDocuments)} // Preselected value to persist in dropdown
                                                        onSelect={this.onSelectRequiredDocList} // Function will trigger on select event
                                                        onRemove={this.onRemoveRequiredDocList} // Function will trigger on remove event
                                                        displayValue="name" // Property name to display in the dropdown options
                                                        name="requiredDocuments"
                                                        showCheckbox="true"
                                                        placeholder="Select" 
                                                    />

                                                </div>
                                            </div>

                                            <div className="form-group row mb-3">
                                                <label className="control-label job-label">Practice</label>
                                                <input placeholder="" name="practice" type="text" onBlur={this.handleInput} className="gray-bg form-control" defaultValue={this.state.practice} />
                                            </div>

                                            <div className="form-group row mb-1">
                                                <label className="control-label job-label">Client Short Name</label>
                                                <input placeholder="" name="clientShortName" onBlur={this.handleInput} type="text" className="gray-bg form-control" defaultValue={this.state.clientShortName} />
                                            </div>
                                            <div className="form-group row mb-1 pt-4">
                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox" className="custom-control-input " name="sendNotification" defaultChecked={this.state.sendNotification=="on"?'checked':null} id="sendNotification"
                                                     onClick={(e)=>{ (e.target.checked)?this.setState({sendNotification:"on"}):this.setState({sendNotification:"off"}) }} 
                                                      />
                                                    <label className="custom-control-label control-label job-label" htmlFor="sendNotification">You want to stop sending email notification to client contact while doing Submit to Client?</label>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                </div>




                                <div className="row col-sm-12 mt-3">
                                    <a href={'../admin/ClientsListings'} className="btn-icon btn btn-sm btn-outline-secondary" style={{ marginRight: 10 + 'px' }}>
                                        <span className="btn-inner--icon mr-1"><i className="far fa-arrow-alt-circle-left"></i></span>
                                        <span className="btn-inner--text">Cancel</span>
                                    </a>


                                    <button type="button" onClick={this.handleSubmit} className="btn-sm btn-icon ml-2 btn btn-primary">

                                        <span className="btn-inner--icon mr-1"><i className="fas fa-plus-circle"></i></span>
                                        <span className="btn-inner--text">Save</span>
                                    </button>
                                </div>
                                <div className="clearfix"></div>
                            </form>
                        </Card>
                    </div></Row>



                {/*  <Row>
                    <div className="col p-0">
                        <Card className="p-2 my-shadow">
                            <form className="p-3">
                            <div className="row pt-1">
                                    <div className="col-sm-12">
                                        <h5>Accounts</h5>
                                    </div>
                                </div>

                                <div className="row ">
                                  <div className="col-sm-12">
                                    <div className="col-sm-3 mr-sm-1 float-left">
                                        <div className="form-group row mb-2">
                                            <label className="control-label job-label">Contact Person<span className="text-danger pl-1">*</span></label>
                                            <input placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.contactPerson} />
                                        </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Email Id<span className="text-danger pl-1">*</span></label>
                                                <input placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.contactPerson} />
                                            </div>



                                        </div>

                                        <div className="col-sm-4 ml-5 float-left">
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Mobile Number<span className="text-danger pl-1">*</span></label>
                                                <input placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.contactPerson} />
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Designation<span className="text-danger pl-1">*</span></label>
                                                <input placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.contactPerson} />
                                            </div>
                                        </div>
                                        <div className="col-sm-4 ml-5 float-left">
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Office Number<span className="text-danger pl-1">*</span></label>
                                                <input placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.contactPerson} />
                                            </div>
                                        </div>
                                    </div>

                                        </div>
                                        </form>
                                        </Card>
                                        </div>
</Row>

                  */}
                {/*
<Row>
                    <div className="col p-0">
                        <Card className="p-2 my-shadow">
                            <form className="p-3">
                            <div className="row pt-1">
                                    <div className="col-sm-12">
                                        <h5>Contacts</h5>
                                    </div>
                                </div>

                                <div className="row ">
                                  <div className="col-sm-12">
                                    <div className="col-sm-3 mr-sm-1 float-left">
                                        <div className="form-group row mb-2">
                                            <label className="control-label job-label">First Name<span className="text-danger pl-1">*</span></label>
                                            <input placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.contactFirstName} />
                                        </div>

                                        <div className="form-group row mb-2">
                                            <label className="control-label job-label">Office Number</label>
                                            <input placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} />
                                        </div>

                                        <div className="form-group row mb-2">
                                            <label className="control-label job-label">Secondary Email ID</label>
                                            <input placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.contactSecondaryEmail} />
                                        </div>

                                        <div className="form-group row mb-2">
                                            <label className="control-label job-label">Address 1</label>
                                            <input placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.jobCode} />
                                        </div>
                                        <div className="form-group row mb-2">
                                            <label className="control-label job-label">State</label>
                                            <input placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.contactState} />
                                        </div>
                                        <div className="form-group row mb-2">
                                            <label className="control-label job-label">LinkedIn Profile URL</label>
                                            <input placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.jobCode} />
                                        </div>
                                        <div className="form-group row mb-2">
                                            <label className="control-label job-label">Google+ Profile URL</label>
                                            <input placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.contactGoogleProfileUrl} />
                                        </div>
                                       
                                     </div>
                                    <div className="col-sm-4 ml-5 float-left">
                                        <div className="form-group row mb-2">
                                                <label className="control-label job-label">Last Number</label>
                                                <input placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} />
                                        </div>
                                        <div className="form-group row mb-2">
                                            <label className="control-label job-label">Mobile Number</label>
                                            <input placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} />
                                        </div>
                                        <div className="form-group row mb-2">
                                            <label className="control-label job-label">Primary Owner</label>
                                            <input placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} />
                                        </div>
                                        <div className="form-group row mb-2">
                                            <label className="control-label job-label">Address 2</label>
                                            <input placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} />
                                        </div>
                                        <div className="form-group row mb-2">
                                            <label className="control-label job-label">City</label>
                                            <input placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} />
                                        </div>
                                        <div className="form-group row mb-2">
                                            <label className="control-label job-label">Facebook Profile URL</label>
                                            <input placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} />
                                        </div>
                                        <div className="form-group row mb-2">
                                            <label className="control-label job-label">Status</label>
                                            <input placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} />
                                        </div>

                                    </div>
                                    <div className="col-sm-4 float-right">
                                        <div className="form-group row mb-2">
                                            <label className="control-label job-label">Designation</label>
                                            <input placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} />
                                        </div>
                                        <div className="form-group row mb-2">
                                            <label className="control-label job-label">Email ID</label>
                                            <input placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} />
                                        </div>
                                        <div className="form-group row mb-2">
                                            <label className="control-label job-label">Ownership</label>
                                            <input placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} />
                                        </div>
                                        <div className="form-group row mb-2">
                                            <label className="control-label job-label">Country</label>
                                            <input placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} />
                                        </div>
                                        <div className="form-group row mb-2">
                                            <label className="control-label job-label">Zip Code</label>
                                            <input placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} />
                                        </div>
                                        <div className="form-group row mb-2">
                                            <label className="control-label job-label">Twitter Profile URL</label>
                                            <input placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} />
                                        </div>
                                        <div className="form-group row mb-2">
                                            <label className="control-label job-label">Client Group</label>
                                            <input placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} />
                                        </div>

                                    </div>
                                    



                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="col-sm-7 mr-sm-1 float-left">
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">About the Contact</label>
                                                <textarea placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} ></textarea>
                                            </div>
                                        </div>
                                    </div>

                                </div>


                                </form>
                            </Card>
                        </div>
</Row>
*/}
                {/*
<Row>
    <div className="col p-0">
        <Card className="p-2 my-shadow">
            <form className="p-3">
            <div className="row pt-1">
                    <div className="col-sm-12">
                        <h5>Notes</h5>
                    </div>
                </div>
                <div className="row ">
                    <div className="col-sm-12">
                    <div className="col-sm-3 mr-sm-1 float-left">
                        <div className="form-group row mb-2">
                            <label className="control-label job-label">Action<span className="text-danger pl-1">*</span></label>
                            <input placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.jobCode} />
                        </div>
                    </div>


                    <div className="col-sm-4 ml-5 float-left">
                        <div className="form-group row mb-2">
                            <label className="control-label job-label">Notes Priority<span className="text-danger pl-1">*</span></label>
                            <input placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.jobCode} />
                        </div>
                    </div>


                    </div>
                    </div>
                    <div className="row ">
                        <div className="col-sm-8 mr-sm-1 float-left">
                        <div className=" ">
                                        <label className="control-label">Note<span className="text-danger pl-1">*</span></label>
                                        <CKEditor  
                                            initData={this.state.jobDescription} 
                                            name="jobDescription" 
                                            className="templateDescriptionEditor"
                                            onChange={this.handleJobDescription}
                                            style={{width:"100%"}}
                                        />
                                    </div>
                        </div>
                    </div>

                <div className="row ">
                    <div className="col-sm-12">
                        <div className="col-sm-3 mr-sm-1 float-left">
                            <div className="form-group row mb-2">
                                <label className="control-label job-label">Notify these people<span className="text-danger pl-1">*</span></label>
                                <input placeholder=""  type="text" className="gray-bg form-control"/>
                            </div>
                        </div>
                        <div className="col-sm-4 ml-5 float-left">
                            <div className="form-group row mb-1 mt-2 pt-4">
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input " id="notesRemindMe" />
                                    <label className="custom-control-label control-label job-label" for="notesRemindMe">Remind Me</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
          </form>
        </Card>
    </div>
</Row>




<Row>
                    <div className="col p-0">
                        <Card className="p-2 my-shadow">
                            <form className="p-3">
                            <div className="row pt-1">
                                    <div className="col-sm-12">
                                        <h5>Documents</h5>
                                    </div>
                                </div>

                                <div className="row ">
                                  <div className="col-sm-12">
                                    <div className="col-sm-3 mr-sm-1 float-left">
                                        <div className="form-group row mb-2">
                                            <label className="control-label job-label">Client Name<span className="text-danger pl-1">*</span></label>
                                            <input placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.jobCode} />
                                        </div>
                                        </div>
                                        </div>
                                        </div>
                                        </form>
                                        </Card>
                                        </div>
</Row>



<Row>
                    <div className="col p-0">
                        <Card className="p-2 my-shadow">
                            <form className="p-3">
                            <div className="row pt-1">
                                    <div className="col-sm-12">
                                        <h5>Guidelines</h5>
                                    </div>
                                </div>

                                <div className="row ">
                                  <div className="col-sm-12">
                                    <div className="col-sm-3 mr-sm-1 float-left">
                                        <div className="form-group row mb-2">
                                            <label className="control-label job-label">Client Name<span className="text-danger pl-1">*</span></label>
                                            <input placeholder=""  type="text" className="gray-bg form-control" defaultValue={this.state.jobCode} />
                                        </div>
                                        </div>
                                        </div>
                                        </div>
                                        </form>
                                        </Card>
                                        </div>
</Row>

*/}



                {/* 

                    <Row>
                    <div className="col p-0">
                        <Card className="p-2 my-shadow">
                           

                            <form className="p-3">
                            <div className="row pt-1">
                                    <div className="col-sm-12">
                                        <h5>Assignment</h5>
                                    </div>
                                </div>

                                <div className="row col-sm-12 mt-3">
                                    <a href={'../admin/manageJobs'} className="btn-icon btn btn-sm btn-outline-secondary" style={{ marginRight: 10 + 'px' }}>
                                        <span className="btn-inner--icon mr-1"><i className="far fa-arrow-alt-circle-left"></i></span>
                                        <span className="btn-inner--text">Cancel</span>
                                    </a>
                        

                                    <button type="button" onClick={this.handleSubmit} className="btn-sm btn-icon ml-2 btn btn-primary">

                                        <span className="btn-inner--icon mr-1"><i className="fas fa-plus-circle"></i></span>
                                        <span className="btn-inner--text">Publish</span>
                                    </button>
                                </div>
                                <div className="clearfix"></div>
                            </form>
                        </Card>
                    </div></Row>





                    <Row>
                    <div className="col p-0">
                        <Card className="p-2 my-shadow">
                           

                            <form className="p-3">
                                <div className="row pt-3 pl-1">
                                    <div className="col-sm-12">
                                        <h5>Markup Calculation</h5>
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
                                                <input placeholder="" type="text" name="skillsEvaluationTemplate" className="form-control gray-bg" defaultValue={this.state.skillsEvaluationTemplate} onBlur={(e) => { this.state.skillsEvaluationTemplate = e.target.value; }}  />
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
                                                    placeholder="Select" className="w-100 gray-bg"
                                                />
                                            </div>

                                        </div>


                                        <div className="col-sm-4 ml-5 float-left">
                                            <div className="form-group mb-2 ">
                                                <label className="control-label job-label">Degree</label>
                                                <Multiselect className="form-control-sm"
                                                    options={this.jobRequiredDocumentsList} // Options to display in the dropdown
                                                    //selectedValues={this.state.selectedStates} // Preselected value to persist in dropdown
                                                    onSelect={this.onSelectRequiredDocList} // Function will trigger on select event
                                                    onRemove={this.onRemoveRequiredDocList} // Function will trigger on remove event
                                                    displayValue="name" // Property name to display in the dropdown options
                                                    name="skillsDegree"
                                                    showCheckbox="true"
                                                    placeholder="Select" className="w-100 gray-bg"
                                                />
                                            </div>
                                            <div className="form-group mb-2 ">
                                                <label className="control-label job-label">Primary Skills</label>
                                                <input placeholder="" name="skillsPrimary" type="text" className="form-control gray-bg" defaultValue={this.state.skillsPrimary} onBlur={(e) => { this.state.skillsPrimary = e.target.value; }}  />
                           
        
                                            </div>
                                        </div>

                                        <div className="col-sm-4 float-right">
                                            <div className="form-group row mb-2 ">
                                                <label className="control-label job-label">Experience<span className="text-danger pl-1">*</span></label>
                                                <div className="input-group ">
                                                    <input placeholder="Min" type="number" name="skillsMinExperience" className="form-control gray-bg col-sm-3 " defaultValue={this.state.skillsMinExperience} onBlur={(e) => { this.state.skillsMinExperience = e.target.value; }}/>
                                                    <input placeholder="Max" type="number" name="skillsMaxExperience" className="form-control gray-bg col-sm-3 ml-3" defaultValue={this.state.skillsMaxExperience}  onBlur={(e) => { this.state.skillsMaxExperience = e.target.value; }} />
                                                    <label className="col-sm-3 ml-3">Years</label>
                                                </div>
                                            </div>
                                            <div className="form-group row mb-2 mt-1">
                                                <label className="control-label job-label">Secondary Skills</label>
                                                <input placeholder="" type="text" name="skillsSecondarySkills" className="form-control gray-bg" defaultValue={this.state.skillsSecondarySkills} onBlur={(e) => { this.state.skillsSecondarySkills = e.target.value; }}  />
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <div className="row pt-3">
                                    <div className="col-sm-12">
                                        <h5>Client Submission Format</h5>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-12 p-2">
                                 
                                      
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
                                            style={{width:"100%"}}
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
                    </div></Row>
*/}
            </div></>);
    }
    handleInput(event) {
        var checkBoxes = ["clientSendRequirement","clientSendHotlist","sendNotification","isNearByClientLocation"]
       
        if(checkBoxes.indexOf(event.target.name) != -1 && event.target.checked)
            this.setState({[event.target.name]:"on"})
        else if (checkBoxes.indexOf(event.target.name) != -1  && !event.target.checked)
            this.setState({[event.target.name]:"off"})
        else
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
        axios.put(apiUrl + 'updateClientDetails', {
            clientName: this.state.clientName,
            contactNo: this.state.contactNo,

            childClients: this.state.clientsList,
            ownership: this.state.clientOwnershipList,
            clientLead: this.state.clientLeadsList,
            clientLeadIds:this.state.clientLeadsIds,
            requiredDocuments: this.state.clientRequiredDocuments,


            country: this.state.country,
            fax: this.state.fax,
            webSite: this.state.webSite,
            status: this.state.status,
            category: this.state.category,
            aboutClient: this.state.aboutClient,
            displayOnJobPosting: this.state.displayOnJobPosting,
            vmsClientName: this.state.vmsClientName,
            clientEmailId: this.state.clientEmailId,
            isNearByClientLocation: this.state.isNearByClientLocation,
            state: this.state.state,
            clientSendRequirement: this.state.clientSendRequirement,
            clientSendHotlist: this.state.clientSendHotlist,
            paymentTerms: this.state.paymentTerms,
           
            federalId: this.state.federalId,
            clientAddress: this.state.clientAddress,
            postalCode: this.state.postalCode,
            postalCity: this.state.postalCity,
            industry: this.state.industry,
            
            practice: this.state.practice,
            clientShortName: this.state.clientShortName,
            sendNotification: this.state.sendNotification,
            primaryOwner: this.state.primaryOwner,
            sess_id: cookies.get("c_csrftoken"),
            clientId:params.get("clientId"),
            clientLeadIds:this.state.clientLeadIds,
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
export default EditClientDetails;