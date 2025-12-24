import api from "./apiClient";
import { AUTH_ENDPOINTS } from "@api/config";

export const loginUser = async ({ username, password }) => {
  const response = await api.post(AUTH_ENDPOINTS.LOGIN, { username, password });
  return response.data;
};

export const registerUser = async (data) => {
  const response = await api.post(AUTH_ENDPOINTS.REGISTER, data);
  console.log("Registration Response:", response);
  return response.data;
};

export const checkUsernameAvailable = async (username) => {
  const res = await api.get(`${AUTH_ENDPOINTS.CHECK_USERNAME}?username=${username}`);
  return res.data.available; 
};
  
export const verifyOTP = async ({ email, otp }) => {
  const response = await api.post(AUTH_ENDPOINTS.VERIFY_OTP, { email, otp });
  return response.data;
}

