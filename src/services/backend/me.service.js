import axios from "axios";
import { getErrorMessage } from "../../utils/i18n";
import { handleUnauthorizedError } from "./auth.service";

const API_URL = "https://dominara-backend.vercel.app";

/**
 * Get authenticated user's profile
 * @returns {Promise<Object>} User data
 * @throws {Error} Error with message and code
 */
export const getMe = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      const error = new Error("No token provided");
      error.code = "error_no_token";
      throw error;
    }

    const response = await axios.get(`${API_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Get user profile by ID
 * @param {string} userId - User ID to fetch
 * @returns {Promise<Object>} User data
 * @throws {Error} Error with message and code
 */
export const getUserProfile = async (userId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      const error = new Error("No token provided");
      error.code = "error_no_token";
      throw error;
    }

    const response = await axios.get(`${API_URL}/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Update authenticated user's profile
 * @param {Object} userData - User data to update
 * @returns {Promise<Object>} Updated user data
 * @throws {Error} Error with message and code
 */
export const updateMe = async (userData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      const error = new Error("No token provided");
      error.code = "error_no_token";
      throw error;
    }

    const response = await axios.put(`${API_URL}/api/users/me`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Add experience to the authenticated user
 * @param {number} xp - Amount of experience to add
 * @returns {Promise<Object>} Updated user data with level info
 * @throws {Error} Error with message and code
 */
export const addExperience = async (xp) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      const error = new Error("No token provided");
      error.code = "error_no_token";
      throw error;
    }

    const response = await axios.post(
      `${API_URL}/api/users/add-experience`,
      { xp },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Get authenticated user's coin balance
 * @returns {Promise<Object>} Object containing coins
 * @throws {Error} Error with message and code
 */
export const getUserCoins = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      const error = new Error("No token provided");
      error.code = "error_no_token";
      throw error;
    }

    const response = await axios.get(`${API_URL}/api/users/me/coins`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Handle API errors
 * @param {Error} error - Error object
 * @throws {Error} Formatted error
 */
const handleError = (error) => {
  // Check if it's an unauthorized error and handle it
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
};
