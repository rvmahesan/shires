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

class UsersListings extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { nextUrl:"",previousUrl:"", allRoleslist:[], allUsersList: [],allTeamsList: [], usersList: [], numberOfUsers: 0, showCreateUserModal: false, showUpdateUserModal:false,
      firstName: "", 
      lastName: "",
      email: "", 
      username: "", 
      password: "", 
      c_password: "", 
      phone: "",
      role: "", 
      reportingTo: "", 
      team: "",
      userId:"",
      sess_id:cookies.get("c_csrftoken"), selectedProfileDetails:[] }
    this.createUser = this.createUser.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.loadUsersList = this.loadUsersList.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.showUpdateForm = this.showUpdateForm.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleActivate = this.handleActivate.bind(this);
    this.setConfigData = this.setConfigData.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.loadNext = this.loadNext.bind(this);
    this.loadPrevious = this.loadPrevious.bind(this);
  }
  loadNext = ()=>{
    axios.get(this.state.nextUrl,{params:{ sess_id:cookies.get("c_csrftoken")}})
    .then(({ data }) => {
      this.setState({ usersList: data.results, numberOfUsers: data.count,nextUrl:data.next ,previousUrl:data.previous });
    })
    .catch((err) => { })
  }
  loadPrevious = ()=>{
    axios.get(this.state.previousUrl,{params:{ sess_id:cookies.get("c_csrftoken")}})
    .then(({ data }) => {
      this.setState({ usersList: data.results, numberOfUsers: data.count,nextUrl:data.next ,previousUrl:data.previous });
    })
    .catch((err) => { })
  }
  handleInput = (e) => {
    this.setState({[e.target.name]: e.target.value });
  }
  createUser = (event) => {
    var thisObj = this;
    if (this.state.email === "" || this.state.username === "" || this.state.lastName === "" || this.state.firstname === "" || this.state.password === "" || this.state.c_password === "" || this.state.roleId === "") {
      Swal.fire('Oops...', 'Invalid entry', 'error'); return;
    }
    if (this.state.password != this.state.c_password) {
      Swal.fire('Oops...', 'Passwords not matching', 'error'); return;
      return;
    }
    
    axios.post(apiUrl + "createNewUser", {
      username: this.state.username,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      phone: this.state.phone,
      password: this.state.password,
      c_password: this.state.c_password,
      roleId: this.state.roleId,
      reportingTo: this.state.reportingTo,
      teamId: this.state.teamId,
      sess_id:this.state.sess_id
    }).then(function (res) {
      if (res.data.statusResponse) {
        let timerInterval;
        Swal.fire({
          icon: 'success',
          title: "User created successfully",
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

            thisObj.loadUsersList();
          }
        });
      } else {
        Swal.fire('Oops...',  res.data.message, 'error'); return;
      }
    });
  }
  showUpdateForm(e, id) {
    //get single user details 
    document.body.style.cursor = 'progress';
    axios.get(serverAPI + "userProfileDetails", {
      params: {
        userId: id,
        sess_id:this.state.sess_id
      }
    }).then(({ data }) => {

      if (data.profileDetails != null) {
        this.setState({ 
          showUpdateUserModal: true,
          selectedProfileDetails:data.profileDetails 
          });
          
          this.setState({
            firstName:this.state.selectedProfileDetails.firstName,
            lastName:this.state.selectedProfileDetails.lastName,
            email:this.state.selectedProfileDetails.email,
            phone:this.state.selectedProfileDetails.phone,
            username:this.state.selectedProfileDetails.userName,
            role:this.state.selectedProfileDetails.userRoleId,
            team:this.state.selectedProfileDetails.teamId,
            userId:this.state.selectedProfileDetails.userId,
            reportingTo:this.state.selectedProfileDetails.reportingTo,

          });


        //data.currentPageNumber
      }else{
        alert("Error fetching user details")
      }
      document.body.style.cursor = 'default';
    })
      .catch((err) => { });


  }
  updateUser() {
    var thisObj = this;
 
    if (this.state.username == "" || this.state.firstName == "" || this.state.lastName == "" || this.state.email == "" || this.state.role == "" || this.state.userId == "") {
      Swal.fire('Oops...', 'Invalid entry', 'error'); return;
    }
    
    if(this.state.password !== "")
      if ((this.state.password !== "") || (this.state.password != this.state.c_password)) {
        Swal.fire('Oops...', 'Passwords not matching', 'error'); return;
        return;
      }
    
    if (this.state.sess_id == "") {
      Swal.fire('Oops...', 'Invalid authorzation details', 'error'); return;
      return;
    }

    axios.put(apiUrl + "updateUserDetails", {
      userId:this.state.selectedProfileDetails.userId,
      company: "canvendor",
      firstName: this.state.firstName,
      lastName:this.state.lastName,
      userName:this.state.username,
      email: this.state.email,
      phone: this.state.phone,
      role:this.state.role,
      password:this.state.password,
      c_password:this.state.c_password,
      reportingTo:this.state.reportingTo,
      sess_id:this.state.sess_id
    }).then(function (res) {
      thisObj.loadUsersList();
      thisObj.setState({showUpdateUserModal:false});
      if (res.data.statusResponse) {
        thisObj.resetForm();
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
          }else{
            Swal.fire('Alert',data.message,'error');
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

  loadUsersList() {
    axios.get(serverAPI + "getAllUsers",{params:{ sess_id:cookies.get("c_csrftoken")}})
      .then(({ data }) => {

        this.setState({ usersList: data.results, numberOfUsers: data.count,nextUrl:data.next,previousUrl:data.previous});
      })
      .catch((err) => { })
  }
  setConfigData(){
    //allRoleslist:[], allUsersList: [],allTeamsList: []
      //getSelectUsersList
    //getSelectTeamsList
    //getSelectUserRolesList
    axios.all([
      axios.get(serverAPI + "getSelectUsersList",{
        params: {
            sess_id: this.state.sess_id
        }
    }),
      axios.get(serverAPI + "getSelectTeamsList",{
        params: {
            sess_id: this.state.sess_id
        }
    }),
      axios.get(serverAPI + "getSelectUserRolesList",{
          params: {
              sess_id:this.state.sess_id
          }
      }),
      ])
      .then(axios.spread((usersList, teamsList,rolesList) =>{
          this.setState({allRoleslist : rolesList.data.data, allTeamsList : teamsList.data.data, allUsersList:usersList.data.data});
        
      }));

  }
  componentDidMount() {
    this.loadUsersList();
    this.setConfigData();
    //
  }
  resetForm(){
    this.setState({firstName: "", 
    lastName: "",
    email: "", 
    username: "", userName:"",
    password: "", 
    c_password: "", 
    phone: "",
    role: "", 
    reportingTo: "", 
    team: "",
    userId:""});
  }

  render() {
    let thisObj = this;
    return (<> 
      <div className="row">
        <div className="col-sm-12">
          <div className="page-title-box">
            <div className="row">
              <div className="col">
                <div className="col-sm-6 float-left">
                  <h4 className="page-title">Users List</h4>
                </div>
                <div className="float-right">
                <a size="sm" onClick={() => { this.setState({ showCreateUserModal: true }) }} className="btn btn-sm btn-primary text-white">Add New</a>
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
                  <th scope="col">Name</th>
                  <th scope="col">Company</th>
                  <th scope="col">Username</th>
                  <th scope="col">Email</th>
                  <th scope="col" />
                </tr>
              </thead>
              <tbody>


                {this.state.usersList.map(function (obj, index) {
                  var idValue = obj.userId;
                  return <tr key={index}><td>{obj.firstName} {obj.lastName}</td><td>{obj.company}</td><td>{obj.userName}</td><td>{obj.email}</td><td> <a title="View/Update" onClick={(e) => thisObj.showUpdateForm(e, obj.userId)} className="btn btn-icon-only btn-sm rounded-circle mr-0" ><i className="fa text-info fa-18 fa-eye"></i></a> 
                  <a className="ml-0 btn btn-sm btn-icon-only rounded-circle" onClick={(e) => thisObj.showUpdateForm(e, obj.userId)} ><i className="fa fa-18 text-yellow fa-pen"></i></a>
                   <a className="ml-0 btn btn-sm btn-icon-only rounded-circle" onClick={(e) => thisObj.handleDelete(e, obj.userId)} ><i className="fa text-danger fa-trash fa-18"></i></a>  </td></tr>;
                })}
              </tbody>
         
              {this.state.numberOfUsers !=0 ? (
                <tfoot>
                  <tr>
                    <td colSpan="3">Number of Users : {this.state.numberOfUsers}</td>
                 
                  {(this.state.numberOfUsers >= 20) ?
                    <td colSpan="2"><ul className="justify-content-end mb-0 pagination">
                    <li className="page-item">
                    
                      {this.state.previousUrl !== null ? <a className="page-link"  onClick={this.loadPrevious}><i className="typcn  typcn-chevron-left-outline "></i><span className="sr-only">Previous</span></a> : ""}

                    </li>
                    <li className="page-item">
                      {this.state.nextUrl !== null ? <a  onClick={this.loadNext} className="page-link"><i className="typcn  typcn-chevron-right-outline "></i><span className="sr-only">Next</span></a> : ""}</li></ul></td> : null}</tr></tfoot>) : null}
                      
            </Table>
          </Card>
        </div></Row><Modal isOpen={this.state.showCreateUserModal} className="modal-lg">
        <ModalHeader>Add User</ModalHeader>
        <ModalBody>
          <form className="p-4">
            <div >
              <div>
                <div className=" col-md-5 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Business Unit</label>
                      <div className="col-sm-8">
                      <input placeholder="" type="text" className="form-control form-control-sm" name="company" value="canvendor" disabled={true} />
                      </div>
                  </div>
                </div>


                <div className=" col-md-5 ml-5 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Username<span className="text-danger pl-2">*</span></label>
                      <div className="col-sm-8">
                      
                      <input placeholder="Required" type="text" className="form-control form-control-sm" name="username" defaultValue={this.state.username} onChange={this.handleInput} />
                      </div>
                  </div>
                </div>

                <div className=" col-md-5 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Email<span className="text-danger pl-2">*</span></label>
                      <div className="col-sm-8">
                      <input placeholder="Required" type="text" className="form-control  form-control-sm" name="email" defaultValue={this.state.email} onChange={this.handleInput} />
                      </div>
                  </div>
                </div>

                <div className=" col-md-5 ml-5 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Phone</label>
                      <div className="col-sm-8">
                      <input placeholder="Required" type="text" className="form-control  form-control-sm" name="phone" defaultValue={this.state.phone} onChange={this.handleInput} />
                      </div>
                  </div>
                </div>
              

                <div className=" col-md-5 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Firstname<span className="text-danger pl-2">*</span></label>
                      <div className="col-sm-8">
                      <input placeholder="Required" type="text" className="form-control form-control-sm" name="firstName" defaultValue={this.state.firstName} onChange={this.handleInput} />
                      </div>
                  </div>
                </div>

                <div className=" col-md-5 ml-5 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Lastname<span className="text-danger pl-2">*</span></label>
                      <div className="col-sm-8">
                      <input placeholder="Required" type="text" className="form-control form-control-sm" name="lastName" defaultValue={this.state.lastName} onChange={this.handleInput} />
                      </div>
                  </div>
                </div>

                <div className=" col-md-5 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Password<span className="text-danger pl-2">*</span></label>
                      <div className="col-sm-8">
                      <input placeholder="Required" type="text" className="form-control  form-control-sm" name="password" defaultValue={this.state.password} onChange={this.handleInput} />
                      </div>
                  </div>
                </div>

                <div className=" col-md-5 float-left ml-5 pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 pt-0 mt-0 float-left col-form-label text-left">Confirm Password<span className="text-danger pl-2">*</span></label>
                      <div className="col-sm-8">
                      <input placeholder="Required" type="text" className="form-control form-control-sm" name="c_password" defaultValue={this.state.confirmpassword} onChange={this.handleInput} />
                      </div>
                  </div>
                </div>

                
                <div className=" col-md-5 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Role<span className="text-danger pl-2">*</span></label>
                      <div className="col-sm-8">
                      <select className="form-control-sm w-100 form-control-select" name="roleId" onChange={this.handleInput} defaultValue={this.state.role}>
                        <option value="">Select</option>
                        
                      {this.state.allRoleslist.map((data,$index,)=>{
                        return <option value={data.pk}>{data.fields.roleName}</option>
                      })}
                       
                    </select>
                      </div>
                  </div>
                </div>


                <div className=" col-md-5  ml-5 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Reporting To</label>
                      <div className="col-sm-8">
                      <select className="form-control-sm w-100 form-control-select" name="reportingTo" onChange={this.handleInput} defaultValue={this.state.reportingTo}>
                        <option value="">Select</option>
                        {this.state.allUsersList.map(function(data){
                          return <option value={data.pk}>{data.fields.firstName}</option>
                      })}
                    </select>
                      </div>
                  </div>
                </div>


                <div className=" col-md-5 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Team</label>
                      <div className="col-sm-8">
                      <select className="form-control-sm w-100 form-control-select" name="teamId" onChange={this.handleInput} defaultValue={this.state.team}>
                        <option value="">Select</option>
                        {this.state.allTeamsList.map(function(data){
                        return <option value={data.pk}>{data.fields.teamName}</option>
                      })}
                    </select>
                      </div>
                  </div>
                </div>


            
              </div>

            </div>
          </form>
        </ModalBody><ModalFooter>
          <button type="button" onClick={thisObj.createUser} className="btn-sm btn-fill pull-left btn btn-primary"> Create </button>
          <Button color="secondary" className="btn-sm" onClick={() => { this.setState({ showCreateUserModal: false });this.resetForm(); }}>Close</Button>
        </ModalFooter></Modal><Modal isOpen={this.state.showUpdateUserModal} className="modal-lg">
        <ModalHeader>User Details</ModalHeader>
        <ModalBody>
          <form className="p-4">
                <div className="row p-0">
                <div className=" col-md-6 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Business Unit</label>
                      <div className="col-sm-8">
                      <input placeholder="" type="text" className="form-control form-control-sm" name="company" value="canvendor" disabled={true} />
                      </div>
                  </div>
                </div> 
                <div className=" col-md-6 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Username<span className="text-danger pl-2">*</span></label>
                      <div className="col-sm-8">
                      
                      <input placeholder="Required" type="text" className="form-control form-control-sm" name="username" defaultValue={this.state.selectedProfileDetails.userName} onChange={this.handleInput} />
                      </div>
                  </div>
                </div>
                </div>

                <div className="row p-0">
                   <div className=" col-md-6 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Email<span className="text-danger pl-2">*</span></label>
                      <div className="col-sm-8">
                      <input placeholder="Required" type="text" className="form-control  form-control-sm" name="email" defaultValue={this.state.selectedProfileDetails.email}  onChange={this.handleInput} />
                      </div>
                  </div>
                </div>
                
                <div className=" col-md-6 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Phone</label>
                      <div className="col-sm-8">
                      <input type="text" className="form-control  form-control-sm" name="phone" defaultValue={this.state.selectedProfileDetails.phone}  onChange={this.handleInput} />
                      </div>
                  </div>
                </div>
                </div>
                <div className="row p-0">
                <div className=" col-md-6 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Firstname<span className="text-danger pl-2">*</span></label>
                      <div className="col-sm-8">
                      <input placeholder="Required" type="text" className="form-control form-control-sm" name="firstName" defaultValue={this.state.selectedProfileDetails.firstName}  onChange={this.handleInput} />
                      </div>
                  </div>
                </div>
                
                <div className=" col-md-6  float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Lastname<span className="text-danger pl-2">*</span></label>
                      <div className="col-sm-8">
                      <input placeholder="Required" type="text" className="form-control form-control-sm" name="lastName" defaultValue={this.state.selectedProfileDetails.lastName}  onChange={this.handleInput} />
                      </div>
                  </div>
                </div>
                </div>
               
                <div className="row p-0">
                <div className=" col-md-6 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Role<span className="text-danger pl-2">*</span></label>
                      <div className="col-sm-8">
                      <select className="form-control-sm w-100 form-control-select" name="role" onChange={this.handleInput} defaultValue={this.state.selectedProfileDetails.userRoleId} >
                        <option value="">Select</option>
                      {this.state.allRoleslist.map((data,$index,)=>{
                        return <option value={data.pk}>{data.fields.roleName}</option>
                      })}
                       
                    </select>
                      </div>
                  </div>
                </div>
               
                <div className=" col-md-6  float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Reporting To</label>
                      <div className="col-sm-8">
                      <select className="form-control-sm w-100 form-control-select" name="reportingTo" onChange={this.handleInput} defaultValue={this.state.selectedProfileDetails.reportingTo} >
                        <option value="">Select</option>
                        {this.state.allUsersList.map(function(data){
                          return <option value={data.pk}>{data.fields.firstName}</option>
                      })}
                    </select>
                      </div>
                  </div>
                </div>
                </div>
                <div className="row p-0">
                <div className=" col-md-6 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Team</label>
                      <div className="col-sm-8" >
                        {this.state.allTeamsList.map(function(data){
                        return <>{thisObj.state.selectedProfileDetails.teamId === data.pk?data.fields.teamName:""}</>
                      })}
                      </div>
                  </div>
                </div>
                </div>
                <div className="row">
                  <h5 className="col-sm-12 mb-3">Change Password</h5>

                <div className=" col-md-6 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Password</label>
                      <div className="col-sm-8">
                      <input placeholder="Leave empty for keep current password" type="text" className="form-control  form-control-sm" title="Leave empty for keep current password" name="password" defaultValue={this.state.password} onChange={this.handleInput} />
                      </div>
                  </div>
                </div>

                <div className=" col-md-6 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 pt-0 mt-0 float-left col-form-label text-left">Confirm Password</label>
                      <div className="col-sm-8">
                      <input placeholder="Leave empty for keep current password" title="Leave empty for keep current password" type="text" className="form-control form-control-sm" name="c_password" defaultValue={this.state.confirmpassword} onChange={this.handleInput} />
                      </div>
                  </div>
                </div>
                </div>

          </form>
        </ModalBody><ModalFooter>
          <button type="button" onClick={thisObj.updateUser} className="btn-sm btn-fill pull-left btn btn-primary"> Update </button>
          <Button color="secondary" className="btn-sm" onClick={() => { this.setState({ showUpdateUserModal: false });this.resetForm(); }}>Close</Button>
        </ModalFooter></Modal></>
    );
  }
}
export default UsersListings;