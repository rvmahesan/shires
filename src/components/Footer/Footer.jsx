import React from "react";
class Footer extends React.Component {
  render() {
    return (<footer className="footer text-center text-sm-left">
      <div className="page-wrapper pt-0">
    &copy;  {new Date().getFullYear()}{" "} <span className="d-none d-sm-inline-block float-right">SuccessHires<i className="mdi mdi-heart text-danger"></i> by Canvendor Inc</span></div>
</footer>);
  }
}
export default Footer;
