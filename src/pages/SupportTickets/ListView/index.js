import React,{useState } from "react";
import { Container, Row, Col, Card } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Widgets from "./Widgets";
import TicketsData from "./TicketsData";
import { Link } from "react-router-dom";
import NotAvailablePage from "../../../Components/Common/NotAvailablePage";
import SearchAndActionBar from "../../../Components/Common/SearchAndActionBar";
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

const ListView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [orderList, setOrderList] = useState([]);

  document.title = "Support Client |Inawo - Suite de gestion";
  return (
    <React.Fragment>
      <ExportCSVModal
        show={isExportCSV}
        onCloseClick={() => setIsExportCSV(false)}
        data={orderList}
      />
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Support Client"
            pageTitle={
              <>
                <i className="ri-account-circle-line me-1 align-bottom"></i>
                &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>&nbsp;&gt;&nbsp;
              </>
            }
          />
          {/* <SearchAndActionBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Chercher un ticket..."
            showSearch={true}
            // addButtonLink="/addReception"
            addButtonText="Créer un ticket"
            addButtonIcon="ri-file-add-line"
            showAddButton={true}
            onExportClick={() => setIsExportCSV(true)}
            exportButtonText="Exporter"
            exportButtonIcon="ri-file-upload-line"
            showExportButton={false}
          /> */}
          {/* <Col lg={12}>
            <Card className="card-h-100" style={{ borderRadius: "20px" }}>
              <NotAvailablePage description="" />
            </Card>
          </Col> */}
          <Row>
                        <Widgets />
                    </Row>
                    <TicketsData />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ListView;
