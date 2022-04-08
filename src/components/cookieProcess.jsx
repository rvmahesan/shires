import React, { Component } from "react";
import Cookies from 'universal-cookie';
const cookies = new Cookies();


export class cookieProcess extends Component {
  constructor(props, context) {
    super(props, context);

  }
  handleLogout = (event) => {
    window.addEventListener("beforeunload", (e) => {
      e.preventDefault();
      cookies.set('canAuthToken', "", { path: '/', expires: 20000 });
    });
    //  window.location.href= "../login";
    // alert("Hi in cookie process");
  }
  handleLogin = (event, value) => {
    let d = new Date();
    d.setTime(d.getTime() + (d.getMinutes() * 60 * 1000));
    cookies.set('canAuthToken', value, { path: '/', expires: d });
    //   alert("Here");
  }

  render() {
    return;
  }
}

export default cookieProcess;
