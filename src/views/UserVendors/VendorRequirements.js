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

import Cookies from 'universal-cookie';
const cookies = new Cookies();
const axios = require("axios").default;
class VendorRequirements extends Component {

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
  }

  componentDidMount() {
    this.setState({ loading: true });
    let currPageNumber = (window.location.hash) ? window.location.hash.substring(1) : 0;
    axios.get(jobListUrl, { params: { pageSize: this.state.pageSize, pageNumber: currPageNumber, sess_id: cookies.get("c_csrftoken") } })
      .then(({ data }) => {
        this.setState({ loading: false });
        if (data.count) {
          this.setState({ jobs: data.results, pageNumber: data.currentPage, numberOfJobs: data.count, nextLink: data.next, previousLink: data.previous });
        }
      })
      .catch((err) => { })
  }

  loadNext(event) {
    var pageNo = (this.state.pageNumber++);
    this.setState({ pageNumber: pageNo, loading: true });
    axios.get(this.state.nextLink, { params: { sess_id: cookies.get("c_csrftoken") } })
      .then(({ data }) => {
        this.setState({ loading: false, jobs: data.results, pageNumber: data.pageNumber, numberOfJobs: data.count });
      }).catch((err) => { })
  }

  loadPrevious(event) {
    this.setState({ pageNumber: this.state.pageNumber--, loading: true });
    axios.get(this.state.previousLink, { params: { sess_id: cookies.get("c_csrftoken") } })
      .then(({ data }) => {
        this.setState({ loading: false, jobs: data.results, pageNumber: data.pageNumber, numberOfJobs: data.count });
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
        return <tr key={index}><td>{idValue}</td><td className="text-left">{obj.additionalReferenceNumber}</td><td className="text-left">{obj.jobTitle}</td><td className="text-center"> {obj.noOfOpenings}</td><td className="text-center">
          {obj.noOfApplications !== 0 ?
            <a className="mr-0 btn-sm btn-link" disabled={(obj.noOfApplications == 0) ? true : false} href={'../vendor/viewJobApplicationDetails?jobId=' + idValue}><u>{obj.noOfApplications}</u></a> : 0}

        </td><td>Active</td><td><a className="mr-0 btn-sm btn btn-icon-only rounded-circle" href={'../vendor/viewJobDetails?jobId=' + idValue}><i className="fa fa-18 text-info fa-eye"></i></a> </td></tr>;
      });
      if (this.state.jobs.length == 0) {
        document.body.style.cursor = 'default';
        tableData = <tr><td colSpan="6" className="text-center p-5">No Records Found</td></tr>;
      }
    }
    return (<>

      <div className="row">
        <div className="col-sm-12">
          <div className="page-title-box">
            <div className="row">
              <div className="col">
                <h4 className="page-title">Jobs</h4>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><a href="javascript:void(0);">Dashboard</a></li>
                  <li className="breadcrumb-item active">Jobs</li>
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
                  <h4 className="mb-0 card-title">Jobs List</h4>
                  <p className="text-muted mb-0"></p>
                </div>
                <div className="float-right">

                </div>
              </CardHeader>

              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">S.No</th>
                    <th scope="col">Ref #</th>
                    <th scope="col">Job title</th>
                    <th scope="col">No.of openings</th>
                    <th scope="col">Applications</th>
                    <th scope="col">Status</th>
                    <th scope="col" >Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData}
                </tbody>
                <tfoot><tr>
                  <td colSpan="4">Number of Jobs : {this.state.numberOfJobs}</td>
                  <td colSpan="4">
                    {(this.state.numberOfJobs >= 20) ? <ul className="justify-content-end mb-0 pagination">
                      <li className="page-item">
                        {this.state.pageNumber >= 1 ? <a href={"#" + (this.state.pageNumber - 1)} onClick={this.loadPrevious} className="page-link"><i class="ni ni-bold-left"></i><span className="sr-only">Previous</span></a> : ""}
                      </li>
                      <li className="page-item">
                        {((this.state.pageSize * (this.state.pageNumber + 1)) < (this.state.numberOfCandidates)) ? <a href={"#" + (this.state.pageNumber + 1)} onClick={this.loadNext} className="page-link"><i class="ni ni-bold-right"></i><span className="sr-only">Next</span></a> : <a aria-disabled={true} className="page-link"><i class="ni ni-bold-right"></i><span className="sr-only">Next</span></a>}
                      </li>
                    </ul> : ""}
                  </td>
                </tr>
                </tfoot>
              </Table>
            </Card>
          </div></Row></div></>);
  }

  render() {
    return this.renderPosts();
  }
}
export default VendorRequirements;