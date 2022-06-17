import React, { Component } from "react";
import {
    Container,
    Row,
    Card,
} from "reactstrap";

import Swal from 'sweetalert2';

import {apiUrl } from "../../variables/Variables.jsx";

import Cookies from 'universal-cookie';

import { Multiselect } from 'multiselect-react-dropdown';
const axios = require("axios").default;
const cookies = new Cookies();
const params = new URLSearchParams(window.location.search);

class EditVendorDetails extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            vendorName: "",
            contactNumber: "",
            country: "",
            zipcode: "",
            primaryOwner: "",
            technologies: "",
            vendorVisibility: "Organization Level",
            federalId: "",
            fax: "",
            state: "",
            sendRequirement: "",
            aboutVendor: "",
            website: "",
            address: "",
            city: "",
            vendorLead: "",
            vendorType: "",
            ownership: "",
            sess_id:cookies.get("c_csrftoken"),

            ownershipIds:[],
            vendorLeadIds:[],
            statesList: [],//axios.get(apiUrl+"getAllStatesList"),
            countriesList: [],//axios.get(apiUrl+"getAllCountriesList"),
            vendorLeads:[],
        

        }
        this.jobRequiredDocumentsList = [{ "name": "Driving License" }, { "name": "EML File" }, { "name": "Passport" }, { "name": "Resume" }, { "name": "SSN" }, { "name": "Transcripts" }];
        this.usersList = [];
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onSelectList = this.onSelectList.bind(this);
        this.onRemoveList = this.onRemoveList.bind(this);
        this.setVendorDetails = this.setVendorDetails.bind(this);
        this.setSelectedValue = this.setSelectedValue.bind(this);
        
        this.onSelectVendorsList = this.onSelectVendorsList.bind(this);
        this.onRemoveVendorsList = this.onRemoveVendorsList.bind(this);

        this.onRemoveOwnershipList = this.onRemoveOwnershipList.bind(this);
        this.onSelectOwnershipList = this.onSelectOwnershipList.bind(this);
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
    componentDidMount() {
        // axios.get(apiUrl+"getAllStatesList")
        axios.all([
            axios.get(apiUrl + "getAllStatesList"),
            axios.get(apiUrl + "getAllCountriesList"),
                //userslist
            axios.get(apiUrl + "getTeamDetailsById",{ params:{sess_id:this.state.sess_id,teamId:"000"}})])
            .then(axios.spread((
                statesList, 
                countriesList,
                teamDetails
                )=>{
                  
                    if(countriesList.status===200 ){ 
                        this.setState({ countriesList: countriesList.data });
                    }
                  //  if(statesList.status==200){ 
                //        this.setState({ statesList: statesList.data })
                //    }
                    if(teamDetails.status===200 && teamDetails.data.statusResponse){ 
                        this.setState({ allUsers: teamDetails.data.allUsers })
                        let usersList = [];
                        this.state.allUsers.map(function(data){
                            usersList.push({"name":data.firstName+" "+data.lastName,value:data.userId})
                        });
                        this.usersList =usersList;
                    }
                    this.setState({formLoading:false});
                }));
            this.setVendorDetails();
    }

    
   setVendorDetails = async () => {
    await axios.get(apiUrl + "getVendorDetails", {
       params: {
          vendorId: params.get('vendorId'),
          sess_id: cookies.get("c_csrftoken")
       }
    }).then(({ data }) => {
       
       // this.state = data;
       this.setState({
          contactNumber:data.vendorDetails.contactNumber,
          vendorName  :data.vendorDetails.vendorName,
          country:data.vendorDetails.country,
          zipcode:data.vendorDetails.zipcode,
          primaryOwner: data.vendorDetails.primaryOwner,
          technologies: data.vendorDetails.technologies,
          vendorVisibility: data.vendorDetails.vendorVisibility,
          federalId:data.vendorDetails.federalId,
          fax: data.vendorDetails.fax,
          state:data.vendorDetails.state,
          sendRequirement: data.vendorDetails.sendRequirement,
          aboutVendor: data.vendorDetails.aboutVendor,
          website: data.vendorDetails.website,
          address: data.vendorDetails.address,
          city: data.vendorDetails.city,
           vendorLead: data.vendorDetails.vendorLead,
          vendorType:data.vendorDetails.vendorType,
          ownership:data.vendorDetails.ownership,
          updatedBy: data.vendorDetails.updatedBy,
          createdBy:data.vendorDetails.createdBy,
          createdDate: data.vendorDetails.createdDate,
          clientId:params.get('clientId') });

          if(data.vendorDetails.country!==""){
            axios.get(apiUrl + "getAllStatesList",{params:{countryId:data.vendorDetails.country}})
            .then(({ data }) => {
                this.setState({ statesList: data })
            })
            .catch((err) => { });
            if(data.vendorDetails.ownershipIds !=="" || data.vendorDetails.ownershipIds !=="[]"){
                this.setState({ownershipIds:eval(data.vendorDetails.ownershipIds)});
            }
            if(data.vendorDetails.vendorLeadIds !=="" || data.vendorDetails.vendorLeadIds !=="[]"){
                this.setState({vendorLeadIds:eval(data.vendorDetails.vendorLeadIds)});
            }
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
      //client ownership list
      onSelectOwnershipList(selectedList, selectedItem) {
        let sts = [];
        let ownershipIds = [];
        for (var i = 0; i < selectedList.length; i++) {
            sts[i] = (selectedList[i].name);
            ownershipIds[i] = selectedList[i].value;
        }
        let sts_ = sts.join(", ");
        this.state.ownership = sts_;
        this.state.ownershipIds = ownershipIds;
    }
    onRemoveOwnershipList(selectedList, selectedItem) {
        let sts = [];
        let ownershipIds = [];
        for (var i = 0; i < selectedList.length; i++) {
            sts[i] = selectedList[i].name;
            ownershipIds[i] = selectedList[i].value;
        }
        let sts_ = sts.join(", ");
        this.state.ownership = sts_;
        this.state.ownershipIds = ownershipIds;
    }
    onSelectVendorsList(selectedList, selectedItem) {
        let sts = [];
        let ownershipIds = [];
        for (var i = 0; i < selectedList.length; i++) {
            sts[i] = (selectedList[i].name);
            ownershipIds[i] = selectedList[i].value;
        }
        let sts_ = sts.join(", ");
        this.state.vendorLead = sts_;
        this.state.vendorLeadIds = ownershipIds;
    }
    onRemoveVendorsList(selectedList, selectedItem) {
        let sts = [];
        let ownershipIds = [];
        for (var i = 0; i < selectedList.length; i++) {
            sts[i] = selectedList[i].name;
            ownershipIds[i] = selectedList[i].value;
        }
        let sts_ = sts.join(", ");
        this.state.vendorLead = sts_;
        this.state.vendorLeadIds = ownershipIds;
    }


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
                                <h4 className="page-title ">Update Vendor</h4>
                            </div>
                            <div className="col-auto align-self-center">
                                <div className="">
                                    <a href={'../admin/vendorsListing'} className="btn-icon btn btn-sm btn-outline-secondary" style={{ marginRight: 10 + 'px' }}>
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
                        <Card className="p-2">


                            <form className="p-3">
                                <div className="row pt-1">
                                    <div className="col-sm-12">
                                        <h5>Business Information</h5>
                                    </div>
                                </div>

                                <div className="row ">
                                    <div className="col-sm-12">
                                        <div className="col-sm-3 mr-sm-1 float-left">
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Vendor Name<span className="text-danger pl-1">*</span></label>
                                                <input placeholder="" name="vendorName" type="text" className="gray-bg form-control" defaultValue={this.state.vendorName} onChange={this.handleInput}/>
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Contact Number</label>
                                                <input placeholder="" type="text" className="form-control gray-bg" name="contactNumber" defaultValue={this.state.contactNumber} onBlur={(e) => { this.state.contactNumber = e.target.value; }}  onChange={this.handleInput}/>
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Country</label>
                                                <select className="form-control gray-bg" name="country" onChange={this.handleInput} value={this.state.country}>
                                                    <option value="">select</option>
                                                    {this.state.countriesList.map((data,$index)=>{
                                                        return <option key={$index} value={data.id}>{data.name}</option>
                                                    })}
                                                </select>
                                            </div>

                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Zip Code</label>
                                                <input placeholder="" type="text" name="zipcode" className="form-control gray-bg" defaultValue={this.state.zipcode} onChange={this.handleInput} />
                                            </div>


                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Primary Owner</label>
                                                <select className="form-control w-100 gray-bg" name="primaryOwner" value={this.state.primaryOwner} onChange={this.handleInput}>
                                                   <option value="">select</option>
                                                    {this.usersList.map(function(data,index){
                                                        return <option value={data.value} key={index}>{data.name}</option>
                                                    })}
                                                </select>


                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Technologies</label>
                                                <input placeholder="" type="text" name="technologies" className="form-control gray-bg" defaultValue={this.state.technologies} onChange={this.handleInput} />
                                            </div>



                                        </div>
                                        <div className="col-sm-4 ml-5 float-left">
                                            <div className="form-group row mb-1">
                                                <label className="control-label job-label">Vendor Visibility</label>
                                                
                                                <select className="form-control gray-bg" name="vendorVisibility" onChange={this.handleInput} value={this.state.vendorVisibility}>
                                                    <option value="">select</option>
                                                    <option value="Organization Level">Organization Level</option>
                                                    <option value="Business Unit">Business Unit</option>
                                                </select>
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Federal ID</label>
                                                <input placeholder="" type="text" className="form-control gray-bg" name="federalId" defaultValue={this.state.federalId} onChange={(e) => { this.state.federalId = e.target.value; }} />
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Fax</label>
                                                <input placeholder="" type="text" className="form-control gray-bg" name="fax" defaultValue={this.state.fax} onChange={(e) => { this.state.fax = e.target.value; }} />
                                            </div>




                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">State</label>
                                                <select className="form-control gray-bg" name="state" onChange={this.handleInput} value={this.state.state}>
                                                    <option value="">select</option>
                                                    {this.state.statesList.map((data,$index)=>{
                                                        return <option  key={$index} value={data.id}>{data.name}</option>
                                                    })}
                                                </select>

                                            </div>
                                            <div className="form-group row mb-4 pt-4">
                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox" onClick={(e)=>{ (e.target.checked)?this.setState({sendRequirement:"on"}):this.setState({sendRequirement:"off"}) }} name="sendRequirement" className="custom-control-input " id="InlineCheckbox" checked={this.state.sendRequirement==="on"?"checked":null}/>
                                                    <label className="custom-control-label control-label job-label" htmlFor="InlineCheckbox">Send Requirement</label>
                                                </div>
                                            </div>



                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">About vendor</label>
                                                <textarea placeholder="" type="text" className="gray-bg form-control" defaultValue={this.state.aboutVendor}  onChange={this.handleInput} name="aboutVendor" ></textarea>
                                            </div>
                                        </div>

                                        <div className="col-sm-4 float-right">
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Website</label>
                                                <input placeholder="" type="text" className="form-control gray-bg" name="website" defaultValue={this.state.website} onChange={(e) => { this.state.website = e.target.value; }} />
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Address</label>
                                                <input placeholder="" type="text" className="form-control gray-bg" name="address" defaultValue={this.state.address} onChange={(e) => { this.state.address = e.target.value; }} />
                                            </div>

                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">City</label>
                                                <input placeholder="" type="text" className="form-control gray-bg" name="city" defaultValue={this.state.city} onChange={(e) => { this.state.city = e.target.value; }} />

                                            </div>

                                            
                                            <div className="form-group row reqDocuments mb-2">
                                                <label className="control-label job-label">Ownership</label>
                                                <div className="">
                                                    <Multiselect className="w-100 gray-bg"
                                                        options={this.usersList} // Options to display in the dropdown
                                                        selectedValues={this.setSelectedValue(this.state.ownership)} // Preselected value to persist in dropdown
                                                        onSelect={this.onSelectOwnershipList} // Function will trigger on select event
                                                        onRemove={this.onRemoveOwnershipList} // Function will trigger on remove event
                                                        displayValue="name" // Property name to display in the dropdown options
                                                        name="vendorLead"
                                                        showCheckbox="true"
                                                        placeholder="Select" 
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Vendor Type</label>
                                                <select className="form-control float-left gray-bg" name="vendorType" onChange={this.handleInput} value={this.state.vendorType}>
                                                    <option value="">select</option>
                                                    <option value="Full time/Lateral">Full time/Lateral</option>
                                                    <option value="Contract/Subcon">Contract/Subcon</option>
                                                    <option value="RPO">RPO</option>
                                                </select>

                                            </div>
                                            <div className="form-group row reqDocuments mt-2">
                                                <label className="control-label job-label">Vendor Lead</label>
                                                <div className="">
                                                    <Multiselect className="w-100 gray-bg"
                                                        options={this.usersList} // Options to display in the dropdown
                                                        selectedValues={this.setSelectedValue(this.state.vendorLead)}
                                                        //selectedValues={this.state.selectedStates} // Preselected value to persist in dropdown
                                                        onSelect={this.onSelectVendorsList} // Function will trigger on select event
                                                        onRemove={this.onRemoveVendorsList} // Function will trigger on remove event
                                                        displayValue="name" // Property name to display in the dropdown options
                                                        name="vendorLead"
                                                        showCheckbox="true"
                                                        placeholder="Select" 
                                                    />
                                                </div>
                                            </div>

                                        </div>

                                    </div>

                                </div>




                                <div className="row col-sm-12 mt-3">
                                    <a href={'../admin/vendorsListing'} className="btn-icon btn btn-sm btn-outline-secondary" style={{ marginRight: 10 + 'px' }}>
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



               {/*<Row>
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
                                                <input placeholder="" type="text" className="gray-bg form-control" defaultValue={this.state.contactPerson} />
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Email Id<span className="text-danger pl-1">*</span></label>
                                                <input placeholder="" type="text" className="gray-bg form-control" defaultValue={this.state.contactPerson} />
                                            </div>



                                        </div>

                                        <div className="col-sm-4 ml-5 float-left">
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Mobile Number<span className="text-danger pl-1">*</span></label>
                                                <input placeholder="" type="text" className="gray-bg form-control" defaultValue={this.state.contactPerson} />
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Designation<span className="text-danger pl-1">*</span></label>
                                                <input placeholder="" type="text" className="gray-bg form-control" defaultValue={this.state.contactPerson} />
                                            </div>
                                        </div>
                                        <div className="col-sm-4 ml-5 float-left">
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Office Number<span className="text-danger pl-1">*</span></label>
                                                <input placeholder="" type="text" className="gray-bg form-control" defaultValue={this.state.contactPerson} />
                                            </div>

                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Payment Terms</label>
                                                <select className="form-control float-left gray-bg" name="projectType" onChange={this.handleInput}>
                                                    <option value="">select</option>
                                                    <option value="Net 7">Net 7</option>
                                                    <option value="Net 10">Net 10</option>
                                                    <option value="Net 15">Net 15</option>
                                                    <option value="Net 30">Net 30</option>
                                                    <option value="Net 45">Net 45</option>
                                                    <option value="Net 60">Net 60</option>
                                                    <option value="Net 90">Net 90</option>
                                                </select>

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
                                                <input placeholder="" type="text" className="gray-bg form-control" defaultValue={this.state.contactFirstName} />
                                            </div>

                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Office Number</label>
                                                <input placeholder="" type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} />
                                            </div>

                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Secondary Email ID</label>
                                                <input placeholder="" type="text" className="gray-bg form-control" defaultValue={this.state.contactSecondaryEmail} />
                                            </div>

                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Address 1</label>
                                                <input placeholder="" type="text" className="gray-bg form-control" defaultValue={this.state.jobCode} />
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">State</label>
                                                <input placeholder="" type="text" className="gray-bg form-control" defaultValue={this.state.contactState} />
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">LinkedIn Profile URL</label>
                                                <input placeholder="" type="text" className="gray-bg form-control" defaultValue={this.state.jobCode} />
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Google+ Profile URL</label>
                                                <input placeholder="" type="text" className="gray-bg form-control" defaultValue={this.state.contactGoogleProfileUrl} />
                                            </div>

                                        </div>
                                        <div className="col-sm-4 ml-5 float-left">
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Last Number</label>
                                                <input placeholder="" type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} />
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Mobile Number</label>
                                                <input placeholder="" type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} />
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Primary Owner</label>
                                                <input placeholder="" type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} />
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Address 2</label>
                                                <input placeholder="" type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} />
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">City</label>
                                                <input placeholder="" type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} />
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Facebook Profile URL</label>
                                                <input placeholder="" type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} />
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Status</label>
                                                <input placeholder="" type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} />
                                            </div>

                                        </div>
                                        <div className="col-sm-4 float-right">
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Designation</label>
                                                <input placeholder="" type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} />
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Email ID</label>
                                                <input placeholder="" type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} />
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Ownership</label>
                                                <input placeholder="" type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} />
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Country</label>
                                                <input placeholder="" type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} />
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Zip Code</label>
                                                <input placeholder="" type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} />
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Twitter Profile URL</label>
                                                <input placeholder="" type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} />
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">Client Group</label>
                                                <input placeholder="" type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} />
                                            </div>

                                        </div>




                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="col-sm-7 mr-sm-1 float-left">
                                            <div className="form-group row mb-2">
                                                <label className="control-label job-label">About the Contact</label>
                                                <textarea placeholder="" type="text" className="gray-bg form-control" defaultValue={this.state.contactOfficeNumber} ></textarea>
                                            </div>
                                        </div>
                                    </div>

                                </div>


                            </form>
                        </Card>
                    </div>
</Row>*/}
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

        this.setState({
            [event.target.name]: event.target.value
        });
        if(event.target.name==="country"){
            this.setState({ statesList:[]});
            axios.get(apiUrl + "getAllStatesList",{params:{countryId:event.target.value}})
            .then(({ data }) => {
                
                this.setState({ statesList: data })
            })
            .catch((err) => { })
        }
    }

    handleSubmit(event) {
        axios.put(apiUrl + 'updateVendorDetails',  { vendorName: this.state.vendorName,
            contactNumber: this.state.contactNumber,
            country:this.state.country,
            zipcode: this.state.zipcode,
            primaryOwner: this.state.primaryOwner,
            technologies: this.state.technologies,
            vendorVisibility: this.state.vendorVisibility,
            federalId:this.state.federalId,
            fax:this.state.fax,
            state:this.state.state,
            sendRequirement: this.state.sendRequirement,
            aboutVendor: this.state.aboutVendor,
            website:this.state.website,
            address: this.state.address,
            city: this.state.city,
            vendorLead: this.state.vendorLead,
            vendorType: this.state.vendorType,
            ownership: this.state.ownership,
        
            ownershipIds:this.state.ownershipIds,
           // vendorLeads:this.state.vendorLeads,
            vendorLeadIds:this.state.vendorLeadIds,
        
            sess_id: this.state.sess_id,
            vendorId:params.get("vendorId")}).then(({ data }) => {
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
export default EditVendorDetails;