import React from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
class successAlert extends React.Component {
  constructor(props,context){
    super(props,context);
  }
  render(){
    return ( toast.success('😋 '+(this.props.title!=''?'':''), {
                position: "top-right",
                autoClose: 1800,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
             })
    );
  }
}
  export default successAlert;