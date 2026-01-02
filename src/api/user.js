import api from "./apiClient";
import { USERS_ENDPOINTS } from "@api/config";

export const followUser = async (targetUsername) => {
  try {
    const response = await api.post(`${USERS_ENDPOINTS.FOLLOW_USER}${targetUsername}/follow`)
    return response.data;
  } catch (error) {
    console.error("Error following user:", error);
    throw error;
  }
};

export const unfollowUser = async (targetUsername) => {
  try {
    const response = await api.post(`${USERS_ENDPOINTS.UNFOLLOW_USER}${targetUsername}`);
    return response.data;
  } catch (error) {
    console.error("Error unfollowing user:", error);
    throw error;
  }
};