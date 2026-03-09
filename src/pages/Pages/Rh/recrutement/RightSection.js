import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader, Table } from "reactstrap";
import img3 from "../../../../assets/images/companies/img-3.png";
import { useTranslation } from "react-i18next";

const RightSection = () => {
  const [isBookmarkClick, setIsBookmarkClick] = useState(false);
  const { t } = useTranslation();

  return (
    <React.Fragment>
      {/* ========== APERÇU DE L'OFFRE ========== */}
      <Card className="card rounded-4 border-0 shadow-sm">
        <CardHeader className="card-header rounded-top-4">
          <h5 className="mb-0">{t("Aperçu de l'offre")}</h5>
        </CardHeader>
        <CardBody className="card-body">
          <div className="table-responsive table-card">
            <Table className="table mb-0">
              <tbody>
                <tr>
                  <td className="fw-medium">{t("Titre")}</td>
                  <td>{t("Designer Produit")}</td>
                </tr>
                <tr>
                  <td className="fw-medium">{t("Nom de l'entreprise")}</td>
                  <td>Themesbrand</td>
                </tr>
                <tr>
                  <td className="fw-medium">{t("Localisation")}</td>
                  <td>{t("Zuweihir, Émirats Arabes Unis")}</td>
                </tr>
                <tr>
                  <td className="fw-medium">{t("Type de contrat")}</td>
                  <td>
                    <span className="badge bg-success-subtle text-success">{t("Temps plein")}</span>
                  </td>
                </tr>
                <tr>
                  <td className="fw-medium">{t("Candidatures reçues")}</td>
                  <td>{t("54 candidatures")}</td>
                </tr>
                <tr>
                  <td className="fw-medium">{t("Date de publication")}</td>
                  <td>{t("15 Sept, 2021")}</td>
                </tr>
                <tr>
                  <td className="fw-medium">{t("Salaire")}</td>
                  <td>35k$ - 45k$</td>
                </tr>
                <tr>
                  <td className="fw-medium">{t("Expérience requise")}</td>
                  <td>{t("5+ ans")}</td>
                </tr>
                <tr>
                  <td className="fw-medium">{t("Formation requise")}</td>
                  <td>Master</td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div className="mt-4 pt-2 hstack gap-2">
            <Link to="#" className="btn btn-primary rounded-4 border-0 shadow-sm w-100">
              {t("Postuler maintenant")}
            </Link>
            <Link
              to="#"
              onClick={() => setIsBookmarkClick(!isBookmarkClick)}
              className={isBookmarkClick ? "btn btn-soft-danger btn-icon custom-toggle flex-shrink-0 active" : "btn btn-soft-danger btn-icon custom-toggle flex-shrink-0"}
            >
              {!isBookmarkClick ?
                <span className="icon-on rounded-4 border-0 shadow-sm">
                  <i className="ri-bookmark-line align-bottom"></i>
                </span>
                :
                <span className="icon-off rounded-4 border-0 shadow-sm">
                  <i className="ri-bookmark-3-fill align-bottom"></i>
                </span>
              }
            </Link>
          </div>
        </CardBody>
      </Card>

      {/* ========== INFORMATIONS SUR L'ENTREPRISE ========== */}
      <Card className="card rounded-4 border-0 shadow-sm">
        <CardBody className="card-body">
          <div className="avatar-sm mx-auto">
            <div className="avatar-title bg-warning-subtle rounded">
              <img src={img3} alt={t("Logo Themesbrand")} className="avatar-xxs" />
            </div>
          </div>
          <div className="text-center">
            <Link to="#">
              <h5 className="mt-3">Themesbrand</h5>
            </Link>
            <p className="text-muted">{t("Département IT")}</p>
          </div>

          <div className="table-responsive">
            <Table className="table mb-0">
              <tbody>
                <tr>
                  <td className="fw-medium">{t("Taille de l'entreprise")}</td>
                  <td>{t("5 employés")}</td>
                </tr>
                <tr>
                  <td className="fw-medium">{t("Secteur d'activité")}</td>
                  <td>{t("Développement logiciel")}</td>
                </tr>
                <tr>
                  <td className="fw-medium">{t("Année de création")}</td>
                  <td>2016</td>
                </tr>
                <tr>
                  <td className="fw-medium">{t("Téléphone")}</td>
                  <td>+(234) 12345 67890</td>
                </tr>
                <tr>
                  <td className="fw-medium">{t("Email")}</td>
                  <td>themesbrand@gmail.com</td>
                </tr>
                <tr>
                  <td className="fw-medium">{t("Réseaux sociaux")}</td>
                  <td>
                    <ul className="list-inline mb-0">
                      <li className="list-inline-item">
                        <Link to="#" title="WhatsApp">
                          <i className="ri-whatsapp-line"></i>
                        </Link>
                      </li>
                      <li className="list-inline-item">
                        <Link to="#" title="Facebook">
                          <i className="ri-facebook-line"></i>
                        </Link>
                      </li>
                      <li className="list-inline-item">
                        <Link to="#" title="Twitter">
                          <i className="ri-twitter-line"></i>
                        </Link>
                      </li>
                      <li className="list-inline-item">
                        <Link to="#" title="YouTube">
                          <i className="ri-youtube-line"></i>
                        </Link>
                      </li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>

      {/* ========== LOCALISATION ========== */}
      <Card className="card rounded-4 border-0 shadow-sm">
        <CardHeader className="card-header rounded-top-4">
          <h5 className="mb-0">{t("Localisation")}</h5>
        </CardHeader>
        <CardBody className="card-body rounded-4">
          <div className="ratio ratio-4x3">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1861227.8137337372!2d51.654904288504646!3d24.33915646928631!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e48dfb1ab12bd%3A0x33d32f56c0080aa7!2sUnited%20Arab%20Emirates!5e0!3m2!1sen!2sin!4v1664257145153!5m2!1sen!2sin"
              height="450"
              style={{ border: "0" }}
              title={t("Carte des Émirats Arabes Unis")}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </CardBody>
      </Card>

      {/* ========== NOUS CONTACTER ========== */}
      <Card className="card rounded-4 border-0 shadow-sm">
        <CardHeader className="card-header rounded-top-4">
          <h5 className="mb-0">{t("Nous contacter")}</h5>
        </CardHeader>
        <CardBody className="card-body">
          <form>
            <div className="mb-3">
              <label htmlFor="nameInput" className="form-label">
                {t("Nom")}
              </label>
              <input
                type="text"
                className="form-control rounded-4"
                id="nameInput"
                placeholder={t("Entrez votre nom")}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="emailInput" className="form-label">
                {t("Email")}
              </label>
              <input
                type="text"
                className="form-control rounded-4"
                id="emailInput"
                placeholder={t("Entrez votre email")}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="messageInput" className="form-label">
                {t("Message")}
              </label>
              <textarea
                className="form-control rounded-4"
                id="messageInput"
                rows="3"
                placeholder={t("Votre message")}
              ></textarea>
            </div>
            <div className="text-end">
              <button type="submit" className="btn btn-primary rounded-4">
                {t("Envoyer le message")}
              </button>
            </div>
          </form>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default RightSection;