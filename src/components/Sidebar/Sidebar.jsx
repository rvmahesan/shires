import React, { useState } from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
// nodejs library to set properties for components
import { PropTypes } from "prop-types";
// reactstrap components
import {
  NavItem,
  NavLink,
} from "reactstrap";
import Cookies from 'universal-cookie';
{/*Nav,
  NavbarToggler,
  Progress,
  Table,
  Container,
  Row,
  Col, Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Media,
  NavbarBrand,
Navbar,*/}
const cookies = new Cookies();
const currentToken = cookies.get('canAuthToken');
const userObj = currentToken ? currentToken.split("==") : null;
var ps;

class Sidebar extends React.Component {

  state = {
    collapseOpen: false,
    usertype: ""
  };
  constructor(props) {
    super(props);
    this.activeRoute.bind(this);


    // if(userObj.length >= 2)
    // this.setState({usertype:userObj[1]});
  }




  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return window.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }
  // toggles collapse between opened and closed (true/false)
  toggleCollapse = () => {
    const [sidebarIsOpen, setSidebarOpen] = useState(true);
    this.setState({
      collapseOpen: !this.state.collapseOpen
    });
  };
  // closes the collapse
  closeCollapse = () => {
    this.setState({
      collapseOpen: false
    });
  };
  // creates the links that appear in the left menu / Sidebar
  createLinks = routes => {
    //if current user is admin then load admin+ recruiter
    if (userObj == null) {
      window.location.href = "../login/login";
      return;
    }
    if (userObj[1] == "admin") {
      return routes.map((prop, key) => {
        if (prop.visibility == "recruiter") {
          if (!prop.redirect)
            return (
              <NavItem key={key}>
                <NavLink
                  to={prop.layout + prop.path}
                  tag={NavLinkRRD}
                  onClick={this.closeCollapse}
                  activeClassName="active"
                >
                  <i className={prop.icon} />
                  {prop.name}
                </NavLink>
              </NavItem>
            );
        }
        if (prop.visibility == "admin") {
          if (!prop.redirect)
            return (
              <NavItem key={key}>
                <NavLink
                  to={prop.layout + prop.path}
                  tag={NavLinkRRD}
                  onClick={this.closeCollapse}
                  activeClassName="active"
                >
                  <i className={prop.icon} />
                  {prop.name}
                </NavLink>
              </NavItem>
            );
        }
      });
    } else if (userObj[1] == "recruiter") {
      return routes.map((prop, key) => {
        if (prop.visibility == "recruiter") {
          if (!prop.redirect)
            return (
              <NavItem key={key}>
                <NavLink
                  to={prop.layout + prop.path}
                  tag={NavLinkRRD}
                  onClick={this.closeCollapse}
                  activeClassName="active"
                >
                  <i className={prop.icon} />
                  {prop.name}
                </NavLink>
              </NavItem>
            );
        }
      });

    }

  };
  render() {
    const { bgColor, routes, logo } = this.props;
    let navbarBrandProps;
    if (logo && logo.innerLink) {
      navbarBrandProps = {
        to: logo.innerLink,
        tag: Link
      };
    } else if (logo && logo.outterLink) {
      navbarBrandProps = {
        href: logo.outterLink,
        target: "_blank"
      };
    }

    return (<></>);
    //{"sidebar sidenav navbar-vertical navbar-expand-xs navbar-light bg-white fixed-left navbar", { "sidebar sidenav navbar-vertical navbar-expand-xs navbar-light bg-white fixed-left navbar is-open": !this.state.collapseOpen}}
  }
}

Sidebar.defaultProps = {
  routes: [{}]
};

Sidebar.propTypes = {
  // links that will be displayed inside the component
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the image src of the logo
    imgSrc: PropTypes.string.isRequired,
    // the alt for the img
    imgAlt: PropTypes.string.isRequired
  })
};

export default Sidebar;

/*
       <ul className="navbar-nav">
          {this.state.width <= 991 ? <AdminNavbarLinks /> : null}
            {this.props.routes.map((prop, key) => {
              if (!prop.redirect)
                return (
                  <li
                    className={
                      prop.upgrade
                        ? this.activeRoute(prop.layout + prop.path)
                        : "nav-item"
                    }
                    key={key}>
                    <NavLink
                      to={prop.layout + prop.path}
                      className="nav-link"
                      activeClassName="active">
                      <i className={prop.icon} />
                      <span className="nav-link-text">{prop.name}</span>
                    </NavLink>
                  </li>
                );
              return null;
            })}
          </ul>


                      src={require("assets/img/theme/team-1-800x800.jpg")*}

    const sidebarBackground = {
      backgroundImage: "url(" + this.props.image + ")"
        <img src={logo} className="navbar-brand-img float-left" alt="Can Hires"/>
    };*/
