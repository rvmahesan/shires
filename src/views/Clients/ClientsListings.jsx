import React, { Component } from "react";
import {
  Container,
  Row,
  Card,
  CardHeader,
  Table, Modal, ModalHeader, ModalBody, ModalFooter, Button
} from "reactstrap";
import Swal from 'sweetalert2';
import Cookies from 'universal-cookie';
import { serverAPI } from "../../variables/Variables";

const axios = require("axios").default;

const cookies = new Cookies();

class ClientsListings extends Component {
  constructor(props, context) {
    super(props, context);
    this.state =
    {
      previousLink: "",
      nextLink: "",
      usersList: [],
      numberOfUsers: 0,
      showCreateUserModal: false,
      profileDetails: {
        id: "",
        userId: "",
        firstName: "",
        lastName: "",
        email: "",
        authToken: "",
        userName: "",
        userPassword: "",
        address: "",
        city: "",
        country: "",
        zip: "",
        company: "",
        userType: "",
        status: "",
        updatedBy: "",
        lastUpdated: ""
      },
      showUpdateUserModal: false,
      confirmpassword: "",
      changePassword: true,
      isLoading: false,
    }

    this.createUser = this.createUser.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.loadClientsList = this.loadClientsList.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.showUpdateForm = this.showUpdateForm.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleActivate = this.handleActivate.bind(this);
    this.loadPrevios = this.loadPrevios.bind(this);
    this.loadNext = this.loadNext.bind(this);
    this.resetProfileDetails = this.resetProfileDetails.bind(this);
    axios.defaults.withCredentials = false;
  }
  resetProfileDetails = (e) => {
    var profileDetails = {
      id: "",
      userId: "",
      firstName: "",
      lastName: "",
      email: "",
      authToken: "",
      userName: "",
      userPassword: "",
      address: "",
      city: "",
      country: "",
      zip: "",
      company: "",
      userType: "",
      status: "",
      updatedBy: "",
      lastUpdated: ""
    };
    this.setState({ profileDetails: profileDetails, changePassword: true });

  }
  handleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  createUser = (event) => {
    var thisObj = this;

    Object.entries(this.state.profileDetails).map(([key, value]) => {
      if (!['id', 'lastUpdated', 'updatedBy', 'status', 'authToken', 'userId'].includes(key)) {
        if (value == "") {
          Swal.fire('Oops...', key.toUpperCase() + ' not empty', 'error');
          return;
        }
      }
    });

    if (this.state.profileDetails.userPassword != this.state.confirmpassword) {
      Swal.fire('Oops...', 'Passwords not matching', 'error');
      return;
    }

    axios.post(serverAPI + "createNewUser", {
      company: this.state.profileDetails.company,
      userName: this.state.profileDetails.userName,
      firstName: this.state.profileDetails.firstName,
      lastName: this.state.profileDetails.lastName,
      country: this.state.profileDetails.country,
      address: this.state.profileDetails.address,
      city: this.state.profileDetails.city,
      zip: this.state.profileDetails.zip,
      email: this.state.profileDetails.email,
      userPassword: this.state.profileDetails.userPassword,
      userType: this.state.profileDetails.userType,
      userId: parseInt(this.state.numberOfUsers) + 1,
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
            thisObj.setState({ showCreateUserModal: false })

            thisObj.resetProfileDetails()
            thisObj.loadUsersList();
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
  updateUser() {
    var thisObj = this;
    console.log(this.state)
    axios.put(serverAPI + "updateProfileDetails", {
      id: this.state.profileDetails.id,
      company: this.state.profileDetails.company,
      userName: this.state.profileDetails.userName,
      firstName: this.state.profileDetails.firstName,
      lastName: this.state.profileDetails.lastName,
      country: this.state.profileDetails.country,
      address: this.state.profileDetails.address,
      city: this.state.profileDetails.city,
      zip: parseInt(this.state.profileDetails.zip),
      email: this.state.profileDetails.email,
      userPassword: this.state.profileDetails.userPassword,
      userType: this.state.profileDetails.userType,
      changePassword: this.state.changePassword,
      sess_id: cookies.get("c_csrftoken")
    }).then(function (res) {
      thisObj.loadUsersList();
      if (res.data.statusResponse) {
        let timerInterval;
        Swal.fire({
          icon: 'success',
          title: "User updated successfully",
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
      alert("Error - Tray again later");
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
      text: "This action can't be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sure',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        const params = new URLSearchParams()
        params.append('id', id)

        axios.delete(serverAPI + "deleteClientDetails", {data: {  id: id, sess_id: cookies.get("c_csrftoken")} }).then(({ data }) => {
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
                this.loadUsersList();
              }
            }).then((result) => {
              /* Read more about handling dismissals below */
              window.location.reload();
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
                this.loadUsersList();
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
        if (data)
          this.setState({ usersList: data.results, nextLink: data.next, previousLink: data.previous, pageNumber: data.currentPage, numberOfUsers: data.count });

      })
      .catch((err) => { })
  }
  loadNext() {
    axios.get(this.state.nextLink)
      .then(({ data }) => {
        if (data)
          this.setState({ usersList: data.results, nextLink: data.next, previousLink: data.previous, pageNumber: data.currentPage, numberOfUsers: data.count });

      })
      .catch((err) => { })
  }
  loadClientsList() {
    this.setState({ isLoading: true });
    axios.get(serverAPI + "listClients", { params: { sess_id: cookies.get("c_csrftoken") } })
      .then(({ data }) => {
        this.setState({ isLoading: false });
        if (data)
          this.setState({ usersList: data.results, nextLink: data.next, previousLink: data.previous, pageNumber: data.currentPage, numberOfUsers: data.count });

      })
      .catch((err) => { this.setState({ isLoading: false }); alert("Error - Try again later") })
  }
  componentDidMount() {
    this.loadClientsList();
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
                <div className="col-sm-6 float-left">
                  <h4 className="page-title">Clients List</h4>
                </div>
                <div className="float-right">
                  <a style={{ marginRight: 2 + '%' }} size="sm" onClick={() => { window.location.href = "../admin/addNewClient" }} className="w-100 btn btn-sm btn-primary text-white">Add New</a>
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
            <Card className="p-2 ">
              <Table className="align-items-center table-flush " responsive>
                <thead className="thead-light">
                  <tr>
                    <th style={{width:"5%"}} scope="col">#</th>
                    <th style={{width:"45%"}} scope="col">Name</th>
                    <th style={{width:"20%"}} scope="col">Country</th>
                    <th style={{width:"20%"}} scope="col">Status</th>
                    <th style={{width:"10%"}} scope="col" />
                  </tr>
                </thead>
                {this.state.isLoading ? <tr className="mt-5"><td colSpan="5" className="text-center p-3"><i className="fa fa-spinner fa-45 fa-spin"></i></td></tr> :
                  <><tbody>{this.state.usersList.length >= 1 ? (this.state.usersList.map(function (obj, index) {
                    var idValue = obj.id;
                    return <tr key={index}><td>{index + 1}</td><td>{obj.clientName} </td>
                      <td>{obj.country}</td>
                      <td>{obj.status}</td>
                      <td className="pb-1">
                        <a title="View/Update" href={"../admin/ViewClientDetails?clientId=" + obj.id} className="btn btn-icon-only btn-sm rounded-circle mr-0" ><i className="fa text-info fa-18 fa-eye"></i></a> <a className="ml-0 btn btn-sm btn-icon-only rounded-circle" onClick={(e) => thisObj.handleDelete(e, obj.id)} ><i className="fa fa-18 text-danger fa-trash"></i></a>
                      </td>
                    </tr>;
                  })) : <tr ><td colSpan={5} className={"text-center pt-3"}>No Records found</td></tr>}
                    {/* onClick={(e) => thisObj.showUpdateForm(e, obj.id)} */}
                  </tbody>
                    {this.state.usersList.length != 0 ? (
                      <tfoot>
                        <tr>
                          <td colSpan="4">Number of Users : {this.state.numberOfUsers}</td>
                          {(this.state.numberOfUsers >= 2) ? <td colSpan="4"><ul className="justify-content-end mb-0 pagination">
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
          </div></Row></div><Modal isOpen={this.state.showCreateUserModal}>
        <ModalHeader>Add User</ModalHeader>
        <ModalBody>
          <form className="pl-3 pr-2 col-sm-12">
            <div className="row ">
              <div className="row">
                <div className=" col-md-4 float-left pr-0">
                  <div className="form-group"><label className="control-label">Company</label><input placeholder="" type="text" className="form-control form-control-sm" name="company" defaultValue={this.state.profileDetails.company} onChange={(e) => { this.state.profileDetails.company = e.target.value; }} />
                  </div>
                </div>
                <div className=" col-md-4 float-left pr-1 pl-1">
                  <div className="form-group">
                    <label className="control-label">Username</label><input placeholder="" type="text" className="form-control form-control-sm" name="username" defaultValue={this.state.profileDetails.userName} onChange={(e) => { this.state.profileDetails.userName = e.target.value; }} />
                  </div>
                </div>
                <div className="col-md-4 float-left  pl-1">
                  <div className="form-group">
                    <label className="control-label">Email</label><input placeholder="" type="text" className="form-control  form-control-sm" name="email" defaultValue={this.state.profileDetails.email} onChange={(e) => { this.state.profileDetails.email = e.target.value; }} /></div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 float-left pr-1">
                  <div className="form-group">
                    <label className="control-label">Password</label><input placeholder="" type="text" className="form-control  form-control-sm" name="password" defaultValue={this.state.profileDetails.userPassword} onChange={(e) => { this.state.profileDetails.userPassword = e.target.value; }} /></div>
                </div>
                <div className="col-md-4 float-left pl-1">
                  <div className="form-group">
                    <label className="control-label">Confirmpassword</label><input placeholder="" type="text" className="form-control form-control-sm" name="confirmpassword" defaultValue={this.state.confirmpassword} onChange={this.handleInput} /></div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 float-left pr-1">
                  <div className="form-group">
                    <label className="control-label">Firstname</label><input placeholder="" type="text" className="form-control form-control-sm" name="firstName" defaultValue={this.state.profileDetails.firstName} onChange={(e) => { this.state.profileDetails.firstName = e.target.value; }} /></div>
                </div>
                <div className="col-md-4 float-left pr-1 pl-1">
                  <div className="form-group">
                    <label className="control-label">Lastname</label><input placeholder="" type="text" className="form-control form-control-sm" name="lastName" defaultValue={this.state.profileDetails.lastName} onChange={(e) => { this.state.profileDetails.lastName = e.target.value; }} /></div>
                </div>
                <div className="col-md-4 float-left pr-1 pl-1">
                  <div className="form-group">
                    <label className="control-label">Usertype</label><br />
                    <select className="form-control form-control-sm" name="userType" onChange={(e) => { this.state.profileDetails.userType = e.target.value; }} defaultValue={this.state.profileDetails.userType}>
                      <option value="">--</option>
                      <option value="recruiter">Recruiter</option>
                      <option value="admin">Admin</option>
                      <option value="vendor">Vendor</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="row col-md-12 pl-0 pr-0">
                <div className="col-md-12 float-left">
                  <div className="form-group">
                    <label className="control-label">Address</label><input placeholder="" type="text" className="form-control   form-control-sm" name="address" defaultValue={this.state.profileDetails.address} onChange={(e) => { this.state.profileDetails.address = e.target.value; }} /></div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 float-left">
                  <div className="form-group">
                    <label className="control-label">City</label><input placeholder="" type="text" className="form-control  form-control-sm" required name="city" defaultValue={this.state.profileDetails.city} onChange={(e) => { this.state.profileDetails.city = e.target.value; }} /></div>
                </div>
                <div className="col-md-4 float-left">
                  <div className="form-group">
                    <label className="control-label">Country</label><input placeholder="" type="text" className="form-control  form-control-sm" required name="country" defaultValue={this.state.profileDetails.country} onChange={(e) => { this.state.profileDetails.country = e.target.value; }} /></div>
                </div>
                <div className="col-md-4 float-left">
                  <div className="form-group">
                    <label className="control-label">Postalcode or Zip</label><input placeholder="" type="number" className="form-control  form-control-sm" required name="zip" defaultValue={this.state.profileDetails.zip} onChange={(e) => { this.state.profileDetails.zip = e.target.value; }} /></div>
                </div>
              </div>
            </div>
          </form>
        </ModalBody><ModalFooter>
          <button type="button" onClick={thisObj.createUser} className="btn-sm btn-fill pull-left btn btn-primary"> Create </button>
          <Button color="secondary" className="btn-sm" onClick={() => { this.setState({ showCreateUserModal: false }) }}>Close</Button>
        </ModalFooter></Modal><Modal isOpen={this.state.showUpdateUserModal}>
        <ModalHeader>User Details</ModalHeader>
        <ModalBody>
          <form className="pl-3 pr-3">
            <div className="row ">
              <div className="row">
                <div className=" col-md-4 float-left pr-0">
                  <div className="form-group"><label className="control-label">Company</label><input placeholder="" type="text" className="form-control form-control-sm" name="company" defaultValue={this.state.profileDetails.company} onChange={(e) => { this.state.profileDetails.company = e.target.value; }} />
                  </div>
                </div>
                <div className=" col-md-4 float-left pr-1 pl-1">
                  <div className="form-group">
                    <label className="control-label">Username</label><input placeholder="" type="text" className="form-control form-control-sm" name="username" defaultValue={this.state.profileDetails.userName} disabled={true} />
                  </div>
                </div>
                <div className="col-md-4 float-left  pl-1">
                  <div className="form-group">
                    <label className="control-label">Email</label><input placeholder="" type="text" className="form-control  form-control-sm" name="email" defaultValue={this.state.profileDetails.email} onChange={(e) => { this.state.profileDetails.email = e.target.value; }} /></div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 float-left pr-1">
                <div className="form-group">
                  <label className="control-label" disabled="disabled">New Password</label>
                  <input {...changePasswordProps} onChange={(e) => { this.state.profileDetails.userPassword = e.target.value; }} />
                </div>
              </div>
              <div className="col-md-6 float-left pr-1">
                <div className="form-group">
                  <div className="checkbox pt-2_5" >
                    <input id="checkbox0" type="checkbox" onChange={(e) => {
                      if (!e.target.checked)
                        this.setState({ changePassword: true })
                      else
                        this.setState({ changePassword: false })
                    }} />
                    <label for="checkbox0">
                      <span className="noselect">
                        Change Password</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="row col-sm-12 pl-0 pr-0">
              <div className="col-md-4 float-left pr-1">
                <div className="form-group">
                  <label className="control-label">Firstname</label><input placeholder="" type="text" className="form-control form-control-sm" name="firstName" defaultValue={this.state.profileDetails.firstName} onChange={(e) => { this.state.profileDetails.firstName = e.target.value; }} /></div>
              </div>
              <div className="col-md-4 float-left pr-1 pl-1">
                <div className="form-group">
                  <label className="control-label">Lastname</label><input placeholder="" type="text" className="form-control  form-control-sm" name="lastName" defaultValue={this.state.profileDetails.lastName} onChange={(e) => { this.state.profileDetails.lastName = e.target.value; }} /></div>
              </div>
              <div className="col-md-4 float-left pr-1 pl-1">
                <div className="form-group">
                  <label className="control-label ">Usertype</label><br />
                  <select className="form-control form-control-sm" name="userType" onChange={(e) => { this.state.profileDetails.userType = e.target.value; }} defaultValue={this.state.profileDetails.userType}>
                    <option value="">--</option>
                    <option value="recruiter">Recruiter</option>
                    <option value="admin">Admin</option>
                    <option value="vendor">Vendor</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="row col-md-12 pl-0 pr-0">
              <div className="col-md-12 float-left">
                <div className="form-group">
                  <label className="control-label">Address</label><input placeholder="" type="text" className="form-control   form-control-sm" name="address" defaultValue={this.state.profileDetails.address} onChange={(e) => { this.state.profileDetails.address = e.target.value; }} /></div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 float-left">
                <div className="form-group">
                  <label className="control-label">City</label><input placeholder="" type="text" className="form-control  form-control-sm" required name="city" defaultValue={this.state.profileDetails.city} onChange={(e) => { this.state.profileDetails.city = e.target.value; }} /></div>
              </div>
              <div className="col-md-4 float-left">
                <div className="form-group">
                  <label className="control-label">Country</label><input placeholder="" type="text" className="form-control  form-control-sm" required name="country" defaultValue={this.state.profileDetails.country} onChange={(e) => { this.state.profileDetails.country = e.target.value; }} /></div>
              </div>
              <div className="col-md-4 float-left">
                <div className="form-group">
                  <label className="control-label">Postalcode</label><input placeholder="" type="number" className="form-control  form-control-sm" required name="zip" defaultValue={this.state.profileDetails.zip} onChange={(e) => { this.state.profileDetails.zip = e.target.value; }} /></div>
              </div>
            </div>
          </form>
        </ModalBody><ModalFooter>
          <button type="button" onClick={thisObj.updateUser} className="btn-sm btn-fill pull-left btn btn-primary"> Update </button>
          <Button color="secondary" className="btn-sm" onClick={() => { this.setState({ showUpdateUserModal: false }) }}>Close</Button>
        </ModalFooter></Modal></>
    );
  }
}
export default ClientsListings;