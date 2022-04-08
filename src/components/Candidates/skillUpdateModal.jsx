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

class SkillsUpdateModal extends React.Component {
    constructor(props,context){
        super(props,context);
        this.state = {
            userId:null,
            newSkillsDetails:[{
                domain:"",
                skills:""
             }]
        };
        this.handleNewSkillsSubmit = this.handleNewSkillsSubmit.bind(this);
    }
    
handleNewSkillsSubmit = (event)=>{
    if(this.props.candidateId === ""){
       alert("Candidate Id Error");
       return;
    }
    axios.post(apiUrl+"catalog/createNewTechnicalSkills",{
       candidateId:this.props.candidateId,
       domain:this.state.newSkillsDetails[0].domain,
       skills:this.state.newSkillsDetails[0].skills})
    .then(({data}) =>{ 
       if(data.statusResponse){
          Swal.fire({
             icon: 'Success',
             title: 'Skill details added',
             text: ""
          });
          this.props.closeSkillAddForm(true)
       }else{
 
       }
    });
    
 }
    componentDidMount(){
       
    }

    render(){
            return (<Card className="no-border m-0"><hr className="dashed"/><CardBody className="p-0 m-0"><div className="kanban-board"><div className="kanban-col"><div className="kanban-main-card"><div className="kanban-box-title"><h4 className="card-title mt-0 mb-3">Add skills</h4><div className="row">
            <div className="col-sm-12">
                  <div className="form-group">
                     <label className="control-label">Domain</label>
                     <input placeholder="Ex: Web Development" type="text" className="form-control" onChange={(e)=>{ this.state.newSkillsDetails[0].domain=e.target.value; }} autoFocus={true}/>
                  </div>
            </div>
            <div className="col-sm-12">
                  <div className="form-group">
                     <label className="control-label">Skills</label>
                     <textarea placeholder="Ex: HTML5, SAAS, CSS3, ES5" type="text" className="form-control" onChange={(e)=>{ this.state.newSkillsDetails[0].skills=e.target.value; }}/>
                  </div>
            </div>
            <div className="col-sm-12">
               <div className="button-items">
                  <button type="button" onClick={(e)=>this.props.closeSkillAddForm(false)} className="btn btn-outline-secondary waves-effect">
                     Close 
                  </button>
                  <button type="button" onClick={this.handleNewSkillsSubmit} className="btn btn-outline-primary waves-effect waves-light">
                     <span className="btn-inner--icon"><i className="fas fa-plus"></i></span> Update 
                  </button>
               </div>
            </div>
            </div></div></div></div></div></CardBody></Card>);
    }
}
export default SkillsUpdateModal;
