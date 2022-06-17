
import axios from "axios";
import { useState } from "react";

import { apiUrl } from "../variables/Variables";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const ValidateLogin = () =>{
    const [cookieDetails] = useState(cookies.get("c_csrftoken"));
    if(cookieDetails!=="undefined" || cookieDetails !=="" || cookieDetails !== null){
        axios.get(apiUrl+"authorizeLogin",{params:{sess_id:cookies.get('c_csrftoken')}})
        .then(res=>res.data)
        .then(({statusResponse}) => {
            //alert(res.statusResponse);
            if(!statusResponse)
                window.location.assign("./login");
            else
                window.location.assign("./admin/dashboard");
        });
    }else{
        window.location.assign("./login");
    }
}
export default ValidateLogin;