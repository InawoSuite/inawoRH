import { createSelector } from 'reselect';

const selectAuthState = state => state?.auth || {
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null
};

export const selectAuthData = createSelector(
  [selectAuthState],
  auth => ({
    user: auth.user || null,
    token: auth.token || null,
    refreshToken: auth.refreshToken || null,
    loading: auth.loading || false,
    error: auth.error || null
  })
);