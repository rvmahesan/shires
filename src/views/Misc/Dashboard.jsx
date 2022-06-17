import React from "react";
//import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { Chart } from "react-google-charts";
 const data = [
    ["Year", "Sales", "Expenses", "Profit"],
    ["2014", 1000, 400, 200],
    ["2015", 1170, 460, 250],
    ["2016", 660, 1120, 300],
    ["2017", 1030, 540, 350],
  ];
  
   const options = {
    chart: {
      title: "Company Performance",
      subtitle: "Sales, Expenses, and Profit: 2014-2017",
    },
  };


  const data2 = [
    [
      "Day",
      "Guardians of the Galaxy",
      "The Avengers",
      "Transformers: Age of Extinction",
    ],
    [1, 37.8, 80.8, 41.8],
    [2, 30.9, 69.5, 32.4],
    [3, 25.4, 57, 25.7],
    [4, 11.7, 18.8, 10.5],
    [5, 11.9, 17.6, 10.4],
    [6, 8.8, 13.6, 7.7],
    [7, 7.6, 12.3, 9.6],
    [8, 12.3, 29.2, 10.6],
    [9, 16.9, 42.9, 14.8],
    [10, 12.8, 30.9, 11.6],
    [11, 5.3, 7.9, 4.7],
    [12, 6.6, 8.4, 5.2],
    [13, 4.8, 6.3, 3.6],
    [14, 4.2, 6.2, 3.4],
  ];
  
   const options2 = {
    chart: {
      title: "Box Office Earnings in First Two Weeks of Opening",
      subtitle: "in millions of dollars (USD)",
    },
  };

  const data3 = [
    ["Year", "Sales", "Expenses"],
    ["2004", 1000, 400],
    ["2005", 1170, 460],
    ["2006", 660, 1120],
    ["2007", 1030, 540],
  ];
  
   const options3 = {
    title: "Company Performance",
    curveType: "function",
    legend: { position: "bottom" },
  };

  const data4 = [
    ["Task", "Hours per Day"],
    ["Work", 11],
    ["Eat", 2],
    ["Commute", 2],
    ["Watch TV", 2],
    ["Sleep", 7],
  ];
  
   const options4 = {
    title: "My Daily Activities",
  };

  

class Dashboard extends React.Component {
    render() {
        return (
            <><div className="row">
                <div className="col-sm-12">
                    <div className="page-title-box dashboard-page-box">
                        <div className="row">
                            <div className="col">
                                <h4 className="page-title">
                                    <div className="iconbg float-left"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-home align-self-center hori-menu-icon"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                                    </div>
                                    <div className="bradcum-text ">
                                        DASHBOARD
                                    </div>
                                    <small className="bradcum-small">Admin Dashboard</small>
                                    </h4>
                               
                            </div>
                           {/* <Chart
                                        chartType="Bar"
                                        width="100%"
                                        height="400px"
                                        data={data}
                                        options={options}
        />*/}
                        </div>
                    </div>
                </div>
            </div>
                <div className="header bg-gradient-info pb-8 ">
                    <div className="row justify-content-center">
                    <div className="col-md-12 col-lg-12">
                            <div className="card report-card my-shadow">

                            <div className="card-header">
                                    <div className="row align-items-center">
                                        <div className="col">                      
                                            <h4 className="card-title">Job Details</h4>                   
                                        </div>
                                    </div>                                  
                                </div>

                                <div className="card-body">
                                    <div className="row d-flex justify-content-center">
                                       
                                    <Chart
                                        chartType="Bar"
                                        width="100%"
                                        height="400px"
                                        data={data}
                                        options={options}
        />
                                    </div>
                                </div>
                            </div>
                        </div>



                        <div className="col-md-6 col-lg-6">
                            <div className="card report-card  my-shadow">

                            <div className="card-header">
                                    <div className="row align-items-center">
                                        <div className="col">                      
                                            <h4 className="card-title">Job Status Graph</h4>                   
                                        </div>
                                    </div>                                  
                                </div>


                                <div className="card-body">
                                    <div className="row d-flex justify-content-center">
                                       
                                        <Chart
                                            chartType="Line"
                                            width="100%"
                                            height="400px"
                                            data={data2}
                                            options={options2}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-6">
                            <div className="card report-card  my-shadow">

                            <div className="card-header">
                                    <div className="row align-items-center">
                                        <div className="col">                      
                                            <h4 className="card-title">Applicants by Source</h4>                   
                                        </div>
                                    </div>                                  
                                </div>


                                <div className="card-body">
                                    <div className="row d-flex justify-content-center">
                                    <Chart
      chartType="LineChart"
      width="100%"
      height="400px"
      data={data3}
      options={options}
    />
                                   
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-6">
                            <div className="card report-card">

                            <div className="card-header">
                                    <div className="row align-items-center">
                                        <div className="col">                      
                                            <h4 className="card-title">Recruitment Activity - By Team</h4>                   
                                        </div>
                                    </div>                                  
                                </div>


                                <div className="card-body">
                                    <div className="row d-flex justify-content-center">
                                       <table className="table table-bordered">
                                        <tbody><tr role="row" className="odd"><td>Prabal Bhadauriya</td><td className=" text-align-right">0</td><td className=" text-align-right">0</td><td className=" text-align-right">0</td><td className=" text-align-right">0</td></tr><tr role="row" className="even"><td>Spurgeon Birla Singh</td><td className=" text-align-right">0</td><td className=" text-align-right">0</td><td className=" text-align-right">0</td><td className=" text-align-right">0</td></tr><tr role="row" className="odd"><td>Peter Manoj</td><td className=" text-align-right">0</td><td className=" text-align-right">0</td><td className=" text-align-right">0</td><td className=" text-align-right">0</td></tr><tr role="row" className="even"><td>Suganya Thirumalaisamy</td><td className=" text-align-right">0</td><td className=" text-align-right">0</td><td className=" text-align-right">0</td><td className=" text-align-right">0</td></tr><tr role="row" className="odd"><td>Vishnu SL</td><td className=" text-align-right">0</td><td className=" text-align-right">0</td><td className=" text-align-right">0</td><td className=" text-align-right">0</td></tr><tr role="row" className="even"><td>Felix Gibson</td><td className=" text-align-right">0</td><td className=" text-align-right">0</td><td className=" text-align-right">0</td><td className=" text-align-right">0</td></tr><tr role="row" className="odd"><td>Steffy Manju</td><td className=" text-align-right">0</td><td className=" text-align-right">0</td><td className=" text-align-right">0</td><td className=" text-align-right">0</td></tr><tr role="row" className="even"><td>Petchiammal Murugan</td><td className=" text-align-right">0</td><td className=" text-align-right">0</td><td className=" text-align-right">0</td><td className=" text-align-right">0</td></tr><tr role="row" className="odd"><td>Shibu A</td><td className=" text-align-right">0</td><td className=" text-align-right">0</td><td className=" text-align-right">0</td><td className=" text-align-right">0</td></tr><tr role="row" className="even"><td>Gokul Raj N M</td><td className=" text-align-right">0</td><td className=" text-align-right">0</td><td className=" text-align-right">0</td><td className=" text-align-right">0</td></tr></tbody>
                                       </table>
                                   
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-6">
                            <div className="card report-card">

                            <div className="card-header">
                                    <div className="row align-items-center">
                                        <div className="col">                      
                                            <h4 className="card-title">Interviews - By Client</h4>                   
                                        </div>
                                    </div>                                  
                                </div>


                                <div className="card-body">
                                    <div className="row d-flex justify-content-center">
                                    <Chart
      chartType="PieChart"
      data={data4}
      options={options4}
      width={"100%"}
      height={"400px"}
    />
                                   
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
