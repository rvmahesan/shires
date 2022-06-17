import axios from 'axios';
import React from 'react';
import { Spinner } from 'reactstrap';

class IFrame extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: true,
        pageContents:null,
      };
      document.body.style.cursor='wait';
    }
  hideSpinner = () => {
      this.setState({
        loading: false
      });
      document.body.style.cursor='default';
    };
  loadContents = ()=>{
    axios.get(this.props.src)
    .then(res=>res.data)
    .then(pagedata=>{
      document.body.style.cursor='default';
      this.setState({pageContents:pagedata,loading:false});
    })
  }
  componentDidMount(){
    this.loadContents();
  }
  render() {
      return (
        <div >
          {this.state.loading? (<>

          <div className='center-load' >
            <Spinner style={{ width: '5rem', height: '5rem',marginTop:"30%"}} />
            <br/>
            <small  style={{ width: '5rem', height: '5rem' }} >generating preview</small></div></>
          ) : 
        <div className="embed-responsive embed-responsive-16by9 res_contents" style={{height:"88vh"}} dangerouslySetInnerHTML={{__html:this.state.pageContents}}>
      
          </div>}
        </div>
      );
    }
  }
  export default IFrame;