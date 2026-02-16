// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Card, CardBody, CardHeader, Col, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
// import { bestSellingProducts } from "../../common/data";

// const BestSellingProducts = () => {
//     return (
//         <React.Fragment>
//             <Col xl={6}>
//                 <Card>
//                     <CardHeader className="align-items-center d-flex">
//                         <h4 className="card-title mb-0 flex-grow-1"></h4>
//                         <div className="flex-shrink-0">
//                             <UncontrolledDropdown className="card-header-dropdown">
//                                 <DropdownToggle tag="a" className="text-reset" role="button">
//                                     <span className="fw-semibold text-uppercase fs-12">Sort by: </span><span className="text-muted">Today<i className="mdi mdi-chevron-down ms-1"></i></span>
//                                 </DropdownToggle>
//                                 <DropdownMenu className="dropdown-menu-end">
//                                     <DropdownItem>Today</DropdownItem>
//                                     <DropdownItem>Yesterday</DropdownItem>
//                                     <DropdownItem>Last 7 Days</DropdownItem>
//                                     <DropdownItem>Last 30 Days</DropdownItem>
//                                     <DropdownItem>This Month</DropdownItem>
//                                     <DropdownItem>Last Month</DropdownItem>
//                                 </DropdownMenu>
//                             </UncontrolledDropdown>
//                         </div>
//                     </CardHeader>

//                     <CardBody>
//                         <div className="table-responsive table-card">
//                             <table className="table table-hover table-centered align-middle table-nowrap mb-0">
//                                 <tbody>
//                                     {(bestSellingProducts || []).map((item, key) => (
//                                         <tr key={key}>
//                                             <td>
//                                                 <div className="d-flex align-items-center">
//                                                     <div className="avatar-sm bg-light rounded p-1 me-2">
//                                                         <img src={item.img} alt="" className="img-fluid d-block" />
//                                                     </div>
//                                                     <div>
//                                                         <h5 className="fs-14 my-1"><Link to="/apps-ecommerce-product-details" className="text-reset">{item.label}</Link></h5>
//                                                         <span className="text-muted">{item.date}</span>
//                                                     </div>
//                                                 </div>
//                                             </td>
//                                             <td>
//                                                 <h5 className="fs-14 my-1 fw-normal">${(item.price).toFixed(2)}</h5>
//                                                 <span className="text-muted">Price</span>
//                                             </td>
//                                             <td>
//                                                 <h5 className="fs-14 my-1 fw-normal">{item.orders}</h5>
//                                                 <span className="text-muted">Orders</span>
//                                             </td>
//                                             <td>
//                                                 <h5 className="fs-14 my-1 fw-normal">{item.stock ? item.stock : <span className="badge bg-danger-subtle  text-danger">Out of stock</span>} </h5>
//                                                 <span className="text-muted">Stock</span>
//                                             </td>
//                                             <td>
//                                                 <h5 className="fs-14 my-1 fw-normal">${item.amount}</h5>
//                                                 <span className="text-muted">Amount</span>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>

//                         <div className="align-items-center mt-4 pt-2 justify-content-between row text-center text-sm-start">
//                             <div className="col-sm">
//                                 <div className="text-muted">Showing <span className="fw-semibold">5</span> of <span className="fw-semibold">25</span> Results
//                                 </div>
//                             </div>
//                             <div className="col-sm-auto mt-3 mt-sm-0">
//                                 <ul className="pagination pagination-separated pagination-sm mb-0 justify-content-center">
//                                     <li className="page-item disabled">
//                                         <Link to="#" className="page-link">←</Link>
//                                     </li>
//                                     <li className="page-item">
//                                         <Link to="#" className="page-link">1</Link>
//                                     </li>
//                                     <li className="page-item active">
//                                         <Link to="#" className="page-link">2</Link>
//                                     </li>
//                                     <li className="page-item">
//                                         <Link to="#" className="page-link">3</Link>
//                                     </li>
//                                     <li className="page-item">
//                                         <Link to="#" className="page-link">→</Link>
//                                     </li>
//                                 </ul>
//                             </div>
//                         </div>

//                     </CardBody>
//                 </Card>
//             </Col>
//         </React.Fragment>
//     );
// };

// export default BestSellingProducts;



import React, { useState, useEffect } from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { useSelector, useDispatch } from "react-redux";
import { getPortfolioChartsData } from '../../slices/thunks';

//import Images
import btc from "../../assets/images/svg/crypto-icons/btc.svg";
import eth from "../../assets/images/svg/crypto-icons/eth.svg";
import ltc from "../../assets/images/svg/crypto-icons/ltc.svg";
import dash from "../../assets/images/svg/crypto-icons/dash.svg";

import { PortfolioCharts } from '../DashboardCrypto/DashboardCryptoCharts';
import { createSelector } from 'reselect';

const MyPortfolio = () => {
    const dispatch = useDispatch();

    const [chartData, setchartData] = useState([]);

    const selectDashboardData = createSelector(
        (state) => state.DashboardCrypto,
        (portfolioData) => portfolioData.portfolioData
      );
    // Inside your component
    const portfolioData = useSelector(selectDashboardData);


    useEffect(() => {
        setchartData(portfolioData);
    }, [portfolioData]);

    const [seletedMonth, setSeletedMonth] = useState("Btc");
    const onChangeChartPeriod = pType => {
        setSeletedMonth(pType);
        dispatch(getPortfolioChartsData(pType));
    };

    useEffect(() => {
        dispatch(getPortfolioChartsData("btc"));
    }, [dispatch]);
    return (
        <React.Fragment>
            <div className="col-xxl-3">
                <div className="card card-height-100">
                    <div className="card-header border-0 align-items-center d-flex">
                        <h4 className="card-title mb-0 flex-grow-1">My Portfolio</h4>
                        <div>
                            <UncontrolledDropdown >
                                <DropdownToggle tag="button" className="btn btn-soft-primary btn-sm" >
                                    <span className="text-uppercase">{seletedMonth}<i className="mdi mdi-chevron-down align-middle ms-1"></i></span>
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu dropdown-menu-end">
                                    <DropdownItem onClick={() => { onChangeChartPeriod("btc"); }} className={seletedMonth === "Btc" ? "active" : ""}>BTC</DropdownItem>
                                    <DropdownItem onClick={() => { onChangeChartPeriod("usd"); }} className={seletedMonth === "usd" ? "active" : ""}>USD</DropdownItem>
                                    <DropdownItem onClick={() => { onChangeChartPeriod("euro"); }} className={seletedMonth === "euro" ? "active" : ""}>Euro</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </div>
                    </div>
                    <div className="card-body">
                        <PortfolioCharts series={chartData} dataColors='["--vz-primary", "--vz-info", "--vz-warning", "--vz-success"]' />

                        <ul className="list-group list-group-flush border-dashed mb-0 mt-3 pt-2">
                            <li className="list-group-item px-0">
                                <div className="d-flex">
                                    <div className="flex-shrink-0 avatar-xs">
                                        <span className="avatar-title bg-light p-1 rounded-circle">
                                            <img src={btc} className="img-fluid" alt="" />
                                        </span>
                                    </div>
                                    <div className="flex-grow-1 ms-2">
                                        <h6 className="mb-1">Bitcoin</h6>
                                        <p className="fs-12 mb-0 text-muted"><i className="mdi mdi-circle fs-10 align-middle text-primary me-1"></i>BTC</p>
                                    </div>
                                    <div className="flex-shrink-0 text-end">
                                        <h6 className="mb-1">BTC 0.00584875</h6>
                                        <p className="text-success fs-12 mb-0">${chartData[0]}.12</p>
                                    </div>
                                </div>
                            </li>
                            <li className="list-group-item px-0">
                                <div className="d-flex">
                                    <div className="flex-shrink-0 avatar-xs">
                                        <span className="avatar-title bg-light p-1 rounded-circle">
                                            <img src={eth} className="img-fluid" alt="" />
                                        </span>
                                    </div>
                                    <div className="flex-grow-1 ms-2">
                                        <h6 className="mb-1">Ethereum</h6>
                                        <p className="fs-12 mb-0 text-muted"><i className="mdi mdi-circle fs-10 align-middle text-info me-1"></i>ETH</p>
                                    </div>
                                    <div className="flex-shrink-0 text-end">
                                        <h6 className="mb-1">ETH 2.25842108</h6>
                                        <p className="text-danger fs-12 mb-0">${chartData[1]}.18</p>
                                    </div>
                                </div>
                            </li>
                            <li className="list-group-item px-0">
                                <div className="d-flex">
                                    <div className="flex-shrink-0 avatar-xs">
                                        <span className="avatar-title bg-light p-1 rounded-circle">
                                            <img src={ltc} className="img-fluid" alt="" />
                                        </span>
                                    </div>
                                    <div className="flex-grow-1 ms-2">
                                        <h6 className="mb-1">Litecoin</h6>
                                        <p className="fs-12 mb-0 text-muted"><i className="mdi mdi-circle fs-10 align-middle text-warning me-1"></i>LTC</p>
                                    </div>
                                    <div className="flex-shrink-0 text-end">
                                        <h6 className="mb-1">LTC 10.58963217</h6>
                                        <p className="text-success fs-12 mb-0">${chartData[2]}.58</p>
                                    </div>
                                </div>
                            </li>
                            <li className="list-group-item px-0 pb-0">
                                <div className="d-flex">
                                    <div className="flex-shrink-0 avatar-xs">
                                        <span className="avatar-title bg-light p-1 rounded-circle">
                                            <img src={dash} className="img-fluid" alt="" />
                                        </span>
                                    </div>
                                    <div className="flex-grow-1 ms-2">
                                        <h6 className="mb-1">Dash</h6>
                                        <p className="fs-12 mb-0 text-muted"><i className="mdi mdi-circle fs-10 align-middle text-success me-1"></i>DASH</p>
                                    </div>
                                    <div className="flex-shrink-0 text-end">
                                        <h6 className="mb-1">DASH 204.28565885</h6>
                                        <p className="text-success fs-12 mb-0">${chartData[3]}.84</p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default MyPortfolio;


