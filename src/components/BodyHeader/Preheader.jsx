import React from "react";
import {
    Container,
    Row,
    Col
  } from "reactstrap";
/* constructor(props){
        super(props);
    }*/ 
class Preheader extends React.Component{
    render(){
        return (<div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            <Row> 
              <Col lg="12" xl="12">
              </Col>
            </Row>
          </div>
        </Container>
      </div>);
    }
}
export default Preheader;