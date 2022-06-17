import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader, Modal, ModalHeader, ModalBody, ModalFooter, Button, CardFooter
} from "reactstrap";

import IFrame from "../../components/iFrame/IFrame";
import Cookies from 'universal-cookie';
import {
  candidateSearchUrl, candidateGetUrl
  , apiUrl
} from "../../variables/Variables.jsx";
import { CKEditor } from 'ckeditor4-react';
import SearchEmailProfileListing from "./SearchEmailProfileListing"

const axios = require("axios").default;
const cookies = new Cookies();

let fileUrl = "";
const params = new URLSearchParams(window.location.search);
class SendEmailCandidates extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      fromEmail:""
      ,sessionId:"",
      profiles: [],
      emailContent:"",
      emailSubject:"",



      showResumeModal: false,
      selectedProfiles: [],
      pageNumber: 1,
      templatesList: [],
      sendEmailWindow: false,
      selectedEmailTemplate: "",
      loading: true,
      isSearchloading: false,
      boolean: false,

      sess_id:cookies.get("c_csrftoken"),
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmailDescription = this.handleEmailDescription.bind(this);



    this.sendEmail = this.sendEmail.bind(this);
    this.selectProfiles = this.selectProfiles.bind(this);
    this.closeResumeModal = this.closeResumeModal.bind(this);
    this.setJobActions = this.setJobActions.bind(this);
    this.closeEmailModal = this.closeEmailModal.bind(this);
    axios.defaults.withCredentials = false;
    this.showResumePreviewModel = this.showResumePreviewModel.bind(this);
    this.selectProfiles = this.selectProfiles.bind(this);
    this.hasChecked = this.hasChecked.bind(this);
  }
  handleEmailDescription = (text)=>{
      this.setState({
        emailContent: text.editor.getData()
      });
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
    let pageId = params.get("pageId");

    //this.setState({ profiles: [], pageNumber: currPageNumber });

    axios.get(apiUrl + "getEmailList",{ params:{ sess_id: this.state.sess_id, pageId:pageId } })
    .then(({ data }) => {
        if(data.statusResponse)
          this.setState({profiles:data.candidatesList,fromEmail:data.fromEmail,sessionId:data.sessionId});
        //this.setState({ countriesList: data,statesList:[],state:"" })
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

  handleSubmit(event) {
    this.sendEmail();
  }

  sendEmail = () => {
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
  setJobActions = (e) => {
   // alert(this.state.selectedProfiles.length)
    if(e.target.value=="sendEmail"){
      let frmPrf = new FormData();
      frmPrf.append("selectedProfiles",this.state.selectedProfiles);

      axios.post(apiUrl+"sendEmailCandidate",frmPrf).then((data)=>{
        alert(data);
        if(data.statusResponse){
          window.location.href = "../sendEmailCandidates/"+data.pageId
        }
      });
    }else if(e.target.value="sendJob"){

    }
    //this.setState({ sendEmailWindow: false });
    //alert(this.state.selectedEmailTemplate);
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

      profileList = this.state.profiles.map((data)=>{
        return <SearchEmailProfileListing candidateName={data.candidateName} email={data.email} />
      }) ;
    }
    const rBoxStyle = {
      height:"75vh",
      overflowY:"scroll"
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
                <h4 className="page-title ">Send Email</h4>
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
          <div className="col p-0 col-sm-8">
            <Card>
              <div className="row p-3">
                <div className="col-sm-4">
                  <div className="form-group" >
                    <label className="control-label text-bold pl-1">From Email</label>
                    <input placeholder="from " type="text" className="form-control gray-bg" name="fromEmail" value={this.state.fromEmail} disabled={true} />
                  </div>
                </div>
                <div className="col-sm-12">
                  <div className="form-group" >
                    <label className="control-label text-bold pl-1">Subject</label>
                    <input placeholder="Subject" type="text" className="form-control gray-bg" name="emailSubject" onKeyPress={this.handleKeyPress.bind(this)} autoComplete="new" onChange={this.handleInput} />
                  </div>
                </div>

                <div className="col-sm-12">
                  <div className="form-group" >
                    <label className="control-label text-bold pl-1">Content</label>
                    <CKEditor
                          initData={this.state.emailContent}
                          name="Mail content"
                          className="templateDescriptionEditor"
                          onChange={this.handleEmailDescription}
                          style={{ width: "100%" }}
                      />

                  </div>
                </div>

              
                <div className="col-md-12 ">
                  <div className=" pl-0 float-left">
                    <button type="button" onClick={this.handleSubmit} className="btn-fill pull-left btn btn-primary"><i className="fas fa-envelope"></i> Send</button>
                  </div>
                  
                </div>
              </div>
            </Card></div>
            <div className="col-sm-4"  style={rBoxStyle}>
            {profileList}
              </div>
            </Row></div>  </>);
  }

  handleInput(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
    if(event.target.name==="country"){
        this.setState({statesList:[]});
        this.candidateDetails.state=null;
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
export default SendEmailCandidates;