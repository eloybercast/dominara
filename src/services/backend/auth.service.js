import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Register a new user
 * @param {string} email - User email
 * @param {string} username - User username
 * @param {string} password - User password
 * @returns {Promise} - Promise with user data and token or error
 */
export const register = async (email, username, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, {
      email,
      username,
      password,
    });

    if (response.status === 201 && response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    const errorCode = error.response?.data?.code || null;
    const errorMessage = error.response?.data?.message || "Registration failed";

    throw {
      code: errorCode,
      message: errorMessage,
      status: error.response?.status,
    };
  }
};

/**
 * Login an existing user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - Promise with user data and token or error
 */
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      identifier: email,
      password,
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    const errorCode = error.response?.data?.code || null;
    const errorMessage = error.response?.data?.message || "Login failed";

    throw {
      code: errorCode,
      message: errorMessage,
      status: error.response?.status,
    };
  }
};

/**
 * Send verification email to current user
 * @returns {Promise} - Promise with success message or error
 */
export const sendVerificationEmail = async () => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/send-verification-email`, {}, { headers: getAuthHeader() });

    return response.data;
  } catch (error) {
    const errorCode = error.response?.data?.code || null;
    const errorMessage = error.response?.data?.message || "Failed to send verification email";

    throw {
      code: errorCode,
      message: errorMessage,
      status: error.response?.status,
    };
  }
};

/**
 * Verify email with code
 * @param {string} code - The verification code
 * @returns {Promise} - Promise with success message or error
 */
export const verifyEmail = async (code) => {
  try {
    const response = await axios.get(`${API_URL}/api/auth/verify-email?code=${code}`, { headers: getAuthHeader() });

    const currentUser = getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, emailVerified: true };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }

    return response.data;
  } catch (error) {
    const errorCode = error.response?.data?.code || null;
    const errorMessage = error.response?.data?.message || "Failed to verify email";

    throw {
      code: errorCode,
      message: errorMessage,
      status: error.response?.status,
    };
  }
};

/**
 * Logout the current user
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/**
 * Get the current user data
 * @returns {Object|null} - User data or null if not logged in
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

/**
 * Get authentication token
 * @returns {string|null} - JWT token or null if not logged in
 */
export const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Process Google OAuth callback
 * @param {string} code - Authorization code from Google
 * @returns {Promise} - Promise with user data and token
 */
export const processGoogleAuth = async (code) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/google/callback`, { code });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    const errorCode = error.response?.data?.code || null;
    const errorMessage = error.response?.data?.message || "Google authentication failed";

    throw {
      code: errorCode,
      message: errorMessage,
      status: error.response?.status,
    };
  }
};

/**
 * Get Google OAuth URL
 * @returns {string} Google authentication URL
 */
export const getGoogleAuthUrl = () => {
  // Ensure we have all necessary parameters for desktop app detection
  return `https://dominara-backend.vercel.app/api/auth/google?redirect_uri=${encodeURIComponent(
    "dominara://auth/callback"
  )}&client=desktop&platform=app&mobile=true`;
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getToken,
  sendVerificationEmail,
  verifyEmail,
  getGoogleAuthUrl,
  processGoogleAuth,
};

export default authService;
