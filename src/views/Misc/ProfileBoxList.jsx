import React, { Component } from "react";
import ProfileBox from "../../views/Misc/ProfileBox";
import {
  Container,
  Row,
  Card,
} from "reactstrap";

//import { Grid, Row, Col, Table } from "react-bootstrap";
//import Card from "components/Card/Card.jsx";
//import { thArray, tdArray } from "variables/Variables.jsx";
 {/*Col,
  UncontrolledTooltip,
  Badge,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
Table,*/}

class ProfileBoxList extends Component {
  constructor(props){
    super(props);
    this.selectProfiles = this.selectProfiles.bind(this);
    this.state = { selectedProfiles:[] };
    this.viewResume = this.viewResume.bind(this);
  }
  selectProfiles(id,e){
    this.props.selectProfiles(id,e);
  }
  viewResume(id,e){
    this.props.viewResume(id,e);
  }
  render() {
    let thisObj = this;
    return this.props.options.length !== 0?( <>
         {this.props.options.map((obj,i)=>{
          return <ProfileBox key={i} selectedProfiles={thisObj.props.selectedProfiles} viewResume={thisObj.viewResume} selectProfiles={thisObj.selectProfiles} options={obj}/>
        })}</>
    ):(<Container className="mt-3" fluid>
    <Row>
      <div className="col">
        <Card className="shadow p-3">
              <span><b> No  </b> Profiles Found</span>
       </Card></div></Row></Container>);
  }
}
export default ProfileBoxList;
/*    {this.props.options.map(option => {
          return <Col md={12}>{option.firstName}
            <ProfileBox/>
            </Col>

          {this.props.options.map(option => {
          return <Col md={12}>
            <ProfileBox/>
            </Col>
        })}
        */
