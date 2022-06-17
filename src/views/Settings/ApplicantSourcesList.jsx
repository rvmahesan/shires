import React, { Component } from "react";
import {
  Container,
  Row,
  Tooltip,
  Card,
  CardHeader
} from "reactstrap";

import {
  Col,
  Table, Input, ModalBody, Modal, ModalFooter, Button
} from "reactstrap";
import Swal from 'sweetalert2';

import { addNewJob, style,apiUrl } from "../../variables/Variables.jsx";
import ReactQuill from "react-quill";
import { CKEditor } from 'ckeditor4-react';
import Cookies from 'universal-cookie';
import { Multiselect } from 'multiselect-react-dropdown';
const axios = require("axios").default;
const cookies = new Cookies();

class ApplicantSources extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      applicationSourceAdd: false,
      applicationSourceEdit: false,
      sourceName: "",
      sourceCategory: "",
      sourceCategoryId: "",
      sourceList: [],
      sourceCategoryList: [],
      numberofRows: 0,
      sourceNameToupdate: "",
      applicationStatusCategoryToupdate: "", applicationStatusCategoryId: "",
    }
    this.loadList = this.loadList.bind(this);
    this.handleCategory = this.handleCategory.bind(this);
    this.createApplicationSource = this.createApplicationSource.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.showApplicationEditModel = this.showApplicationEditModel.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

  }
  handleCategory(event) {
    if (event.target.value !== "") {
      let catName = event.target.value.split("$$$");
      this.setState({ sourceCategory: catName[0], sourceCategoryId: catName[1] });
    }
  }
  handleInput(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    let fData = new FormData();
    var ss = this.state.applicationStatusCategoryToupdate.split("$$$");

    fData.append("sourceName", this.state.sourceNameToupdate);
    fData.append("sourceCategory", ss[0]);
    fData.append("sourceCategoryId", ss[1]);
    fData.append("sess_id", cookies.get("c_session_id"));

    axios.put(apiUrl + "updateApplicantSource", fData).then(({ data }) => {
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
          }
        });
      } else {
        var errMsg = "";
        Swal.fire('Error', data.message, 'error'); return;
      }
    });
  }
  //idValue, obj.fields.applicantSource,obj.fields.categoryName,obj.fields.categoryId
  showApplicationEditModel = (idValue, applicantSource, categoryName, categoryId) => {
    this.setState({ sourceNameToupdate: applicantSource, applicationStatusCategoryToupdate: categoryName + '$$$' + categoryId, applicationSourceEdit: true, applicationStatusCategoryId: categoryId });
  }


  handleDelete = (event, id) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You can't revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sure',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        const params = new URLSearchParams()
        params.append('id', id)
        axios.delete(apiUrl + "deleteAppSource", { data: { id: id, sess_id: cookies.get("c_csrftoken") } }).then(({ data }) => {
          // alert(data)
          console.log(data)
          if (data.statusResponse == true) {
            let timerInterval;
            Swal.fire({
              icon: 'success',
              title: data.message,
              html: '',
              timer: 1800,
              timerProgressBar: true,
              onBeforeOpen: () => {
                Swal.showLoading()
                timerInterval = setInterval(() => {
                }, 100)
              },
              onClose: () => {
                clearInterval(timerInterval)
              }
            }).then((result) => {
            });
          }
        }).catch(function (err) {
          console.log(err);
          alert("Error - Tray again later");
        });
      }
    });

  }



  createApplicationSource = () => {

    let fData = new FormData();
    fData.append("sourceName", this.state.sourceName);
    fData.append("sourceCategory", this.state.sourceCategory);
    fData.append("sourceCategoryId", this.state.sourceCategoryId);
    fData.append("sess_id", cookies.get("c_session_id"));

    axios.post(apiUrl + "addNewApplicantSource", fData).then(({ data }) => {
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
          }
        });
      } else {
        var errMsg = "";
        Swal.fire('Error', data.message, 'error'); return;
      }
    });
    this.loadList();
  }
  componentDidMount() {
    this.loadList();
  }
  loadList() {
    axios.get(apiUrl + "getApplicantSourceList")
      .then(({ data }) => {
        if (data.statusResponse) {
          this.setState({ sourceList: data.datalist, numberofRows: data.numberOfRecords })
        }
      })
      .catch((err) => { });
    axios.get(apiUrl + "getApplicantSourceCategoriesList")
      .then(({ data }) => {
        if (data.statusResponse) {
          this.setState({ sourceCategoryList: data.datalist })
        }
      })
      .catch((err) => { });

  }

  render() {
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
      //{obj.pk}
      tableData = this.state.sourceList.length >= 1 ? <>{this.state.sourceList.map((obj, index, thisObj) => {
        var idValue = obj.pk;
        return <tr key={index}>
          <td>{obj.fields.applicantSource} </td>
          <td>{obj.fields.categoryName} </td>
          <td>{obj.fields.createdBy} </td>
          <td>{obj.fields.lastUpdatedBy} </td>
          <td>{new Date(obj.fields.lastUpdatedDate).toLocaleDateString()} </td>



          <td > <a id="editbutton" title="Edit applicant status" className="btn btn-default btn-xs btn ml-1" onClick={(e) => this.showApplicationEditModel(idValue, obj.fields.applicantSource, obj.fields.categoryName, obj.fields.categoryId)}><i className="fa fa-pen text-primary" aria-hidden="true"></i>
          </a>

            <a id="editbutton" title="Delete applicant status" onClick={(e) => this.handleDelete(e, idValue)} className="btn btn-default btn-xs btn ml-1" ><i className="fa fa-trash text-danger" aria-hidden="true"></i>
            </a>

          </td>


        </tr>;

      })}</> : "";
      if (this.state.sourceList.length === 0) {
        document.body.style.cursor = 'default';
        tableData = <tr><td colSpan="6" className="text-center p-3">No Records Found</td></tr>;
      }
    }
    return (<><div className="row" style={{ marginTop: "64px" }}>
      <div className="col-sm-12">
        <div className="page-title-box">
          <div className="row col-sm-12 mt-1">
            <div className="col-sm-10 float-left">
              <h4 className="page-title">Applicant Sources</h4>
            </div>
            <div className="col-sm-2">
              <button size="sm" onClick={(e) => { this.setState({ applicationSourceAdd: true }) }} className="btn btn-sm btn-primary float-right ">
                <i className="fas fa-plus mr-2"></i>
                Add New</button>
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
              <Table className="align-items-center align-items-center table-flush table-centered table table-flush table-centered lh-24" responsive>
                <thead>
                  <tr>
                    <th>Applicant Source</th>
                    <th>Category</th>
                    <th>Created By</th>
                    <th>Modified By</th>
                    <th>Last Modified</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody >
                  {tableData}
                </tbody>
                <tfoot><tr>
                  <td colSpan="3" ></td>
                  <td colSpan="3" className="">
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
          </div></Row></div>
      <Modal isOpen={this.state.applicationSourceAdd}>
        <div className="modal-header">
          <h6 className="modal-title m-0" id="exampleModalDefaultLabel">Applicant Status</h6>
          <button type="button" className="close float-right" onClick={(e) => { this.setState({ applicationSourceAdd: false }); this.setState({ progressTimer: 0 }); }}>
            <span aria-hidden="true"><i className="la la-times"></i></span>
          </button>
        </div>

        <ModalBody >
          <div className="row p-3">
            <div className="col-md-12">
              <div className="form-group row">
                <label className="control-label col-form-label text-left col-sm-4">Applicant Source</label>
                <input type="text" autoComplete="new" placeholder="Required" className="form-control col-sm-8" name="sourceName" autoComplete="new" onChange={this.handleInput} />
              </div>
            </div>

            <div className="col-md-12">
              <div className="form-group row">
                <label className="control-label col-form-label text-left col-sm-4">Category</label>


                <select className="form-control col-sm-8" alt="tt" name="newApplicationStatusCategory" onChange={this.handleCategory}>
                  <option value="">Select Status</option>
                  {this.state.sourceCategoryList.map((data, index) => {
                    return <option value={data.fields.categoryName + "$$$" + data.pk}>{data.fields.categoryName}</option>
                  })}
                </select>
              </div>
            </div>

          </div>

        </ModalBody><ModalFooter>
          <Button color="primary" className="btn-sm" onClick={(e) => { this.createApplicationSource(); }}>Submit</Button>
          <Button color="secondary" className="btn-sm" onClick={(e) => { this.setState({ applicationSourceAdd: false, sourceCategory: "", sourceCategoryId: "" }); }}>Close</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={this.state.applicationSourceEdit}>
        <div className="modal-header">
          <h6 className="modal-title m-0" id="exampleModalDefaultLabel">Applicant Status</h6>
          <button type="button" className="close float-right" onClick={(e) => { this.setState({ applicationSourceEdit: false }); this.setState({ progressTimer: 0 }); }}>
            <span aria-hidden="true"><i className="la la-times"></i></span>
          </button>
        </div>

        <ModalBody >
          <div className="row p-3">
            <div className="col-md-12">
              <div className="form-group row">
                <label className="control-label col-form-label text-left col-sm-4">Applicant Source</label>
                <input type="text" autoComplete="new" placeholder="Required" className="form-control col-sm-8" name="sourceNameToupdate" value={this.state.sourceNameToupdate} autoComplete="new" onChange={this.handleInput} />
              </div>
            </div>

            <div className="col-md-12">
              <div className="form-group row">
                <label className="control-label col-form-label text-left col-sm-4">Category</label>


                <select className="form-control col-sm-8" alt="tt" name="applicationStatusCategoryToupdate" onChange={this.handleCategory} value={this.state.applicationStatusCategoryToupdate}>
                  <option value="">Select Status</option>
                  {this.state.sourceCategoryList.map((data, index) => {
                    return <option value={data.fields.categoryName + "$$$" + data.pk}>{data.fields.categoryName}</option>
                  })}
                </select>
              </div>
            </div>

          </div>

        </ModalBody><ModalFooter>
          <Button color="primary" className="btn-sm" onClick={(e) => { this.handleSubmit(); }}>Submit</Button>
          <Button color="secondary" className="btn-sm" onClick={(e) => { this.setState({ applicationSourceEdit: false, sourceNameToupdate: "", applicationStatusCategoryToupdate: "" }); }}>Close</Button>
        </ModalFooter>
      </Modal>



    </>);
  }

}
export default ApplicantSources;