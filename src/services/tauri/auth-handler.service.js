import deepLinkService from "./deep-link.service";

/**
 * AuthHandlerService - Handles authentication through deep links
 */
class AuthHandlerService {
  constructor() {
    this.authCallbacks = [];
    this.unlisten = null;
  }

  /**
   * Sets up the auth handler listener
   */
  init() {
    if (this.unlisten) return;

    console.log("AuthHandlerService: Initializing deep link auth handler");

    this.unlisten = deepLinkService.addListener((url) => {
      // For auth links, we expect /auth/callback or /auth/verify
      if (url.pathname.startsWith("/auth/")) {
        console.log("AuthHandlerService: Received auth deep link:", url.href);
        this.processAuthDeepLink(url);
      }
    });

    console.log("AuthHandlerService: Initialized");
  }

  /**
   * Process an authentication deep link
   * @param {URL} url - Parsed URL object
   * @private
   */
  processAuthDeepLink(url) {
    const authData = deepLinkService.parseAuthData(url);

    if (!authData) {
      console.log("AuthHandlerService: Invalid auth data in deep link");
      return;
    }

    console.log("AuthHandlerService: Processing auth data from deep link", authData);

    // Save to localStorage
    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", JSON.stringify(authData.userData));

    // Notify all callbacks
    this.notifyCallbacks(authData);
  }

  /**
   * Notify all registered auth callbacks
   * @param {Object} authData - The authentication data
   * @private
   */
  notifyCallbacks(authData) {
    console.log(`AuthHandlerService: Notifying ${this.authCallbacks.length} callbacks about auth data`);
    this.authCallbacks.forEach((callback) => {
      try {
        callback(authData);
      } catch (error) {
        console.error("AuthHandlerService: Error in auth callback:", error);
      }
    });
  }

  /**
   * Register a callback for authentication events
   * @param {Function} callback - Function to call when authentication data is received
   * @returns {Function} Function to unregister the callback
   */
  onAuthenticated(callback) {
    // Initialize on first subscription
    this.init();

    this.authCallbacks.push(callback);
    console.log(`AuthHandlerService: Added auth callback, total: ${this.authCallbacks.length}`);

    return () => {
      this.authCallbacks = this.authCallbacks.filter((cb) => cb !== callback);
      console.log(`AuthHandlerService: Removed auth callback, remaining: ${this.authCallbacks.length}`);

      // If no more callbacks, clean up
      if (this.authCallbacks.length === 0 && this.unlisten) {
        this.unlisten();
        this.unlisten = null;
        console.log("AuthHandlerService: No more auth callbacks, cleaned up");
      }
    };
  }

  /**
   * Clean up all callbacks and listeners
   */
  cleanup() {
    if (this.unlisten) {
      this.unlisten();
      this.unlisten = null;
    }

    this.authCallbacks = [];
    console.log("AuthHandlerService: Cleaned up all resources");
  }
}

// Create a singleton instance
const authHandlerService = new AuthHandlerService();

export default authHandlerService;
