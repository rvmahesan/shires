import React, { Component } from "react";
import {
  Container,
  Row,
  Card,Label
} from "reactstrap";
import {apiUrl} from "../variables/Variables.jsx";



//import { Grid, Row, Col } from "react-bootstrap";
//import Card from "components/Card/Card";
//import { thArray, tdArray } from "variables/Variables.jsx";


class ProfileBox extends Component {
  constructor(props){
    super(props);
    this.selectProfiles = this.selectProfiles.bind(this);
    this.viewResume = this.viewResume.bind(this);
    this.state = { selectedProfiles:[] };
    this.hasCheckedP = this.hasCheckedP.bind(this);
  }

  selectProfiles(id,e){
    this.props.selectProfiles(id,e);
   
    if(e){
        if(e.target.checked === true){
            let profiless = this.state.selectedProfiles;
            profiless.push(id);
            //this.setState({selectedProfiles:profiless});
        }
    }
    if(e.target.checked === false){
      let profiless = this.state.selectedProfiles;
      let indx = profiless.indexOf(id);
      if(indx !== -1){
        profiless.splice(indx,1);
     //   this.setState({selectedProfiles:profiless });
      }
    }
  }


  viewResume(id,e){ 
    this.props.viewResume(id,e);
  }

  hasCheckedP(ids){
    return this.props.selectedProfiles.indexOf(ids)>-1;
  }
  render() {
    if(this.state.selectedProfiles.length>=1)
    var linkHref = `../admin/viewCandidateDetails?userId=${this.props.options._id}` ;
    let thisObj = this;
    return (<Container className="mt-3" fluid> 
    <Row> 
      <div className="col" key={this.props.options._id+"sd"}>
        <Card className="shadow p-3">
        <div className="content profileBox">
          <div className="col-md-12 float-left ml-0 pl-0">
            <div className="custom-control custom-checkbox">
                <input
                type="checkbox" 
                className="custom-control-input form-control-sm custom" 
                name={this.props.options._id} 
                onChange={(e)=>this.selectProfiles(this.props.options._id,e)} 
                id={this.props.options._id} 
                defaultValue={true}
                checked={this.hasCheckedP(this.props.options._id)}
                />
                <Label className="custom-control-label" for={this.props.options._id}></Label>
                
                <a rel="noopener noreferrer" href={`../admin/viewCandidateDetails?userId=${this.props.options._id}`} target="_blank"><h5 className="title headerName">
             {this.props.options.firstName} {this.props.options.lastName}</h5></a>
            </div>
          </div>
            <div className="col-md-4 float-left pl-0">
              <div className="col-md-12 pl-0">
              <span className="badge badge-pill badge-secondary text-black">Email:</span>{this.props.options.email!==""?this.props.options.email:<span className="badge badge-pill badge-md badge-na badge-default">--NA--</span>}
              </div>
              <div className="col-md-12 pl-0">
                <span className="badge badge-pill badge-secondary text-black">Current Location : </span>{this.props.options.location!==""?this.props.options.location:<span className="badge badge-na badge-pill badge-default">--NA--</span>}
              </div>
              <div className="col-md-12 pl-0">
                <span className="badge badge-pill badge-secondary text-black"> Gender : </span> {this.props.options.gender!==""?this.props.options.gender:<span className="badge badge-pill badge-na badge-default">--NA--</span>}
              </div>
            </div>
            <div className="col-md-4 float-left pl-0">
                <div className="col-md-12 mt-2">
                <span className="badge badge-pill badge-secondary text-black">Contact :</span> {this.props.options.phone!==""?this.props.options.phone:<span className="badge badge-pill badge-na badge-default">--NA--</span>}
                </div>
                <div className="col-md-12">
                <span className="badge badge-pill badge-secondary text-black"> Rate :</span> {this.props.options.rate!==""?this.props.options.rate:<span className="badge badge-pill badge-na badge-default">--NA--</span>}
                </div>
                <div className="col-md-12">
                </div>
            </div>
            <div className="col-md-4 float-left pl-0 btn-group">
                <button type="button" className="btn-facebook btn btn-icon-only rounded-circle" name="viewResume" title="View Resume" onClick={(e)=>this.viewResume(this.props.options._id,e)}>
                  <span className="btn-inner--icon"><i className="ni ni-paper-diploma"></i></span>
                </button>
                <a className="btn btn-twitter ml-2 btn-icon-only rounded-circle"  href={`${apiUrl}catalog/downloadResume?userId=${this.props.options._id}`} download>
                  <span className="btn-inner--icon" title="Download Resume"><i className="ni ni-cloud-download-95"></i></span>
                </a>

            </div>
        </div>
       </Card></div></Row></Container>);
  }
}
export default ProfileBox;