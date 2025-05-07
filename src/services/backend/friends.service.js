import axios from "axios";
import { getErrorMessage } from "../../utils/i18n";
import { handleUnauthorizedError } from "./auth.service";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Get all friends of the logged in user
 * @returns {Promise<Array>} Array of friend objects
 * @throws {Error} Error with message and code
 */
export const getFriends = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      const error = new Error("No token provided");
      error.code = "error_no_token";
      throw error;
    }

    const response = await axios.get(`${API_URL}/api/friends`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (handleUnauthorizedError(error)) {
      const authError = new Error("Session expired. Please login again.");
      authError.code = "session_expired";
      throw authError;
    }

    const errorCode = error.response?.data?.code || error.code;
    const errorMessage = error.response?.data?.message || error.message;

    const formattedError = new Error(
      getErrorMessage({
        code: errorCode,
        message: errorMessage,
        status: error.response?.status,
      })
    );

    formattedError.code = errorCode;
    formattedError.status = error.response?.status;

    throw formattedError;
  }
};
