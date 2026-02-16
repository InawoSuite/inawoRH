import React, { useEffect } from "react";
import { Navigate, Route, useLocation } from "react-router-dom"; // Added useLocation
import { setAuthorization } from "../helpers/api_helper";
import { useDispatch } from "react-redux";

import { useProfile } from "../Components/Hooks/UserHooks";


const AuthProtected = (props) => {
  const dispatch = useDispatch();
  const { userProfile, loading, token } = useProfile();
  const location = useLocation(); // Get location for potential 'from' state

  useEffect(() => {
    // This effect might be redundant if useProfile or another mechanism handles setting the auth header
    if (userProfile && !loading && token) {
      // console.log("AuthProtected Effect: Setting authorization based on profile/token.");
      setAuthorization(token);
    } 
    
  }, [token, userProfile, loading, dispatch]); // Dependencies seem correct
  /*
    Redirect logic: Wait until loading is finished before deciding.
  */
  if (loading === false && (!userProfile || !token)) { 
    // Log before redirecting
    // console.log(`AuthProtected: Redirecting to login. Loading: ${loading}, Has profile: ${!!userProfile}, Has token: ${!!token}`);
    return (
      // Pass the current location in state so the login page can redirect back after success
      <Navigate to="/fr/connexion" state={{ from: location }} replace /> 
    );
  }

  // --- Debugging Logs ---
  // Log the state right before making the rendering decision
  // console.log(`AuthProtected: Checking render conditions. Loading: ${loading}, Has profile: ${!!userProfile}, Has token: ${!!token}`);


  if (loading) {
    //  console.log("AuthProtected: Loading is true, rendering null.");
     return null; // Render nothing (blank) while loading
  }

  if (!loading && userProfile && token) {
    // console.log("AuthProtected: Loading false, user authenticated. Rendering children.");
    return <>{props.children}</>; // Render the protected component
  }

  // Fallback case (should ideally not be reached if redirect logic is correct)
  // console.warn("AuthProtected: Reached unexpected state, rendering null.");
  return null; 
};



const AccessRoute = ({ component: Component, ...rest }) => {
  // This implementation uses the deprecated 'render' prop and doesn't fit v6 well.
  // console.warn("AccessRoute component is likely deprecated for React Router v6 and might not work as expected.");
  return (
    <Route
      {...rest}
      element={<Component />} 
    />
  );
};

export { AuthProtected };
