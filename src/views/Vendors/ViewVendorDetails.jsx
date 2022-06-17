import React, { Component } from "react";
import {
   Container,
   Row,
   Col,
   Card,
   Spinner, CardBody, ModalBody, ModalFooter, Modal
} from "reactstrap";


import IFrame from "../../components/iFrame/IFrame";
import Swal from 'sweetalert2';
import { style, candidateGetUrl, candidateDeleteUrl, candidateUpdateUrl, candidateResumeUpdateUrl, apiUrl } from "../../variables/Variables.jsx";

import Cookies from 'universal-cookie';
import LoadingGrow from '../../components/LoadingGrow.jsx'
let selectedUserId = "";
let fData = new FormData();

const cookies = new Cookies();
const axios = require("axios").default;
let config = {
   headers: {
      'content-type': 'multipart/form-data'
   }
};

let fileUrl = "";
const params = new URLSearchParams(window.location.search);

class ViewVendorDetails extends Component {
   constructor(props, context) {
      super(props, context);
      this.state = {
         countryName:"",primaryOwnerName:"",
        contactNumber: "",
        vendorName  : "",
        contactNumber: "",
        country: "",
        zipcode: "",
        primaryOwner: "",
        technologies: "", vendorVisibility: "",
        federalId: "",
        fax: "",
        state: "",
        sendRequirement: "",
        aboutVendor: "", website: "",
        address: "",
        city: "", vendorLead: "",
        vendorType: "",
        ownership: "",
        updatedBy: "",
        createdBy: "",
        createdDate: "",
        vendorId:params.get("vendorId"),
         
        statesList: [],
        countryList:[],
        countryName:"",
        primaryOwnerName:"",
      };
      this.genderOptions = ["Select", "Male", "Female", "Others"];
      this.handleInput = this.handleInput.bind(this);
      this.handleDelete = this.handleDelete.bind(this);
      this.setVendorDetails = this.setVendorDetails.bind(this);
   }


   notificationSystem = React.createRef();
   addNotification = (event, level, msg, position = "tr") => {
      event.preventDefault();
      const notification = this.notificationSystem.current;
      notification.addNotification({
         title: <span data-notify="icon" className="pe-7s-gift" />,
         message: msg,
         level: level,//"success",//warning, error, info
         position: position,
         autoDismiss: 15
      });
   };

   setVendorDetails = async () => {
      const params = new URLSearchParams(window.location.search);
      await axios.get(apiUrl + "getVendorDetails", {
         params: {
            vendorId: params.get('vendorId'),
            sess_id: cookies.get("c_csrftoken")
         }
      }).then(({ data }) => {
         // this.state = data;
         this.setState({
            countryName:data.countryName,
            primaryOwnerName:data.primaryOwnerName,
            contactNumber:data.vendorDetails.contactNumber,
            website:data.vendorDetails.website,
            vendorName  :data.vendorDetails.vendorName,
            country:data.vendorDetails.country,
            zipcode:data.vendorDetails.zipcode,
            primaryOwner: data.vendorDetails.primaryOwner,
            technologies: data.vendorDetails.technologies,
            vendorVisibility: data.vendorDetails.vendorVisibility,
            federalId:data.vendorDetails.federalId,
            fax: data.vendorDetails.fax,
            state:data.vendorDetails.state,
            sendRequirement: data.vendorDetails.sendRequirement,
            aboutVendor: data.vendorDetails.aboutVendor,
            website: data.vendorDetails.website,
            address: data.vendorDetails.address,
            city: data.vendorDetails.city,
             vendorLead: data.vendorDetails.vendorLead,
            vendorType:data.vendorDetails.vendorType,
            ownership:data.vendorDetails.ownership,
            updatedBy: data.vendorDetails.updatedBy,
            createdBy:data.vendorDetails.createdBy,
            createdDate: data.vendorDetails.createdDate,
            clientId:params.get('clientId') });

      }).catch((err) => { });
   }

   componentDidMount() {
      this.setVendorDetails();
      //   this.setState({ _notificationSystem: this.refs.notificationSystem });

   }


   handleInput(event) {
      this.setState({
         [event.target.name]: event.target.value
      });
   }


   handleDelete = (event) => {
      const swalWithBootstrapButtons = Swal.mixin({
         customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
         },
         buttonsStyling: false
      })

      swalWithBootstrapButtons.fire({
         title: 'Are you sure?',
         text: "You won't be able to revert this!",
         icon: 'warning',
         showCancelButton: true,
         confirmButtonText: 'Yes, delete it!',
         cancelButtonText: 'No, cancel!',
         reverseButtons: true
      }).then((result) => {
         if (result.value) {
            axios.get(apiUrl + "getClientDetails?clientId=" + this.state.clientId).then(function (res) {
               if (res.statusResponse) {
                  let timerInterval;
                  Swal.fire({
                     icon: 'success',
                     title: "Candidate deleted successfully",
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
                     }
                  }).then((result) => {
                     /* Read more about handling dismissals below */
                     window.location.href = "../admin/candidates";
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

   render() {
      var downloadLink = "";
      var editClientLink = `../admin/editVendorDetails?vendorId=${this.state.vendorId}&currPageNumber=0`;
      var diffDays = "";
      if(typeof this.state.vendorName === "undefined")
         return "";
      return (typeof this.state.vendorName === "undefined") || this.state.vendorName == null || this.state.vendorName == "" ? <LoadingGrow/> : (<>
         <div className="row ss">
            <div className="col-sm-12">
               <div className="page-title-box">
                  <div className="row pl-2">
                     <div className="col ">
                     </div>
                     <div className="col-auto align-self-center">
                        <div className="button-items float-right pr-0">
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div className="row"></div>
         <div className="col-sm-12 p-0">
            <div className="col-sm-9 pl-0 float-left">
               <Row>
                  <div className="col p-0 m-0">
                     <Card className="p-2 my-shadow">
                        <div className=" p-0">

                           <div className="job-backbutton float-left">
                              <a href={"../admin/ClientsListings"} className="float-right btn-icon " >
                                 <span className="btn-inner--icon mr-1"><i className="gr-btn far dripicons-backspace"></i></span>
                              </a>
                           </div>
                           <div className="job-content-section pt-2 float-right">
                              <h4 className="mb-0 job-title">{this.state.vendorName} </h4>
                              <h6 className="jpLocation"> {this.state.countryName}</h6>
                              <span> {this.state.contactNumber != "" ? this.state.contactNumber : "--"} |  {this.state.website} | {this.state.city != "" ? this.state.city : "--"}</span>

                              <span className="jpAssingInfo"> </span>




                              <div className="row mt-2 mb-2">
                                 <a href={editClientLink} className="btn btn-sm btn-outline-primary ml-2">Edit Vendor</a>


                              </div>

                           </div>
                        </div>
                     </Card></div>
               </Row>
               <Row>
                  <div className="col p-0">
                     <Card className="p-2 my-shadow">



                        <ul className="nav nav-tabs" role="tablist">
                           <li className="nav-item">
                              <a className={`nav-link active`} data-toggle="tab" href="#aboutClient" onClick={() => { this.setState({ activeTab: "aboutClient" }) }} role="tab" aria-selected="true">About Company </a>
                           </li>

                           {/* <li className="nav-item">
                                            <a className={`nav-link ${this.state.activeTab=='contacts'?'active':''}`} data-toggle="tab"  onClick={()=>{this.setState({activeTab:"contacts"})}} href="#contacts" role="tab" aria-selected="false">Contacts</a>
                                        </li> <li className="nav-item">
                                            <a className={`nav-link ${this.state.activeTab=='jobdetails'?'active':''}`} data-toggle="tab" href="#settings" role="tab" aria-selected="false">Settings</a>
        </li>*/}
                        </ul>





                        <div className="tab-content">
                           <div className={`tab-pane p-3 active profiledetails}`} id="aboutCLient" role="tabpanel">




                              <CardBody className="p-1" >
                                 <div className="col-sm-12" >


                                    <div className={`tab-pane pt-3 pb-3 active`} id="aboutCLient" role="tabpanel">


                                       {this.state.aboutVendor != "" ? this.state.aboutVendor : "-N/A-"}

                                    </div>  </div>
                              </CardBody>


                           </div>
                           {/*    <div className={`tab-pane pt-3 pb-3 ${this.state.activeTab=='contacts'?'active':''}`}  id="contacts" role="tabpanel">
                        <CardBody className="p-1" >
                        <div className="col-sm-12 pt-0 p-2">
                    <h5 className="mb-0">Contacts</h5>
                </div>

                            <Table className="align-items-center table-flush " responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">SUBMITTED BY/ON</th>
                    <th scope="col">CONTACT/LOCATION</th>
                    <th scope="col">PAY RATE/WORK AUTH</th>
                    <th scope="col">STATUS</th>
                  </tr>
                  <tbody>
                    <tr>
                        <td colSpan="5" className="text-center">No Data Available</td>
                    </tr>
                </tbody>
                </thead>
                
              </Table>


                        </CardBody>
                        </div>         

*/}


                        </div>
                     </Card>
                  </div>
               </Row>
            </div>

            <div className="col-sm-3 pl-3 w-100 pr-0 mr-0 float-left">
               <Card className="p-2 my-shadow w-100">

                  <CardBody className="p-1">
                     <div className="col-sm-12">

                        <div className="form-group row mb-2">
                           <label className="formLabel mr-2"><b>Federal Id :</b></label>
                           <label className="formValue ">{this.state.federalId != "" ? this.state.federalId : "NA"} </label>
                        </div>
                        <div className="form-group row mb-2">
                           <label className="formLabel"><b>Send Requirement :</b></label>
                           <label className="formValue pl-1">{this.state.sendRequirement != "" ?(this.state.sendRequirement == "on"?"Yes":""): "NA"}</label>
                        </div>

                    
                        <div className="form-group row mb-2">
                           <label className="formLabel"><b>PrimaryOwner :</b></label>
                           <label className="formValue pl-1">{this.state.primaryOwner != "" ? this.state.primaryOwnerName : "NA"}</label>
                        </div>

                        <div className="form-group row mb-2">
                           <label className="formLabel"><b>Technologies :</b></label>
                           <label className="formValue pl-1">{this.state.technologies != "" ? this.state.technologies : "NA"}</label>
                        </div>

                        <div className="form-group row mb-2">
                           <label className="formLabel"><b>Visibility :</b></label>
                           <label className="formValue pl-1 ">{this.state.vendorVisibility != "" ? this.state.vendorVisibility : "NA"}</label>
                        </div>
                        <div className="form-group row mb-2">
                           <label className="formLabel"><b>Address</b></label>
                           <label className="formValue pl-2">{this.state.address != "" ? this.state.address : "NA"} </label>
                        </div>
                        <div className="form-group row mb-2">
                           <label className="formLabel"> <b>Vendor Lead :</b></label>
                           <label className="formValue ">{this.state.vendorLead !== ""?this.state.vendorLead:"NA"}</label>
                        </div>

                        <div className="form-group row mb-2">
                           <label className="formLabel"> <b>Vendor Type :</b></label>
                           <label className="formValue ">{this.state.vendorType !== ""?this.state.vendorType:"NA"}</label>
                        </div>

                        <div className="form-group row mb-2">
                           <label className="formLabel"> <b>Ownership :</b></label>
                           <label className="formValue ">{this.state.ownership !== ""?this.state.ownership:"NA"}</label>
                        </div>

                       

                     </div>
                  </CardBody>
               </Card>
            </div>
         </div>
      </>);
   }
}
export default ViewVendorDetails;