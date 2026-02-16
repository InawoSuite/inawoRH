import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import LoginReducer from './slices/auth/login/reducer';

const store = configureStore({
   Login: LoginReducer,
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;