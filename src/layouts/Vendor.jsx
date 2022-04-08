import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import NotificationSystem from "react-notification-system";
import AdminNavbar from "components/Navbars/AdminNavbar";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";
import { style, logourl } from "variables/Variables";
import routes from "routes.js";
import Cookies from 'universal-cookie';
import userImage from "assets/images/brand-logo/blue.png";
import { browserHistory } from 'react-router';
import AdminFooter from "components/Footer/Footer.jsx";
import image from "assets/images/brand-logo/blue.png";
import { Container } from "reactstrap";
import classNames from "classnames";
const axios = require("axios").default;
const cookies = new Cookies();


class Vendor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: image,
      color: "black",
      hasImage: true,
      fixedClasses: "dropdown show-dropdown open",
      toggleSidebar: false,
      userType: ""
    };
  }

  handleNotificationClick = position => {
  };
  getRoutes = routes => {
    //visibility
    return routes.map((prop, key) => {
      if (prop.layout === "/vendor") {
        return (
          <Route
            path={prop.layout + prop.path}
            render={props => (
              <prop.component {...props} handleClick={this.handleNotificationClick} />
            )}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  getBrandText = path => {
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
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
    /*document.body.classList.remove('g-sidenav-pinned');
    var currentToken = cookies.get('canAuthToken');
    if(!currentToken){
       window.location.href="../login/login"; 
       return;
      }*/
    if (typeof cookies.get('canAuthToken') === "undefined") {
      window.location.href = "../login"
    }
    var cookies_ = (cookies.get('canAuthToken')).split("==");

    this.setState({ userType: cookies_[1] });

    document.body.classList.remove('bg-default');
  }

  componentDidUpdate(e) {
    if (
      window.innerWidth < 993) {
      // document.documentElement.classList.toggle("nav-opens");
    } else {

    }
    document.body.classList.remove('bg-default');

  }
  hideSideBar = (event) => {
    //console.log(document.body.classList);
    if (event.target.classList[0] != "togglebutton") {
      document.body.classList.forEach(element => {
        if (element == "g-sidenav-pinned") {
          document.body.classList.remove('g-sidenav-pinned');
        }
      });
    }
  }
  render() {
    const sidebarIsOpen = true, setSidebarOpen = true;
    const toggleSidebar = () => setSidebarOpen(!sidebarIsOpen);
    if (this.state.userType == "") return "";
    return <>{(this.state.userType) !== "vendor" ? window.location.href = "../" + this.state.userType + "/dashboard" : <>
      <AdminNavbar
        {...this.props} routes={routes}
        brandText={this.getBrandText(window.location.pathname)} userImage={logourl}
      />
      <div className="page-wrapper">
        <div className="page-content">
          <div className="container-fluid">
            <div className="main-content" ref="mainContent" id="panel" onClick={this.hideSideBar}>
              <Switch>{this.getRoutes(routes)} <Redirect from="*" to="/vendor/dashboard" /></Switch>
              <Container fluid className={classNames("content", { "is-open": this.state.toggleSidebar })} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>}</>
  }
}
export default Vendor;