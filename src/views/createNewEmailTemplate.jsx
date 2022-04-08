import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader
} from "reactstrap";


import Swal from 'sweetalert2';

import ReactQuill from "react-quill";
import { addEmailTemplateDetailsUrl } from "../variables/Variables.jsx";

{/* 
import Select from "../components/Select.jsx";

import NumberFormat from "react-number-format";

import NotificationSystem from "react-notification-system";
import { Redirect } from 'react-router-dom';
import Candidates from "./Candidates.jsx";*/}

const axios = require("axios").default;

class createNewEmailTemplate extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      templateCode: "",
      templateName: "",
      templateDescription: "",
      templateDynamicHeaders: ["{firstName}", "{lastName}", "{jobTitle}", "{companyName}"]
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTemplateDescription = this.handleTemplateDescription.bind(this);
    this.handleTemplateTag = this.handleTemplateTag.bind(this);
  }


  handleInput(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  componentDidMount() {

  }
  handleTemplateTag(value, e) {
    let oldText = this.state.templateDescription;
    if (oldText != "") {
      oldText = oldText.slice(0, -4);
    }
    oldText = oldText + "  " + (e.target.value.trim());

    this.setState({ templateDescription: (oldText.trimStart().trimEnd()) })
    e.target.value = "";
  }
  handleTemplateDescription = (text) => {
    this.setState({
      templateDescription: text
    });
  }
  handleSubmit(event) {

    if (this.state.jobDescription == "") {
      Swal.fire('Oops...', 'Enter jobdescription', 'error'); return;
    }

    axios.post(addEmailTemplateDetailsUrl, {
      templateCode: this.state.templateCode,
      templateDescription: this.state.templateDescription,
      templateName: this.state.templateName,
      userId: window.sessionStorage.getItem("userId")
    }).then(function (res) {
      console.log(res.data);
      if (res.data.statusResponse) {
        //this.showAlert("br","success","Candidate created successsfully","pe-7s-check");
        let timerInterval;
        Swal.fire({
          icon: 'success',
          title: "Template created successfully",
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
            // setTimeout(()=>this.props.history.push("../admin/candidates"),  500);
            // window.location.href = "../admin/manageMailTemplates";
          }
        });
      } else {
        Swal.fire('Oops...', 'Error creating', 'error'); return;
      }
    });//axios end
  }
  //  setTimeout(()=>this.props.history.push("../admin/candidates"),  1200);


  render() {
    return (<><div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
      <Container fluid>
        <div className="header-body">
          {/* Card stats */}
          <Row>
            <Col lg="12" xl="12">
            </Col>
          </Row>
        </div>
      </Container>
    </div>
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-1">
                <h3 className="col-sm-8 float-left">Email Management - Add Template</h3>
                <a href={'../admin/manageMailTemplates'}
                  className="btn-sm text-white btn-default pull-right float-right"
                >X</a>
              </CardHeader>
              <form className="p-4">
                <div className="row ">
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="control-label col-sm-4">Template Code</label>
                      <input placeholder="" type="text" className="form-control col-sm-8" name="templateCode" defaultValue={this.state.templateCode} onChange={this.handleInput} />
                    </div>
                    <div className="form-group row">
                      <label className="control-label col-sm-4">Name</label>
                      <input placeholder="" type="text" className="form-control col-sm-8" required name="templateName" defaultValue={this.state.templateName} onChange={this.handleInput} />
                    </div>

                  </div>
                </div>
                <div className="row templateWrapper">
                  <div className="col-md-12 mt-3 mb-3">
                    <label className="control-label">Template Details</label>
                    <ReactQuill theme="snow"
                      value={this.state.templateDescription}
                      name="templateDescription"
                      className="templateDescriptionEditor"
                      onChange={this.handleTemplateDescription}
                    />

                    {/*https://www.npmjs.com/package/react-tinymce*/}

                  </div>
                </div>
                <div className="col-md-6 form-group row">
                  <label className="col-sm-4 control-label">Tags</label>
                  <div className="col-sm-8">
                    <select className="form-control" name="templateTag" onChange={(e) => this.handleTemplateTag(this, e)}>
                      <option value="">select</option>
                      {this.state.templateDynamicHeaders.map(function (obj, index) {
                        return <option value={obj}>{obj}</option>
                      })}
                    </select>
                  </div>
                </div>
                <a href={'../admin/candidates'} className="btn-fill pull-left btn btn-secondary" style={{ marginRight: 10 + 'px' }}> Cancel </a>
                <button type="button" onClick={this.handleSubmit} className="btn-fill pull-left btn btn-primary"> Create </button>
                <div className="clearfix"></div></form></Card></div></Row></Container></>);
  }
}
export default createNewEmailTemplate;