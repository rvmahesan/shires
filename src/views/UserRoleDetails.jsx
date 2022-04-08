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

import { apiUrl, serverAPI } from "../variables/Variables";
import Cookies from "universal-cookie";
//const cookies = new Cookies();

const axios = require("axios").default;
const cookies = new Cookies();

class UserRoleDetails extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { userRolesList: [],showUpdateUserModal:false,showCreateUserModal:false, roleId :0, numberOfRecords: 0, roleName: "", roleCategory: "",sess_id:cookies.get("c_csrftoken")}
    this.createUserRole = this.createUserRole.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.loadUserRolesList = this.loadUserRolesList.bind(this);
    this.updateUserRole = this.updateUserRole.bind(this);
    this.showUpdateForm = this.showUpdateForm.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleActivate = this.handleActivate.bind(this);
  }
  handleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  createUserRole = (event) => {
    var thisObj = this;
    if (this.state.roleName === "" || this.state.roleCategory === "" ) {
      Swal.fire('Oops...', 'Invalid entry', 'error'); return;
    }
    axios.post(apiUrl + "createNewRole", {
      roleName: this.state.roleName,
      roleCategory: this.state.roleCategory,
      sess_id:this.state.sess_id
    }).then(function (res) {  
      if (res.data.statusResponse) {
       
        let timerInterval;
        Swal.fire({
          icon: 'success',
          title: "Role created successfully",
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
            this.setState({ firstName: "", lastName: "", company: "", username: "", email: "", address: "", city: "", country: "", zip: "", authToken: "", userType: "" });

            thisObj.loadUserRolesList();
          }
        });
      } else {
        Swal.fire('Oops...', 'Error creating', 'error'); return;
      }
    });
  }
  showUpdateForm(e, id) {
    //get single user details 
    document.body.style.cursor = 'progress';
    axios.get(serverAPI + "getRoleDetails", {
      params: {
        roleId: id,
        sess_id:cookies.get("c_csrftoken")
      }
    }).then(({ data }) => {
      
      if (data.statusResponse) { 
        this.setState({ showUpdateUserModal: true, roleId: data.roleDetails.roleId, roleName: data.roleDetails.roleName, roleCategory: data.roleDetails.roleCategoryName });
        //data.currentPageNumber
      }
      document.body.style.cursor = 'default';
    })
      .catch((err) => { });


  }
  updateUserRole() {
    var thisObj = this;
    if (this.state.roleName == "" || this.state.roleCategory == "" || this.state.roleId == "" || this.state.roleId == 0 ) {
      Swal.fire('Oops...', 'Invalid entry', 'error'); return;
    }
    
    if (this.state.authToken == "") {
      Swal.fire('Oops...', 'Invalid authorzation details', 'error'); return;
      return;
    }

    axios.put(apiUrl + "updateUserRoleDetails", {
      roleId: this.state.roleId,
      roleName: this.state.roleName,
      roleCategory: this.state.roleCategory,
      sess_id: this.state.sess_id
    }).then(function (res) {
      thisObj.loadUserRolesList();
      if (res.data.statusResponse) {
        let timerInterval;
        Swal.fire({
          icon: 'success',
          title: "User role updated successfully",
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
            thisObj.setState({ showUpdateUserModal: false })
          }
        });
      } else {
        Swal.fire('Oops...', 'Error creating', 'error'); return;
      }
    });
  }



  handleDelete = (event, authToken) => {
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
      cancelBtnBsStyle:"pr-2 mr-2",
      confirmBtnBsStyle:"pr-2 mr-2",
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        axios.put(apiUrl + "deActiveUser", { userId: authToken,sess_id:cookies.get("c_csrftoken") }).then(({ data }) => {
          console.log(data)
          if (data.statusResponse == true) {
            let timerInterval;
            Swal.fire({
              icon: 'success',
              title: data.message,
              html: '',
              timer: 1800,
              timerProgressBar: true,
              btnSize:"sm"
            }).then((result) => {
              /* Read more about handling dismissals below */
               window.location.reload();

            });
          }
        }).catch(function (err) {
          console.log(err);
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {

      }
    })
  }

  handleActivate(e, authToken) {
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
      cancelBtnBsStyle:"pr-2",
      reverseButtons: true,
      btnSize:"sm"
    }).then((result) => {
      if (result.value) {
        axios.put(apiUrl + "reActiveUser", { userId: authToken,sess_id:cookies.get("c_csrftoken") }).then(({ data }) => {
          if (data.statusResponse == true) {
            let timerInterval;
            Swal.fire({
              icon: 'success',
              title: data.message,
              html: '',
              timer: 1800,
              timerProgressBar: true
            }).then((result) => {
              /* Read more about handling dismissals below */
              window.location.reload();
            });
          }
        }).catch(function (err) {
          console.log(err);
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {

      }
    })
  }

  loadUserRolesList() {
    axios.get(serverAPI + "getAllUsersRole",{params:{ sess_id:cookies.get("c_csrftoken")}})
      .then(({ data }) => {
        this.setState({ userRolesList: data.results, numberOfRecords: data.count });
      })
      .catch((err) => { })
  }
  componentDidMount() {
    this.loadUserRolesList();
    //
  }

  render() {
    const thisObj = this;
    
    return (<> 
      <div className="row">
        <div className="col-sm-12">
          <div className="page-title-box">
            <div className="row">
              <div className="col">
                <div className="col-sm-6 float-left">
                  <h4 className="page-title">Roles</h4>
                </div>
                <div className="float-right">
                <a size="sm" onClick={() => { this.setState({ showCreateUserRoleModal: true }) }} className="btn btn-sm btn-primary text-white">Add New</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Row>
        <div className="col">
          <Card className="p-2">
            <Table className="align-items-center table-flush" responsive>
              <thead className="thead-light">
                <tr>
                  <th scope="col">Role</th>
                  <th scope="col">Category</th>
                  <th scope="col">Number Of Users</th>
                  <th scope="col">Actions</th>
                  <th scope="col" />
                </tr>
              </thead>
              <tbody>
                {this.state.userRolesList.map(function (obj, index) {
                  var idValue = obj.roleId;
                  
                  return <tr key={index}>
                    <td>{obj.roleName}</td>
                    <td>{obj.roleCategoryName}</td>
                    <td>{obj.numberOfUsers} </td>
                    <td> 
                      <a title="View/Update" onClick={(e) => thisObj.showUpdateForm(e, obj.roleId)} className="btn btn-icon-only btn-sm rounded-circle mr-0" ><i className="fa text-info fa-18 fa-eye"></i> <i className="fa fa-18 text-yellow fa-pen"></i></a>
                     
                     <a className="ml-0 btn btn-sm btn-icon-only rounded-circle" onClick={(e) => thisObj.handleDelete(e, obj.roleId)} ><i className="fa text-danger fa-trash fa-18"></i></a> 
                    </td>
                    
                    </tr>;
                })}
                {this.state.userRolesList.length == 0 ?<tr><td className="text-center pt-4" colSpan={5}>No Records Found</td></tr>:""}
              </tbody>
              {this.state.userRolesList.length != 0 ? (
                <tfoot>
                  <tr>
                    <td colSpan="2">Number of Records : {this.state.numberOfRecords}</td>
                  </tr>
                  {(this.state.numberOfRecords >= 20) ? <tr><td colSpan="4"><ul className="justify-content-end mb-0 pagination">
                    <li className="page-item">
                      {this.state.pageNumber >= 1 ? <a href={"#" + (this.state.pageNumber - 1)} onClick={this.loadPrevious} className="page-link"><i className="ni ni-bold-left"></i><span className="sr-only">Previous</span></a> : ""}
                    </li>
                    <li className="page-item">
                      {((this.state.pageSize * (this.state.pageNumber + 1)) < (this.state.numberOfRecords)) ? <a href={"#" + (this.state.pageNumber + 1)} onClick={this.loadNext} className="page-link"><i class="ni ni-bold-right"></i><span className="sr-only">Next</span></a> : <a aria-disabled={true} className="page-link"><i className="ni ni-bold-right"></i><span className="sr-only">Next</span></a>}</li></ul></td></tr> : null}</tfoot>) : null}
            </Table>
          </Card>
        </div></Row><Modal isOpen={this.state.showCreateUserRoleModal} className="modal-md">
        <ModalHeader>Add Role</ModalHeader>
        <ModalBody>
          <form className="p-4">
            <div >
              <div>
                <div className=" col-md-10 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Business Unit</label>
                      <div className="col-sm-8">
                      <input placeholder="" disabled={true} type="text" className="form-control form-control-sm" name="company" value="canvendor"/>
                      </div>
                  </div>
                </div>


                <div className=" col-md-10  float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input"className="col-sm-4 float-left col-form-label text-left">Role Name</label>
                      <div className="col-sm-8">
                      
                      <input placeholder="Required" type="text" className="form-control form-control-sm"  name="roleName" defaultValue={this.state.roleName} onChange={this.handleInput} />
                      </div>
                  </div>
                </div>

                <div className=" col-sm-10 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Role Category</label>
                      <div className="col-sm-8">
                      <select onChange={this.handleInput} name="roleCategory" className="form-control form-control-sm" >
                        <option value="">select</option>
                        <option value="HR Manager">HR Manager</option>
                        <option value="Recruitment Manager">Recruitment Manager</option>
                        <option value="Technical Recruiter">Technical Recruiter</option>
                        <option value="Administrator">Administrator</option>
                        <option value="Sales Manager">Sales Manager</option>
                        <option value="Director">Director</option>
                        <option value="Team Lead">Team Lead</option>
                        <option value="Trainee Recruiter">Trainee Recruiter</option>
                      </select>
                      </div>
                  </div>
                </div>

          

            
              </div>

            </div>
          </form>
        </ModalBody><ModalFooter>
          <button type="button" onClick={thisObj.createUserRole} className="btn-sm btn-fill pull-left btn btn-primary"> Create </button>
          <Button color="secondary" className="btn-sm" onClick={() => { this.setState({ showCreateUserRoleModal: false }) }}>Close</Button>
        </ModalFooter></Modal><Modal isOpen={this.state.showUpdateUserModal}>
        <ModalHeader>User Role Details</ModalHeader>
        <ModalBody>
          <form className="pl-3 pr-3">
          <div >
              <div>
                <div className=" col-md-10 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Business Unit</label>
                      <div className="col-sm-8">
                      <input placeholder="" disabled={true} type="text" className="form-control form-control-sm" name="company" value="canvendor"/>
                      </div>
                  </div>
                </div>


                <div className=" col-md-10  float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input"className="col-sm-4 float-left col-form-label text-left">Role Name</label>
                      <div className="col-sm-8">
                      <input type="hidden" name="roleId" defaultValue={this.state.roleId}/>

                      <input placeholder="Required" type="text" className="form-control form-control-sm"  name="roleName" defaultValue={this.state.roleName} onChange={this.handleInput} />
                      </div>
                  </div>
                </div>

                <div className=" col-sm-10 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Role Category</label>
                      <div className="col-sm-8">
                      <select onChange={this.handleInput} name="roleCategory" className="form-control form-control-sm" defaultValue={this.state.roleCategory} >
                        <option value="">select</option>
                        <option value="HR Manager">HR Manager</option>
                        <option value="Recruitment Manager">Recruitment Manager</option>
                        <option value="Technical Recruiter">Technical Recruiter</option>
                        <option value="Administrator">Administrator</option>
                        <option value="Sales Manager">Sales Manager</option>
                        <option value="Director">Director</option>
                        <option value="Team Lead">Team Lead</option>
                        <option value="Trainee Recruiter">Trainee Recruiter</option>
                      </select>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </ModalBody><ModalFooter>
          <button type="button" onClick={thisObj.updateUserRole} className="btn-sm btn-fill pull-left btn btn-primary"> Update </button>
          <Button color="secondary" className="btn-sm" onClick={() => { this.setState({ showUpdateUserModal: false }) }}>Close</Button>
        </ModalFooter></Modal></>
    );
  }
}
export default UserRoleDetails;