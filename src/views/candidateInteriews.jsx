import React, { Component } from "react";
import { candidatesListUrl, apiUrl } from "../variables/Variables.jsx";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  Table,
  CardFooter, Button,
  Modal, ModalHeader, ModalBody, ModalFooter, Tooltip, Spinner
} from "reactstrap";

import Cookies from 'universal-cookie';
import StarRatings from 'react-star-ratings';
import Swal from 'sweetalert2';

const cookies = new Cookies();
const axios = require("axios").default;

//axios.defaults.credentials = 'same-origin';
//axios.defaults.withCredentials = false;
//axios.defaults.headers.common['Can-Auth-Token'] = 'c22d3c3360cd39bf40847e17c2497be4a6ffd758'


class CandidateInterviews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updatesinTotal: 0,
      updatesinExp: 0,
      posts: [],
      candidates: [],
      loading: true,
      error: null,
      numberOfInterviews: 0,
      pageSize: 20,
      pageNumber: 1,
      nextLink: "",
      previousLink: "",
      filterCandidate: "",
      offset: "",
      selectedInterviewId: 0,
      selectedSubmissionId: 0,
      selectedCandidateSkillArray: [],
      selectedCandidateInterviewFeedbackArray: [],
      selectedCandidateInterviewFeedback: "",
      renderSkillsInput: "",
      showInterviewModal: false,
      showInterviewResultModal: false,
      interviewResultHtml: "",
    };
    this.loadPrevious = this.loadPrevious.bind(this);
    this.loadNext = this.loadNext.bind(this);
    //this.findCandidate = this.findCandidate.bind(this);
    axios.defaults.withCredentials = false;
    this.updateInterview = this.updateInterview.bind(this);
    this.setSkillRating = this.setSkillRating.bind(this);
    this.submitInterviewFeedback = this.submitInterviewFeedback.bind(this);
    this.viewInterdetails = this.viewInterdetails.bind(this);
    this.isToolTipOpen = this.isToolTipOpen.bind(this);
  }

  componentDidMount() {

    this.setState({ loading: true });
    let currPageNumber = parseInt((window.location.hash) ? window.location.hash.substring(1) : 0);
    //currPageNumber = 0;
    axios.get(apiUrl + "listAllInterviews", {
      params: { offset: (currPageNumber * 10), __daa: Date.now(), sess_id: cookies.get("c_csrftoken") },
    })
      .then(({ data }) => {
        this.setState({ loading: false });
        this.setState({ candidates: data.results });
        this.setState({ nextLink: data.next })
        this.setState({ previousLink: data.previous })
        this.setState({ pageNumber: 0 });
        this.setState({ numberOfInterviews: data.count })
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

  viewInterdetails(event, interviewId) {
    this.setState({ loading: true });

    axios.get(apiUrl + "getInterviewDetails", { params: { interviewId: interviewId, sess_id: cookies.get("c_csrftoken") } })
      .then(({ data }) => {
        this.setState({ loading: false, showInterviewResultModal: true });
        if (data.statusResponse) {
          // this.setState({ candidates: data.results });
          this.setState({
            interviewResultHtml: <><div className="form-group row">
              <label className="control-label col-sm-4">Candidate Name </label>
              <label className="control-label col-sm-4">{data.interviewDetails[0].candidateName} </label>
            </div>
              <div className="form-group row">
                <label className="control-label col-sm-4">Candidate Email </label>
                <label className="control-label col-sm-4">{data.interviewDetails[0].candidateEmail} </label>
              </div>
              <div className="form-group row">
                <label className="control-label col-sm-4">Interview Channel</label>
                <label className="control-label col-sm-4">{data.interviewDetails[0].channel} </label>
              </div>
              <div className="form-group row">
                <label className="control-label col-sm-4">Recruiter Comments</label>
                <label className="control-label col-sm-4">{data.interviewDetails[0].interviewComments} </label>
              </div>
              <div className="form-group row">
                <label className="control-label col-sm-4">Scheduled Datetime</label>
                <label className="control-label col-sm-4">{(new Date(data.interviewDetails[0].scheduledDate))} </label>
              </div>
              <div className="form-group row">
                <label className="control-label col-sm-4">Scheduled By</label>
                <label className="control-label col-sm-4">{data.interviewDetails[0].createdBy} </label>
              </div>
              {data.skillDetails.length >= 1 ? <>
                <hr className="dash-border" />
                {data.skillDetails.map((obj, index) => {
                  return <div className="form-group row">
                    <label className="control-label col-sm-4" title={"Updated by - " + obj.createdByName + " " + (new Date(obj.createdDate))}>{obj.skillName}
                    </label>
                    <StarRatings
                      key={index}
                      rating={obj.skillValue}
                      starRatedColor="goldenrod"
                      numberOfStars={5}
                      starDimension="20px"
                      starSpacing="5px"
                      name={obj.key}

                    />
                    {(obj.skillValue == 1) ? <span className="pl-3 text-danger">Below Average</span> : ""}
                    {(obj.skillValue == 2) ? <span className="pl-3 text-info"> Average</span> : ""}
                    {(obj.skillValue == 3) ? <span className="pl-3 text-info"> Ok</span> : ""}
                    {(obj.skillValue == 4) ? <span className="pl-3 text-info">Good</span> : ""}
                    {(obj.skillValue == 5) ? <span className="pl-3 text-success">Great</span> : ""}
                  </div>;
                })}
              </> : <></>}
              {data.feedbackDetails.length >= 1 ? <>
                <hr className="dash-border" />
                {data.feedbackDetails.map((obj, index) => {
                  return <div className="form-group row">
                    <label className="control-label col-sm-12">{obj.interviewComments}</label>
                    <label className="text-muted"> - {obj.createdByName} {new Date(obj.createdDate).toDateString()}</label>

                  </div>;
                })}
              </> : <></>}

            </>
          });
        }
      })
      .catch((err) => { })
  }  /**/
  updateInterview = (interviewId, skills, submissionId) => {
    this.setState({ selectedInterviewId: interviewId, showInterviewModal: true, selectedSubmissionId: submissionId });
    var skillsArray = skills.split(",");
    var skInp = "";
    var skillsDictionary = [];
    if (skills !== "") {
      skillsArray.map((obj, ind) => {
        skillsDictionary.push({ key: obj, value: 0 });
      });
      this.setState({ selectedCandidateSkillArray: skillsDictionary });
    }
    //selectedCandidateSkillArray
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
        this.setState({ nextLink: data.next })
        this.setState({ previousLink: data.previous })
        this.setState({ pageNumber: 0 });
        this.setState({ numberOfInterviews: data.count })
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
        this.setState({ nextLink: data.next })
        this.setState({ previousLink: data.previous })
        this.setState({ pageNumber: 0 });
        this.setState({ numberOfInterviews: data.count })
      })
      .catch((err) => { })
  }


  renderLoading() {
    return <div className="content"><div className="container-fluid"> <Row>
      <Col md={9}><i className="fa fa-spinner fa-spin"></i><Card
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
  submitInterviewFeedback() {
    console.clear();
    console.log(this.state.selectedCandidateSkillArray);
    axios.post(apiUrl + "updateInterview", {
      skillsArray: this.state.selectedCandidateSkillArray,
      interviewId: this.state.selectedInterviewId,
      interviewFeedback: this.state.selectedCandidateInterviewFeedback,
      submissionId: this.state.selectedSubmissionId,
      sess_id: cookies.get("c_csrftoken"),
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
            this.setState({ selectedInterviewId: 0, showInterviewModal: false });
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

  setSkillRating(skillName, index, rateValue) {
    //console.log(skillName,ind,newRateValue)
    //this.state.selectedCandidateSkillArray({skillName:newRateValue});

    this.state.selectedCandidateSkillArray[index].value = rateValue;
    this.setState({ selectedCandidateSkillArray: this.state.selectedCandidateSkillArray });
  }
  renderPosts() {

    var skillInp = this.state.selectedCandidateSkillArray.map((obj, index) => {

      return <div className="form-group row">
        <label className="control-label col-sm-4">{obj.key}</label>
        <StarRatings
          key={index}
          rating={obj.value}
          starRatedColor="goldenrod"
          numberOfStars={5}
          starDimension="20px"
          starSpacing="5px"
          changeRating={this.setSkillRating.bind(index, obj, index)}
          name={obj.key}
        />
      </div>;
    });

    let currPageNumber = (window.location.hash) ? window.location.hash.substring(1) : 0;
    if (this.state.loading) {
      document.body.style.cursor = 'wait';
      tableData = <tr><td colSpan="9" className="text-center p-3"><i className="fa fa-spinner fa-45 fa-spin"></i></td></tr>;
    }
    if (!this.state.loading) {
      document.body.style.cursor = 'default';

      var tableData = [];

      tableData = this.state.numberOfInterviews >= 1 ? this.state.candidates.map((obj, index, thisObj) => {
        var idValue = obj.id;
        const self = this;
        return <tr key={index}><td>{obj.id}</td><td>{obj.recruitmentTitle} {obj.recruitmentSkills}</td><td>{obj.timeZone}</td><td> <p className="mb-0 w-100">{obj.candidateName}</p><small>{obj.candidateEmail}</small></td><td>{obj.channel}</td><td>${obj.candRate} / {obj.candRateType}</td><td>${obj.clientRate} / {obj.clientRateType}</td><td>${obj.subRate} / {obj.subRateType}</td><td>{obj.status}</td><td>{new Date(obj.interviewDate).toDateString()}</td><td>
          {<button className="btn btn-sm btn-soft-primary btn-circle" title="Update Interviewdetails" onClick={(e) => { this.updateInterview(obj.id, obj.candidateSkills, obj.submissionId) }}><i className="dripicons-pencil" aria-hidden="true"></i></button>
          }
          {<button className="ml-2 btn btn-sm btn-soft-info btn-circle" title="View Interviewdetails" onClick={(e) => { this.viewInterdetails(e, obj.id) }}><i className="dripicons-preview" aria-hidden="true"></i></button>
          }</td></tr>;
      }) : "";
      if (this.state.numberOfInterviews === 0) {
        document.body.style.cursor = 'default';
        tableData = <tr><td colSpan="10" className="text-center p-5">No Records Found</td></tr>;
      }
    }

    return (<><div className="row">
      <div className="col-sm-12">
        <div className="page-title-box">
          <div className="row">
            <div className="col">
              <h4 className="page-title">Scheduled Interviews</h4>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="javascript:void(0);">Dashboard</a></li>
                <li className="breadcrumb-item active">Interviews</li>
              </ol>
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
            <Card className="p-2 my-shadow">
              <CardHeader className="border-1">
                <div className="col-sm-8 float-left">
                  <h4 className="mb-0 card-title">Candidate Interviews</h4>
                  <p className="text-muted mb-0"></p>
                </div>
                <div className="col-sm-4 float-right">

                </div>
              </CardHeader>
              <div className="clearfix"></div>
              <div className=" mb-3 mt-3 ml-0 mr-0">
                <div className="col-sm-12  w-100">
                  <div className="col-sm-6 col-xs-6  float-left">

                  </div>
                  <div className="col-sm-6 float-right">
                    {(this.state.numberOfInterviews >= 10) ? <ul className="pt-2 mt-2 justify-content-end mb-0 pagination">
                      <li className="page-item ">
                        {this.state.previousLink != null ? <a href={"#" + (this.state.pageNumber - 1)} onClick={this.loadPrevious} className="page-link "><i className="typcn  typcn-chevron-left-outline "></i><span className="sr-only">Previous</span></a> : ""}
                      </li>
                      <li className="page-item">
                        {(this.state.nextLink != null) ? <a href={"#" + (this.state.pageNumber + 1)} onClick={this.loadNext} className="page-link "><i className="typcn typcn-chevron-right-outline "></i><span className="sr-only">Next</span></a> : ""}

                      </li>
                    </ul> : ""}
                  </div>
                </div>
              </div>

              <Table className="align-items-center table-flush table-centered lh-24" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col nameColumn">Recruitment Details</th>
                    <th scope="col nameColumn">Date/Timezone</th>
                    <th scope="col nameColumn">Candidate Details</th>
                    <th scope="col">Channel</th>
                    <th scope="col">Candidate Rate</th>
                    <th scope="col">Client Rate</th>
                    <th scope="col">Submitted Rate</th>
                    <th scope="col nameColumn">Status</th>
                    <th scope="col nameColumn">Created Date</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {tableData}
                </tbody>
                <tfoot><tr>
                  <td colSpan="4">Number of candidates : {this.state.numberOfInterviews}</td>
                  <td colSpan="4">
                    {(this.state.numberOfInterviews >= 10) ? <ul className="pt-2 mt-2 justify-content-end mb-0 pagination">
                      <li className="page-item ">
                        {this.state.previousLink != null ? <a href={"#" + (this.state.pageNumber - 1)} onClick={this.loadPrevious} className="page-link "><i className="typcn  typcn-chevron-left-outline "></i><span className="sr-only">Previous</span></a> : ""}
                      </li>
                      <li className="page-item">
                        {(this.state.nextLink != null) ? <a href={"#" + (this.state.pageNumber + 1)} onClick={this.loadNext} className="page-link "><i className="typcn typcn-chevron-right-outline "></i><span className="sr-only">Next</span></a> : ""}</li>
                    </ul> : ""}
                  </td>
                </tr>
                </tfoot>
              </Table>
            </Card>
          </div></Row></div>
      <Modal isOpen={this.state.showInterviewModal}>
        <ModalHeader>Update Interview</ModalHeader>
        <ModalBody>
          {skillInp}
          <div className="form-group row"><label className="control-label col-sm-4">Comments</label><textarea type="text" className="form-control form-control-sm col-sm-8" name="selectedEmailTemplate" placeholder="Interview Feedback" onChange={(e) => { this.setState({ selectedCandidateInterviewFeedback: e.target.value }) }}></textarea></div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" className="btn-sm" onClick={(e) => { this.submitInterviewFeedback(); }}>Update</Button>
          <Button color="secondary" className="btn-sm" onClick={() => this.setState({ showInterviewModal: false })}>Close</Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={this.state.showInterviewResultModal}>
        <ModalHeader>Interview Details</ModalHeader>
        <ModalBody>
          {this.state.interviewResultHtml}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" className="btn-sm" onClick={() => this.setState({ showInterviewResultModal: false })}>Close</Button>
        </ModalFooter>
      </Modal>

    </>);
  }

  render() {
    return this.renderPosts();
  }
}
export default CandidateInterviews;