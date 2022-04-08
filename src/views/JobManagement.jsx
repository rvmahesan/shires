import React, { Component } from "react";
import { Grid } from "react-bootstrap";
import { canthArray, jobListUrl } from "../variables/Variables.jsx";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  Table,
} from "reactstrap";

import Common from "../views/commons/Common.jsx"
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const axios = require("axios").default;

const userType = new Common().getUserType();

class JobManagement extends Component {

  constructor(props) {
    super(props);
    this.state = {
      jobs: [],
      loading: true,
      error: null,
      numberOfJobs: 0,
      pageSize: 10,
      pageNumber: 0
    };
    this.loadPrevious = this.loadPrevious.bind(this);
    this.loadNext = this.loadNext.bind(this);

    axios.defaults.withCredentials = false;
  }

  componentDidMount() {
    this.setState({ loading: true });
    let currPageNumber = (window.location.hash) ? window.location.hash.substring(1) : 0;
    axios.get(jobListUrl, { params: { sess_id: cookies.get("c_csrftoken") } })
      .then(({ data }) => {
        this.setState({ loading: false });
        if (data.count) {
          this.setState({ jobs: data.results, numberOfJobs: data.count, nextLink: data.next, previousLink: data.previous });
        }
      })
      .catch((err) => { })
  }

  loadNext(event) {

    var pageNo = (this.state.pageNumber++);
    this.setState({ pageNumber: pageNo, loading: true });
    axios.get(this.state.nextLink)
      .then(({ data }) => {
        this.setState({ loading: false, jobs: data.results, numberOfJobs: data.count, nextLink: data.next, previousLink: data.previous });
      }).catch((err) => { })
  }

  loadPrevious(event) {
    this.setState({ pageNumber: this.state.pageNumber--, loading: true });
    axios.get(this.state.previousLink)
      .then(({ data }) => {
        this.setState({ loading: false, jobs: data.results, numberOfJobs: data.count, nextLink: data.next, previousLink: data.previous });
      })
      .catch((err) => { })
  }

  renderLoading() {
    return <div className="content"><div className="container-fluid"> <Row>
      <Col md={12}>sdsd<Card
        title=""
        category=""
        cttablefullwidth="'"
        cttableresponsive=""
        content={<center></center>} /></Col></Row></div></div>;
  }


  renderError() {
    return (
      <div>
        Uh oh: {this.state.error.message}
      </div>
    );
  }

  renderPosts() {
    if (this.state.loading) {
      document.body.style.cursor = 'wait';
      tableData = <tr><td colSpan="6" className="text-center p-5"><i className="fa fa-spinner fa-45 fa-spin"></i></td></tr>;
    }
    if (!this.state.loading) {
      document.body.style.cursor = 'default';
      var tableData = this.state.jobs.map(function (obj, index) {
        var idValue = obj.id;
        {/*<td>{idValue}</td>*/ }
        return <tr key={index}><td className="text-left">{obj.jobCode}</td><td className="text-left">{obj.jobTitle}</td><td className="text-center">{obj.orgInfoNoOfPositions}</td><td className="text-center">{obj.noOfApplicants}</td><td>{obj.jobStatus}</td><td><a className="mr-0 btn-sm btn btn-icon-only rounded-circle" href={'../' + userType + '/viewJobDetails?jobId=' + idValue}><i className="fa fa-18 text-info fa-eye"></i></a> {userType == "admin" ? <a className="ml-0 btn-sm btn btn-icon-only rounded-circle" href={'../' + userType + '/editJobDetails?jobId=' + idValue}><i className="fa fa-18 fa-user-edit"></i></a> : <></>}</td></tr>;
      });
      if (this.state.jobs.length == 0) {
        document.body.style.cursor = 'default';
        tableData = <tr><td colSpan="6" className="text-center p-5">No Records Found</td></tr>;
      }
    }
    let addJobLink = "";
    if (userType == "admin") {
      addJobLink = <a style={{ marginRight: 2 + '%' }} size="sm" href={"../" + userType + "/createNewJob"} className="w-100 float-right btn btn-sm btn-primary ">Create New</a>;
    }
    return (<>

      <div className="row" style={{ marginTop: "0px" }}>
        <div className="col-sm-12">
          <div className="page-title-box">
            <div className="row">
              <div className="col">
                <div className="col-sm-6 float-left">
                  <h4 className="page-title">Jobs List</h4>
                </div>
                <div className=" float-right">
                  {addJobLink}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <Container fluid style={{ marginTop: "0px" }} >
        <div className="header-body">
          {/* Card stats */}
        </div>
      </Container>
      <div className="mb-5">
        {/* Table */}
        <Row>
          <div className="col p-0">
            <Card className="p-2">

              <div className="fixedHeight">
                <Table className="align-items-center table-flush table-striped" responsive >
                  <thead className="thead-light" >
                    <tr>
                      {/*<th scope="col">S.No</th> -*/}
                      <th scope="col" style={{width:"7%"}}>Ref #</th>
                      <th scope="col">Job title</th>
                      <th scope="col" style={{width:"10%"}}>No.of openings</th>
                      <th scope="col" style={{width:"7%"}}>Applications</th>
                      <th scope="col" style={{width:"7%"}}>Status</th>
                      <th scope="col"  style={{width:"8%"}}/>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData}
                  </tbody>
                  <tfoot><tr>
                    <td colSpan="4">Number of Jobs : {this.state.numberOfJobs}</td>
                    <td colSpan="3">
                      {(this.state.numberOfJobs >= 10) ? <ul className="justify-content-end mb-0 pagination">
                        <li className="page-item">
                          {this.state.previousLink !== null ? <a href={"#" + (this.state.pageNumber - 1)} onClick={this.loadPrevious} className="page-link"><i className="typcn  typcn-chevron-left-outline"></i><span className="sr-only">Previous</span></a> : ""}
                        </li>
                        <li className="page-item">
                          {this.state.nextLink !== null ? <a href={"#" + (this.state.pageNumber + 1)} onClick={this.loadNext} className="page-link"><i className="typcn typcn-chevron-right-outline "></i><span className="sr-only">Next</span></a> : ""}
                        </li>
                      </ul> : ""}
                    </td>
                  </tr>
                  </tfoot>
                </Table>
              </div>
            </Card>
          </div></Row></div></>);
  }

  render() {
    return this.renderPosts();
  }
}
export default JobManagement;