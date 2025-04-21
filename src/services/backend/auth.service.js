import axios from "axios";

const API_URL = "https://dominara-backend.vercel.app";

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
 * Process deep link callback with token
 * @param {string} url - Deep link URL containing token
 * @returns {Object} - User data and authentication status
 */
export const processDeepLink = async (url) => {
  try {
    const parsedUrl = new URL(url);

    // Obtener token directamente de los parámetros de la URL
    const token = parsedUrl.searchParams.get("token");

    // Obtener el objeto usuario serializado de los parámetros de la URL
    const userJson = parsedUrl.searchParams.get("user");

    console.log("Deep link processing - token:", token);
    console.log("Deep link processing - user JSON:", userJson);

    if (token && userJson) {
      try {
        // Parsear el objeto usuario
        const userData = JSON.parse(userJson);
        console.log("Deep link processing - parsed user data:", userData);

        // Almacenar token y datos del usuario en localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", userJson);

        return {
          success: true,
          user: userData,
          token,
        };
      } catch (jsonError) {
        console.error("Error parsing user JSON from deep link:", jsonError);
        throw new Error("Invalid user data format in deep link");
      }
    } else if (token) {
      // Si solo tenemos token pero no tenemos datos de usuario, los obtenemos
      localStorage.setItem("token", token);

      // Fetch user info with the token
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        return {
          success: true,
          user: response.data.user,
          token,
        };
      }
    }

    throw new Error("Invalid token or user data in deep link");
  } catch (error) {
    console.error("Deep link processing error:", error);
    throw {
      code: "DEEP_LINK_ERROR",
      message: `Failed to process authentication from deep link: ${error.message || "Unknown error"}`,
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
  // Use dominara:// scheme for Tauri deep linking
  return `${API_URL}/api/auth/google?redirect_uri=${encodeURIComponent(
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
  processDeepLink,
};

export default authService;
