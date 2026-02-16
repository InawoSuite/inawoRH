// import { createSlice } from "@reduxjs/toolkit";
// import { getAuthData } from '../../../utils/authUtils';

// // Récupère les données d'authentification au démarrage depuis le localStorage/sessionStorage
// const getInitialAuthState = () => {
//   const authData = getAuthData();
//   console.log("AuthData22:",authData )
//   return {
//     user: authData.user || JSON.parse(localStorage.getItem("user")),
//     token: authData.access_token || JSON.parse(localStorage.getItem("access_token")),
//     refreshToken: authData.refresh_token || JSON.parse(localStorage.getItem("access_token")),
//     error: "",
//     loading: false,
//     isUserLogout: false,
//     errorMsg: false,
//   };
// };

// export const initialState = getInitialAuthState();

// const loginSlice = createSlice({
//   name: "login",
//   initialState,
//   reducers: {
//     loginRequest(state) {
//       state.loading = true;
//       state.error = "";
//       state.errorMsg = false;
//     },
    
//     loginSuccess(state, action) {
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//       state.refreshToken = action.payload.refreshToken;
//       state.loading = false;
//       state.errorMsg = false;
//       state.error = "";
//       state.isUserLogout = false;
//     },
    
//     logoutUserSuccess(state) {
//       state.isUserLogout = true;
//       state.user = null;
//       state.token = null;
//       state.refreshToken = null;
//       state.loading = false;
//     },
    
//     apiError(state, action) {
//       state.error = action.payload?.message || action.payload?.data || "Erreur d'authentification";
//       state.loading = false;
//       state.errorMsg = true;
//     },
    
//     clearError(state) {
//       state.error = "";
//       state.errorMsg = false;
//     },
    
//     updateUserProfile(state, action) {
//       if (state.user) {
//         state.user = { ...state.user, ...action.payload };
//       }
//     },
    
//     tokenRefreshed(state, action) {
//       state.token = action.payload.token;
//       state.refreshToken = action.payload.refreshToken || state.refreshToken;
//     },
    
//     reset_login_flag(state) {
//       state.error = "";
//       state.loading = false;
//       state.errorMsg = false;
//     }
//   },
// });

// export const {
//   loginRequest,
//   loginSuccess,
//   logoutUserSuccess,
//   apiError,
//   clearError,
//   updateUserProfile,
//   tokenRefreshed,
//   reset_login_flag
// } = loginSlice.actions;

// export default loginSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { getAuthData } from '../../../utils/authUtils';

// Récupère les données d'authentification au démarrage depuis le localStorage/sessionStorage
const getInitialAuthState = () => {
  const authData = getAuthData();
  return {
    user: authData.user,
    token: authData.access_token,
    refreshToken: authData.refresh_token,
    error: "",
    loading: false,
    isUserLogout: false,
    errorMsg: false,
  };
};

export const initialState = getInitialAuthState();

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    loginRequest(state) {
      state.loading = true;
      state.error = "";
      state.errorMsg = false;
    },
    
    loginSuccess(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.loading = false;
      state.errorMsg = false;
      state.error = "";
      state.isUserLogout = false;
    },
    
    logoutUserSuccess(state) {
      state.isUserLogout = true;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.loading = false;
    },
    
    apiError(state, action) {
      state.error = action.payload?.message || action.payload?.data || "Erreur d'authentification";
      state.loading = false;
      state.errorMsg = true;
    },
    
    clearError(state) {
      state.error = "";
      state.errorMsg = false;
    },
    
    updateUserProfile(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    
    tokenRefreshed(state, action) {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken || state.refreshToken;
    },
    
    reset_login_flag(state) {
      state.error = "";
      state.loading = false;
      state.errorMsg = false;
    }
  },
});

export const {
  loginRequest,
  loginSuccess,
  logoutUserSuccess,
  apiError,
  clearError,
  updateUserProfile,
  tokenRefreshed,
  reset_login_flag
} = loginSlice.actions;

export default loginSlice.reducer;
