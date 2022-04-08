import React from "react";
import { Link } from "react-router-dom";
import {
  NavbarBrand,
  Navbar,
  Container,
} from "reactstrap";

class AuthNavBar extends React.Component {
  render() {
    return (
      <>
        <Navbar
          className="navbar-top navbar-horizontal navbar-dark"
          expand="md">
          <Container className="px-4 pt-3">
            <NavbarBrand to="/" tag={Link}>
              <img alt="..." src={require("assets/images/brand-logo/canvendor.png")} />
            </NavbarBrand>
          </Container>
        </Navbar>
      </>
    );
  }
}

export default AuthNavBar;
