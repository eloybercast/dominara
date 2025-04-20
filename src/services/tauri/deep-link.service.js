import { onOpenUrl } from "@tauri-apps/plugin-deep-link";

/**
 * DeepLinkService - Handles deep link functionality for the application
 */
class DeepLinkService {
  constructor() {
    this.listeners = [];
    this.isSetup = false;
    this.unlistenCallback = null;
  }

  /**
   * Initializes the deep link service
   * @returns {Promise<void>}
   */
  async init() {
    if (this.isSetup) return;

    try {
      console.log("DeepLinkService: Initializing...");
      this.unlistenCallback = await onOpenUrl(this.handleDeepLink.bind(this));
      this.isSetup = true;
      console.log("DeepLinkService: Initialized successfully");
    } catch (error) {
      console.error("DeepLinkService: Failed to initialize", error);
      throw error;
    }
  }

  /**
   * Handles incoming deep links and processes them
   * @param {string[]} urls - Array of received URLs
   * @private
   */
  handleDeepLink(urls) {
    console.log("DeepLinkService: Received URLs:", urls);

    if (!urls || urls.length === 0) {
      console.log("DeepLinkService: No URLs received");
      return;
    }

    const url = urls[0];
    console.log("DeepLinkService: Processing URL:", url);

    try {
      // Parse the URL
      const urlObj = new URL(url);
      console.log("DeepLinkService: Parsed URL:", {
        protocol: urlObj.protocol,
        pathname: urlObj.pathname,
        search: urlObj.search,
        searchParams: Object.fromEntries(urlObj.searchParams.entries()),
      });

      // Notify all listeners
      this.notifyListeners(urlObj);
    } catch (error) {
      console.error("DeepLinkService: Error processing URL:", error);
    }
  }

  /**
   * Notifies all registered listeners about the deep link
   * @param {URL} urlObj - Parsed URL object
   * @private
   */
  notifyListeners(urlObj) {
    this.listeners.forEach((listener) => {
      try {
        listener(urlObj);
      } catch (error) {
        console.error("DeepLinkService: Error in listener callback:", error);
      }
    });
  }

  /**
   * Registers a listener for deep link events
   * @param {Function} callback - Callback function to be called when a deep link is received
   * @returns {Function} Function to unregister the listener
   */
  addListener(callback) {
    if (!this.isSetup) {
      this.init().catch((error) => {
        console.error("DeepLinkService: Failed to initialize when adding listener", error);
      });
    }

    this.listeners.push(callback);
    console.log(`DeepLinkService: Added listener, total: ${this.listeners.length}`);

    // Return function to remove this specific listener
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback);
      console.log(`DeepLinkService: Removed listener, remaining: ${this.listeners.length}`);
    };
  }

  /**
   * Cleans up all listeners and resources
   */
  cleanup() {
    if (this.unlistenCallback) {
      this.unlistenCallback();
      this.unlistenCallback = null;
    }

    this.listeners = [];
    this.isSetup = false;
    console.log("DeepLinkService: Cleaned up all resources");
  }

  /**
   * Parses deep link authentication data
   * @param {URL} url - The parsed URL object
   * @returns {Object|null} Authentication data or null if invalid
   */
  parseAuthData(url) {
    if (url.protocol !== "dominara:") {
      console.log("DeepLinkService: Not a dominara: protocol URL");
      return null;
    }

    const params = new URLSearchParams(url.search);
    const token = params.get("token");
    const userStr = params.get("user");
    const verified = params.get("verified");

    console.log("DeepLinkService: Auth params:", {
      token: token ? "exists" : "missing",
      userStr: userStr ? "exists" : "missing",
      verified: verified || "missing",
    });

    if (!token || !userStr) {
      console.log("DeepLinkService: Missing token or user data");
      return null;
    }

    try {
      const userData = JSON.parse(decodeURIComponent(userStr));
      return {
        token,
        userData,
        verified: verified === "true",
      };
    } catch (error) {
      console.error("DeepLinkService: Failed to parse user data", error);
      return null;
    }
  }
}

// Create a singleton instance
const deepLinkService = new DeepLinkService();

export default deepLinkService;
