import React, { Component } from "react";
import { candidatesListUrl, apiUrl } from "../variables/Variables.jsx";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  Table, Tooltip
} from "reactstrap";

import Cookies from 'universal-cookie';
const cookies = new Cookies();
const axios = require("axios").default;

//axios.defaults.credentials = 'same-origin';
//axios.defaults.withCredentials = false;
//axios.defaults.headers.common['Can-Auth-Token'] = 'c22d3c3360cd39bf40847e17c2497be4a6ffd758'


class CandidatesOnboarded extends Component {
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
      offset: ""
    };
    this.loadPrevious = this.loadPrevious.bind(this);
    this.loadNext = this.loadNext.bind(this);
    this.findCandidate = this.findCandidate.bind(this);
    axios.defaults.withCredentials = false;
  }
  componentDidMount() {

    this.setState({ loading: true });
    let currPageNumber = parseInt((window.location.hash) ? window.location.hash.substring(1) : 0);
    //currPageNumber = 0;
    axios.get(apiUrl + "listAllShortlistedCandidates", {
      params: { offset: (currPageNumber * 10), __daa: Date.now(), sess_id: cookies.get("c_csrftoken") },
    })
      .then(({ data }) => {
        this.setState({ loading: false });
        if (data.results) {
          this.setState({ candidates: data.results.results });
          this.setState({ nextLink: data.results.next })
          this.setState({ previousLink: data.results.previous })
          this.setState({ pageNumber: currPageNumber });
          this.setState({ numberOfCandidates: data.results.count })
        }
      })
      .catch((err) => { })

  }
  findCandidate(event) {
    if (this.state.filterCandidate.length <= 3 && this.state.filterCandidate.length !== 0)
      return false;
    this.setState({ loading: true });
    axios.get(candidatesListUrl, { params: { offset: this.state.offset, search: this.state.filterCandidate, __daa: Date.now() } })
      .then(({ data }) => {
        this.setState({ loading: false });
        if (data.count > 0) {
          this.setState({ candidates: data.results });
          this.setState({ previousLink: data.previous })
          this.setState({ nextLink: data.next })
          this.setState({ pageNumber: 1 });
          this.setState({ numberOfCandidates: data.count })
        }
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
        this.setState({ numberOfCandidates: data.results[0].count })
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
      tableData = <tr><td colSpan="6" className="text-center p-3"><i className="fa fa-spinner fa-45 fa-spin"></i></td></tr>;
    }
    if (!this.state.loading) {
      document.body.style.cursor = 'default';

      var tableData = [];

      tableData = this.state.numberOfCandidates >= 1 ? this.state.candidates.map(function (obj, index, thisObj) {
        console.log("rvmahe")

        var idValue = obj.id;

        return <tr key={index}><td>{obj.candidateId}</td><td>{obj.firstName} {obj.lastName}</td><td>--</td><td>{obj.location !== "" ? obj.location : "--"}</td><td>{obj.gender !== "" ? obj.gender : "--"}</td><td>{obj.rate !== "" ? obj.rate : "--"}</td><td>{obj.phone !== "" ? obj.phone : "--"}</td><td>
          <div className=" pull-right">{/*<a id="bEdit" type="button" className="btn btn-sm btn-soft-info btn-circle mr-2" href={'../admin/viewCandidateDetails?userId='+idValue}><i className="dripicons-preview"></i></a>*/}<a className="btn btn-sm btn-soft-success btn-circle" href={'../admin/editCandidate?userId=' + idValue + "&currPageNumber=" + currPageNumber}><i className="dripicons-pencil" aria-hidden="true"></i></a></div>
        </td></tr>;

      }) : "";
      if (this.state.numberOfCandidates === 0) {
        document.body.style.cursor = 'default';
        tableData = <tr><td colSpan="7" className="text-center p-5">No Records Found</td></tr>;
      }
    }
    return (<><div className="row">
      <div className="col-sm-12">
        <div className="page-title-box">
          <div className="row">
            <div className="col">
              <h4 className="page-title">Onboarded Candidates</h4>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="javascript:void(0);">Dashboard</a></li>
                <li className="breadcrumb-item active">Onboarded Candidates</li>
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
                  <h4 className="mb-0 card-title">Candidates List</h4>
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
                    {(this.state.numberOfCandidates >= 10) ? <ul className="pt-2 mt-2 justify-content-end mb-0 pagination">
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
                    <th scope="col nameColumn">Name</th>
                    <th scope="col title">Title/Skills</th>
                    <th scope="col">Location</th>
                    <th scope="col">Gender</th>
                    <th scope="col">Rate</th>
                    <th scope="col">Phone</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {tableData}
                </tbody>
                <tfoot><tr>
                  <td colSpan="4">Number of candidates : {this.state.numberOfCandidates}</td>
                  <td colSpan="4" className="">
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
            </Card>
          </div></Row></div></>);
  }

  render() {
    return (this.renderPosts());
  }
}
export default CandidatesOnboarded;

/*<a style={{marginRight:2+'%'}} size="sm" href="../admin/createCandidate" className="btn btn-sm btn-primary ">Add New</a>
                      <table className="table align-items-center table-flush">
                      <thead>
                        <tr>
                          {canthArray.map((prop) => {
                            return <th>{prop}</th>;
                          })}
                        </tr>
                      </thead>
                        <tbody>
                          {tableData}
                        </tbody>
                     </table>*/