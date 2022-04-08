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

class ExperienceAddForm extends React.Component {
    constructor(props,context){
        super(props,context);
        this.state = {
            userId:null,
            newExperienceDetails:[{
                title:"",
                employmentType:"",
                company:"",
                startYear:"",
                endYear:"",
                location:"",
                headLine:"",
                description:"",
                responsibility:""
             }]
        };
        this.genderOptions = ["Select","Male", "Female", "Others"];
        this.handleNewExperienceSubmit = this.handleNewExperienceSubmit.bind(this);
    }
    handleNewExperienceSubmit = (event)=>{
        if(this.props.candidateId === ""){
           alert("Candidate Id Error");
           return;
        }
         axios.post(apiUrl+"createNewExperience",{
            candidateId:this.props.candidateId,
            sess_id:this.props.sess_id,
            title:this.state.newExperienceDetails[0].title,
            employmentType:this.state.newExperienceDetails[0].employmentType,
            company:this.state.newExperienceDetails[0].company,
            startYear:this.state.newExperienceDetails[0].startYear,
            endYear:this.state.newExperienceDetails[0].endYear,
            location:this.state.newExperienceDetails[0].location,
            headLine:this.state.newExperienceDetails[0].headLine,
            description:this.state.newExperienceDetails[0].description,
            responsibility:this.state.newExperienceDetails[0].responsibility})
         .then(({data}) =>{
           if(data.statusResponse){
              Swal.fire({
                 icon: 'Success',
                 title: 'Experience details added',
                 text: ""
              });
              this.props.closeExperienceAddForm(true)
           }else{
              
           }
  
          });
  
      }
    componentDidMount(){
       
    }

    render(){
            return (<Card className="no-border m-0"><hr className="dashed"/><CardBody className="p-0 m-0"><div className="kanban-board"><div className="kanban-col"><div className="kanban-main-card"><div className="kanban-box-title"><h4 className="card-title mt-0 mb-3">Add Experience</h4><div className="row">
            <div className="col-sm-12">
                  <div className="form-group">
                     <label className="control-label">Title</label>
                     <input placeholder="Ex: Retail Sales Manager" type="text" className="form-control" onChange={(e)=>{ this.state.newExperienceDetails[0].title=e.target.value; }} autoFocus={true}/>
                  </div>
            </div>
            <div className="col-sm-12">
                  <div className="form-group">
                     <label className="control-label">Employment Type</label>
                     <select type="text" className="form-control" onChange={(e)=>{ this.state.newExperienceDetails[0].employmentType=e.target.value; }} defaultValue="">
                     <option value="">-</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Self-employed">Self-employed</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Internship">Internship</option>
                        <option value="Trainee">Trainee</option>
                     </select>
                  </div>
            </div>
            <div className="col-sm-12">
                  <div className="form-group">
                     <label className="control-label">Company</label>
                     <input placeholder="Ex: Business" type="text" className="form-control" onChange={(e)=>{ this.state.newExperienceDetails[0].company=e.target.value; }}/>
                  </div>
            </div>
            <div className="col-sm-6 float-left">
                  <div className="form-group">
                     <label className="control-label">Start Date</label>
                     <input placeholder="Year" type="text" className="form-control" onChange={(e)=>{ this.state.newExperienceDetails[0].startYear=e.target.value; }}/>
                  </div>
            </div>
            <div className="col-sm-6 float-left">
                  <div className="form-group">
                     <label className="control-label">End Date</label>
                     <input placeholder="Year" type="text" className="form-control" onChange={(e)=>{ this.state.newExperienceDetails[0].endYear=e.target.value; }}/>
                  </div>
            </div>
            <div className="col-sm-12">
                  <div className="form-group">
                     <label className="control-label">Location</label>
                     <input placeholder="" type="text" className="form-control" onChange={(e)=>{ this.state.newExperienceDetails[0].location=e.target.value; }}/>
                  </div>
            </div>
            <div className="col-sm-12">
                  <div className="form-group">
                     <label className="control-label">Headline</label>
                     <input placeholder="" type="text" className="form-control" onChange={(e)=>{ this.state.newExperienceDetails[0].headLine=e.target.value; }}/>
                  </div>
            </div>
            <div className="col-sm-12">
                  <div className="form-group">
                     <label className="control-label">Description</label>
                     <textarea className="form-control" defaultValue={this.state.educationNewDescription} onChange={(e)=>{ this.state.newExperienceDetails[0].description=e.target.value; }}></textarea>
                  </div>
            </div>
            
            <div className="col-sm-12">
                  <div className="form-group">
                     <label className="control-label">Responsibility</label>
                     <textarea className="form-control" onChange={(e)=>{ this.state.newExperienceDetails[0].responsibility=e.target.value; }}></textarea>
                  </div>
            </div>
         
            <div className="col-sm-12">
               <div className="button-items">
                  <button type="button" onClick={(e)=>this.props.closeExperienceAddForm(false)} className="btn btn-outline-secondary waves-effect">
                     Close 
                  </button>
                  <button type="button" onClick={this.handleNewExperienceSubmit} className="btn btn-outline-primary waves-effect waves-light">
                     <span className="btn-inner--icon"><i className="fas fa-plus"></i></span> Update 
                  </button>
               </div>
            </div>
         </div></div></div></div></div></CardBody></Card>);
    }
}
export default ExperienceAddForm;
