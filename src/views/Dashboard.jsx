import React from "react";
//import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

class Dashboard extends React.Component {
    render() {
        return (
            <><div className="row">
                <div className="col-sm-12">
                    <div className="page-title-box">
                        <div className="row">
                            <div className="col">
                                <h4 className="page-title">Dashboard</h4>
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a >Dashboard</a></li>
                                </ol>
                            </div>
                            <div className="col-auto align-self-center">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
                <div className="header bg-gradient-info pb-8 ">
                    <div className="row justify-content-center">
                        <div className="col-md-6 col-lg-3">
                            <div className="card report-card">
                                <div className="card-body">
                                    <div className="row d-flex justify-content-center">
                                        <div className="col">
                                            <p className="text-dark mb-0 font-weight-semibold">Sessions</p>
                                            <h3 className="m-0">24k</h3>
                                            <p className="mb-0 text-truncate text-muted"><span className="text-success"><i className="mdi mdi-trending-up"></i>8.5%</span> New Sessions Today</p>
                                        </div>
                                        <div className="col-auto align-self-center">
                                            <div className="report-main-icon bg-light-alt">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users align-self-center text-muted icon-sm"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="card report-card">
                                <div className="card-body">
                                    <div className="row d-flex justify-content-center">
                                        <div className="col">
                                            <p className="text-dark mb-0 font-weight-semibold">Avg.Sessions</p>
                                            <h3 className="m-0">00:18</h3>
                                            <p className="mb-0 text-truncate text-muted"><span className="text-success"><i className="mdi mdi-trending-up"></i>1.5%</span> Weekly Avg.Sessions</p>
                                        </div>
                                        <div className="col-auto align-self-center">
                                            <div className="report-main-icon bg-light-alt">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-clock align-self-center text-muted icon-sm"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="card report-card">
                                <div className="card-body">
                                    <div className="row d-flex justify-content-center">
                                        <div className="col">
                                            <p className="text-dark mb-0 font-weight-semibold">Bounce Rate</p>
                                            <h3 className="m-0">$2400</h3>
                                            <p className="mb-0 text-truncate text-muted"><span className="text-danger"><i className="mdi mdi-trending-down"></i>35%</span> Bounce Rate Weekly</p>
                                        </div>
                                        <div className="col-auto align-self-center">
                                            <div className="report-main-icon bg-light-alt">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-activity align-self-center text-muted icon-sm"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="card report-card">
                                <div className="card-body">
                                    <div className="row d-flex justify-content-center">
                                        <div className="col">
                                            <p className="text-dark mb-0 font-weight-semibold">Goal Completions</p>
                                            <h3 className="m-0">85000</h3>
                                            <p className="mb-0 text-truncate text-muted"><span className="text-success"><i className="mdi mdi-trending-up"></i>10.5%</span> Completions Weekly</p>
                                        </div>
                                        <div className="col-auto align-self-center">
                                            <div className="report-main-icon bg-light-alt">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-briefcase align-self-center text-muted icon-sm"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Dashboard;
