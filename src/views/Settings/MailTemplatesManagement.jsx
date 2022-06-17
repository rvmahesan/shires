import React, { Component } from "react";
import { emailTemplateListingUrl, apiUrl } from "../../variables/Variables.jsx";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  Table, Modal, ModalHeader, ModalBody, ModalFooter, Button
} from "reactstrap";
import ReactQuill from "react-quill";

import Swal from 'sweetalert2';
const axios = require("axios").default;
class MailTemplatesManagement extends Component {

  constructor(props) {
    super(props);
    this.state = {
      templates: [],
      loading: true,
      error: null,
      numberOfItems: 0,
      pageSize: 10,
      pageNumber: 0,
      templateCode: "",
      templateId: "",
      templateName: "",
      templateDescription: "",
      showTemplateModal: false
    };

    this.loadPrevious = this.loadPrevious.bind(this);
    this.loadNext = this.loadNext.bind(this);
    this.updateTemplate = this.updateTemplate.bind(this);
    this.viewTemplate = this.viewTemplate.bind(this);
    this.deleteTemplate = this.deleteTemplate.bind(this);
    this.handleTemplateDescription = this.handleTemplateDescription.bind(this);
    this.closeResumeModal = this.closeResumeModal.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.loadList = this.loadList.bind(this);
  }
  viewTemplate(id) {
    axios.get(apiUrl + "/catalog/getEmailTemplateDetails", { params: { templateId: id } })
      .then(({ data }) => {
        this.setState({ templateCode: data.templateDetails.templateCode, templateName: data.templateDetails.templateName, templateDescription: data.templateDetails.templateDescription, templateId: data.templateDetails.templateId });
      }).catch((err) => { })

    this.setState({ showTemplateModal: true });
  }
  closeResumeModal() {
    this.setState({ showTemplateModal: false });
    return true;
  }
  loadList(pageSize, pageNumber) {
    this.setState({ loading: true });

    axios.get(emailTemplateListingUrl, { params: { userId: window.sessionStorage.getItem("userId"), pageSize: pageSize, pageNumber: pageNumber } })
      .then(({ data }) => {
        this.setState({ loading: false, templates: data.templates, pageNumber: data.pageNumber, numberOfItems: data.numberOfItems });
      })
      .catch((err) => { })
  }
  updateTemplate() {
    const userId = window.sessionStorage.getItem("userId");
    axios.put(apiUrl + "catalog/updateTemplateDetails", { userId: userId, templateCode: this.state.templateCode, templateName: this.state.templateName, templateDescription: this.state.templateDescription, templateId: this.state.templateId })
      .then(({ data }) => {
        this.setState({ showTemplateModal: false });
        let timerInterval;
        Swal.fire({
          icon: 'success',
          title: "Template updated successfully",
          html: '',
          timer: 1800,
          timerProgressBar: true,
          onBeforeOpen: () => {
            Swal.showLoading()
            timerInterval = setInterval(() => {
            }, 100)
          },
          onClose: () => {
            clearInterval(timerInterval)
          }
        }).then((result) => {
          /* Read more about handling dismissals below */
          this.setState({ loading: true });
          let currPageNumber = (window.location.hash) ? window.location.hash.substring(1) : 0;
          const userId = window.sessionStorage.getItem("userId");
          axios.get(emailTemplateListingUrl, { params: { userId: userId, pageSize: this.state.pageSize, pageNumber: this.state.pageNumber } })
            .then(({ data }) => {
              this.setState({ loading: false, templates: data.templates, pageNumber: data.pageNumber, numberOfItems: data.numberOfItems });
            })
            .catch((err) => { })
        });
        this.setState({ templateCode: "", templateName: "", templateDescription: "", templateId: "" });
      })
      .catch((err) => { })
  }
  deleteTemplate = (tId, vent) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    const thsObj = this;
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
        axios.get(apiUrl + "emailTemplate/deleteEmailTemplate?templateId=" + tId).then(function (res) {
          if (res.status) {
            let timerInterval;
            Swal.fire({
              icon: 'success',
              title: "Template removed successfully",
              html: '',
              timer: 1800,
              timerProgressBar: true,
              onBeforeOpen: () => {
                Swal.showLoading()
                timerInterval = setInterval(() => {
                }, 100)
              },
              onClose: () => {
                clearInterval(timerInterval);

              }
            }).then((result) => {
              /* Read more about handling dismissals below */
              thsObj.loadList(thsObj.state.pageSize, thsObj.state.pageNumber);
            });
          }
        }).catch(function (err) {
          console.log(err);
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })
  }


  handleInput(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  handleTemplateDescription(text) {
    this.setState({
      templateDescription: text
    });
  }
  componentDidMount() {
    this.loadList(this.state.pageSize, this.state.pageNumber);
  }

  loadNext(event) {
    var pageNo = (this.state.pageNumber++);
    this.setState({ pageNumber: pageNo });
    //localStorage.setItem("currentPage",this.state.pageNumber);
    // #alert(localStorage.getItem("currentPage"));

    this.setState({ loading: true });
    this.loadList(this.state.pageSize, this.state.pageNumber);

  }


  loadPrevious(event) {
    this.setState({ pageNumber: this.state.pageNumber-- });
    this.setState({ loading: true });
    this.loadList(this.state.pageSize, this.state.pageNumber);
  }



  renderLoading() {
    return <div className="content"><div fluid> <Row>
      <Col md={12}>Loading<Card
        title=""
        category=""
        cttablefullwidth="'"
        cttableresponsive=""
        content={<center></center>} /></Col></Row></div></div>;
  }


  renderError() {
    return (
      <div>
        Uh oh: {this.state.error.message}
      </div>
    );
  }
  componentDidUpdate() {
  }
  renderPosts() {
    if (this.state.loading) {
      // document.body.style.cursor='wait';
      tableData = <tr><td colSpan="6" className="text-center p-5"></td></tr>;
    }
    const thObj = this;
    if (!this.state.loading) {
      var tableData = "";
      if (this.state.templates.length == 0) {
        document.body.style.cursor = 'default';
        tableData = <tr><td colSpan="6" className="text-center p-5">No Records Found</td></tr>;
      }
    }
    return (<><div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
      <Container fluid>
        <div className="header-body">
        </div>
      </Container>
    </div>
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-1">
                <h3 className="mb-0">Templates List</h3>
              </CardHeader>
              <Row>
                <div className="col-12 col-sm-6 ml-3 mb-3 mt-3">
                  <a style={{ marginRight: 2 + '%' }} size="sm" href="../admin/createEmailTemplate" className="btn btn-sm btn-primary ">Add New</a>
                </div>
              </Row>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Code</th>
                    <th scope="col">Name</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {this.state.templates.map(function (obj, index) {
                    var idValue = obj._id;
                    return <tr key={index}><td>{obj.colIndex}</td><td>{obj.templateCode}</td><td>{obj.templateName}</td><td> <a className="btn btn-icon-only btn-sm rounded-circle mr-0" onClick={() => thObj.viewTemplate(obj._id)}><i className="fa text-info  fa-24 fa-eye"></i></a> <a className="ml-0 btn btn-sm btn-icon-only rounded-circle" onClick={() => thObj.deleteTemplate(obj._id)}><i className="fa text-danger  fa-24 fa-trash"></i></a></td></tr>;
                  })}
                </tbody>{this.state.templates.length != 0 ? (
                  <tfoot><tr>
                    <td colSpan="4">Number of Templates : {this.state.numberOfItems}</td>
                  </tr>
                    {(this.state.numberOfItems >= 20) ? <tr><td colSpan="4"><ul className="justify-content-end mb-0 pagination">
                      <li className="page-item">
                        {this.state.pageNumber >= 1 ? <a href={"#" + (this.state.pageNumber - 1)} onClick={this.loadPrevious} className="page-link"><i className="ni ni-bold-left"></i><span className="sr-only">Previous</span></a> : ""}
                      </li>
                      <li className="page-item">
                        {((this.state.pageSize * (this.state.pageNumber + 1)) < (this.state.numberOfItems)) ? <a href={"#" + (this.state.pageNumber + 1)} onClick={this.loadNext} className="page-link"><i class="ni ni-bold-right"></i><span className="sr-only">Next</span></a> : <a aria-disabled={true} className="page-link"><i className="ni ni-bold-right"></i><span className="sr-only">Next</span></a>}</li></ul></td></tr> : null}</tfoot>) : null}
              </Table>
            </Card>
          </div></Row></Container><Modal isOpen={this.state.showTemplateModal}>
        <ModalHeader>Template Details</ModalHeader>
        <ModalBody>
          <form className="pr-4">
            <div className="row ">
              <div className="col-md-12">
                <div className="form-group row"><label className="control-label col-sm-4">Template Code</label><input placeholder="" type="text" className="form-control col-sm-8 form-control-sm" name="templateCode" defaultValue={this.state.templateCode} onChange={this.handleInput} />
                </div>
                <div className="form-group row"><label className="control-label col-sm-4">Name</label><input placeholder="" type="text" className="form-control col-sm-8 form-control-sm" required name="templateName" defaultValue={this.state.templateName} onChange={this.handleInput} /></div>
              </div>
            </div>
            <div className="row col-md-12 mr-0 pr-0">
              <label className="control-label">Template Details</label>
              <div className="mr-0 pr-0 pl-0 ml-0 col-md-12">
                <ReactQuill theme="snow"
                  value={this.state.templateDescription}
                  name="templateDescription"
                  onChange={this.handleTemplateDescription} className="p-0"
                /></div>
            </div>
          </form>
        </ModalBody><ModalFooter>
          <button type="button" onClick={this.updateTemplate} className="btn-sm btn-fill pull-left btn btn-primary"> Update </button>
          <Button color="secondary" className="btn-sm" onClick={this.closeResumeModal}>Close</Button>
        </ModalFooter></Modal></>);
  }

  render() {
    return (this.renderPosts());
  }
}
export default MailTemplatesManagement;

/*<a style={{marginRight:2+'%'}} size="sm" href="../admin/createCandidate" className="btn btn-sm btn-primary ">Add New</a>
                      <table className="table align-items-center table-flush">
                      <thead>
                        <tr>
                          {canthArray.map((prop) => {
                            return <th>{prop}</th>;
                          })}
                        </tr>
                      </thead>
                        <tbody>
                          {tableData}
                        </tbody>
                     </table>*/