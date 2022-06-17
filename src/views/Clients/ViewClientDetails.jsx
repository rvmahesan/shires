import React, { Component } from "react";
import {
   Container,
   Row,
   Col,
   Card,
   Spinner, CardBody, ModalBody, ModalFooter, Modal
} from "reactstrap";
import Swal from 'sweetalert2';
import Cookies from 'universal-cookie';

import IFrame from "../../components/iFrame/IFrame";
import { style, candidateGetUrl, candidateDeleteUrl, candidateUpdateUrl, candidateResumeUpdateUrl, apiUrl } from "../../variables/Variables.jsx";



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
class ViewClientDetails extends Component {
   constructor(props, context) {
      super(props, context);
      this.state = {
         aboutClient: "",
            clientName: "",
            contactNo: "",
            childClients: "",
            clientShortName: "",
            clientSendRequirement: "",
            clientSendHotlist: "", clientEmailId: "",
            clientLead: "",
            category: "",
            clientAddress: "",
            country: "",
            fax: "", federalId: "",
            webSite: "",
            isNearByClientLocation: "", industry: "",
            ownership: "",
            displayOnJobPosting: "",
            vmsClientName: "",
            practice: "",
            postalCode: "", paymentTerms: "", primaryOwner: "",
            postalCity: "",
            requiredDocuments: "",
            state: "",
            status: "",
            sendNotification: "",clientId:"",
         clientId: 0,
         resumePath: '',
         resumeDetails: '',
         fileExists: '',
         fileType: '',
         activeTab: 'profiledetails'
      };
      this.genderOptions = ["Select", "Male", "Female", "Others"];
      this.handleInput = this.handleInput.bind(this);
      this.handleUpdate = this.handleUpdate.bind(this);
      this.handleDelete = this.handleDelete.bind(this);
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

   setCandidateData = async () => {
      const params = new URLSearchParams(window.location.search);
      await axios.get(apiUrl + "getClientDetails", {
         params: {
            clientId: params.get('clientId'),
            sess_id: cookies.get("c_csrftoken")
         }
      }).then(({ data }) => {
         // this.state = data;
         this.setState({ clientName: data.clientDetails.clientName,
            contactNo: data.clientDetails.contactNo,
            childClients: data.clientDetails.childClients,
            country: data.clientDetails.country,
            fax: data.clientDetails.fax,
            webSite: data.clientDetails.webSite,
            status: data.clientDetails.status,
            ownership: data.clientDetails.ownership,
            aboutClient: data.clientDetails.aboutClient,
            category: data.clientDetails.category,
            displayOnJobPosting: data.clientDetails.displayOnJobPosting,
            vmsClientName: data.clientDetails.vmsClientName,
            clientEmailId: data.clientDetails.clientEmailId,
            isNearByClientLocation: data.clientDetails.isNearByClientLocation,
            state: data.clientDetails.state,
            clientSendRequirement: data.clientDetails.clientSendRequirement,
            clientSendHotlist: data.clientDetails.clientSendHotlist,
            paymentTerms: data.clientDetails.paymentTerms,
            clientLead: data.clientDetails.clientLead,
            federalId: data.clientDetails.federalId,
            clientAddress: data.clientDetails.clientAddress,
            postalCode: data.clientDetails.postalCode,
            postalCity: data.clientDetails.postalCity,
            industry: data.clientDetails.industry,

            requiredDocuments: data.clientDetails.requiredDocuments,
            practice: data.clientDetails.practice,
            clientShortName: data.clientDetails.clientShortName,
            sendNotification: data.clientDetails.sendNotification,
            primaryOwner: data.clientDetails.primaryOwner,
            updatedBy: data.clientDetails.updatedBy,
            createdBy: data.clientDetails.createdBy,
            createdDate: data.clientDetails.createdDate,
             clientId:params.get('clientId') });

      }).catch((err) => { });
   }

   componentDidMount() {
      this.setCandidateData();
      //   this.setState({ _notificationSystem: this.refs.notificationSystem });

   }


   showResumePreviewModel = (id) => {
      this.setState({ documentPreviewMain: true });
      fileUrl = apiUrl + "generateSystemResume?userId=" + (id) + "&sess_id=" + cookies.get("c_csrftoken") + "#zoom100&toolbar=0&navpanes=0&scrollbar=1"
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

   handleUpdate(event) {
      var candidateDetails = {};
      axios.put(candidateUpdateUrl, {
         firstName: this.state.firstName,
         lastName: this.state.lastName,
         phone: this.state.phone,
         location: this.state.location,
         rate: this.state.rate,
         gender: this.state.gender,
         country: this.state.country,
         zipcode: this.state.zipcode,
         aboutMe: this.state.aboutMe,
         address: this.state.address,
         selectedUserId: this.state.selectedUserId,
         email: this.state.email
      }).then(function (res) {
         //  console.log(res);
         var responseJson = (res.data);
         if (responseJson.statusResponse) {
            //this.showAlert("br","success","Candidate created successsfully","pe-7s-check");
            //console.log(res.headers)
            //alert(responseJson.message);
            let timerInterval;
            Swal.fire({
               icon: 'success',
               title: "Candidate details updated successfully",
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


            //setTimeout(()=>this.props.history.push("../admin/candidates"),  1200);
            // window.location.href = "../admin/candidates";
         } else {
            alert(responseJson.message);

         }
      }).catch(function (err) {
         console.log(err);
      })
   }

   render() {
      var downloadLink = "";
      var editClientLink = `../admin/editClientDetails?clientId=${this.state.clientId}&currPageNumber=0`;
      var diffDays = "";
      if(typeof this.state.clientName === "undefined")
         return "";
      return this.state.clientName == null && this.state.clientName == "" ? (<div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
         <Container fluid>
            <div className="header-body">
               <Row>
                  <Col lg="12" xl="12"><center><Spinner style={{ width: '3rem', height: '3rem' }} type="grow" /></center>
                  </Col>
               </Row>
            </div>
         </Container>
      </div>) : (<>
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
                              <h4 className="mb-0 job-title">{this.state.clientId} - {this.state.clientName} </h4>
                              <h6 className="jpLocation"> {this.state.countryName}</h6>
                              <span> {this.state.contactNo != "" ? this.state.contactNo : "--"} |  {this.state.webSite}</span>


                              <div className="row mt-2 mb-2">
                                 <a href={editClientLink} className="btn btn-sm btn-outline-primary ml-2">Edit Client</a>


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


                                       {this.state.aboutClient != "" ? this.state.aboutClient : "-N/A-"}

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
                           <label className="formLabel"><b>Send Hotlist :</b></label>
                           <label className="formValue pl-1">{this.state.clientSendHotlist != "" ?(this.state.clientSendHotlist == "on"?"Yes":""): "NA"}</label>
                        </div>

                        <div className="form-group row mb-2">
                           <label className="formLabel"><b>Send Requirement :</b></label>
                           <label className="formValue pl-1">
                           {this.state.clientSendRequirement != "" ?(this.state.clientSendRequirement == "on"?"Yes":""): "NA"}
                           </label>
                        </div>
                        <div className="form-group row mb-2">
                           <label className="formLabel"><b>Payment Terms :</b></label>
                           <label className="formValue pl-1">{this.state.paymentTerms != "" ? this.state.paymentTerms : "NA"}</label>
                        </div>

                        <div className="form-group row mb-2">
                           <label className="formLabel"><b>Required Documents :</b></label>
                           <label className="formValue pl-1">{this.state.requiredDocuments != "" ? this.state.requiredDocuments : "NA"}</label>
                        </div>

                        <div className="form-group row mb-2">
                           <label className="formLabel"><b>Practice :</b></label>
                           <label className="formValue pl-1 ">{this.state.practice != "" ? this.state.practice : "NA"}</label>
                        </div>
                        <div className="form-group row mb-2">
                           <label className="formLabel"><b>About Company</b></label>
                           <label className="formValue pl-2">{this.state.aboutClient != "" ? this.state.aboutClient : "NA"} </label>
                        </div>
                        <div className="form-group row mb-2">
                           <label className="formLabel"> <b>Display on Job Posting :</b></label>
                           <label className="formValue ">{this.state.displayOnJobPosting !== ""?this.state.displayOnJobPosting:"NA"}</label>
                        </div>

                     </div>
                  </CardBody>
               </Card>
            </div>
         </div>
      </>);
   }

  

}
export default ViewClientDetails;