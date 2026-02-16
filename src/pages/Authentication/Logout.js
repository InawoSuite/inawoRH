// import React, { useEffect } from "react";
// import { Navigate, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { logoutUser } from "../../slices/auth/login/thunk";
// import { Spinner } from "reactstrap";

// const Logout = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { isUserLogout } = useSelector((state) => state.auth || {});

//   useEffect(() => {
//     // Exécuter la déconnexion au chargement du composant
//     dispatch(logoutUser(navigate));
//   }, [dispatch, navigate]);

//   // Pendant que la déconnexion est en cours, afficher un spinner
//   return (
//     <div className="auth-page-wrapper pt-5">
//       <div className="auth-one-bg">
//         <div className="bg-overlay"></div>
//         <div className="position-relative h-100 d-flex align-items-center justify-content-center">
//           <div className="text-center">
//             <div className="mb-4">
//               <Spinner color="primary" size="lg" />
//             </div>
//             <h4 className="text-white">Déconnexion en cours...</h4>
//           </div>
//         </div>
//       </div>
//       {isUserLogout && <Navigate to="/:fr/connexion" replace={true} />}
//     </div>
//   );
// };

// export default Logout;



import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../slices/auth/login/thunk";
import { Spinner } from "reactstrap";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import loadingInawoGif from "../../assets/images/loading_inawo.gif.gif";

const LoadingPage = () => {
  const { t } = useTranslation();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#fff",
      }}
    >
      <img src={loadingInawoGif} alt={t("Chargement...")} style={{ width: "150px" }} />
    </div>
  );
};

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isUserLogout } = useSelector((state) => state.auth || {});
  const { lang } = useParams();
  const { i18n } = useTranslation();

  useEffect(() => {
    dispatch(logoutUser(navigate));
  }, [dispatch, navigate]);

  // Détermine la langue à utiliser
  const redirectLang = lang || i18n.language || "fr";
  const redirectUrl = `/${redirectLang}/connexion`;

  return (
    <div className="auth-page-wrapper pt-5">
      <div className="auth-one-bg">
        <div className="bg-overlay"></div>
        <div className="position-relative h-100 d-flex align-items-center justify-content-center">
          <div className="text-center">
            <div className="mb-4">
              <Spinner color="primary" size="lg" />
            </div>
            {/* <h4 className="text-white">Déconnexion en cours...</h4> */}
            <LoadingPage />
          </div>
        </div>
      </div>
      {isUserLogout && <Navigate to={redirectUrl} replace={true} />}
      {/* {isUserLogout && <Navigate to="/:fr/connexion" replace={true} />} */}
    </div>
  );
};

export default Logout;