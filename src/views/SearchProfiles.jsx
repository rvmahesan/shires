import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader, Modal, ModalHeader, ModalBody, ModalFooter, Button, CardFooter
} from "reactstrap";

import IFrame from "../components/iFrame/IFrame";
import Cookies from 'universal-cookie';

import ProfileBoxList from "../views/ProfileBoxList";
import {
  candidateSearchUrl, candidateGetUrl
  , apiUrl
} from "../variables/Variables.jsx";
const axios = require("axios").default;
const cookies = new Cookies();

let fileUrl = "";

class SearchProfiles extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      countriesList:[],
      statesList:[],
      profiles: [],
      showResumeModal: false,
      selectedProfiles: [],
      pagingArray: [],
      revPagingArray: [],
      pageNumber: 1,
      pageSize: 20, pagingText: "",
      searchingProfile: false,
      loadMorePaging: true,
      numberOfProfiles: 0,
      templatesList: [],
      sendEmailWindow: false,
      selectedEmailTemplate: "",
      loading: true,
      error: null,
      isSearchloading: false,
      resumeContains: "",
      boolean: false,

      keywords: "communications or php",
      jobTitle: null,
      country:  null,
      state:  null,
      city: null,
      documentPreviewMain: false,
      sess_id:cookies.get("c_csrftoken"),
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

    this.findProfiles = this.findProfiles.bind(this);
    this.selectProfiles = this.selectProfiles.bind(this);
    this.closeResumeModal = this.closeResumeModal.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
    this.closeEmailModal = this.closeEmailModal.bind(this);
    axios.defaults.withCredentials = false;
    this.showResumePreviewModel = this.showResumePreviewModel.bind(this);
    this.selectProfiles = this.selectProfiles.bind(this);
    this.hasChecked = this.hasChecked.bind(this);
  }

  showResumePreviewModel = (id) => {
    this.setState({ documentPreviewMain: true });
    fileUrl = apiUrl + "generateSystemResume?userId=" + (id) + "&sess_id=" + this.state.sess_id + "#zoom100&toolbar=0&navpanes=0&scrollbar=1"
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
    }/**/
  }

  componentDidMount() {
    this.setState({ loading: false });
    let currPageNumber = (window.location.hash) ? window.location.hash.substring(1) : 1;
    if (currPageNumber === "") { currPageNumber = 1 }
    this.setState({ profiles: [], pageNumber: currPageNumber });

    axios.get(apiUrl + "getAllCountriesList",{ params:{ sess_id: this.state.sess_id } })
    .then(({ data }) => {
        this.setState({ countriesList: data,statesList:[],state:"" })
    })
    .catch((err) => { })
  }

  renderLoading() {
    return <Container className="mt-3" fluid>
      <Row>
        <div className="col">
          <Card className="shadow p-3">
            <div className="content profileBox">
              <Col md={12}><center className="mt-4 mb-4"><i className="fa fa-45 fa-spinner fa-spin"></i></center></Col>
            </div>
          </Card>
        </div>
      </Row>
    </Container>;
  }

  renderError() {
    return (
      <div>
        Uh oh: {this.state.error.message}
      </div>
    );
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
    }/**/
  }

  handleSearch(event) {
    this.findProfiles();
  }

  findProfiles = () => {
    this.setState({ isSearchloading: true });
    window.location.hash = '';
    axios.get(candidateSearchUrl, {
      params: {
        keywords: this.state.keywords,
        jobTitle: this.state.jobTitle!=''?this.state.jobTitle:null,
        country: this.state.country!=''?this.state.country:null,
        state: this.state.state!=''?this.state.state:null,
        city: this.state.city!=''?this.state.city:null,
        pageNumber: 1
      }
    }).then(({ data }) => {
      if (data.profileDetails == null)
        alert(data.message);
      if (data.profileDetails != null) {
        this.setState({
          loading: false,
          profiles: data.profileDetails,
          numberOfProfiles: data.numberOfProfiles,
          pagingArray: data.pagingArray,
          searchingProfile: true, isSearchloading: false
        });
        //data.pageNumber
      }
    })
      .catch((err) => { this.setState({ isSearchloading: false }); });

  }
  hasChecked(ids) {
    return this.state.selectedProfiles.indexOf(ids) > -1;
  }
  sendEmail = () => {
    this.setState({ sendEmailWindow: false });
    alert(this.state.selectedEmailTemplate);
    //axios post send email here
  }
  closeEmailModal = () => {
    this.setState({ sendEmailWindow: false });
  }
  closeResumeModal = () => {
    this.setState({ showResumeModal: false });
  }
  viewResume(id, e) {
    this.setState({
      candidateResumeDetails: this.renderLoading(), showResumeModal: true
    });
    axios.get(candidateGetUrl, {
      params: {
        userId: id
      }
    }).then(({ data }) => {
      this.setState({
        candidateResumeDetails: data.candidateDetails[0].resumeDetails,
      });
    }).catch((err) => { });
  }



  render() {
    let profileList = '';
    if (this.state.isSearchloading) {
      profileList = <div className="card">
        <div className="card-body border p-3  text-center" >
          <p><i className="la la-spinner text-primary pt-4 pb-4 la-spin progress-icon-spin"></i></p>
        </div>
      </div>;
    }

    if (this.state.profiles.length >= 1) {
      profileList = <><div className="card">
        <div className="card-body"> <div className="mb-2"><Row><div className="col p-0"><Card className="pl-2 pr-2"><div className="row p-0 pt-0"><div className="table-responsive" style={{ height: '80vh' }}><table className="sticky_table align-items-center table-flush table-centered table"><thead class="thead-light"><tr><th style={{ width: "25vw", paddingLeft: "2vw" }}>Name</th><th style={{ width: "25vw" }}>Email</th><th >Job Title</th><th >Experience</th><th >Work Authorization</th></tr></thead>{this.state.profiles.map((data, index) => {
          return <><tr className="applicantsRow">
            <td style={{ width: "25vw", paddingLeft: "2vw" }}>
            <input
                    type="checkbox"
                    className="checkbox0 inline-checkbox mr-2"
                    name={data.pk}
                    onChange={(e) => this.selectProfiles(data.pk, e)}
                    id={data.pk}
                    defaultValue={true}
                    checked={this.hasChecked(data.pk)}
                  />

              <a target="_blank" href={"../admin/viewCandidateDetails?candDetails=" + data.pk}>{data.fields.firstName} {data.fields.lastName} </a>


              <a id="showResumePreview" className="btn-soft-success btn-outline-success edit-row-button ml-2" onClick={(e) => { this.showResumePreviewModel(data.pk) }}  ><i className="fa fa-binoculars" aria-hidden="true"></i>
              </a>

              <a id="editbutton" target="_blank" className="btn-soft-primary btn-outline-primary edit-row-button ml-1" href={'../admin/editCandidate?userId=' + data.pk}><i className="fa fa-location-arrow" aria-hidden="true"></i>
              </a>
            </td>
            <td style={{ width: "25vw" }}>{data.fields.email}</td>
            <td style={{ width: "25vw" }}>{data.fields.jobTitle}</td>
            <td style={{ width: "25vw" }}>{data.fields.experienceYears !== 0 ? data.fields.experienceYears + " Yrs " : "--"} {data.fields.experienceMonths !== 0 ? data.fields.experienceMonths + " Months " : "--"} </td>
            <td style={{ width: "25vw" }}>{data.fields.workAuthorization}</td>

          </tr></>;
        })}</table></div></div></Card></div></Row></div></div></div>{this.state.selectedProfiles.length >= 1 ? (<div className="cardfooter shadow"><nav className="fixed-bottoms">
       
    
      </nav><div className="col-sm-4 float-left pb-3 pl-0"><button type="button" className="btn-fill btn-sm float-left btn btn-primary mr-3" onClick={this.sendEmailToCandidate}>Send Email</button><h6 className="text-black mt-2"> Selected {this.state.selectedProfiles.length} Profile(s)</h6></div></div>) : ""}</>;
    }
    //else{
    //profileList = "";
    //}

    /*  <td className="" style={{width:"46vw",display:"flex",wordWrap:"break-word",wordBreak:"break-word"}}>
              {data.fields.skills.length>=80?<>{data.fields.skills.substring(0,80)}...</>:data.fields.skills}
              
            </td> 
            */
    let thisObj = this;
    return (<>
      <Modal isOpen={this.state.documentPreviewMain} className={"rightside-modal"}>
        <ModalBody >
          <IFrame src={fileUrl} title={"Quick Preview"} loading={true} />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" className="btn-sm" onClick={(e) => { this.setState({ documentPreviewMain: false }); this.setState({ progressTimer: 0 }); }}>Close</Button>
        </ModalFooter>
      </Modal>
      <div className="row ss">
        <div className="col-sm-12">
          <div className="page-title-box">
            <div className="row pl-2">
              <div className="col ">
                <h4 className="page-title ">Search Profiles</h4>
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
      <div className="mb-2">
        {/* Table */}
        <Row>
          <div className="col p-0">
            <Card>
              <div className="row p-3">
                <div className="col-sm-6">
                  <div className="form-group" >
                    <label className="control-label text-bold pl-1">KEYWORDS</label>
                    <input placeholder="Applicants Search keywords" type="text" className="form-control gray-bg" name="keywords" onKeyPress={this.handleKeyPress.bind(this)} autoComplete="new" onChange={this.handleInput} />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group" >
                    <label className="control-label text-bold pl-1">JOB TITLE</label>
                    <input placeholder="Devops Engineer" type="text" className="form-control gray-bg" name="jobTitle" onKeyPress={this.handleKeyPress.bind(this)} autoComplete="new" onChange={this.handleInput} />
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="form-group" >
                    <label className="control-label text-bold pl-1">COUNTRY</label>
                    <select className="form-control gray-bg" name="country" onChange={this.handleInput}>
                      <option value="">select</option>
                      {this.state.countriesList.map(function(data){
                        return <option value={data.id}>{data.name}</option>;
                      })}
                    </select>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="form-group" >
                    <label className="control-label text-bold pl-1">STATE</label>
                    <select className="form-control gray-bg" name="state" value={this.state.state} onChange={this.handleInput}>
                      <option value="">select</option>
                      {this.state.statesList.map(function(data){
                        return <option value={data.id}>{data.name}</option>;
                      })}
                    </select>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="form-group" >
                    <label className="control-label text-bold pl-1">CITY</label>
                    <input placeholder="City" type="text" className="form-control gray-bg" name="city" onKeyPress={this.handleKeyPress.bind(this)} autoComplete="new" onChange={this.handleInput} />
                  </div>
                </div>
                <div className="col-md-12 ">
                  <div className="col-md-1 pl-0 float-left">
                    <button type="button" onClick={this.handleSearch} className="mt-2 btn-fill pull-left btn btn-primary"><i className="fas fa-search"></i> SEARCH</button>
                  </div>
                  <div className="col-md-4 pl-0 float-left mt-2 pl-0 ">
                    <a onClick={this.handleSearch} className="pull-left link-btn"> Advanced search options</a>
                  </div>
                </div>
              </div>
            </Card></div></Row></div> {profileList} </>);
  }

  handleInput(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
    if(event.target.name==="country"){
        axios.get(apiUrl + "getAllStatesList",{ params: {  sess_id: this.state.sess_id,countryId:event.target.value } })
        .then(( response ) => {
            this.setState({ statesList: response.data })
          //  console.log(response.data)
        })
        .catch((err) => { })
    }
  }

  handleKeyPress(event) {
    if (event.nativeEvent.key === "Enter") {
      this.findProfiles();
    }
  }
}
export default SearchProfiles;