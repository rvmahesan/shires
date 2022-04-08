import React from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,Spinner, CardBody,Toast,Label,Modal,ModalHeader,ModalBody,ModalFooter,Button } from "reactstrap";
import {style,candidateGetUrl,candidateDeleteUrl,candidateUpdateUrl,candidateResumeUpdateUrl,apiUrl} from "../../variables/Variables.jsx";
import Swal from 'sweetalert2';
const axios = require("axios").default;

class EducationAddForm extends React.Component {
    constructor(props,context){
        super(props,context);
        this.state = {
            userId:null,
            newEducationDetails:[{
                educationNewSchool:"",
                educationNewDegree:"",
                educationNewFieldofStudy:"",
                educationNewStartyear:"",
                educationNewEndyear:"",
                educationNewGrade:"",
                educationNewDescription:""
             }]
        };
        this.handleNewEducationSubmit = this.handleNewEducationSubmit.bind(this);
    }
    handleNewEducationSubmit = (event)=>{
        if(this.props.candidateId === ""){
           alert("Candidate Id Error");
           return;
        }
        axios.post(apiUrl+"createNewEducation",{
           candidateId:this.props.candidateId,
           sess_id:this.props.sess_id,
           schoolName:this.state.newEducationDetails[0].educationNewSchool,
           degreeName:this.state.newEducationDetails[0].educationNewDegree,
           fieldofStudy:this.state.newEducationDetails[0].educationNewFieldofStudy,
           startYear:this.state.newEducationDetails[0].educationNewStartyear,
           endYear:this.state.newEducationDetails[0].educationNewEndyear,
           grade:this.state.newEducationDetails[0].educationNewGrade,
           description:this.state.newEducationDetails[0].educationNewDescription})
        .then(({data}) =>{ 
           if(data.statusResponse){
              Swal.fire({
                 icon: 'Success',
                 title: 'Education details added',
                 text: ""
              });
              this.props.closeEducationAddForm(true)
              //his.setState({showEducationAddFormCond:false});
           }else{
  
           }
        });
     }
    componentDidMount(){
       
    }

    render(){
            return (<Card className="no-border m-0"><hr className="dashed"/><CardBody className="p-0 m-0"><div className="kanban-board"><div className="kanban-col"><div className="kanban-main-card"><div className="kanban-box-title"><h4 className="card-title mt-0 mb-3">Add Education</h4><div className="row">
            <div className="col-sm-12">
                <div className="form-group">
                    <label className="control-label">{this.state.userId} School</label>
                    <input placeholder="Ex: Boston university" type="text" autoFocus={true} className="form-control" onChange={(e)=>{ this.state.newEducationDetails[0].educationNewSchool = e.target.value; }}/>
                </div>
            </div>
            <div className="col-sm-12">
                <div className="form-group">
                    <label className="control-label">Degree</label>
                    <input placeholder="Ex: Bachelor's" type="text" className="form-control" onChange={(e)=>{ this.state.newEducationDetails[0].educationNewDegree=e.target.value; }}/>
                </div>
            </div>
            <div className="col-sm-12">
                <div className="form-group">
                    <label className="control-label">Field of study</label>
                    <input placeholder="Ex: Business" type="text" className="form-control" onChange={(e)=>{ this.state.newEducationDetails[0].educationNewFieldofStudy=e.target.value; }}/>
                </div>
            </div>
            <div className="col-sm-6 float-left">
                <div className="form-group">
                    <label className="control-label">Start year</label>
                    <input placeholder="Year" type="text" className="form-control" onChange={(e)=>{ this.state.newEducationDetails[0].educationNewStartyear=e.target.value; }}/>
                </div>
            </div>
            <div className="col-sm-6 float-left">
                <div className="form-group">
                    <label className="control-label">End year</label>
                    <input placeholder="Year" type="text" className="form-control" onChange={(e)=>{ this.state.newEducationDetails[0].educationNewEndyear=e.target.value; }}/>
                </div>
            </div>
            <div className="col-sm-12">
                <div className="form-group">
                    <label className="control-label">Grade</label>
                    <input placeholder="" type="text" className="form-control" onChange={(e)=>{ this.state.newEducationDetails[0].educationNewGrade=e.target.value; }}/>
                </div>
            </div>
            <div className="col-sm-12">
                <div className="form-group">
                    <label className="control-label">Description</label>
                    <textarea className="form-control" name="location" onChange={(e)=>{ this.state.newEducationDetails[0].educationNewDescription=e.target.value; }}></textarea>
                </div>
            </div>
            <div className="col-sm-12">
            <div className="button-items">
            <button type="button" onClick={()=>this.props.closeEducationAddForm(false)} className="btn btn-outline-secondary waves-effect">
                Close 
            </button>
            <button type="button" onClick={(e)=>this.handleNewEducationSubmit(e)} className="btn btn-outline-primary waves-effect waves-light">
                <span className="btn-inner--icon"><i className="fas fa-plus"></i></span> Update 
            </button>
            </div>
            </div>
        </div></div></div></div></div></CardBody></Card>);
    }
}
export default EducationAddForm;
