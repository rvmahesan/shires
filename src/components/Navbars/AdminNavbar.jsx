import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Nav,
  Media,
} from "reactstrap";
import Cookies from 'universal-cookie';
import brandImg from "../../assets/images/leftLogo_3.png";
import user5 from "../../assets/images/loginImg.png";


const cookies = new Cookies();

class AdminNavbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = { userProfileClasses: "dropdown-menu  dropdown-menu-right", userNotificationClasses: "dropdown-menu dropdown-menu-xl dropdown-menu-right py-0 overflow-hidden" };
    this.handleLogout = this.handleLogout.bind(this);
    this.toggleSideBar = this.toggleSideBar.bind(this);
    this.activeRoute = this.activeRoute.bind(this);
  }
  toggleSideBar = () => { };
  handleLogout = (event) => {
    var expiryDate = new Date(Number(new Date()) + 2592000);
    document.cookie = 'canAuthToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    cookies.remove('canAuthToken', "", { path: '/', expires: expiryDate });
    //c_csrftoken
    cookies.remove('c_csrftoken', "", { path: '/', expires: expiryDate });
    document.cookie = 'c_csrftoken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = "../login";
    window.sessionStorage.setItem("userId", "");
  }

  getUserType() {
    var cookieArr = document.cookie.split(";");

    // Loop through the array elements
    for (var i = 0; i < cookieArr.length; i++) {
      var cookiePair = cookieArr[i].split("=");

      /* Removing whitespace at the beginning of the cookie name
      and compare it with the given string */
      if ("canAuthToken" === cookiePair[0].trim()) {
        // Decode the cookie value and return
        var cookies_ = decodeURIComponent(cookiePair[1]).split("==");
        return cookies_[1];
      }
    }
  }
  activeRoute(prop1) {
    if (prop1 === window.location.pathname)
      return true;
    else
      return false;
  }

  render() {
    document.body.classList.remove('accountbg');
    document.body.classList.remove('account-body');
    if(typeof this.props === undefined)
      window.location.reload();
    return (
      <>
        <div className="topbar">



          <nav className="w-100 navbar-custom navbar-custom-menu navbar navbar-expand-md navbar-light bg-light">
            <div className="navbar-brand">
              <div className="brand mr-3 pl-3 d-sm-none d-md-block d-none d-sm-block" style={{ backgroundColor: "transparent" }}>
                <Link to="../admin/dashboard" className="logo">
                  <span>
                    <img src={brandImg} className="logo-sm" />
                  </span>
                </Link>
              </div>
            </div>
            <button aria-label="Toggle navigation" type="button" className="navbar-toggler">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse">
              <ul className="navigation-menu ml-auto w-100 float-left navbar-nav">
                {/* Loop start*/}
                {this.props.routes.map((prop, key) => {
                  if (!prop.redirect)
                    if (prop.visibility == this.getUserType()) {
                      return (
                        <li
                          className={this.activeRoute(prop.layout + prop.path) ? "has-submenu active"
                            : "has-submenu "
                          }
                          key={key}>
                          <NavLink
                            to={prop.layout + prop.path}
                            className={(navData) => (navData.isActive ? "active-style" : 'none')}
                            activeclassname="active">
                            <span dangerouslySetInnerHTML={{ __html: prop.svgCode + "<span class='menu-text'>" + prop.name+"</span>" }}>
                            </span>
                          </NavLink>
                          {prop.submenu.length>=1?
                        <ul className="submenu">
                          {prop.submenu.map((prop, key) =>{ return <li key={key}><a href={prop.layout + prop.path}><i className="ti ti-minus"></i>{prop.name}</a></li>})}
                        </ul>:""}
                        </li>
                      );
                    }

                  return null;
                })}

              </ul>
            </div>



            <Nav className="list-unstyled topbar-nav float-right mb-0">

              <UncontrolledDropdown nav className="float-right">
                <DropdownToggle className="pr-0" nav>
                  <Media className="align-items-center">

                    <Media className="ml-2 d-none d-lg-block">
                      <span className="pr-2">Admin</span>
                      <span className="mb-0 text-sm font-weight-bold ml-1 nav-user-name hidden-sm">

                        <img src={user5} alt="profile-user" className="rounded-circle thumb-sm" />
                      </span>
                    </Media>
                  </Media>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" end>
                  <DropdownItem className="noti-title" header tag="div">
                    <h6 className="text-overflow m-0">Welcome!</h6>
                  </DropdownItem>
                  <DropdownItem to="../admin/myprofile" tag={Link}>
                    <i className="ni ni-single-02" />
                    <span>My profile</span>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem tag={Link} to="" onClick={this.handleLogout}>
                    <i className="ni ni-user-run" />
                    <span>Logout</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>


          </nav>
        </div>
        {/*<ul className="list-unstyled topbar-nav float-right mb-0"> */}
        {/* <NavbarToggler aria-controls="basic-navbar-nav" /> 
         <Collapse id="basic-navbar-nav"></Collapse>
        <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
          <Container fluid>
            <Link
              className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
              to="/"
            >{this.props.brandText}
            </Link>
          </Container>
        </Navbar>*/}
      </>
    );
  }
}
export default AdminNavbar;
/*
{*<AdminTopNavbarLinks userImage={this.props.userImage}/> *}*/