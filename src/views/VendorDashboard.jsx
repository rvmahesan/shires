import React from "react";
//import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

import Cookies from 'universal-cookie';
import { apiUrl, cookieDomain } from "../variables/Variables";
const axios = require("axios").default;
const cookies = new Cookies();

class VendorDashboard extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            activeUsers: null,
            activeUsersCount: 0,
            results: null
        };
        this.getUserType = this.getUserType.bind(this);
    }


    getUserType = () => {
        var cookieArr = cookies.get("canAuthToken");
        if (typeof cookieArr !== "undefined") {
            var cookiePair = cookieArr.split("==");
            return cookiePair[1];
        } else {
            return "";
        }
    }


    componentDidMount() {
        if (this.getUserType() == "admin") {
            axios.get(apiUrl + "getDashboardDetails").then(({ data }) => {
                if (data.statusResponse) {
                    /*{"statusResponse": true, "activeUsers": ["berin", "sajeetha", "berin", "canadmin", "priya"], "activeUsersCount": 5, "results": {"totalUsers": ["admin", "priya", "sajeetha", "mala"], "skills": [10, 13, 4, 10], "education": [2, 20, 6, 23], "experience": [10, 63, 32, 46]}}*/
                    this.setState({ activeUsers: data.activeUsers, activeUsersCount: data.activeUsersCount, results: data.results });
                    console.log(this.state.results);
                }
            }).catch(({ err }) => {

            });
        }
    }
    render() {
        let userType = this.getUserType();
        let thisObj = this;
        return <div className="row">
            <div className="col-sm-12">
                <div className="page-title-box">
                    <div className="row">
                        <div className="col">
                            <h4 className="page-title">Dashboard</h4>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a >Dashboard - Vendor</a></li>
                            </ol>
                        </div>
                        <div className="col-auto align-self-center">

                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default VendorDashboard;
