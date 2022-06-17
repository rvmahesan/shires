import React from "react";
 const  SearchEmailProfileListing=(props)=>{
    return <div className="card">
    <div className="card-body">
        <h5 className="my-1 font-14">{props.candidateName}</h5>
        <p className="text-muted mb-2">{props.email}</p>
    </div>
</div>

}

export default SearchEmailProfileListing;