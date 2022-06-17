import React, { Component } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Spinner, Button, Table, CardBody, ModalBody, ModalFooter, Modal
} from "reactstrap";


import IFrame from "../../components/iFrame/IFrame";
import Swal from 'sweetalert2';
import { style, candidateGetUrl, candidateDeleteUrl, candidateUpdateUrl, candidateResumeUpdateUrl, apiUrl } from "../../variables/Variables.jsx";

import Cookies from 'universal-cookie';

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

class ViewCandidateDetails extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            candidateDetails: {},
            candidateId: params.get('candDetails'),
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

        await axios.get(candidateGetUrl, {
            params: {
                candidateId: params.get('candDetails'),
                sess_id: cookies.get("c_csrftoken")
            }
        }).then(({ data }) => {
            // this.state = data;
            this.setState({ candidateDetails: data.candidateDetails, candidateId: params.get('candDetails'), selectedUserId: params.get('candDetails'), resumePath: data.resumePath, fileExists: data.fileExists, fileType: data.fileType, resumeDetails: data.resumeDetails });

        }).catch((err) => { });
    }

    componentDidMount() {
        this.setCandidateData();
        //   this.setState({ _notificationSystem: this.refs.notificationSystem });

    }


    showResumePreviewModel = (id) => {
        this.setState({ documentPreviewMain: true });
        fileUrl = apiUrl + "generateSystemResume?candidateId=" + (id) + "&sess_id=" + cookies.get("c_csrftoken") + "#zoom100&toolbar=0&navpanes=0&scrollbar=1"
    }


    render() {
        var downloadLink = "";
        var editJobLink = `../admin/editCandidate?candidateId=${this.state.candidateId}&currPageNumber=0`;
        var diffDays = "";
        if (this.state.resumePath === null)
            downloadLink = "";
        
        if(this.state.candidateDetails === null)
            return <div className="header bg-gradient-info pb-4 pt-5 pt-md-8">
            <Container fluid>
               <div className="header-body">
                  <Row>
                     <Col lg="12" xl="12"><center>
                        Candidate details not found</center>
                     </Col>
                  </Row>
               </div>
            </Container>
         </div>;
      
        return (this.state.candidateDetail != null && Object.keys(this.state.candidateDetails).length >= 3) ? (<div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
            <Container fluid>
                <div className="header-body">
                    <Row>
                        <Col lg="12" xl="12"><center><Spinner style={{ width: '3rem', height: '3rem' }} type="grow" /></center>
                        </Col>
                    </Row>
                </div>
            </Container>
        </div>) : (<>
            <div className="row ss" style={{ marginTop: "27px" }}>
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
                                        <a href={"../admin/candidates"} className="float-right btn-icon " >
                                            <span className="btn-inner--icon mr-1"><i className="gr-btn far dripicons-backspace"></i></span>
                                        </a>
                                    </div>
                                    <div className="job-content-section pt-2 float-right">
                                        <h4 className="mb-0 job-title">{this.state.candidateId} - {this.state.candidateDetails.firstName} {this.state.candidateDetails.lastName}</h4>
                                        <h6 className="jpLocation"> {this.state.candidateDetails.jobTitle}</h6>
                                        <span> {this.state.candidateDetails.phone} |  {this.state.candidateDetails.email}</span>

                                        <span className="jpAssingInfo">{this.state.candidateDetails.address} </span>




                                        <div className="row mt-2 mb-2">
                                            <a href={editJobLink} className="btn btn-sm btn-outline-primary ml-2">Edit Candidate</a>

                                            <button onClick={(e) => { this.showResumePreviewModel(this.state.candidateId) }} className="btn btn-sm btn-outline-primary ml-2">View Resume</button>
                                            {this.state.candidateDetails.resumePath != "" ?
                                                <a download title="Download the current resume file" href={`${apiUrl}downloadResume?candidateId=${this.state.selectedUserId}&sess_id=${cookies.get("c_csrftoken")}`} className="btn btn-sm btn-outline-primary ml-2">
                                                    <i className="fa fa-download" ></i> Download</a> : "--NA--"}


                                            {/* <Button title="Submit new candidate" className="btn-sm ml-2 pull-left btn bg-blue-primary" >
                                    <span className="btn-inner--icon mr-1"><i className="fas fa-user-astronaut" ></i></span><span className="btn-inner--text">Submit Candidate</span>
                                </Button>
                                */}

                                        </div>

                                        {/*
                               <hr className="border-bottom-dashed mb-0"/>
                                <div className="col-sm-12 pt-2  pl-0 ml-0">
                                        <ul className="jpQViewList">
                                            <li>
                                                <div className="jphLabel-1">Recruitment Manager</div>
                                                <div className="jphLabel-2"></div>
                                            </li>
                                            <li>
                                                <div className="jphLabel-1">Client Bill Rate / Salary <a className="active" href="javascript:void(0);"><i className="fas fa-question-circle"></i></a></div>
                                                <div className="jphLabel-2"> </div>
                                            </li>
                                            <li>
                                                <div className="jphLabel-1">Pay Rate / Salary <a className="active" href="javascript:void(0);"><i className="fas fa-question-circle"></i></a></div>
                                                <div className="jphLabel-2"> to  </div>
                                            </li>
                                            <li>
                                                <div className="jphLabel-1">Created On </div>
                                                <div className="jphLabel-2"></div>
                                            </li>
                                            <li>
                                                <div className="jphLabel-1">Job Status </div>
                                                <div className="jphLabel-2"></div>
                                            </li>
                                            <li>
                                                <div className="jphLabel-1">Job Age</div>
                                                <div className="jphLabel-2">Days</div>
                                            </li>
                                        </ul>
                                </div> 
                                <div className="row col-sm-12 pt-2 ">
                                    <span className="jpDescrTitle">Job Description</span>
                                    <p className="p-1">
                                        
                                    
                                    </p>
                                </div>
                                */}
                                    </div>
                                </div>
                            </Card></div>
                    </Row>
                    <Row>
                        <div className="col p-0">
                            <Card className="p-2 my-shadow">



                                <ul className="nav nav-tabs" role="tablist">
                                    <li className="nav-item">
                                        <a className={`nav-link ${this.state.activeTab == 'profiledetails' ? 'active' : ''}`} data-toggle="tab" href="#profiledetails" onClick={() => { this.setState({ activeTab: "profiledetails" }) }} role="tab" aria-selected="true">Profile Details</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className={`nav-link ${this.state.activeTab == 'snapshot' ? 'active' : ''}`} data-toggle="tab" onClick={() => { this.setState({ activeTab: "snapshot" }) }} href="#profile" role="tab" aria-selected="false">Snapshot</a>
                                    </li>
                                    {/* <li className="nav-item">
                                            <a className={`nav-link ${this.state.activeTab=='jobdetails'?'active':''}`} data-toggle="tab" href="#settings" role="tab" aria-selected="false">Settings</a>
        </li>*/}
                                </ul>


                                <div className="tab-content">
                                    <div className={`tab-pane p-3 ${this.state.activeTab == 'profiledetails' ? 'active' : ''}`} id="home" role="tabpanel">




                                        <CardBody className="p-1" >
                                            <div className="col-sm-12">
                                                <div className="col-sm-4 float-left pl-0">
                                                    <div className="form-group">
                                                        <label className="formLabel mr-2"><b>First Name</b></label>
                                                        <span className="formValue">
                                                            {this.state.candidateDetails.firstName==""?"--":this.state.candidateDetails.firstName}
                                                        </span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel mr-2"><b>Middle Name</b></label>
                                                        <span className="formValue">{this.state.candidateDetails.middleName==""?"--":this.state.candidateDetails.middleName}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel mr-2"><b>Last Name</b></label>
                                                        <span className="formValue">{this.state.candidateDetails.lastName==""?"--":this.state.candidateDetails.lastName}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel mr-2"><b>Gender</b></label>
                                                        <span className="formValue">{this.state.candidateDetails.gender==""?"--":this.state.candidateDetails.gender}</span>
                                                    </div>



                                                    <div className="form-group">
                                                        <label className="formLabel mr-2"><b>Email</b></label>
                                                        <span className="formValue">{this.state.candidateDetails.email==""?"--":this.state.candidateDetails.email}</span>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="formLabel mr-2"><b>Skills</b></label>
                                                        <span className="formValue">
                                                        {typeof this.state.candidateDetails.skills !== "undefined" && this.state.candidateDetails.skills.length > 120?this.state.candidateDetails.skills.substring(0, 120)+"...":this.state.candidateDetails.skills}
                                                        </span>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="formLabel mr-2"><b>Job Title</b></label>
                                                        <span className="formValue">{this.state.candidateDetails.jobtitle==""?"--":this.state.candidateDetails.jobtitle}</span>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="formLabel mr-2"><b>Source</b></label>
                                                        <span className="formValue">{this.state.candidateDetails.source==""?"--":this.state.candidateDetails.source}</span>
                                                    </div>

                                                </div>


                                                <div className="col-sm-4 float-left">
                                                    <div className="form-group">
                                                        <label className="formLabel mr-2"><b>Alternate Email</b></label>
                                                        <span className="formValue">{this.state.candidateDetails.altemail==""?"--":this.state.candidateDetails.altemail}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel mr-2"><b>Phone</b></label>
                                                        <span className="formValue">{this.state.candidateDetails.phone==""?"--":this.state.candidateDetails.phone}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel mr-2"><b>Alternate Phone</b></label>
                                                        <span className="formValue">{this.state.candidateDetails.altphone==""?"--":this.state.candidateDetails.altphone}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel mr-2"><b>Work Authorization</b></label>
                                                        <span className="formValue">{this.state.candidateDetails.workAuthorization==""?"--":this.state.candidateDetails.workAuthorization}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel mr-2"><b>City</b></label>
                                                        <span className="formValue">{this.state.candidateDetails.city==""?"--":this.state.candidateDetails.city}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel mr-2"><b>Expected Pay</b></label>
                                                        <span className="formValue">{this.state.candidateDetails.lastName==""?"--":this.state.candidateDetails.lastName}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel mr-2"><b>Job Title</b></label>
                                                        <span className="formValue">{this.state.candidateDetails.jobTitle==""?"--":this.state.candidateDetails.jobTitle}</span>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="formLabel mr-2"><b>Experience</b></label>
                                                        <span className="formValue">{this.state.candidateDetails.experienceMonths==""?"--":this.state.candidateDetails.experienceMonths} Months {this.state.candidateDetails.experienceYears==""?"--":this.state.candidateDetails.middleName}</span>
                                                    </div>

                                                </div>


                                                <div className="col-sm-4 float-left">
                                                    <div className="form-group">
                                                        <label className="formLabel mr-2"><b>Source</b></label>
                                                        <span className="formValue">{this.state.candidateDetails.source==""?"--":this.state.candidateDetails.source}</span>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="formLabel mr-2"><b>Experience</b></label>
                                                        <span className="formValue">{this.state.candidateDetails.experienceMonths==""?"--":this.state.candidateDetails.experienceMonths} Months {this.state.candidateDetails.experienceYears==""?"--":this.state.candidateDetails.middleName}</span>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="formLabel mr-2"><b>Address</b></label>
                                                        <span className="formValue">{this.state.candidateDetails.address==""?"--":this.state.candidateDetails.address}</span>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="formLabel mr-2"><b>Country</b></label>
                                                        <span className="formValue">{this.state.candidateDetails.country==""?"--":this.state.candidateDetails.country}</span>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="formLabel mr-2"><b>Zip Code</b></label>
                                                        <span className="formValue">{this.state.candidateDetails.zipcode==""?"--":this.state.candidateDetails.zipcode}</span>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="formLabel mr-2"><b>State</b></label>
                                                        <span className="formValue">{this.state.candidateDetails.state==""?"--":this.state.candidateDetails.state}</span>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="formLabel mr-2"><b>Applicant Status</b></label>
                                                        <span className="formValue">{this.state.candidateDetails.applicantStatus==""?"--":this.state.candidateDetails.applicantStatus}</span>
                                                    </div>
                                                </div>


                                            </div>
                                        </CardBody>


                                    </div>
                                    <div className={`tab-pane pt-3 pb-3 ${this.state.activeTab == 'snapshot' ? 'active' : ''}`} id="profile" role="tabpanel">
                                        <CardBody className="p-1" >
                                            <div className="col-sm-12 pt-0 p-2">
                                                <h5 className="mb-0">Submissions</h5>
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

                                            <div className="col-sm-12 pt-0 p-2">
                                                <h5 className="mb-0">Notes</h5>
                                            </div>

                                            <Table className="align-items-center table-flush " responsive>
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th scope="col">ADDED BY / ON</th>
                                                        <th scope="col">NOTES / DESCRIPTION</th>
                                                        <th scope="col">ACTION</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td colSpan="3" className="text-center">No Data Available</td>
                                                    </tr>
                                                </tbody>
                                            </Table>


                                        </CardBody>
                                    </div>
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
                                    <label className="formLabel mr-2"><b>Created By & On :</b></label>
                                    <label className="formValue ">{this.state.candidateDetails.createdBy} {new Date(this.state.candidateDetails.createdDate).toDateString()} {new Date(this.state.candidateDetails.createdDate).toLocaleTimeString()}</label>
                                </div>
                                <div className="form-group row mb-2">
                                    <label className="formLabel mr-2"><b>Applicant Status :</b></label>
                                    <label className="formValue ">{this.state.candidateDetails.applicantStatus!=""?this.state.candidateDetails.applicantStatus:"--"}</label>
                                </div>

                                <div className="form-group row mb-2">
                                    <label className="formLabel mr-2"><b>Source</b></label>
                                    <label className="formValue ">{this.state.candidateDetails.source!=""?this.state.candidateDetails.source:"--"}</label>
                                </div>
                                <div className="form-group row mb-2">
                                    <label className="formLabel mr-2"><b>Work Authorization :</b></label>
                                    <label className="formValue ">{this.state.candidateDetails.workAuthorization!=""?this.state.candidateDetails.workAuthorization:"--"}</label>
                                </div>

                                <div className="form-group row mb-2">
                                    <label className="formLabel mr-2"><b>Home Phone Number :</b></label>
                                    <label className="formValue ">{this.state.candidateDetails.altphone!=""?this.state.candidateDetails.altphone:"--"}</label>
                                </div>

                                <div className="form-group row mb-2">
                                    <label className="formLabel mr-2"><b>Skills :</b></label>
                                    <label className="formValue ">{this.state.candidateDetails.skills!=""?this.state.candidateDetails.skills:"--"}</label>
                                </div>
                                <div className="form-group row mb-2">
                                    <label className="formLabel mr-2"><b>Experience :</b></label>
                                    <label className="formValue ">{this.state.candidateDetails.experienceMonths!=""?this.state.candidateDetails.experienceMonths:"--"} Months {this.state.candidateDetails.experienceYears!=""?this.state.candidateDetails.experienceYears:"--"} Yrs</label>
                                </div>
                                <div className="form-group row mb-2">
                                    <label className="formLabel mr-2"><b> Pay Rate :</b></label>
                                    <label className="formValue ">{this.state.candidateDetails.rate!=""?this.state.candidateDetails.rate:"--"} {this.state.candidateDetails.rateType!=""?this.state.candidateDetails.rateType:"--"}</label>
                                </div>



                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>

            <Modal isOpen={this.state.documentPreviewMain} className={"rightside-modal"}>
                {/* <div className="modal-header respreview-header">
               <h6 className="modal-title m-0" id="exampleModalDefaultLabel">Preview Resume</h6>
               <button type="button" className="close float-right" onClick={(e) => { this.setState({ documentPreviewMain: false }); this.setState({ progressTimer: 0 }); }}>
                  <span aria-hidden="true"><i className="la la-times"></i></span>
               </button>
            </div>
 */}
                <ModalBody >
                    <IFrame src={fileUrl} title={"Quick Preview"} loading={true} />
                </ModalBody><ModalFooter>
                    <Button color="secondary" className="btn-sm" onClick={(e) => { this.setState({ documentPreviewMain: false }); this.setState({ progressTimer: 0 }); }}>Close</Button>
                </ModalFooter>
            </Modal>


        </>);
    }

    handleInput(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    //upload validation
    handleUpload = (event) => {

        var a = event.target.files[0].name.split(".");
        var allowedTypes = ["doc", "docx", "pdf", "txt"];
        let file = event.target.files[0];
        var fileExt = a[a.length - 1];
        if (allowedTypes.indexOf(fileExt) > 0 && event.target.files[0].size <= 2000000) {
            fData.append("file", file);
            fData.append("selectedUserId", this.state.selectedUserId);
            fData.append("fileExtension", fileExt);
            //  console.log(fData);
            // console.log(event.target.files[0])
        } else {
            //addNotification(event,level,msg,position)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "I can't process this file. Retry with pdf, doc, docx, txt files"
            });
            //alert("This file can not be processed")
            event.target.value = null
        }
    }


    //processing upload
    completeUpload = (event) => {
        axios.post(candidateResumeUpdateUrl, fData, config).then(function (res) {
            var responseJson = (res.data);
            if (responseJson.statusResponse) {
                //this.showAlert("br","success","Candidate created successsfully","pe-7s-check");
                //console.log(res.headers)
                //    alert(responseJson.message)
                let timerInterval;
                Swal.fire({
                    icon: 'success',
                    title: responseJson.message,
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
                //window.location.href = "../admin/candidates";
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: responseJson.message
                });
            }
        }).catch(function (err) {
            //console.log(err);
        })

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
                axios.get(candidateDeleteUrl + "?userId=" + this.state.selectedUserId).then(function (res) {
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

}
export default ViewCandidateDetails;
