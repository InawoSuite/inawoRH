import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth/authReducer';
import profileReducer from './profile/profileReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  Profile: profileReducer  // Utilisez 'Profile' pour correspondre à votre sélecteur
});

export default rootReducer;