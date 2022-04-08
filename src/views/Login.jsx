import React, { Component } from "react";
import { loginUrl } from "../variables/Variables.jsx";
import Cookies from 'universal-cookie';
import Swal from 'sweetalert2';

import LoadingBar from 'react-top-loading-bar'

const axios = require("axios").default;
const cookies = new Cookies();

class Login extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: true,
            loginState: false,
            userId: "",
            userName: "",
            userPassword: "",
            progressTimer: 0
        };
        this.handleInput = this.handleInput.bind(this);
        this.validateLogin = this.validateLogin.bind(this);
        this.checkLogin = this.checkLogin.bind(this);
    }
    checkLogin() {
        const authToken = cookies.get('canAuthToken');

        if (typeof authToken !== "undefined") {
            var cookies_ = (authToken).split("==");
            // alert("Valid")
            window.location.href = "../" + cookies_[1] + "/dashboard";
            return;
        }

    }

    handleInput(event) {
        this.setState({
            [event.target.name]: event.target.value
        });

    }

    validateLogin(event) {
        var thisObj = this;
        var ptTimer = 0;
        var inter = setInterval(function () {
            ptTimer = ptTimer + 8;
            if (ptTimer <= 90)
                thisObj.setState({ progressTimer: ptTimer });
        }, 100);

        axios.post(loginUrl, {
            userName: this.state.userName,
            userPassword: this.state.userPassword,
        }).then(function (res) {
            if (res.data.statusResponse === true) {
                //this.showAlert("br","success","Candidate created successsfully","pe-7s-check");
                //alert("Candidate created successfully"); 
                //setTimeout(()=>this.props.history.push("../admin/candidates"),  1200);
                let d = new Date();
                d.setTime(d.getTime() + (d.getMinutes() * 120 * 1000));
                //var expiryDate = "expires="+ d.toUTCString();
                //var expiryDate = new Date(Number(new Date()) + 315360000000);
                cookies.set('canAuthToken', res.data.token + "==" + res.data.usertype + "==" + res.data.username, { path: '/', expires: d });
                cookies.set('c_csrftoken', res.data.token, { path: '/', expires: d });
                window.sessionStorage.setItem("userId", res.data.userId);

                Swal.fire({
                    icon: 'success',
                    title: res.data.message + " Please wait you will be redirected in a moment",
                    html: '',
                    timer: 600,
                    timerProgressBar: true,
                    onBeforeOpen: () => {
                    },
                    onClose: () => {
                        clearInterval(inter)
                    }
                }).then((result) => {
                    /* Read more about handling dismissals below */
                    if (res.data.statusResponse === true && result.isDismissed) {
                        window.location.href = "../admin/dashboard";
                    }
                });
            } else {
                thisObj.setState({ progressTimer: 100 });
                clearInterval(inter)
                Swal.fire('Oops...', res.data.message, 'error');
            }
        }).catch(function (err) {
            thisObj.setState({ progressTimer: 100 });
            clearInterval(inter)
            Swal.fire('Oops...', "Try again later", 'error');
        })
    }
    render() {
        this.checkLogin();
        return (<><LoadingBar
            color='#1761fd'
            progress={this.state.progressTimer}
            onLoaderFinished={0}
        /><form className="form-horizontal auth-form">
            {window.location.pathname!=="/login"?<div className="row justify-center">Please login to continue</div>:""}
                <div className="form-group mb-2">
                    
                    <label htmlFor="username">Username</label> 
                    <div className="input-group">
                        <input type="text" className="form-control" onChange={this.handleInput} name="userName" id="username" placeholder="Enter username" />
                    </div>
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="userpassword">Password</label>
                    <div className="input-group">
                        <input type="password" className="form-control" onChange={this.handleInput} name="userPassword" id="userpassword" placeholder="Enter password" onKeyDown={(e) => { if (e.key === 'Enter') { this.validateLogin() } }} />
                    </div>
                </div>
                <div className="form-group row my-3">
                    <div className="col-sm-6">
                        <div className="custom-control custom-switch switch-success">
                            <input type="checkbox" className="custom-control-input" id="customSwitchSuccess" />
                            <label className="custom-control-label text-muted" htmlFor="customSwitchSuccess">Remember me</label>
                        </div>
                    </div>
                    <div className="col-sm-6 text-right">
                        <a href="" className="text-muted font-13"><i className="dripicons-lock"></i> Forgot password?</a>
                    </div>
                </div>
                <div className="form-group mb-0 row">
                    <div className="col-12">
                        <button onClick={this.validateLogin} className="btn btn-primary btn-block waves-effect waves-light" type="button">Log In <i className="fas fa-sign-in-alt ml-1"></i></button>
                    </div>
                </div>
            </form></>);
    }
}

export default Login;
