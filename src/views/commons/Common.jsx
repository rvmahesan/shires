import React, { Component } from "react";

import Cookies from 'universal-cookie';
const cookies = new Cookies();
const axios = require("axios").default;
class Common extends Component {
    /* constructor(props){
         super(props);
         this.getUserType = this.getUserType.bind(this);
     }*/
    getUserType() {
        var cookies_ = decodeURIComponent(cookies.get('canAuthToken')).split("==");
        return cookies_[1];
    };
    getSessionId() {
        return cookies.get("c_csrftoken");
    }
}
export default Common;