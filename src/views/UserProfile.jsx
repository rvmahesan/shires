import React, { Component } from "react";
import { serverAPI } from "../variables/Variables.jsx";
import {
  Container,
  Row,
  Col,
  Card,
  Button
} from "reactstrap";
import Cookies from "universal-cookie";
import Swal from 'sweetalert2';
import Preheader from "../components/BodyHeader/Preheader";
import Cards from "../components/Card/Card";
const axios = require("axios").default;
const cookies = new Cookies();
class UserProfile extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      zip: "",
      company: "",
      username: "",
      homeAddress: "",
      city: "",
      address: "",
      country: "",
      password: "",
      confirmPassword: "",
      userType: "",
      userListForSelect:[],
      teamsListForSelect:[],
      userROlesListForSelect:[],
    }
    this.handleInput = this.handleInput.bind(this);
    this.updateTemplate = this.updateTemplate.bind(this);
    this.getuserDetails = this.getuserDetails.bind(this);
  }


  handleInput(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  getuserDetails() {
    var authToken = cookies.get("canAuthToken");
    var authToken = authToken.split("==");
    axios.get(serverAPI + "userProfileDetails", { params: { tokenId: authToken[0] } })
      .then(({ data }) => {
        this.setState({ company: data.profileDetails.company, firstName: data.profileDetails.firstName, lastName: data.profileDetails.lastName, email: data.profileDetails.email, country: data.profileDetails.country, username: data.profileDetails.userName, address: data.profileDetails.address, city: data.profileDetails.city, country: data.profileDetails.country, zip: data.profileDetails.zip, userType: data.profileDetails.userType })
      })
      .catch((err) => { })

  
  }

  componentDidMount() {
    this.getuserDetails(); 
  }


  updateTemplate() {
    var thisObj = this;
    if (this.state.password != "") {
      if (this.state.password != this.state.confirmPassword) {
        alert("Passwords not equal")
        return;
      }
    }
    var authToken = cookies.get("canAuthToken");
    var authToken = authToken.split("==");
    axios.put(serverAPI + "/updateUserDetails", {
      authToken: authToken[0],
      userPassword: this.state.password,
      mode: "profile_update",
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      company: this.state.company,
      address: this.state.address,
      city: this.state.city,
      country: this.state.country,
      zip: this.state.zip, oldusername: this.state.username, username: this.state.username, userType: this.state.userType
    })
      .then(({ data }) => {
        if (data.statusResponse) {
          let timerInterval;
          Swal.fire({
            icon: 'success',
            title: "User updated successfully",
            html: '',
            timer: 800,
            timerProgressBar: true,
            onBeforeOpen: () => {
              Swal.showLoading()
              timerInterval = setInterval(() => {
              }, 100)
            },
            onClose: () => {
              clearInterval(timerInterval);
              thisObj.getuserDetails();
            }
          });
        } else {
          Swal.fire('Oops...', 'Error creating', 'error'); return;
        }
      }).catch((err) => { })
  }



  render() {
    var thisObj = this;
    return (<><Preheader />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow p-3">
              <div className="content m-1">
                <Col md={8}>

                  <h6 className="heading-small text-muted mb-4">Account information</h6>
                  <div className="pl-lg-4">
                    <div className="col-md-4 float-left ">
                      <div className="form-group">
                        <label className="control-label">Company / Business Unit</label>
                        <input type="text" className="form-control" defaultValue={this.state.company} name="company" onChange={this.handleInput} placeholder="Company" /></div>
                    </div>
                    <div className="col-md-4 float-left">
                      <div className="form-group">
                        <label className="control-label">Username</label>
                        <input type="text" className="form-control" disabled={true} defaultValue={this.state.username} name="username" placeholder="Username" /></div>
                    </div>
                    <div className="col-md-4 float-left">
                      <div className="form-group">
                        <label className="control-label">Email</label>
                        <input type="text" className="form-control" defaultValue={this.state.email} name="email" onChange={this.handleInput} placeholder="Email" /></div>
                    </div>


                    <div className="col-md-4 float-left">
                      <div className="form-group">
                        <label className="control-label">Password</label>
                        <input placeholder="Password" type="text" className="form-control" defaultValue={this.state.password} name="password" onChange={this.handleInput} /></div>
                    </div>

                    <div className="col-md-4 float-left">
                      <div className="form-group">
                        <label className="control-label">Confirm password</label>
                        <input placeholder="Confirm password" type="text" className="form-control" defaultValue={this.state.confirmPassword} name="confirmPassword" onChange={this.handleInput} /></div>
                    </div>
                    <div className="col-md-12 float-left">
                      <small className="text-danger">*** If you want to keep your old password leave the password field(s) empty</small>
                    </div>
                  </div>
                  <div className="clearfix" />
                  <hr className="my-4" />
                  <h6 className="heading-small text-muted mb-4">User information</h6>
                  <div className="pl-lg-4">
                    <div className="col-md-6 float-left">
                      <div className="form-group">
                        <label className="control-label">First Name</label>
                        <input placeholder="First Name" type="text" className="form-control" defaultValue={this.state.firstName} name="firstName" onChange={this.handleInput} /></div>
                    </div>

                    <div className="col-md-6 float-left">
                      <div className="form-group">
                        <label className="control-label">Last Name</label>
                        <input type="text" className="form-control" defaultValue={this.state.lastName} name="lastName" onChange={this.handleInput} placeholder="Last Name" /></div>
                    </div>
                    <div className="col-md-12 float-left">
                      <div className="form-group">
                        <label className="control-label">Adress</label>
                        <input placeholder="Home Adress" type="text" className="form-control" defaultValue={this.state.address} name="address" onChange={this.handleInput} /></div>
                    </div>


                    <div className="col-md-4 float-left">
                      <div className="form-group">
                        <label className="control-label">City</label>
                        <input placeholder="City" type="text" className="form-control" defaultValue={this.state.city} name="city" onChange={this.handleInput} /></div>
                    </div>
                    <div className="col-md-4 float-left">
                      <div className="form-group">
                        <label className="control-label">Country</label>
                        <input placeholder="Country" type="text" className="form-control" defaultValue={this.state.country} name="country" onChange={this.handleInput} /></div>
                    </div>
                    <div className="col-md-4 float-left">
                      <div className="form-group">
                        <label className="control-label">Postal Code</label>
                        <input placeholder="Postal Code" type="number" className="form-control" defaultValue={this.state.zip} name="zip" onChange={this.handleInput} /></div>
                    </div>
                  </div>
                  <div className="clearfix" />
                  <Row>
                    <Button className="float-right" onClick={this.updateTemplate} type="submit">
                      Update Profile
                    </Button>
                  </Row>
                  <div className="clearfix" />
                </Col>
              </div></Card></div></Row></Container></>
    );
  }
}

export default UserProfile;
