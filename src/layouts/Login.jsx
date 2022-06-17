import React, { Component } from "react";
import LoginForm from "../views/Login";


import image from "../assets/images/loginImg.png";
import loginImg from "../assets/images/loginImg.png"

import { ToastContainer } from 'react-toastify';
/*
import AuthNavbar from "components/Navbars/AuthNavBar.jsx";
import { Route, Switch } from "react-router-dom";
import NotificationSystem from "react-notification-system";
import Footer from "components/Footer/Footer";
import { style } from "variables/Variables.jsx";
import routes from "routes.js";
import loginLogo from "assets/images/brand-logo/white.png";
*/
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _notificationSystem: null,
      image: image,
      color: "black",
      hasImage: true,
      fixedClasses: "dropdown show-dropdown open"
    };
  }
  handleNotificationClick = position => {
    var color = Math.floor(Math.random() * 4 + 1);
    var level = "success";

    this.state._notificationSystem.addNotification({
      title: <span data-notify="icon" className="pe-7s-gift" />,
      message: (
        <div>
          Description.
        </div>
      ),
      level: level,
      position: position,
      autoDismiss: 15
    });
  };


  getRoutes = routes => {
    return null;
  };

  getBrandText = path => {
    return "Brand";
  };
  handleImageClick = image => {
    this.setState({ image: image });
  };
  handleColorClick = color => {
    this.setState({ color: color });
  };
  handleHasImage = hasImage => {
    this.setState({ hasImage: hasImage });
  };
  handleFixedClick = () => {
    if (this.state.fixedClasses === "dropdown") {
      this.setState({ fixedClasses: "dropdown show-dropdown open" });
    } else {
      this.setState({ fixedClasses: "dropdown" });
    }
  };
  componentDidMount() {

    this.setState({ _notificationSystem: this.refs.notificationSystem });
    var _notificationSystem = this.refs.notificationSystem;
    var color = Math.floor(Math.random() * 4 + 1);
    if (window.sessionStorage.getItem("userId") !== "") {
      //  window.location.href = "../admin/dashboard";
    }
  }
  componentDidUpdate(e) {

  }
  render() {

    return (<div className="container ">
      <div className="row vh-100 d-flex justify-content-center">
        <div className="col-12 align-self-center">
          <div className="row">
            <div className="col-lg-5 mx-auto">
              <div className="card my-shadow" style={{borderRadius:"6px",overflow:"hidden",border:"1px solid #245086"}}>
                <div className="card-body p-0 auth-header-box">
                  <div className="text-center pl-3 pr-3 pb-3 pt-1">
                    <a href="index.html" className="logo logo-admin">
                      <img src={loginImg} height="85" alt="logo" className="auth-logo" />
                    </a>
                    <h4 className="mt-1 mb-1 font-weight-semibold text-white font-18">CANVENDOR </h4>
                  </div>
                </div>
                <div className="card-body p-0">
                  <ul className="nav-border nav nav-pills" role="tablist">
                    <li className="nav-item">
                      <a className="nav-link active font-weight-semibold" >Sign in</a>
                    </li>
                  </ul>

                  <div className="tab-content">
                    <div className="tab-pane active p-3" id="LogIn_Tab" role="tabpanel">
                      <LoginForm />
                         {/* <div className="m-3 text-center text-muted">
                        <p className="mb-0"></p>
                      </div>
                      <div className="account-social">
                        <h6 className="mb-3">HMS</h6>
                      </div>
                  
                      <div className="btn-group btn-block">
                        <button type="button" className="btn btn-sm btn-outline-secondary">Facebook</button>
                        <button type="button" className="btn btn-sm btn-outline-secondary">Twitter</button>
                        <button type="button" className="btn btn-sm btn-outline-secondary">Google</button>
                      </div>*/}
                    </div>

                  </div>
                </div>
                <div className="card-body bg-light-alt text-center">
                  <span className="text-muted d-none d-sm-inline-block">Canvendor © {new Date().getFullYear()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
         />
    </div>);
  }
}

export default Login;
