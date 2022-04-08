import React, { Component } from "react";
import Preheader from "../components/BodyHeader/Preheader";
import {
  Container,
  Row,
  Card,
  CardHeader,
  Table, Modal, ModalHeader, ModalBody, ModalFooter, Button
} from "reactstrap";
import Swal from 'sweetalert2';
import Cookies from 'universal-cookie';
import { serverAPI } from "../variables/Variables";

const axios = require("axios").default;

const cookies = new Cookies();

class AttributeDetails extends Component {
  constructor(props, context) {
    super(props, context);
    this.state =
    {
      previousLink: "",
      nextLink: "",
      configDetailsList: [],
      parentId: 0,
      numberOfRecords: 0,
      showCreateConfigModal: false,
      attributeDetails: {
        id: "",
        Name: "",
        Value: "",
        parentId: "",
        status: "",
        updatedBy: "",
        lastUpdated: ""
      },
      showUpdateConfigModal: false,
      isLoading: false,
    }

    this.createAttribute = this.createAttribute.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.loadAttributeDetailsList = this.loadAttributeDetailsList.bind(this);
    this.updateAttribute = this.updateAttribute.bind(this);
    this.showUpdateForm = this.showUpdateForm.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleActivate = this.handleActivate.bind(this);
    this.loadPrevios = this.loadPrevios.bind(this);
    this.loadNext = this.loadNext.bind(this);
    this.resetProfileDetails = this.resetProfileDetails.bind(this);
    axios.defaults.withCredentials = false;
  }
  resetProfileDetails = (e) => {
    var attributeDetails = {
      configid: "",
      Name: "",
      Value: "",
      parentId: "",
      status: "",
      updatedBy: "",
      lastUpdated: ""
    };
    this.setState({ attributeDetails: attributeDetails });

  }
  handleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  createAttribute = (event) => {
    var thisObj = this;


    axios.post(serverAPI + "createNewAttribute", {
      Name: this.state.attributeDetails.Name,
      Value: this.state.attributeDetails.Value,
      ParentId: parseInt(this.state.parentId),
      sess_id: cookies.get("c_csrftoken")
    }).then(function (res) {
      if (res.data.statusResponse) {
        let timerInterval;
        Swal.fire({
          icon: 'success',
          title: res.data.message,
          html: '',
          timer: 1800,
          timerProgressBar: true,
          onBeforeOpen: () => {
            Swal.showLoading()
            timerInterval = setInterval(() => {
            }, 100)
          },
          onClose: () => {
            clearInterval(timerInterval);
            thisObj.setState({ showCreateConfigModal: false })

            thisObj.resetProfileDetails()
            thisObj.loadAttributeDetailsList();
          }
        });
      } else {
        Swal.fire('Oops...', res.data.message, 'error'); return;
      }
    });
  }
  showUpdateForm(e, id) {
    //get single user details 
    this.resetProfileDetails();
    document.body.style.cursor = 'progress';

    axios.get(serverAPI + "userProfileDetails", {
      params: {
        id: id,
        sess_id: cookies.get("c_csrftoken")
      }
    }).then(({ data }) => {

      if (data.profileDetails != null) {
        this.setState({ showUpdateUserModal: true, profileDetails: data.profileDetails });
        //data.currentPageNumber
      }
      document.body.style.cursor = 'default';
    })
      .catch((err) => {
        alert("Error - Tray again later");
      });


  }
  updateAttribute() {
    var thisObj = this;
    console.log(this.state)
    axios.put(serverAPI + "updateAttributeDetails", {
      id: this.state.configDetails.configid,
      Name: "",
      Value: "",
      ParentId: "",
      status: "",
      sess_id: cookies.get("c_csrftoken")
    }).then(function (res) {
      thisObj.loadAttributeDetailsList();
      if (res.data.statusResponse) {
        let timerInterval;
        Swal.fire({
          icon: 'success',
          title: "Attribute updated successfully",
          html: '',
          timer: 800,
          timerProgressBar: true,
          onBeforeOpen: () => {
            Swal.showLoading()
            timerInterval = setInterval(() => {
            }, 100)
          },
          onClose: () => {
            clearInterval(timerInterval);
            thisObj.setState({ showUpdateUserModal: false, changePassword: true })

          }
        });
      } else {
        Swal.fire('Oops...', res.data.message, 'error'); return;
      }
    }).catch(function () {
      alert("Error - Try again later");
    });
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
      text: "User won't be able to login!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sure',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        const params = new URLSearchParams()
        params.append('id', id)

        axios.post(serverAPI + "deActiveUser", { id: id, sess_id: cookies.get("c_csrftoken") }).then(({ data }) => {
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
                  //    const content = Swal.getContent()
                  //   if (content) {
                  //  const b = content.querySelector('b')
                  // if (b) {
                  //   b.textContent = Swal.getTimerLeft()
                  //  }
                  //  }
                }, 100)
              },
              onClose: () => {
                clearInterval(timerInterval)
                this.loadAttributeDetailsList();
              }
            }).then((result) => {
              /* Read more about handling dismissals below */

            });
          }
        }).catch(function (err) {
          console.log(err);
          alert("Error - Tray again later");
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {

      }
    })
  }

  handleActivate(e, id) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "User can be activated!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sure',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        const params = new URLSearchParams()
        params.append('id', id)
        axios.post(serverAPI + "reActiveUser", { id: id, sess_id: cookies.get("c_csrftoken") }).then(({ data }) => {
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

                  //    const content = Swal.getContent()
                  //   if (content) {
                  //  const b = content.querySelector('b')
                  // if (b) {
                  //   b.textContent = Swal.getTimerLeft()
                  //  }
                  //  }
                }, 100)
              },
              onClose: () => {
                clearInterval(timerInterval)
                this.loadAttributeDetailsList();
              }
            }).then((result) => {
              /* Read more about handling dismissals below */

            });
          }
        }).catch(function (err) {
          alert("Error - Tray again later")
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {

      }
    })
  }
  loadPrevios() {
    axios.get(this.state.previousLink)
      .then(({ data }) => {
        if (data.statusResponse)
          this.setState({ configDetailsList: data.results, nextLink: data.next, previousLink: data.previous, pageNumber: data.currentPage, numberOfRecords: data.count });

      })
      .catch((err) => { })
  }
  loadNext() {
    axios.get(this.state.nextLink)
      .then(({ data }) => {
        if (data.statusResponse)
          this.setState({ configDetailsList: data.results, nextLink: data.next, previousLink: data.previous, pageNumber: data.currentPage, numberOfRecords: data.count });

      })
      .catch((err) => { })
  }
  loadAttributeDetailsList() {
    this.setState({ isLoading: true });
    const params = new URLSearchParams(this.props.location.search);

    var parentId = params.get('attribId');
    this.setState({ parentId: parentId });

    axios.get(serverAPI + "getAllConfigAttributeDetails", { params: { sess_id: cookies.get("c_csrftoken"), pId: params.get('attribId') } })
      .then(({ data }) => {
        this.setState({ isLoading: false });
        this.setState({ configDetailsList: data.results, nextLink: data.next, previousLink: data.previous, pageNumber: 1, numberOfRecords: data.count });

      })
      .catch((err) => { this.setState({ isLoading: false }); alert("Error - Try again later") })

  }
  componentDidMount() {
    this.loadAttributeDetailsList();
    //
  }

  render() {
    let thisObj = this;
    let changePasswordProps = {
      type: "text",
      placeholder: "",
      className: "form-control form-control-sm",
      name: "password"
    };
    this.state.changePassword ? changePasswordProps.disabled = true : changePasswordProps.disabled = false;
    return (<>
      <div className="row">
        <div className="col-sm-12">
          <div className="page-title-box">
            <div className="row">
              <div className="col">
                <h4 className="page-title">Attributes</h4>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><a href="javascript:void(0);">Dashboard</a></li>
                  <li className="breadcrumb-item active">Attributes</li>
                </ol>
              </div>
              <div className="col-auto align-self-center">
                <a href="../admin/configAttributes" class="btn btn btn-dark btn-sm waves-effect waves-light float-right">back</a>

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
                  <h4 className="mb-0 card-title">Attributes List</h4>
                  <p className="text-muted mb-0"></p>
                </div>

                <div className="float-right">

                  <a style={{ marginRight: 2 + '%' }} size="sm" onClick={() => { this.resetProfileDetails(); this.setState({ showCreateConfigModal: true }) }} className="w-100 btn btn-sm btn-primary text-white">Add New</a>
                </div>

              </CardHeader>

              <Row>
                <div className="col-12 col-sm-6 ml-3 mb-3 mt-3">

                </div>
              </Row>


              <Table className="align-items-center table-flush " responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Value</th>
                    <th scope="col" />
                  </tr>
                </thead>
                {this.state.isLoading && this.state.configDetailsList !== null ? <tr className="mt-5"><td colSpan="5" className="text-center p-3"><i className="fa fa-spinner fa-45 fa-spin"></i></td></tr> :
                  <><tbody>{this.state.configDetailsList.length >= 1 ? (this.state.configDetailsList.map(function (obj, index) {
                    var idValue = obj.id;
                    return <tr key={index}><td>{index + 1}</td>
                      <td>{obj.Name}</td>
                      <td>{obj.Value}</td>
                      <td>



                        {<a title="View/Update" onClick={(e) => thisObj.showUpdateForm(e, obj.id)} className="btn btn-icon-only btn-sm rounded-circle mr-0" ><i className="fa text-info fa-18 fa-eye"></i></a>}

                        <a className="ml-0 btn btn-sm btn-icon-only rounded-circle" onClick={(e) => thisObj.handleDelete(e, obj.id)} ><i className="fa text-danger fa-trash fa-18"></i></a>

                      </td></tr>;
                  })) : <tr ><td colSpan={4} className={"text-center pt-3"}>No Records found</td></tr>}
                  </tbody>
                    {this.state.configDetailsList.length != 0 ? (
                      <tfoot>
                        <tr>
                          <td colSpan="2">Number of Records : {this.state.numberOfRecords}</td>

                          {(this.state.numberOfRecords >= 2) ? <td colSpan="2"><ul className="justify-content-end mb-0 pagination">
                            <li className="page-item">
                              {(this.state.previousLink != null) ? <a href={"#" + (this.state.pageNumber)} onClick={this.loadPrevios} className="page-link"><i className="typcn  typcn-chevron-left-outline"></i><span className="sr-only">Previous</span></a> : ""}
                            </li>
                            <li className="page-item">
                              {(this.state.nextLink != null) ? <a href={"#" + (this.state.pageNumber)} onClick={this.loadNext} className="page-link"><i className="typcn  typcn-chevron-right-outline"></i><span className="sr-only">Previous</span></a> : ""}
                            </li>
                          </ul></td> : null}
                        </tr>
                      </tfoot>) : null}</>}

              </Table>


            </Card>
          </div></Row></div><Modal isOpen={this.state.showCreateConfigModal}>
        <ModalHeader>Add Attribute</ModalHeader>
        <ModalBody>
          <form className="pl-3 pr-2 col-sm-12">
            <div className="row">
              <div className=" col-md-5 float-left pr-0">
                <div className="form-group"><label className="control-label">Name</label><input placeholder="" type="text" className="form-control form-control-sm" name="company" defaultValue={this.state.attributeDetails.Name} onChange={(e) => { this.state.attributeDetails.Name = e.target.value; }} />
                </div>
              </div>
              <div className=" col-md-5 float-left pr-1 pl-1">
                <div className="form-group">
                  <label className="control-label">Value</label><input placeholder="" type="text" className="form-control form-control-sm" name="username" defaultValue={this.state.attributeDetails.Value} onChange={(e) => { this.state.attributeDetails.Value = e.target.value; }} />
                </div>
              </div>
            </div>
          </form>
        </ModalBody><ModalFooter>
          <button type="button" onClick={thisObj.createAttribute} className="btn-sm btn-fill pull-left btn btn-primary"> Create </button>
          <Button color="secondary" className="btn-sm" onClick={() => { this.setState({ showCreateConfigModal: false }) }}>Close</Button>
        </ModalFooter></Modal><Modal isOpen={this.state.showUpdateUserModal}>
        <ModalHeader>Attribute Details</ModalHeader>
        <ModalBody>
          <form className="pl-3 pr-3">
            <div className="row ">
              <div className="row">
                <div className=" col-md-4 float-left pr-0">
                  <div className="form-group"><label className="control-label"> Name</label><input placeholder="" type="text" className="form-control form-control-sm" name="company" defaultValue={this.state.attributeDetails.Name} onChange={(e) => { this.state.attributeDetails.Name = e.target.value; }} />
                  </div>
                </div>
                <div className=" col-md-4 float-left pr-1 pl-1">
                  <div className="form-group">
                    <label className="control-label">Value</label><input placeholder="" type="text" className="form-control form-control-sm" name="username" defaultValue={this.state.attributeDetails.Name} />
                  </div>
                </div>

              </div>
            </div>

          </form>
        </ModalBody><ModalFooter>
          <button type="button" onClick={thisObj.updateAttribute} className="btn-sm btn-fill pull-left btn btn-primary"> Update </button>
          <Button color="secondary" className="btn-sm" onClick={() => { this.setState({ showUpdateUserModal: false }) }}>Close</Button>
        </ModalFooter></Modal></>
    );
  }
}
export default AttributeDetails;