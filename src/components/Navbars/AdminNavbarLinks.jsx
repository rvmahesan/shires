import React, { Component } from "react";
import { Navbar, NavItem, Nav, NavDropdown, MenuItem, Dropdown } from "react-bootstrap";
import Cookies from 'universal-cookie';
const cookies = new Cookies();

class AdminNavbarLinks extends Component {

  constructor(props) {
    super(props);
    this.state = { userProfileClasses: "dropdown-menu  dropdown-menu-right", userNotificationClasses: "dropdown-menu dropdown-menu-xl dropdown-menu-right py-0 overflow-hidden" };
    this.handleLogout = this.handleLogout.bind(this);
    this.showUserProfile = this.showUserProfile.bind(this);
    this.showUserNotofications = this.showUserNotofications.bind(this);
    this.hideUserNotifications = this.hideUserNotifications.bind(this);
    this.toggleMainMenu = this.toggleMainMenu.bind(this);
  }

  handleLogout = (event) => {
    var expiryDate = new Date(Number(new Date()) + -315360000000);
    cookies.set('canAuthToken', "", { path: '/', expires: expiryDate });
    window.location.href = "../login";

  }
  toggleMainMenu = (event) => {
    document.body.classList.toggle('g-sidenav-pinned');
  }
  showUserProfile = (event) => {
    this.setState({ userNotificationClasses: "dropdown-menu dropdown-menu-xl dropdown-menu-right py-0 overflow-hidden" });
    if (this.state.userProfileClasses == "dropdown-menu  dropdown-menu-right show") {
      if (event.target.name != "userDrop") {
        setTimeout(() => {
          this.setState({ userProfileClasses: "dropdown-menu  dropdown-menu-right" });
        }, 800);
      }
    } else {
      this.setState({ userProfileClasses: "dropdown-menu  dropdown-menu-right show" });
    }
  }
  showUserNotofications = (event) => {
    this.setState({ userProfileClasses: "dropdown-menu  dropdown-menu-right" });
    if (this.state.userNotificationClasses == "dropdown-menu dropdown-menu-xl dropdown-menu-right py-0 overflow-hidden show") {
      setTimeout(() => {
        this.setState({ userNotificationClasses: "dropdown-menu dropdown-menu-xl dropdown-menu-right py-0 overflow-hidden" });
      }, 200);

    } else {
      this.setState({ userNotificationClasses: "dropdown-menu dropdown-menu-xl dropdown-menu-right py-0 overflow-hidden show" });
    }
  }
  hideUserNotifications = (event) => {
    setTimeout(() => {
      this.setState({ userNotificationClasses: "dropdown-menu dropdown-menu-xl dropdown-menu-right py-0 overflow-hidden" });
    }, 800);

  }

  render() {
    const notification = (
      <div>
        <i className="fa fa-globe" />
        <b className="caret" />
        <span className="notification">1</span>
        <p className="hidden-lg hidden-md">Notification</p>
      </div>
    );
    return (
      <nav className="navbar navbar-top navbar-expand navbar-dark bg-primary border-bottom navPreHeader">
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav align-items-center ml-auto ml-md-auto ">
              <li className="nav-item dropdown notificationList">
                <a className="nav-link" href="#" role="button" onMouseEnter={this.showUserNotofications} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i className="ni ni-bell-55"></i>
                </a>
                <div className={this.state.userNotificationClasses} onMouseLeave={this.hideUserNotifications}>
                  <div className="px-3 py-3">
                    <h6 className="text-sm text-muted m-0">You have <strong className="text-primary">0</strong> notifications.</h6>
                  </div>
                  <div className="list-group list-group-flush">
                    <a href="#!" className="list-group-item list-group-item-action">
                      <div className="row align-items-center">
                        <div className="col-auto">
                          <img alt="Image placeholder" src={this.props.userImage} className="avatar rounded-circle" />
                        </div>
                        <div className="col ml--2">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h4 className="mb-0 text-sm">Admin</h4>
                            </div>
                            <div className="text-right text-muted">
                              <small>2 hrs ago</small>
                            </div>
                          </div>
                          <p className="text-sm mb-0">Let's meet at Starbucks at 11:30. Wdyt?</p>
                        </div>
                      </div>
                    </a>
                  </div>
                  <a href="#!" className="dropdown-item text-center text-primary font-weight-bold py-3">View all</a>
                </div>
              </li>
            </ul>
            <ul className="navbar-nav align-items-center userProfileList ml-md-0 ">
              <li className="nav-item dropdown">
                <a className="nav-link pr-0" href="#" role="button" name="userDrop" onMouseEnter={this.showUserProfile} >
                  <div className="media align-items-center">
                    <span className="avatar avatar-sm rounded-circle">
                    </span>
                    <div className="media-body  ml-2  d-none d-lg-block">
                      <span className="mb-0 text-sm  font-weight-bold">Admin</span>
                    </div>
                  </div>
                </a>
                <div className={this.state.userProfileClasses} name="userDropMenu" onMouseLeave={this.showUserProfile}>
                  <div className="dropdown-header noti-title">
                    <h6 className="text-overflow m-0">Welcome!</h6>
                  </div>
                  <a href="#!" className="dropdown-item">
                    <i className="ni ni-single-02"></i>
                    <span>My profile</span>
                  </a>
                  <div className="dropdown-divider"></div>
                  <a onClick={this.handleLogout} className="dropdown-item">
                    <i className="ni ni-user-run"></i>
                    <span>Logout</span>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>);
  }
}

export default AdminNavbarLinks;

/* <div>
        <Nav>
          <NavDropdown
            eventKey={2}
            title={notification}
            noCaret
            id="basic-nav-dropdown">
            <MenuItem eventKey={2.1}>Notification 1</MenuItem>
          </NavDropdown>
        </Nav>
        <Nav pullRight>
          <NavDropdown
            eventKey={2}
            title="Dropdown"
            id="basic-nav-dropdown-right"
          >
            <MenuItem eventKey={2.1}>Action</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey={2.5}>Separated link</MenuItem>
          </NavDropdown>
          <NavItem eventKey={3} onClick={this.handleLogout} >
            Log out
          </NavItem>
        </Nav>
      </div>
*/
