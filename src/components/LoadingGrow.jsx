import React from "react";
//import { toast } from 'react-toastify';
import {
    Container,
    Row,
    Col,
    Spinner
 } from "reactstrap";
import 'react-toastify/dist/ReactToastify.css';
class LoadingGrow extends React.Component {
    render(){ return <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
         <Container fluid>
            <div className="header-body">
               <Row>
                  <Col lg="12" xl="12"><center><Spinner style={{ width: '3rem', height: '3rem' }} type="grow" /></center>
                  </Col>
               </Row>
            </div>
         </Container>
      </div>;}
}
export default LoadingGrow;