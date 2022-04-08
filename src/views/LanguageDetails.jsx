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

class LanguageDetails extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { 
      departmentList: [], 
      numberOfRecords: 0, 
      showCreateModal: false, 
      configId:"", 
      configName: "",
       configType: "",
       sess_id:cookies.get("c_csrftoken"),
       nextUrl:null, 
       prevUrl:null,
    }
    this.createNewRecords = this.createNewRecords.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.loadAllDepartments = this.loadAllDepartments.bind(this);
    this.updateConfigDetails = this.updateConfigDetails.bind(this);
    this.showUpdateForm = this.showUpdateForm.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.loadPrevious = this.loadPrevious.bind(this);
    this.loadNext = this.loadNext.bind(this);

    

  }
  handleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  createNewRecords = (event) => {
    var thisObj = this;
    if (this.state.configName === "") {
      Swal.fire('Oops...', 'Invalid entry', 'error'); return;
    }
    let fData = new FormData();
    fData.append("configName", this.state.configName);
    fData.append("configType", "language");
    fData.append("sess_id", this.state.sess_id);

    axios.post(apiUrl + "AddConfigDetails", fData).then(function (res) {
      if (res.data.statusResponse) {
        let timerInterval;
        Swal.fire({
          icon: 'success',
          title: "Created successfully",
          html: '',
          timer: 600,
          btnSize:"sm",
          timerProgressBar: true
        });
        
        setTimeout(function(){
          thisObj.setState({ showCreateModal: false })
          thisObj.setState({ configName: "", configType: "", configId: "" });
          thisObj.loadAllDepartments();
        },400);
        
      
      } else {
        Swal.fire('Oops...', 'Error creating', 'error'); return;
      }
    });
  }
  showUpdateForm(e, id, name) {
    //get single user details 
    document.body.style.cursor = 'progress';
    axios.get(serverAPI + "getConfigDetails", {
      params: {
        configId: id,
        sess_id:cookies.get("c_csrftoken")
      }
    }).then(({ data }) => {

      if (data.details != null) {
        this.setState({ showUpdateModal: true,configId:data.details.ConfigId, configName: data.details.ConfigName, configType: data.details.ConfigType });
        //data.currentPageNumber
      }
      document.body.style.cursor = 'default';
    })
      .catch((err) => { });


  }
  updateConfigDetails() {
    var thisObj = this;
    console.log(this.state.configId)
    if (this.state.configName == "" || this.state.configId == "") {
      Swal.fire('Oops...', 'Invalid entry', 'error'); return;
    }
  
    if (this.state.configId == "") {
      Swal.fire('Oops...', 'Invalid authorzation details', 'error'); return;
      return;
    }
    let fData = new FormData();
    fData.append("configName", this.state.configName);
    fData.append("configId", this.state.configId);
    fData.append("configType", "language");
    fData.append("sess_id", this.state.sess_id);

    axios.post(apiUrl + "updateConfigDetails", fData).then(function (res) {
      thisObj.loadAllDepartments();
      if (res.data.statusResponse) {
        let timerInterval;
        Swal.fire({
          icon: 'success',
          title: "Details updated successfully",
          html: '',
          timer: 800,
          timerProgressBar: true
        });
        
      setTimeout(function(){
        thisObj.setState({ showUpdateModal: false })
        thisObj.setState({ configName: "", configType: "", configId: "" });
        thisObj.loadAllDepartments();
      },400);
      

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

  loadPrevious(){
    axios.get(this.state.prevUrl)
    .then(({ data }) => {
      
      this.setState({ departmentList: data.results,numberOfRecords:data.count,nextUrl:data.next,prevUrl:data.previous });
    
      //console.log(this.state.departmentList);return;
    })
    .catch((err) => { })
  }
  loadNext(){
    axios.get(this.state.nextUrl)
    .then(({ data }) => {
      
      this.setState({ departmentList: data.results,numberOfRecords:data.count,nextUrl:data.next,prevUrl:data.previous });
    
      //console.log(this.state.departmentList);return;
    })
    .catch((err) => { })
  }

  loadAllDepartments() {
    axios.get(serverAPI + "getConfigList",{params:{ sess_id:cookies.get("c_csrftoken"),search:"language"}})
      .then(({ data }) => {
        
        this.setState({ departmentList: data.results,numberOfRecords:data.count,nextUrl:data.next,prevUrl:data.previous });
      
        //console.log(this.state.departmentList);return;
      })
      .catch((err) => { })
  }
  componentDidMount() {
    this.loadAllDepartments();
    //
  }

  render() {
    let thisObj = this;
   /*departmentList: [], 
      numberOfRecords: 0, */
     
    return (<> 
      <div className="row">
        <div className="col-sm-12">
          <div className="page-title-box">
            <div className="row">
              <div className="col">
                <div className="col-sm-6 float-left">
                  <h4 className="page-title">Language</h4>
                </div>
                <div className="float-right">
                <a size="sm" onClick={() => { this.setState({ showCreateModal: true }) }} className="btn btn-sm btn-primary text-white">Add New</a>
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
                  <th scope="col">Created By</th>
                  <th scope="col" style={{width:"10%"}}>Created Date</th>
                  <th scope="col" style={{width:"8%"}}/>
                </tr>
              </thead>
              <tbody>

                {this.state.departmentList?this.state.departmentList.map(function (obj, index) {
                  var idValue = obj._id;
                  return <tr key={index}><td>{obj.ConfigName}</td><td>{obj.createdBy==1?"admin":""} </td><td>
                    {obj.createdDate !== "" ? new Date(obj.createdDate).toDateString() : "--"}
                    </td><td>
                     <a title="View/Update" onClick={(e) => thisObj.showUpdateForm(e, obj.ConfigId,obj.ConfigName)} className="btn btn-icon-only btn-sm rounded-circle mr-0" ><i className="fa text-info fa-18 fa-eye"></i></a> 
                     <a className="ml-0 btn btn-sm btn-icon-only rounded-circle"><i className="fa fa-18 text-yellow fa-pen"></i></a></td></tr>;
                }):""}
                {this.state.numberOfRecords==0?<tr><td colSpan={4} className="text-center pt-4"> No Records Found</td></tr>:""}
              </tbody>
              {this.state.departmentList.length != 0 ? (
                <tfoot>
                  <tr>
                    <td colSpan="3">Number of Records : {this.state.numberOfRecords}</td>
             
                  {(this.state.numberOfRecords >= 10) ? <ul className="pt-2 mt-2 justify-content-end mb-0 pagination">
                        <li className="page-item ">
                          {this.state.prevUrl != null ? <a onClick={this.loadPrevious} className="page-link "><i className="typcn  typcn-chevron-left-outline "></i><span className="sr-only">{ }Previous</span></a> : ""}
                        </li>
                        <li className="page-item">
                          {(this.state.nextUrl != null) ? <a  onClick={this.loadNext} className="page-link "><i className="typcn typcn-chevron-right-outline "></i><span className="sr-only">Next</span></a> : ""}

                        </li>
                      </ul> : ""}
                  
                      </tr>
                  
                  </tfoot>) : null}
            </Table>
          </Card>
        </div></Row><Modal isOpen={this.state.showCreateModal} className="modal-md">
        <ModalHeader>Add New</ModalHeader>
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
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Language Name</label>
                      <div className="col-sm-8">
                      
                      <input placeholder="Required" type="text" className="form-control form-control-sm" name="configName" defaultValue={this.state.configName} onChange={this.handleInput} />
                      </div>
                  </div>
                </div>
              
            
              </div>
            </div>
          </form>
        </ModalBody><ModalFooter>
          <button type="button" onClick={thisObj.createNewRecords} className="btn-sm btn-fill pull-left btn btn-primary"> Create </button>
          <Button color="secondary" className="btn-sm" onClick={() => { this.setState({ showCreateModal: false }) }}>Close</Button>
        </ModalFooter></Modal><Modal isOpen={this.state.showUpdateModal}>
        <ModalHeader>Details</ModalHeader>
        <ModalBody>
          <form className="pl-3 pr-3">
            <div className="row ">
            
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
                      <label for="example-text-input" className="col-sm-4 float-left col-form-label text-left">Language Name</label>
                      <div className="col-sm-8">
                      
                      <input placeholder="Required" type="text" className="form-control form-control-sm" name="configName" defaultValue={this.state.configName} onChange={this.handleInput} />
                      </div>
                  </div>
                </div>
              
             
              
            </div>
          </form>
        </ModalBody><ModalFooter>
          <button type="button" onClick={thisObj.updateConfigDetails} className="btn-sm btn-fill pull-left btn btn-primary"> Update </button>
          <Button color="secondary" className="btn-sm" onClick={() => { this.setState({ showUpdateModal: false,configId:"",configName:"",configType:"" }) }}>Close</Button>
        </ModalFooter></Modal></>
    );
  }
}
export default LanguageDetails;