import React, { useEffect, useState, useMemo, useCallback } from "react";
import
  {
    Card,
    CardBody,
    Col,
    Container,
    CardHeader,
    Nav,
    NavItem,
    NavLink,
    Row,
    Modal,
    ModalHeader,
    Form,
    ModalBody,
    Label,
    Input,
    FormFeedback
  } from "reactstrap";
import * as moment from "moment";
import { Link } from "react-router-dom";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { isEmpty } from "lodash";

// Formik
import * as Yup from "yup";

const staticOrders = [
  {
    orderId: "#VLZ123",
    customer: "Marcella CHANHOUN",
    product: "Tapis fait main",
    amount: "$120",
    payment: "Carte",
    status: "En attente",
    date: "2025-04-22",
  },
  {
    orderId: "#VLZ124",
    customer: "Alice Johnson",
    product: "Panier artisanal",
    amount: "$80",
    payment: "Paypal",
    status: "Livré",
    date: "2025-04-20",
  },
];

import { useFormik } from "formik";

//redux


//Import actions


import Loader from "../../../Components/Common/Loader";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import { createSelector } from "reselect";

const EcommerceOrderscopy = () =>
{
  const [ modal, setModal ] = useState( false );
  const [ activeTab, setActiveTab ] = useState( "1" );

  

  const selectLayoutState = ( state ) => state.Ecommerce;
  const selectLayoutProperties = createSelector(
    selectLayoutState,
    ( ecom ) => ( {
      orders: ecom.orders,
      isOrderSuccess: ecom.isOrderSuccess,
      error: ecom.error,
    } )
  );
  // Inside your component
  const {
    orders, isOrderSuccess, error
  } = useSelector( selectLayoutProperties )


  const [ orderList, setOrderList ] = useState( [] );
  const [ order, setOrder ] = useState( [] );
  const [ isExportCSV, setIsExportCSV ] = useState( false );





  const productname = [
    {
      options: [
        { label: "Product", value: "Product" },
        { label: "Puma Tshirt", value: "Puma Tshirt" },
        { label: "Adidas Sneakers", value: "Adidas Sneakers" },
        {
          label: "350 ml Glass Grocery Container",
          value: "350 ml Glass Grocery Container",
        },
        {
          label: "American egale outfitters Shirt",
          value: "American egale outfitters Shirt",
        },
        { label: "Galaxy Watch4", value: "Galaxy Watch4" },
        { label: "Apple iPhone 12", value: "Apple iPhone 12" },
        { label: "Funky Prints T-shirt", value: "Funky Prints T-shirt" },
        {
          label: "USB Flash Drive Personalized with 3D Print",
          value: "USB Flash Drive Personalized with 3D Print",
        },
        {
          label: "Oxford Button-Down Shirt",
          value: "Oxford Button-Down Shirt",
        },
        {
          label: "Classic Short Sleeve Shirt",
          value: "Classic Short Sleeve Shirt",
        },
        {
          label: "Half Sleeve T-Shirts (Blue)",
          value: "Half Sleeve T-Shirts (Blue)",
        },
        { label: "Noise Evolve Smartwatch", value: "Noise Evolve Smartwatch" },
      ],
    },
  ];

  const [ isEdit, setIsEdit ] = useState( false );

  const [ deleteModal, setDeleteModal ] = useState( false );
  const [ deleteModalMulti, setDeleteModalMulti ] = useState( false );

  const onClickDelete = ( order ) =>
  {
    setOrder( order );
    setDeleteModal( true );
  };

  const handleDeleteOrder = () =>
  {
    if ( order )
    {
      dispatch( onDeleteOrder( order._id ) );
      setDeleteModal( false );
    }
  };

  useEffect( () =>
  {
    setOrderList( orders );
  }, [ orders ] );

  useEffect( () =>
  {
    if ( !isEmpty( orders ) ) setOrderList( orders );
  }, [ orders ] );

  const toggleTab = ( tab, type ) =>
  {
    if ( activeTab !== tab )
    {
      setActiveTab( tab );
      let filteredOrders = orders;
      if ( type !== "all" )
      {
        filteredOrders = orders.filter( ( order ) => order.status === type );
      }
      setOrderList( filteredOrders );
    }
  };

  // validation
  const validation = useFormik( {
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      orderId: ( order && order.orderId ) || '',
      customer: ( order && order.customer ) || '',
      product: ( order && order.product ) || '',
      orderDate: ( order && order.orderDate ) || '',
      // ordertime: (order && order.ordertime) || '',
      amount: ( order && order.amount ) || '',
      payment: ( order && order.payment ) || '',
      status: ( order && order.status ) || '',
    },
    validationSchema: Yup.object( {
      orderId: Yup.string().required( "Please Enter order Id" ),
      customer: Yup.string().required( "Please Enter Customer Name" ),
      product: Yup.string().required( "Please Enter Product Name" ),
      // orderDate: Yup.string().required("Please Enter Order Date"),
      // ordertime: Yup.string().required("Please Enter Order Time"),
      amount: Yup.string().required( "Please Enter Total Amount" ),
      payment: Yup.string().required( "Please Enter Payment Method" ),
      status: Yup.string().required( "Please Enter Delivery Status" )
    } ),
    onSubmit: ( values ) =>
    {
      if ( isEdit )
      {
        const updateOrder = {
          _id: order ? order._id : 0,
          orderId: values.orderId,
          customer: values.customer,
          product: values.product,
          orderDate: date,
          // ordertime: values.ordertime,
          amount: values.amount,
          payment: values.payment,
          status: values.status
        };
        // update order
        dispatch( onUpdateOrder( updateOrder ) );
        validation.resetForm();
      } else
      {
        const newOrder = {
          _id: ( Math.floor( Math.random() * ( 30 - 20 ) ) + 20 ).toString(),
          orderId: values[ "orderId" ],
          customer: values[ "customer" ],
          product: values[ "product" ],
          orderDate: date,
          // ordertime: values["ordertime"],
          amount: values[ "amount" ],
          payment: values[ "payment" ],
          status: values[ "status" ]
        };
        // save new order
        dispatch( onAddNewOrder( newOrder ) );
        validation.resetForm();
      }
      toggle();
    },
  } );

  useEffect( () =>
  {
    if ( orders && !orders.length )
    {
      dispatch( onGetOrders() );
    }
  }, [ dispatch, orders ] );

  useEffect( () =>
  {
    setOrder( orders );
  }, [ orders ] );

  useEffect( () =>
  {
    if ( !isEmpty( orders ) )
    {
      setOrder( orders );
      setIsEdit( false );
    }
  }, [ orders ] );


  const toggle = useCallback( () =>
  {
    if ( modal )
    {
      setModal( false );
      setOrder( null );
    } else
    {
      setModal( true );
      setDate( defaultdate() );
    }
  }, [ modal ] );

  const handleOrderClicks = () =>
  {
    setOrder( "" );
    setIsEdit( false );
    toggle();
  };

  const handleOrderClick = useCallback( ( arg ) =>
  {
    const order = arg;
    setOrder( {
      _id: order._id,
      orderId: order.orderId,
      customer: order.customer,
      product: order.product,
      orderDate: order.orderDate,
      ordertime: order.ordertime,
      amount: order.amount,
      payment: order.payment,
      status: order.status
    } );

    setIsEdit( true );
    toggle();
  }, [ toggle ] );

  // Node API 
  // useEffect(() => {
  //   if (isOrderCreated) {
  //     setOrder(null);
  //     dispatch(onGetOrders());
  //   }
  // }, [
  //   dispatch,
  //   isOrderCreated,
  // ]);


  // Checked All
  const checkedAll = useCallback( () =>
  {
    const checkall = document.getElementById( "checkBoxAll" );
    const ele = document.querySelectorAll( ".orderCheckBox" );

    if ( checkall.checked )
    {
      ele.forEach( ( ele ) =>
      {
        ele.checked = true;
      } );
    } else
    {
      ele.forEach( ( ele ) =>
      {
        ele.checked = false;
      } );
    }
    deleteCheckbox();
  }, [] );

  // Delete Multiple
  const [ selectedCheckBoxDelete, setSelectedCheckBoxDelete ] = useState( [] );
  const [ isMultiDeleteButton, setIsMultiDeleteButton ] = useState( false );

  const deleteMultiple = () =>
  {
    const checkall = document.getElementById( "checkBoxAll" );
    selectedCheckBoxDelete.forEach( ( element ) =>
    {
      dispatch( onDeleteOrder( element.value ) );
      setTimeout( () => { toast.clearWaitingQueue(); }, 3000 );
    } );
    checkall.checked = false;
    setIsMultiDeleteButton( false );
  };

  const deleteCheckbox = () =>
  {
    const ele = document.querySelectorAll( ".orderCheckBox:checked" );
    ele.length > 0 ? setIsMultiDeleteButton( true ) : setIsMultiDeleteButton( false );
    setSelectedCheckBoxDelete( ele );
  };

  // Column
  const columns = useMemo(
    () => [
      {
        header: <input type="checkbox" id="checkBoxAll" className="form-check-input" onClick={ () => checkedAll() } />,
        cell: ( cell ) =>
        {
          return <input type="checkbox" className="orderCheckBox form-check-input" value={ cell.getValue() } onChange={ () => deleteCheckbox() } />;
        },
        id: '#',
        accessorKey: 'id',
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        header: "N",
        accessorKey: "orderId",
        enableColumnFilter: false,
        cell: ( cell ) =>
        {
          return <Link to="/apps-ecommerce-order-details" className="fw-medium link-primary">{ cell.getValue() }</Link>;
        },
      },
      {
        header: "Nom",
        accessorKey: "customer",
        enableColumnFilter: false,
      },
      {
        header: "Description",
        accessorKey: "product",
        enableColumnFilter: false,
      },
      {
        header: "Ville",
        accessorKey: "orderDate",
        enableColumnFilter: false,
        cell: ( cell ) => (
          <>
            { handleValidDate( cell.getValue() ) },
            <small className="text-muted"> { handleValidTime( cell.getValue() ) }</small>
          </>
        ),
      },
      {
        header: "Pays",
        accessorKey: "amount",
        enableColumnFilter: false,
      },
      {
        header: "Succursale",
        accessorKey: "payment",
        enableColumnFilter: false,
      },


      {
        header: "Action",
        cell: ( cellProps ) =>
        {
          return (
            <ul className="list-inline hstack gap-2 mb-0">

              <li className="list-inline-item edit">
                <Link
                  to="#"
                  className="text-primary d-inline-block edit-item-btn"
                  onClick={ () =>
                  {
                    const orderData = cellProps.row.original;
                    handleOrderClick( orderData );
                  } }
                >
                  <i className="ri-pencil-fill fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item">
                <Link
                  to="#"
                  className="text-danger d-inline-block remove-item-btn"
                  onClick={ () =>
                  {
                    const orderData = cellProps.row.original;
                    onClickDelete( orderData );
                  } }
                >
                  <i className="ri-delete-bin-5-fill fs-16"></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    [ handleOrderClick, checkedAll ]
  );

  const defaultdate = () =>
  {
    let d = new Date(),
      months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
    let h = ( d.getHours() % 12 ) || 12;
    let ampm = d.getHours() < 12 ? "AM" : "PM";
    return ( ( d.getDate() + ' ' + months[ d.getMonth() ] + ', ' + d.getFullYear() + ", " + h + ":" + d.getMinutes() + " " + ampm ).toString() );
  };


  const [ date, setDate ] = useState( defaultdate() );

  const dateformate = ( e ) =>
  {
    const dateString = e.toString().split( " " );

    let time = dateString[ 4 ];
    let H = +time.substr( 0, 2 );
    let h = ( H % 12 ) || 12;
    h = ( h <= 9 ) ? h = ( "0" + h ) : h;
    let ampm = H < 12 ? "AM" : "PM";
    time = h + time.substr( 2, 3 ) + " " + ampm;

    const date = dateString[ 2 ] + " " + dateString[ 1 ] + ", " + dateString[ 3 ];
    const orderDate = ( date + ", " + time ).toString();
    setDate( orderDate );

  };

  const handleValidDate = date =>
  {
    const date1 = moment( new Date( date ) ).format( "DD MMM Y" );
    return date1;
  };

  const handleValidTime = ( time ) =>
  {
    const time1 = new Date( time );
    const getHour = time1.getUTCHours();
    const getMin = time1.getUTCMinutes();
    const getTime = `${ getHour }:${ getMin }`;
    var meridiem = "";
    if ( getHour >= 12 )
    {
      meridiem = "PM";
    } else
    {
      meridiem = "AM";
    }
    const updateTime = moment( getTime, 'hh:mm' ).format( 'hh:mm' ) + " " + meridiem;
    return updateTime;
  };

  document.title = "Orders | Velzon - React Admin & Dashboard Template";
  return (
    <div className="page-content">
      <ExportCSVModal
        show={ isExportCSV }
        onCloseClick={ () => setIsExportCSV( false ) }
        data={ orderList }
      />
      <DeleteModal
        show={ deleteModal }
        onDeleteClick={ handleDeleteOrder }
        onCloseClick={ () => setDeleteModal( false ) }
      />
      <DeleteModal
        show={ deleteModalMulti }
        onDeleteClick={ () =>
        {
          deleteMultiple();
          setDeleteModalMulti( false );
        } }
        onCloseClick={ () => setDeleteModalMulti( false ) }
      />
      <Container fluid>

        <BreadCrumb title="Departement" pageTitle="Inawo >>" />
        <Row>
          <Col lg={ 12 }>
            <Card id="orderList">
              <CardHeader className="border-0">
                <Row className="align-items-center gy-3">
                  <div className="col-sm">
                    <h5 className="card-title mb-0">Liste des départements</h5>
                  </div>
                  <div className="col-sm-auto">
                    <div className="d-flex gap-1 flex-wrap">
                      <button
                        type="button"
                        className="btn btn-success add-btn"
                        id="create-btn"
                        onClick={ () => { setIsEdit( false ); toggle(); } }
                      >
                        <i className="ri-add-line align-bottom me-1"></i> Ajouter un département
                      </button>{ " " }
                      <button type="button" className="btn btn-info" onClick={ () => setIsExportCSV( true ) }>
                        <i className="ri-file-download-line align-bottom me-1"></i>{ " " }
                        Export
                      </button>
                      { " " }
                      { isMultiDeleteButton && <button className="btn btn-soft-danger"
                        onClick={ () => setDeleteModalMulti( true ) }
                      ><i
                        className="ri-delete-bin-2-line"></i></button> }
                    </div>
                  </div>
                </Row>
              </CardHeader>
              <CardBody className="pt-0">
                <div>

                  { isOrderSuccess && orderList.length ? (
                    <TableContainer
                      columns={ columns }
                      data={ ( orderList || [] ) }
                      isGlobalFilter={ true }
                      isAddUserList={ false }
                      customPageSize={ 8 }
                      divclassName="table-responsive table-card mb-1"
                      tableclassName="align-middle table-nowrap"
                      theadclassName="table-light text-muted"
                      handleOrderClick={ handleOrderClicks }
                      isOrderFilter={ true }

                    />
                  ) : ( <Loader error={ error } /> )
                  }
                </div>
                <Modal id="showModal" isOpen={ modal } toggle={ toggle } centered>
                  <ModalHeader className="bg-light p-3" toggle={ toggle }>
                    { !!isEdit ? "Edit Order" : "Ajouter un département" }
                  </ModalHeader>
                  <Form className="tablelist-form" onSubmit={ ( e ) =>
                  {
                    e.preventDefault();
                    validation.handleSubmit();
                    return false;
                  } }>
                    <ModalBody>
                      <input type="hidden" id="id-field" />



                      <div className="mb-3">
                        <Label
                          htmlFor="customername-field"
                          className="form-label"
                        >
                          Nom
                        </Label>
                        <Input
                          name="customer"
                          id="customername-field"
                          className="form-control"
                          placeholder="Nom"
                          type="text"
                          validate={ {
                            required: { value: true },
                          } }
                          onChange={ validation.handleChange }
                          onBlur={ validation.handleBlur }
                          value={ validation.values.customer || "" }
                          invalid={
                            validation.touched.customer && validation.errors.customer ? true : false
                          }
                        />
                        { validation.touched.customer && validation.errors.customer ? (
                          <FormFeedback type="invalid">{ validation.errors.customer }</FormFeedback>
                        ) : null }

                      </div>

                      <div className="mb-3">
                        <Label
                          htmlFor="customername-field"
                          className="form-label"
                        >
                          Description
                        </Label>
                        <Input
                          name="customer"
                          id="customername-field"
                          className="form-control"
                          placeholder="Description"
                          type="text"
                          validate={ {
                            required: { value: true },
                          } }
                          onChange={ validation.handleChange }
                          onBlur={ validation.handleBlur }
                          value={ validation.values.customer || "" }
                          invalid={
                            validation.touched.customer && validation.errors.customer ? true : false
                          }
                        />
                        { validation.touched.customer && validation.errors.customer ? (
                          <FormFeedback type="invalid">{ validation.errors.customer }</FormFeedback>
                        ) : null }

                      </div>



                      <div className="mb-3">
                        <Label htmlFor="date-field" className="form-label">
                          Ville
                        </Label>

                        <Flatpickr
                          name="orderDate"
                          className="form-control"
                          id="datepicker-publish-input"
                          placeholder="Ville"
                          options={ {
                            enableTime: true,
                            altInput: true,
                            altFormat: "d M, Y, G:i K",
                            dateFormat: "d M, Y, G:i K",
                          } }
                          onChange={ ( e ) =>
                            dateformate( e )
                          }
                          value={ validation.values.orderDate || "" }
                        />

                        { validation.touched.orderDate && validation.errors.orderDate ? (
                          <FormFeedback type="invalid">{ validation.errors.orderDate }</FormFeedback>
                        ) : null }
                      </div>
                      <div className="mb-3">
                        <Label htmlFor="date-field" className="form-label">
                          Pays
                        </Label>

                        <Flatpickr
                          name="orderDate"
                          className="form-control"
                          id="datepicker-publish-input"
                          placeholder="Pays"
                          options={ {
                            enableTime: true,
                            altInput: true,
                            altFormat: "d M, Y, G:i K",
                            dateFormat: "d M, Y, G:i K",
                          } }
                          onChange={ ( e ) =>
                            dateformate( e )
                          }
                          value={ validation.values.orderDate || "" }
                        />

                        { validation.touched.orderDate && validation.errors.orderDate ? (
                          <FormFeedback type="invalid">{ validation.errors.orderDate }</FormFeedback>
                        ) : null }
                      </div>
                      <div className="mb-3">
                        <Label htmlFor="date-field" className="form-label">
                          Succursale
                        </Label>

                        <Flatpickr
                          name="orderDate"
                          className="form-control"
                          id="datepicker-publish-input"
                          placeholder="Succursale"
                          options={ {
                            enableTime: true,
                            altInput: true,
                            altFormat: "d M, Y, G:i K",
                            dateFormat: "d M, Y, G:i K",
                          } }
                          onChange={ ( e ) =>
                            dateformate( e )
                          }
                          value={ validation.values.orderDate || "" }
                        />

                        { validation.touched.orderDate && validation.errors.orderDate ? (
                          <FormFeedback type="invalid">{ validation.errors.orderDate }</FormFeedback>
                        ) : null }
                      </div>

                    </ModalBody>
                    <div className="modal-footer">
                      <div className="hstack gap-2 justify-content-end">
                        <button
                          type="button"
                          className="btn btn-light"
                          onClick={ () =>
                          {
                            setModal( false );
                          } }
                        >
                          Fermer
                        </button>

                        <button type="submit" className="btn btn-success">
                          { !!isEdit
                            ? "Update"
                            : "Ajouter département" }
                        </button>
                      </div>
                    </div>
                  </Form>
                </Modal>
                <ToastContainer closeButton={ false } limit={ 1 } />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EcommerceOrderscopy;


