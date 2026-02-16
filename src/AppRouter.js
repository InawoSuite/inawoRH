
import React from "react";
import { Routes, Route } from "react-router-dom";
import loadingInawoGif from "./assets/images/loading_inawo.gif.gif";
import { useTranslation } from "react-i18next";


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

const Index = React.lazy(() => import('./Routes'));

const AppRouter = () => (
      <React.Suspense fallback={ <LoadingPage />}>
  <Routes>
    <Route path="/*" element={<Index />} />
  </Routes>
  </React.Suspense>
);

export default AppRouter;


// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import loadingInawoGif from "./assets/images/loading_inawo.gif.gif";
// import { useTranslation } from "react-i18next";

// const Index = React.lazy(() => import('./Routes'));
// const ExpenseCreateRouter = React.lazy(() => import("./pages/depenses/ExpenseCreateRouter"));
// const { t } = useTranslation();

// const AppRouter = () => (
//       <React.Suspense fallback={<div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               height: "100vh",
//               backgroundColor: "#fff",
//             }}
//           >
//             <img src={loadingInawoGif} alt={t("Chargement...")} style={{ width: "150px" }} />
//           </div>}>
//   <Routes>
//     <Route path="/*" element={<Index />} />
//     <Route path="/depenses/create/:type" element={<ExpenseCreateRouter />} />
//   </Routes>
//   </React.Suspense>
// );

// export default AppRouter;


