// src/Components/Hooks/UserHooks.js
import { useSelector } from "react-redux";

const useProfile = () => {
  // Accéder au state via "Login" (avec L majuscule)
  const { user, token, loading } = useSelector(state => state.Login || {});
  
  return {
    userProfile: user,
    token,
    loading: loading || false,
  };
};

export { useProfile };

// import { useSelector } from "react-redux";

// const useProfile = () => {
//   // Utilise bien "Login" (majuscule) pour Velzon
//   const { user, token, loading } = useSelector(state => state.Login);
//   return {
//     userProfile: user,
//     token,
//     loading,
//   };
// };

// export { useProfile };
