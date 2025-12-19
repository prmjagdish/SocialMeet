
export const API_BASE_URL = import.meta.env.VITE_API_URL;

export const AUTH_ENDPOINTS = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  CHECK_USERNAME: "/auth/check-username",
  VERIFY_OTP: "/auth/verify-otp",
  SUGGESTED_USERS: "api/profile/suggested",
  ACCOUNT_DELETE: "/api/profile/me",
};

