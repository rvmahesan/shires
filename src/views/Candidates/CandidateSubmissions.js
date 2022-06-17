
import axios from "axios";
import { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    Table, Tooltip, Input, ModalBody, Modal, ModalFooter, Button
  } from "reactstrap";
import { apiUrl } from "../../variables/Variables";
import Cookies from 'universal-cookie';
import Swal from 'sweetalert2';

const cookies = new Cookies();

const CandidateSubmissions = ()=>{
    const [submissionList,setSubmissionList] = useState(null);
    const [statusUpdate,showStatusUpdate] = useState(false);

    const [canddiateId,setCandidateId] = useState(0);
    const [submissionId,setSubmissionId] = useState(0);
    const [candStatus,setCandStatus] = useState(null);
    
    useEffect(()=>{
        if(submissionList===null){
            pageData();
            console.log(submissionList)
        }
    },[submissionList]);
    const updateCandidate = (candDetails) =>{
       // setCandidateId(candId);
        //setSubmissionId(rowId);
        setCandStatus(candDetails);
        showStatusUpdate(true);
    }
    const pageData = async ()=>{
//        .then((dat)=>{
        axios.get(apiUrl+"candidateSubmissionList",{params:{sess_id:cookies.get('c_csrftoken')}})
        .then(res=>res.data)
        .then(({statusResponse,results}) => {
            //alert(res.statusResponse);
            setSubmissionList(results);
        });
    }

    const updateInterview = (submissionId) =>{
        let subDets = new FormData();
        subDets.append("sess_id",cookies.get('c_csrftoken'));
        subDets.append("subId",submissionId);
        axios.post(apiUrl+"shortListCandidate",subDets)
        .then(res=>res.data)
        .then(({statusResponse,message}) => {
            //alert(res.statusResponse);
            pageData();
            showStatusUpdate(false);
            Swal.fire({
                icon: 'success',
                title: message,
                html: '',
                timer: 600,
                timerProgressBar: true,
              });
        });
    }
    const scheduleInterview = (submissionId) =>{

    }
    const onboardInterview = (submissionId) =>{
        let subDets = new FormData();
        subDets.append("sess_id",cookies.get('c_csrftoken'));
        subDets.append("subId",submissionId);
        axios.post(apiUrl+"onboardCandidate",subDets)
        .then(res=>res.data)
        .then(({statusResponse,message}) => {
            //alert(res.statusResponse);
            pageData();
            showStatusUpdate(false);
            Swal.fire({
                icon: 'success',
                title: message,
                html: '',
                timer: 600,
                timerProgressBar: true,
              });
        });
    }
    return (<><div className="row pr-0 mr-0"  >
    <div className="col-sm-12 pr-0 mr-0">
      <div className="page-title-box pr-0 mr-0">
        <div className="row pr-0 mr-0">
          <div className="col pr-0 mr-0">
            <div className="col-sm-6 p-0 float-left">
              <h4 className="page-title">Candidate Submissions</h4>
            </div>
            <div className="col-sm-6 p-0 float-right ">
             
              <div className="col-sm-8 float-right p-0 m-0">
                <div className="input-group">
                  <select className="form-control col-sm-4" name="searchCondition">
                    <option value="any">Any</option>
                    <option value="name">Applicant Name</option>
                    <option value="email">Email Address</option>
                    <option value="phone">Mobile Number</option>
                    <option value="skills">Skills</option>
                  </select>
                  <input type="text" id="searchkey" name="filterCandidate" className="form-control"  placeholder="" aria-label="Search for..." autoComplete="off" />
                  <span className="input-group-append">
                    <button className="btn btn-primary waves-effect waves-light" type="button"><i className="fas fa-search"></i></button>
                  </span>
             

                </div>
              </div>

              
            </div>
          </div>
          <div className="col-auto align-self-center">

          </div>
        </div>
      </div>
    </div>
  </div>

 

    <div className="mb-5">
      {/* Table */}
      <Row>
        <div className="col p-0">
          <Card className="p-2">
            <div className="table-responsive" >
              <Table className="sticky_table align-items-center align-items-center table-flush table-centered table candidates-list table-flush table-centered lh-24" responsive>
                <thead className="thead-light sticky-header">
                  <tr>
                    <th scope=" nameColumn" className="nameColumn">Name</th>
                    <th scope=" title" className="emailColumn">Email</th>
                    <th scope=" title" className="mobileColumn">Mobile Number</th>
                    <th scope=" title" className="workauthorizationColumn">Work Authorization</th>
                    <th scope=" title" className="jobtitleColumn">Job Details</th>
                    <th scope=" title" className="createdbyColumn">Submitted By</th>
                    <th scope=" title" className="createdbyColumn"></th>
                  </tr>
                </thead>
                <tbody>
                    {submissionList!=null?submissionList.map((dat)=>{
                        return <tr className="applicantsRow">
                            <td className="nameColumn">{dat.candName}
                            <a target={"_blank"} href={`../admin/viewCandidateDetails?candDetails=${dat.candidateId}`} id="showResumePreview" className="btn-soft-success btn-outline-success edit-row-button ml-2"><i className="fa fa-binoculars" aria-hidden="true"></i></a>
                            </td>
                            <td>{dat.email}</td>
                            <td>{dat.phone}</td>
                            <td>{dat.workAuthorization}</td>
                            <td><a target={"_blank"} href={`../admin/viewJobDetails?jobId=${dat.requirementId}`}>{dat.requirementName}</a></td>
                            <td></td>
                            <td><a onClick={(e)=>updateCandidate(dat)} style={{cursor:"pointer"}}>{dat.status===1?<span className="badge badge-warning mr-2">submitted</span>:dat.status===2?<span className="badge badge-secondary mr-2">shortlisted</span>:""}
                            </a>{dat.status===3?<span className="badge badge-success mr-2">Onboarded</span>:""}</td>
                        </tr>;
                    }):"loading"}
                </tbody>
                <tfoot><tr>
                  <td colSpan="4" >Number of candidates : </td>
                  <td colSpan="3" className="">
                    
                  </td>
                </tr>
                </tfoot>
              </Table>
            </div>
          </Card>
        </div></Row></div>
        <Modal isOpen={statusUpdate} className={"rightside-modal"}>
        <div className="modal-header respreview-header">
               <h6 className="modal-title m-0" id="exampleModalDefaultLabel">Update</h6>
               <button type="button" className="close float-right" onClick={(e) => { showStatusUpdate(false) }}>
                  <span aria-hidden="true"><i className="la la-times"></i></span>
               </button>
            </div>
        <ModalBody>
            {/*{"requirementName":"CAN-3 - asdasdasdasd","candName":"ChurnicaVennela Sunki","submissionId":6,"candidateId":29277,"submissionRate":12,"submissionRateType":"Hourly","workAuthorization":"","phone":"703-634-0261","email":"vennela.sunki6699@gmail.com","createdByName":"admin","createdDate":"2022-04-18T16:30:12.756","status":1,"location":"","requirementId":23}*/}
            {candStatus!==null&& <div className="col-sm-12 row">
                <div className="form-group">
                    <label className="control-label col-sm-6">Requirement Name:</label><span> {candStatus.requirementName}</span>
                    <label className="control-label col-sm-6">Candidate Name: </label><span>{candStatus.candName}</span>
                    <label className="control-label col-sm-6">Email:</label><span> {candStatus.email}</span>
                    <label className="control-label col-sm-6">Submitted Date: </label><span>{candStatus.createdDate}</span>
                </div>
            </div>}
            {candStatus!==null?candStatus.status==1?<>
            <div className="col-sm-12">
                <div className="form-group text-center">
                    <button className="btn ml-2 btn-info waves-effect waves-light" onClick={(e)=>updateInterview(candStatus.submissionId)}>Shortlist</button>
                    <Button color="secondary" className="btn ml-2  waves-effect waves-light" onClick={(e) => { showStatusUpdate(false) }}>Close</Button>
                </div>
            </div>
            </>:candStatus.status==2?<> <div className="col-sm-12">
                <div className="form-group row">
                    <label className="control-label col-sm-6 float-left">Date:</label><div className="col-sm-6 float-left"> 
                    <input type="date" className="form-control"/></div>
                </div>
                <div className="form-group row">
                    <label className="control-label col-sm-6 float-left">Mode: </label>
                    <div className="col-sm-6  float-left">
                        <select className="form-control">
                        <option value="">select</option>
                        <option value="Phone">Phone</option>
                        <option value="Skype">Skype</option>
                        <option value="Direct">Direct</option>
                        </select></div>
                </div>

                <div className="form-group text-center">
                    <button className="btn ml-2 btn-warning waves-effect waves-light" onClick={(e)=>scheduleInterview(candStatus.submissionId)}>Schedule </button>
                    <button className="btn ml-2 btn-primary waves-effect waves-light" onClick={(e)=>onboardInterview(candStatus.submissionId)}>Onboard </button>
                    <Button color="secondary" className="btn ml-2  waves-effect waves-light" onClick={(e) => { showStatusUpdate(false) }}>Close</Button>
                </div>
            </div></>:"3":""}
        </ModalBody>
      </Modal>

 </>);
}
export default CandidateSubmissions;