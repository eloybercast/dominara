import axios from "axios";
import { getErrorMessage } from "../../utils/i18n";
import { handleUnauthorizedError } from "./auth.service";
import { API_URL } from "../index";

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
    const statusCode = error.response?.status;
    
    let formattedError;
    
    switch (errorCode) {
      case "error_no_token":
        formattedError = new Error("No token provided");
        break;
      case "error_insufficient_permissions":
        formattedError = new Error("You don't have permission to view friends");
        break;
      case "error_user_not_found":
        formattedError = new Error("User account not found");
        break;
      case "error_rate_limit_second":
        formattedError = new Error("Too many requests. Please try again later");
        break;
      case "error_server":
        formattedError = new Error("Server error. Please try again later");
        break;
      default:
        formattedError = new Error(
          getErrorMessage({
            code: errorCode,
            message: errorMessage,
            status: statusCode,
          })
        );
    }

    formattedError.code = errorCode;
    formattedError.status = statusCode;

    throw formattedError;
  }
};

/**
 * Send a friend request to another user
 * @param {string} username - Username of the user to send the request to
 * @returns {Promise<Object>} Friendship object with status
 * @throws {Error} Error with message and code
 */
export const sendFriendRequest = async (username) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      const error = new Error("No token provided");
      error.code = "error_no_token";
      throw error;
    }

    if (!username) {
      const error = new Error("Username is required");
      error.code = "error_missing_username";
      throw error;
    }

    const response = await axios.post(
      `${API_URL}/api/friends`,
      { username },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (handleUnauthorizedError(error)) {
      const authError = new Error("Session expired. Please login again.");
      authError.code = "session_expired";
      throw authError;
    }

    const errorCode = error.response?.data?.code || error.code;
    const errorMessage = error.response?.data?.message || error.message;
    const statusCode = error.response?.status;
    
    let formattedError;
    
    switch (errorCode) {
      case "error_no_token":
        formattedError = new Error("No token provided");
        break;
      case "error_missing_username":
        formattedError = new Error("Username is required");
        break;
      case "error_self_request":
        formattedError = new Error("You cannot send a friend request to yourself");
        break;
      case "error_friendship_exists":
        formattedError = new Error("A friendship or request already exists with this user");
        break;
      case "error_insufficient_permissions":
        formattedError = new Error("You don't have permission to send friend requests");
        break;
      case "error_user_not_found":
        formattedError = new Error("User not found");
        break;
      case "error_rate_limit_second":
        formattedError = new Error("Too many requests. Please try again later");
        break;
      default:
        formattedError = new Error(
          getErrorMessage({
            code: errorCode,
            message: errorMessage,
            status: statusCode,
          })
        );
    }

    formattedError.code = errorCode;
    formattedError.status = statusCode;

    throw formattedError;
  }
};
