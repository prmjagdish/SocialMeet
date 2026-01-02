import api from "./apiClient";
import { AUTH_ENDPOINTS } from "@api/config";

export const getMyProfile = async () => {
  const response = await api.get("/api/profile/me");
  console.log(response.data)
  return response.data;
};

export const getSuggestedUsers = async (userId) => {
  const response = await api.get(`${AUTH_ENDPOINTS.SUGGESTED_USERS}?userId=${userId}`);
  return response.data;
}

export const deleteAccount = async () => {
  const response = await api.delete(AUTH_ENDPOINTS.ACCOUNT_DELETE);
  return response.data;
};

export const getPublicProfile = async (username) => {
  const response = await api.get(`${AUTH_ENDPOINTS.GET_PUBLIC_PROFILE}${username}`);
  return response.data;
}
