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

class TeamDetails extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { 
      tblTeamsList: [],//table rendering team details
      numberOfTeams: 0, //number of records
      showCreateTeamModal: false,//create model control
      showUpdateTeamModal:false,//update model controll
      teamLead: "", //for invdual edit
      teamName: "", //for invdual edit
      teamDescription: "", //for invdual edit
      teamId: "",//for invdual edit

      teamLeadType: "",//for invdual createC
      teamLeadTypeId: "",//for invdual createC
      teamLeadUser: "",//for invdual createC
      teamLeadUserId: "",//for invdual createC
      teamUsers: [],//for invdual team users details list
      allUsers:[],//all users list

      selectedTeamUserId:"",//inviduall team member insert

      sess_id:cookies.get("c_csrftoken"),
    }
    this.createNewTeam = this.createNewTeam.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.loadUsersList = this.loadTeamsList.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.showUpdateForm = this.showUpdateForm.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleActivate = this.handleActivate.bind(this);
    this.closeTeamUpdateModal = this.closeTeamUpdateModal.bind(this);
    this.addUserToTeam = this.addUserToTeam.bind(this);
    this.removeTeamMember = this.removeTeamMember.bind(this);

  }
  removeTeamMember(e,userId){
  
    const thisObj = this;
    let formD = new FormData();
    formD.append("teamId",this.state.teamId);
    formD.append("userId", userId);
    formD.append("sess_id",this.state.sess_id);
    document.body.style.cursor = 'progress';
    axios.post(apiUrl + "removeTeamMember", formD).then(function (res) {
      if (res.data.statusResponse) {
       
        axios.get(serverAPI + "getTeamDetailsById", {
          params: {
            teamId: thisObj.state.teamId,
            sess_id:thisObj.state.sess_id
          }
        }).then(({ data }) => {
          if(!data.statusResponse){
            Swal.fire('Oops...', 'Error getting details, try again later', 'error'); return;
          }
          if (data.teamDetails != null) {
            
            thisObj.setState({ 
              teamUsers: data.teamUsers,
            });
          
            //data.currentPageNumber
          }
          document.body.style.cursor = 'default';
        })
          .catch((err) => { }); 
      }
    });

  }

  addUserToTeam(e){
    //check userid existing in the list
    //add userto team reload the  team user list
    const thisObj = this;
    let formD = new FormData();
    formD.append("teamId",this.state.teamId);
    formD.append("userId",this.state.selectedTeamUserId);
    formD.append("sess_id",this.state.sess_id);
    document.body.style.cursor = 'progress';
    axios.post(apiUrl + "addMemberToTeam", formD).then(function (res) {
      if (res.data.statusResponse) {
       
        axios.get(serverAPI + "getTeamDetailsById", {
          params: {
            teamId: thisObj.state.teamId,
            sess_id:thisObj.state.sess_id
          }
        }).then(({ data }) => {
          if(!data.statusResponse){
            Swal.fire('Oops...', 'Error getting details, try again later', 'error'); return;
          }
          if (data.teamDetails != null) {
            
            thisObj.setState({ 
              teamUsers: data.teamUsers,
            });
          
            //data.currentPageNumber
          }
          document.body.style.cursor = 'default';
        })
          .catch((err) => { }); 
      }else{
        Swal.fire('Oops...', res.data.message, 'error'); return;
      }
    });
  }
  closeTeamUpdateModal(e){
    this.setState({ showUpdateTeamModal: false });
    
  }
  handleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  createNewTeam = (event) => {
    var thisObj = this;
    if (this.state.teamLead === "" || this.state.teamName === "") {
      Swal.fire('Oops...', 'Invalid entry', 'error'); return;
    }
    axios.post(apiUrl + "createNewTeam", {
      teamName: this.state.teamName,
      teamLead: this.state.teamLead,
      teamDescription: this.state.teamDescription,
      sess_id: this.state.sess_id
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
            this.setState({ teamName: "", teamLead: "", teamName: "", teamDescription: "", teamLeadUserId: ""});

            thisObj.loadTeamsList();
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
    axios.get(serverAPI + "getTeamDetailsById", {
      params: {
        teamId: id,
        sess_id:cookies.get("c_csrftoken")
      }
    }).then(({ data }) => {
      if(!data.statusResponse){
        Swal.fire('Oops...', 'Error getting details, try again later', 'error'); return;
      }
      if (data.teamDetails != null) {
        
        this.setState({ 
          showUpdateTeamModal:true,
          teamId: data.teamDetails.teamId, 
          teamName: data.teamDetails.teamName,
          teamLeadUserId: data.teamDetails.teamLeadUserId,
          teamDescription: data.teamDetails.Description,
          teamUsers: data.teamUsers,
          allUsers:data.allUsers,
        });
      
        //data.currentPageNumber
      }
      document.body.style.cursor = 'default';
    })
      .catch((err) => { }); return;
  }
  updateUser() {
    var thisObj = this;
    console.log(this.state)
    if (this.state.teamId == "" || this.state.teamName == "" || this.state.teamLeadUserId == "" || this.state.teamDescription == "") {
      Swal.fire('Oops...', 'Invalid entry', 'error'); return;
    }
   
    if (this.state.sess_id == "") {
      Swal.fire('Oops...', 'Invalid authorzation details', 'error'); return;
    }

    axios.put(apiUrl + "updateTeamDetails", {
      teamId: this.state.teamId,
      teamName: this.state.teamName,
      teamLeadUserId: this.state.teamLeadUserId==0?null:this.state.teamLeadUserId,
      teamDescription: this.state.teamDescription,
      sess_id: this.state.sess_id
    }).then(function (res) {
      thisObj.loadTeamsList();
      if (res.data.statusResponse) {
        let timerInterval;
        Swal.fire({
          icon: 'success',
          title: "Team updated successfully",
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

  loadTeamsList() {
    axios.get(serverAPI + "getTeamsDisplayList",{params:{ sess_id:cookies.get("c_csrftoken")}})
      .then(({ data }) => {
        this.setState({ tblTeamsList: data.results, numberOfTeams: data.count });
      })
      .catch((err) => { })
      axios.get(serverAPI + "getTeamDetailsById",{params:{ sess_id:cookies.get("c_csrftoken"), teamId:"000"}})
      .then(({ data }) => {
        this.setState({ allUsers: data.allUsers });
      })
      .catch((err) => { })
  }
  componentDidMount() {
    this.loadTeamsList();
    //
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
                  <h4 className="page-title">Teams List</h4>
                </div>
                <div className="float-right">
                <a size="sm" onClick={() => { this.setState({ showCreateTeamModal: true }) }} className="btn btn-sm btn-primary text-white">Add New</a>
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
                  <th scope="col" style={{width:"10%"}}>Name</th>
                  <th scope="col" style={{width:"40%"}}>Team Lead</th>
                  <th scope="col" style={{width:"10%"}}>Memebers Count</th>
                  <th scope="col" style={{width:"8%"}}/>
                </tr>
              </thead>
            
              <tbody>{this.state.tblTeamsList.map(function (teamData, index) {
                  return <tr key={index}>
                    <td>{teamData.teamName}</td>
                    <td>{teamData.teamLeadUser}</td>
                    <td>{teamData.totalUsers}</td>
                    <td><a title="View/Update" onClick={(e) => thisObj.showUpdateForm(e, teamData.teamId)} className="btn btn-icon-only btn-sm rounded-circle mr-0" ><i className="fa text-info fa-18 fa-eye"></i></a> 
                     <a className="ml-0 btn btn-sm btn-icon-only rounded-circle" onClick={(e) => thisObj.handleActivate(e, teamData.teamId)} ><i className="fa fa-18 text-yellow fa-pen"></i></a></td>
                     </tr>;
                })}{this.state.numberOfTeams==0?<tr><td colSpan={4} className="text-center pt-4"> No Records Found</td></tr>:""}</tbody>
              {this.state.tblTeamsList.length != 0 ? (
                <tfoot>
                  <tr>
                    <td colSpan="4">Number of Records : {this.state.numberOfTeams}</td>
                  </tr>
                  {(this.state.numberOfTeams >= 20) ? <tr><td colSpan="4"><ul className="justify-content-end mb-0 pagination">
                    <li className="page-item">
                      {this.state.pageNumber >= 1 ? <a href={"#" + (this.state.pageNumber - 1)} onClick={this.loadPrevious} className="page-link"><i className="ni ni-bold-left"></i><span className="sr-only">Previous</span></a> : ""}
                    </li>
                    <li className="page-item">
                      {((this.state.pageSize * (this.state.pageNumber + 1)) < (this.state.numberOfTeams)) ? <a href={"#" + (this.state.pageNumber + 1)} onClick={this.loadNext} className="page-link"><i class="ni ni-bold-right"></i><span className="sr-only">Next</span></a> : <a aria-disabled={true} className="page-link"><i className="ni ni-bold-right"></i><span className="sr-only">Next</span></a>}</li></ul></td></tr> : null}</tfoot>) : null}
            </Table>
          </Card>
        </div></Row><Modal isOpen={this.state.showCreateTeamModal} className="modal-lg">
        <ModalHeader>Add Team</ModalHeader>
        <ModalBody>
          <form className="p-4">
            <div >
              <div>
                <div className=" col-md-10 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Business Unit</label>
                      <div className="col-sm-8">
                      <input placeholder="" type="text" disabled={true} className="form-control form-control-sm" name="company" value="canvendor"/>
                      </div>
                  </div>
                </div>


                <div className=" col-md-10 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Team 
                      Name</label>
                      <div className="col-sm-8">
                      
                      <input placeholder="Required" type="text" className="form-control form-control-sm" name="teamName" defaultValue={this.state.teamName} onChange={this.handleInput} />
                      </div>
                  </div>
                </div>

                <div className=" col-md-10 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Team Lead</label>
                      <div className="col-sm-8">
                      <select name="teamLead" className="form-control-sm form-control" onChange={this.handleInput}>
                        <option value="">select</option>
                        
                        {this.state.allUsers.map((data,index)=>{
                          return <option value={data.userId}>{data.firstName} {data.lastName} ({data.email})</option>
                        })}
                      </select>
                      </div>
                  </div>
                </div>

                <div className=" col-md-10 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Team Description</label>
                      <div className="col-sm-8">
                      <textarea placeholder="Required" type="text" className="form-control  form-control-sm" name="teamDescription" defaultValue={this.state.teamDescription} onChange={this.handleInput}/>
                      </div>
                  </div>
                </div>
              
            
              </div>
            </div>
          </form>
        </ModalBody><ModalFooter>
          <button type="button" onClick={thisObj.createNewTeam} className="btn-sm btn-fill pull-left btn btn-primary"> Create </button>
          <Button color="secondary" className="btn-sm" onClick={() => { this.setState({ showCreateTeamModal: false }) }}>Close</Button>
        </ModalFooter></Modal><Modal isOpen={this.state.showUpdateTeamModal} className="modal-lg">
        <ModalHeader>Team Details</ModalHeader>
        <ModalBody>
          <form className="pl-3 pr-3">
            <div>
              <div>
                <div className=" col-md-10 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Business Unit</label>
                      <div className="col-sm-8">
                      <input placeholder="" type="text" disabled={true} className="form-control form-control-sm" name="company" value="canvendor"/>
                      </div>
                  </div>
                </div>
                <div className=" col-md-10 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Team Name</label>
                      <div className="col-sm-8">
                      
                      <input placeholder="Required" type="text" className="form-control form-control-sm" name="teamName" defaultValue={this.state.teamName} onChange={this.handleInput} />
                      </div>
                  </div>
                </div>
                <div className=" col-md-10 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Team Lead</label>
                      <div className="col-sm-8">
                      <select name="teamLeadUserId" defaultValue={this.state.teamLeadUserId} className="form-control-sm form-control" onChange={this.handleInput}>
                        <option value="">select</option>
                        {this.state.allUsers.map((data,index)=>{
                          return <option value={data.userId}>{data.firstName} {data.lastName} ({data.email})</option>
                        })}
                      </select>
                      </div>
                  </div>
                </div>
                <div className=" col-md-10 float-left pr-0">
                  <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Team Description</label>
                      <div className="col-sm-8">
                      <textarea placeholder="Required" type="text" className="form-control  form-control-sm" name="teamDescription" defaultValue={this.state.teamDescription} onChange={this.handleInput}/>
                      </div>
                  </div>
                </div>
                <div className=" col-md-10 float-left pl-3">
                  <div className="form-group row">

                <button type="button" onClick={thisObj.updateUser} className="btn-sm btn-fill pull-left btn btn-primary"> Update Details </button>
                  </div>
                </div>
             <div className="row justify-content-center">
               <hr className="hr-dashed"/>
             </div>
             </div>

              <div className=" col-md-12 float-left pr-0">
                      <table className="w-100 table table-bordered">
                        <thead>
                            <th className="text-center">
                              User Name
                            </th>
                            
                            <th className="text-center">
                              Manage
                            </th>
                        </thead>
                        <tbody>
                          {this.state.teamUsers.length==0?<tr>
                            <td colSpan={2} className="text-center">No Users Assigned</td>
                          </tr>:""}
                            {this.state.teamUsers.map(function(data,index){
                               return <tr key={index}><td>{data.firstName} {data.lastName} ({data.email})</td><td> 
                                <a className="ml-0 btn btn-sm btn-icon-only rounded-circle" onClick={(e) => thisObj.removeTeamMember(e, data.userId)} ><i className="fa text-danger fa-trash fa-18"></i></a>  </td></tr>;
                            })}
                         
                        </tbody>

                      </table>
              </div>
              <div className=" col-md-8 float-left pr-0">
                <div className="form-group row">
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Add User</label>
                      <div className="col-sm-8">
                          <select className="form-control form-control-sm" name="selectedTeamUserId" onChange={this.handleInput} defaultValue={this.state.selectedTeamUserId}>
                            <option value="">select</option>
                            {this.state.allUsers.map(function(data){
                              return <option value={data.userId}>{data.firstName} {data.lastName} ({data.email})</option>
                            })}
                          </select>
                      </div>
                  </div>
                </div>
                <div className=" col-md-2 float-left pr-0">
                        <button className="btn btn-primary btn-sm" type="button" onClick={(e)=>this.addUserToTeam(e)}>Save</button>
                </div>

           
            </div>
          </form>
        </ModalBody><ModalFooter>
         
          <Button color="secondary" className="btn-sm" onClick={(e) => { this.closeTeamUpdateModal(e) }}>Close</Button>
        </ModalFooter></Modal></>
    );
  }
}
export default TeamDetails;