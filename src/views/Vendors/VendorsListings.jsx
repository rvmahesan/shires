import React, { Component } from "react";
import Preheader from "../../components/BodyHeader/Preheader";
import {
  Container,
  Row,
  Card,
  CardHeader,
  Table, Modal, ModalHeader, ModalBody, ModalFooter, Button
} from "reactstrap";
import Swal from 'sweetalert2';
import Cookies from 'universal-cookie';
import { serverAPI } from "../../variables/Variables";

const axios = require("axios").default;

const cookies = new Cookies();

class VendorsListing extends Component {
  constructor(props, context) {
    super(props, context);
    this.state =
    {
      previousLink: "",
      nextLink: "",
      vendorsList: [],
      numberOfVendors: 0,
      showCreateUserModal: false,
      isLoading: false,
    }

    this.handleInput = this.handleInput.bind(this);
    this.loadVendorsList = this.loadVendorsList.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.loadPrevios = this.loadPrevios.bind(this);
    this.loadNext = this.loadNext.bind(this);
    axios.defaults.withCredentials = false;
  }

  handleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  handleDelete = (event, id) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "This action can't be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sure',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        axios.delete(serverAPI + "deleteVendorDetails", {data: {  vendorId: id, sess_id: cookies.get("c_csrftoken")} }).then(({ data }) => {
          // alert(data)
          if (data.statusResponse == true) {
            let timerInterval;
            Swal.fire({
              icon: 'success',
              title: data.message,
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
                this.loadUsersList();
              }
            }).then((result) => {
              /* Read more about handling dismissals below */
              window.location.reload();
            });
          }
        }).catch(function (err) {
          console.log(err);
          alert("Error - Tray again later");
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {

      }
    })
  }

  loadPrevios() {
    this.setState({ isLoading: true });
    axios.get(this.state.previousLink)
      .then(({ data }) => {
        if (data){
          this.setState({ isLoading: false });
          this.setState({ vendorsList: data.results, nextLink: data.next, previousLink: data.previous, pageNumber: data.currentPage, numberOfUsers: data.count });
        }
      })
      .catch((err) => { })
  }
  loadNext() { this.setState({ isLoading: true });
    axios.get(this.state.nextLink)
      .then(({ data }) => {
        if (data){
          this.setState({ isLoading: false });
          this.setState({ vendorsList: data.results, nextLink: data.next, previousLink: data.previous, pageNumber: data.currentPage, numberOfUsers: data.count });
        }
      })
      .catch((err) => { })
  }
  loadVendorsList() {
    this.setState({ isLoading: true });
    axios.get(serverAPI + "listAllVendors", { params: { sess_id: cookies.get("c_csrftoken") } })
      .then(({ data }) => {
        this.setState({ isLoading: false });
        if (data)
          this.setState({ vendorsList: data.results, nextLink: data.next, previousLink: data.previous, pageNumber: data.currentPage, numberOfVendors: data.count });

      })
      .catch((err) => { this.setState({ isLoading: false }); alert("Error - Try again later") })
  }
  componentDidMount() {
    this.loadVendorsList ();
    //
  }

  render() {
    let thisObj = this;
   
    return (<>
      <div className="row">
        <div className="col-sm-12">
          <div className="page-title-box">
            <div className="row">
              <div className="col">
                <div className="col-sm-6 float-left">
                  <h4 className="page-title">Vendors List</h4>
                </div>
                <div className="float-right">
                  <a style={{ marginRight: 2 + '%' }} size="sm" onClick={() => { window.location.href = "../admin/addNewVendor" }} className="w-100 btn btn-sm btn-primary text-white">Add New</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Container fluid >
        <div className="header-body">
          {/* Card stats */}
        </div>
      </Container>
      <div className="mb-5">
        {/* Table */}
        <Row>
          <div className="col p-0">
            <Card className="p-2">
              <Table className="align-items-center table-flush " responsive>
                <thead className="thead-light">
                  <tr key="thead1">
                    <th style={{width:"5%"}} scope="col">#</th>
                    <th style={{width:"45%"}} scope="col">Name</th>
                    <th style={{width:"20%"}} scope="col">Country</th>
                    <th style={{width:"20%"}} scope="col">Contact Number</th>
                    <th style={{width:"10%"}} scope="col" />
                  </tr>
                </thead>
                {this.state.isLoading ? <tr className="mt-5"><td colSpan="5" className="text-center p-3"><i className="fa fa-spinner fa-45 fa-spin"></i></td></tr> :
                  <><tbody>{this.state.vendorsList.length >= 1 ? (this.state.vendorsList.map(function (obj, index) {
                    var idValue = obj.id;
                    return <tr key={index}><td>{index + 1}</td><td>{obj.vendorName|| "--"} </td>
                      <td>{obj.country|| "--"}</td>
                      <td>{obj.contactNumber || "--"}</td>
                      <td className="pb-1">
                        <a title="View/Update" href={"../admin/ViewVendorDetails?vendorId=" + obj.id} className="btn btn-icon-only btn-sm rounded-circle mr-0" ><i className="fa text-info fa-18 fa-eye"></i></a> <a className="ml-0 btn btn-sm btn-icon-only rounded-circle" onClick={(e) => thisObj.handleDelete(e, obj.id)} ><i className="fa fa-18 text-danger fa-trash"></i></a>
                      </td>
                    </tr>;
                  })) : <tr ><td colSpan={5} className={"text-center pt-3"}>No Records found</td></tr>}
                    {/* onClick={(e) => thisObj.showUpdateForm(e, obj.id)} */}
                  </tbody>
                    {this.state.vendorsList.length != 0 ? (
                      <tfoot>
                        <tr>
                          <td colSpan="4">Number of Users : {this.state.numberOfVendors}</td>
                          {(this.state.numberOfVendors >= 2) ? <td colSpan="4"><ul className="justify-content-end mb-0 pagination">
                            <li className="page-item">
                              {(this.state.previousLink != null) ? <a href={"#" + (this.state.pageNumber)} onClick={this.loadPrevios} className="page-link"><i className="typcn  typcn-chevron-left-outline"></i><span className="sr-only">Previous</span></a> : ""}
                            </li>
                            <li className="page-item">
                              {(this.state.nextLink != null) ? <a href={"#" + (this.state.pageNumber)} onClick={this.loadNext} className="page-link"><i className="typcn  typcn-chevron-right-outline"></i><span className="sr-only">Previous</span></a> : ""}
                            </li>
                          </ul></td> : null}
                        </tr>
                      </tfoot>) : null}</>}
              </Table>
            </Card>
          </div></Row></div></>
    );
  }
}
export default VendorsListing;