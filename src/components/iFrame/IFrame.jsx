import React from 'react';
import { Spinner } from 'reactstrap';

class IFrame extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: true
      };
      document.body.style.cursor='wait';
    }
  hideSpinner = () => {
      this.setState({
        loading: false
      });
      document.body.style.cursor='default';
    };
  render() {
      return (
        <div >
          {this.state.loading? (<>
            <Spinner style={{ width: '5rem', height: '5rem',marginTop:'8rem',marginLeft:'16rem'  }} />
            <br/>
            <small  style={{ width: '5rem', height: '5rem',marginTop:'8rem',marginLeft:'15.3rem'  }} >generating preview</small></>
          ) : null}
        <div className="embed-responsive embed-responsive-16by9 res_contents">
          <iframe
            title=""
            src={this.props.src}
            width="100%"
            height="700"
            onLoad={this.hideSpinner}
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
          /></div>
        </div>
      );
    }
  }
  export default IFrame;