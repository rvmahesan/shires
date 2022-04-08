import React, { Component } from "react";
import { Grid } from "react-bootstrap";
import { candidatesListUrl } from "../variables/Variables.jsx";

import IFrame from "../components/iFrame/IFrame";

import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  Table, Tooltip, Input, ModalBody, Modal, ModalFooter, Button
} from "reactstrap";
import Common from "../views/commons/Common.jsx"
import Cookies from 'universal-cookie';
import { apiUrl } from "../variables/Variables.jsx";
import Swal from 'sweetalert2';

const cookies = new Cookies();
const axios = require("axios").default;
const userType = new Common().getUserType();
//axios.defaults.credentials = 'same-origin';
//axios.defaults.withCredentials = false;
//axios.defaults.headers.common['Can-Auth-Token'] = 'c22d3c3360cd39bf40847e17c2497be4a6ffd758'

let fileUrl = "";
class Candidates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updatesinTotal: 0,
      updatesinExp: 0,
      posts: [],
      loading: true,
      error: null,
      numberOfCandidates: 0,
      pageSize: 20,
      pageNumber: 1,
      nextLink: "",
      previousLink: "",
      filterCandidate: "",
      offset: "",
      sets_pageNumber: 1,
      documentPreviewMain: false, applicationStatusEdit: false, selectedCandidateId: 0, newApplicationStatusComment: "", newApplicationStatus: "", searchCondition: "any"
    };
    this.loadPrevious = this.loadPrevious.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.loadNext = this.loadNext.bind(this);
    this.findCandidate = this.findCandidate.bind(this);
    axios.defaults.withCredentials = false;
    this.showResumePreviewModel = this.showResumePreviewModel.bind(this);
    this.showApplicationEditModel = this.showApplicationEditModel.bind(this);
    this.loadCandidateList = this.loadCandidateList.bind(this);
    //axios.defaults.headers.common['Authorization'] = 'Token '+cookies.get("c_csrftoken");
  }
  handleInput(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  showResumePreviewModel = (id) => {
    this.setState({ documentPreviewMain: true });
    fileUrl = apiUrl + "generateSystemResume?candidateId=" + (id) + "&sess_id=" + cookies.get("c_csrftoken") + "#zoom100&toolbar=0&navpanes=0&scrollbar=1"
  }
  showApplicationEditModel = (id, appStatus) => {
    this.setState({ selectedCandidateId: id, applicationStatusEdit: true, newApplicationStatus: appStatus });
  }

  updateCandidateApplicationStatus = () => {
    //this.setState({selectedCandidateId:id,applicationStatusEdit:true,newApplicationStatus:appStatus});
    if (this.state.selectedCandidateId == "") {
      Swal.fire('Oops...', 'Error Occured', 'error'); return;
    }
    if (this.state.newApplicationStatus == "") {
      Swal.fire('Oops...', 'Invalid input', 'error'); return;
    }

    let fData = new FormData();
    fData.append("candidateId", this.state.selectedCandidateId);
    fData.append("applicantStatus", this.state.newApplicationStatus);
    fData.append("applicantStatusComment", this.state.newApplicationStatusComment);
    fData.append("sess_id", cookies.get("c_session_id"));

    axios.post(apiUrl + "updateCandidateApplicationStatus", fData).then(({ data }) => {
      if (data.statusResponse) {
        this.setState({ applicationStatusEdit: false, newApplicationStatus: "", newApplicationStatusComment: "" });
        //this.showAlert("br","success","Candidate created successsfully","pe-7s-check");
        let timerInterval;
        this.loadCandidateList();
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
        Object.keys(data.message).map((e, i) => {
          errMsg += "<br/>- " + (data.message[e]);

        });
        Swal.fire('Error', errMsg, 'error'); return;
      }
    });//axios end



  }
  loadCandidateList = () => {
    this.setState({ loading: true });
    let currPageNumber = parseInt((window.location.hash) ? window.location.hash.substring(1) : 0);
    //currPageNumber = 0;
    var currpag = (currPageNumber * 10);
    axios.get(apiUrl + "listCandidates", {
      params: { offset: (currPageNumber * 10), __daa: Date.now(), sess_id: cookies.get("c_csrftoken") }
    })
      .then(({ data }) => {
        this.setState({ loading: false });
        if (data.count > 0) {
          this.setState({ candidates: data.results });
          this.setState({ nextLink: data.next })
          this.setState({ previousLink: data.previous })
          this.setState({ pageNumber: currPageNumber });
          this.setState({ numberOfCandidates: data.count });
          var nocand = this.state.numberOfCandidates;
          if (nocand < currpag) {
            this.setState({ numberOfCandidates: 0 });
            this.setState({ candidates: [] });
          }
        }

      })
      .catch((err) => { })
  }
  componentDidMount() {
    this.loadCandidateList();
  }
  findCandidate(event) {
    if (this.state.filterCandidate.length <= 3 && this.state.filterCandidate.length !== 0)
      return false;
    this.setState({ loading: true });
    axios.get(candidatesListUrl, { params: { offset: this.state.offset, searchKey: this.state.searchCondition, search: this.state.filterCandidate, __daa: Date.now(), sess_id: cookies.get("c_csrftoken") } })
      .then(({ data }) => {
        this.setState({ loading: false });
        this.setState({ candidates: data.results });
        this.setState({ previousLink: data.previous })
        this.setState({ nextLink: data.next })
        this.setState({ pageNumber: 1 });
        this.setState({ numberOfCandidates: data.count })
      })
      .catch((err) => { })
  }


  loadNext(event) {
    let currPageNumber = parseInt((window.location.hash) ? window.location.hash.substring(1) : this.state.pageNumber);
    currPageNumber++;
    //localStorage.setItem("currentPage",this.state.pageNumber);
    // #alert(localStorage.getItem("currentPage"));
    this.setState({ loading: true });
    axios.get(this.state.nextLink)
      .then(({ data }) => {
        this.setState({ loading: false });
        this.setState({ candidates: data.results });
        this.setState({ nextLink: data.next });
        this.setState({ previousLink: data.previous })
        this.setState({ pageNumber: currPageNumber });
        this.setState({ numberOfCandidates: data.count })
      }).catch((err) => { })

  }


  loadPrevious(event) {
    let currPageNumber = parseInt((window.location.hash) ? window.location.hash.substring(1) : this.state.pageNumber);
    currPageNumber--;

    this.setState({ loading: true });
    axios.get(this.state.previousLink)
      .then(({ data }) => {
        this.setState({ loading: false });
        this.setState({ candidates: data.results });
        this.setState({ previousLink: data.previous })
        this.setState({ nextLink: data.next })
        this.setState({ pageNumber: currPageNumber });
        this.setState({ numberOfCandidates: data.count })
      })
      .catch((err) => { })
  }



  renderLoading() {
    return <div className="content"><div className="container-fluid"> <Row>
      <Col md={12}><i className="fa fa-spinner fa-spin"></i><Card
        title=""
        category=""
        cttablefullwidth="'"
        cttableresponsive=""
        content={<center></center>} /></Col></Row></div></div>;
  }


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

  isToolTipOpen = targetName => {
    return this.state[targetName] ? this.state[targetName].tooltipOpen : false;
  };

  renderError() {
    return (
      <div>
        Uh oh: {this.state.error.message}
      </div>
    );
  }
  componentDidUpdate() {


  }
  renderPosts() {
    let currPageNumber = (window.location.hash) ? window.location.hash.substring(1) : 0;
    if (this.state.loading) {
      document.body.style.cursor = 'wait';
      tableData = <tr><td colSpan="12" className="text-center p-3"><i className="fa fa-spinner fa-45 fa-spin"></i></td></tr>;
    }
    const addCandLink = "";
    if (!this.state.loading) {
      document.body.style.cursor = 'default';

      var tableData = [];
      var userTpe = null;

      tableData = this.state.numberOfCandidates >= 1 ? <>{this.state.candidates.map((obj, index, thisObj) => {
        var idValue = obj.id;
        var nameCol = "nameCont"+index;
        return <tr key={index} className="applicantsRow">
          <td className="idColumn">{obj.id}   </td>
          <td className="nameColumn">
            <a target="_blank" id={nameCol} href={`../admin/viewCandidateDetails?candDetails=${idValue}`}>{obj.firstName} {obj.middleName} {obj.lastName}
            </a>
            <Tooltip
        placement="bottom"
        isOpen={this.isToolTipOpen(nameCol)}
        target={nameCol}
        toggle={() => this.toggle(nameCol)}
      >{obj.createdDate !== "" ? new Date(obj.createdDate).toDateString() : "--"}
      {obj.createdBy !== "" ? obj.createdBy : "Admin"}
      </Tooltip>
            <a id="showResumePreview" className="btn-soft-success btn-outline-success edit-row-button ml-2" onClick={(e) => { this.showResumePreviewModel(obj.id) }}  ><i className="fa fa-binoculars" aria-hidden="true"></i>
            </a>
            <a id="editbutton" target="_blank" className="btn-soft-primary btn-outline-primary edit-row-button ml-1" href={'../' + userType + '/editCandidate?candidateId=' + idValue + "&currPageNumber=" + currPageNumber}><i className="fa fa-location-arrow" aria-hidden="true"></i>
            </a>
            
          </td>
          <td className="emailColumn">{obj.email}</td>
          <td className="mobileColumn">{obj.phone}</td>
          <td className="workauthorizationColumn">{obj.workAuthorization !== "" ? obj.workAuthorization : "--"}</td>
          <td className="cityColumn">{obj.location !== "" ? obj.location : "--"}</td><td className="stateColumn">{obj.state !== "" ? obj.state : "--"}</td>
          <td className="sourceColumn">{obj.source !== "" ? obj.source : "--"}</td>
          <td className="appStatusColumn">{obj.applicantStatus !== "" ? <span>{obj.applicantStatus} <a id="editbutton" title="Edit applicant status" className="btn-soft-primary btn-outline-primary edit-row-button ml-1" onClick={(e) => this.showApplicationEditModel(idValue, obj.applicantStatus)}><i className="fa fa-pen" aria-hidden="true"></i>
          </a></span> : "--"}</td>
          <td className="jobtitleColumn">{obj.jobTitle !== "" ? obj.jobTitle : "--"}</td> 
        </tr>;

      })}<Tooltip
        placement="bottom"
        isOpen={this.isToolTipOpen("editbutton")}
        target="editbutton"
        toggle={() => this.toggle("editbutton")}
      >
          Edit
        </Tooltip>
        <Tooltip
          placement="bottom"
          isOpen={this.isToolTipOpen("showResumePreview")}
          target="showResumePreview"
          toggle={() => this.toggle("showResumePreview")}
        >
          Show Resume Preview
        </Tooltip></> : "";
      if (this.state.numberOfCandidates === 0) {
        document.body.style.cursor = 'default';
        tableData = <tr><td colSpan="12" className="text-center p-3">No Records Found</td></tr>;
      }
    }
    return (<><div className="row">
      <div className="col-sm-12">
        <div className="page-title-box">
          <div className="row">
            <div className="col">
              <div className="col-sm-6 float-left">
                <h4 className="page-title">Candidates List</h4>
              </div>

              <div className="col-sm-6 float-right">
                <div className="col-sm-2 float-left">
                  <a style={{ marginRight: 2 + '%' }} size="sm " href={"../" + userType + "/createCandidate"} className="btn btn-sm btn-primary ">
                    <i className="fas fa-plus mr-2"></i>
                    Add New</a>
                </div>
                <div className="col-sm-4 float-left">


                  <div className="input-group">
                    <Input
                      className="form-control pagenumber"
                      aria-label="Go To Page number"
                      name="pagenumber"
                      type="number"

                      id="Pagenumber" title="Click Enter or Tab"
                      onBlur={(e) => { window.location.href = "../" + userType + "/candidates#" + (e.target.value); window.location.reload(); }} placeholder="#Pagenumber"
                      onKeyDown={(e) => { if (e.key == 'Enter') { window.location.href = "../" + userType + "/candidates#" + (e.target.value); window.location.reload(); } }}
                       />
                    {/*"Current Page - "+this.state.pageNumber*/}

                    <Tooltip
                      placement="bottom"
                      isOpen={this.isToolTipOpen("Pagenumber")}
                      target="Pagenumber"
                      toggle={() => this.toggle("Pagenumber")}
                    >
                      Press Enter or Tab key to traverse
                    </Tooltip>

                  </div>

                </div>

                <div className="col-sm-6 float-left">
                  <div className="input-group">
                    <select className="form-control col-sm-4" name="searchCondition" onChange={(e) => this.setState({ searchCondition: e.target.value })}>
                      <option value="any">Any</option>
                      <option value="name">Applicant Name</option>
                      <option value="email">Email Address</option>
                      <option value="phone">Mobile Number</option>
                      <option value="skills">Skills</option>
                    </select>
                    <input type="text" id="searchkey" name="filterCandidate" className="form-control" onChange={(e) => {
                      this.state.filterCandidate = e.target.value; this.findCandidate(e); this.setState
                        ({ pageNumber: 0 });
                    }} placeholder="" aria-label="Search for..." autoComplete="off" />
                    <span className="input-group-append">
                      <button className="btn btn-primary waves-effect waves-light" onClick={this.findCandidate} type="button"><i className="fas fa-search"></i></button>
                    </span>
                    <Tooltip
                      placement="bottom"
                      isOpen={this.isToolTipOpen("searchkey")}
                      target="searchkey"
                      toggle={() => this.toggle("searchkey")}
                    >
                      Search in candidate name
                    </Tooltip>

                  </div>
                </div>


              </div>




            </div>
            <div className="col-auto align-self-center">

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
              <div className="table-responsive" >
                <Table className="sticky_table table-striped align-items-center align-items-center table-flush table-centered table candidates-list table-flush table-centered lh-24" responsive>
                  <thead className="thead-light sticky-header">
                    <tr>
                      <th scope="" className="idColumn">ID</th>
                      <th scope=" nameColumn" className="nameColumn">Name</th>
                      <th scope=" title" className="emailColumn">Email Address</th>
                      <th scope=" title" className="mobileColumn">Mobile Number</th>
                      <th scope=" title" className="workauthorizationColumn">Work Authorization</th>

                      <th scope=" title" className="cityColumn">City</th>
                      <th scope=" title" className="stateColumn">State</th>
                      <th scope=" title" className="sourceColumn">Source</th>
                      <th scope=" title" className="appStatusColumn">Applicant Status</th>

                      <th scope=" title" className="jobtitleColumn">Job Title</th>
                    </tr>
                  </thead>
                  <tbody >
                    {tableData}
                  </tbody>
                  <tfoot><tr>
                    <td colSpan="4" >Number of candidates : {this.state.numberOfCandidates}</td>
                    <td colSpan="8" className="">
                      {(this.state.numberOfCandidates >= 10) ? <ul className="pt-2 mt-2 justify-content-end mb-0 pagination">
                        <li className="page-item ">
                          {this.state.previousLink != null ? <a href={"#" + (this.state.pageNumber - 1)} onClick={this.loadPrevious} className="page-link "><i className="typcn  typcn-chevron-left-outline "></i><span className="sr-only">{ }Previous</span></a> : ""}
                        </li>
                        <li className="page-item">
                          {(this.state.nextLink != null) ? <a href={"#" + (this.state.pageNumber + 1)} onClick={this.loadNext} className="page-link "><i className="typcn typcn-chevron-right-outline "></i><span className="sr-only">Next</span></a> : ""}

                        </li>
                      </ul> : ""}
                    </td>
                  </tr>
                  </tfoot>
                </Table>
              </div>
            </Card>
          </div></Row></div>

      <Modal isOpen={this.state.documentPreviewMain} className={"rightside-modal"}>
        {/* <div className="modal-header respreview-header">
               <h6 className="modal-title m-0" id="exampleModalDefaultLabel">Preview Resume</h6>
               <button type="button" className="close float-right" onClick={(e) => { this.setState({ documentPreviewMain: false }); this.setState({ progressTimer: 0 }); }}>
                  <span aria-hidden="true"><i className="la la-times"></i></span>
               </button>
            </div>
 */}
        <ModalBody >
          <IFrame src={fileUrl} title={"Quick Preview"} loading={true} />
        </ModalBody><ModalFooter>
          <Button color="secondary" className="btn-sm" onClick={(e) => { this.setState({ documentPreviewMain: false }); this.setState({ progressTimer: 0 }); }}>Close</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={this.state.applicationStatusEdit}>
        <div className="modal-header">
          <h6 className="modal-title m-0" id="exampleModalDefaultLabel">Applicant Status</h6>
          <button type="button" className="close float-right" onClick={(e) => { this.setState({ applicationStatusEdit: false }); this.setState({ progressTimer: 0 }); }}>
            <span aria-hidden="true"><i className="la la-times"></i></span>
          </button>
        </div>

        <ModalBody >
          <div className="row p-3">
            <div className="col-md-12">
              <div className="form-group row">
                <label className="control-label col-form-label text-left col-sm-4">Applicant Status</label>
                <select className="form-control col-sm-8" name="newApplicationStatus" value={this.state.newApplicationStatus} onChange={this.handleInput}>
                  <option value="">Select Status</option>
                  <option value="Do Not call">Do Not call (Allowed to submit)</option>
                  <option value="Do Not Submit">Do Not Submit (Not allowed to submit)</option>
                  <option value="New lead">New lead (Allowed to submit)</option>
                  <option value="Out of market">Out of market (Allowed to submit)</option>
                  <option value="Placed">Placed (Allowed to submit)</option>
                </select>
              </div>
            </div>

            <div className="col-md-12">
              <div className="form-group row">
                <label className="control-label col-form-label text-left col-sm-4">Comment</label>
                <textarea style={{ resize: "none", height: "12vh" }} type="text" autoComplete="new" placeholder="Comment" className="form-control col-sm-8" name="newApplicationStatusComment" name="newApplicationStatusComment" defaultValue={this.state.newApplicationStatusComment} autoComplete="new" onChange={this.handleInput}></textarea>
              </div>
            </div>

          </div>

        </ModalBody><ModalFooter>
          <Button color="primary" className="btn-sm" onClick={(e) => { this.updateCandidateApplicationStatus(); }}>Submit</Button>
          <Button color="secondary" className="btn-sm" onClick={(e) => { this.setState({ applicationStatusEdit: false, newApplicationStatus: "", newApplicationStatusComment: "" }); }}>Close</Button>
        </ModalFooter>
      </Modal>

    </>);
  }

  render() {
    let currPageNumber = (window.location.hash) ? window.location.hash.substring(1) : 0;
    return (this.renderPosts());
  }
}
export default Candidates;
