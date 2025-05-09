import { Window } from "@tauri-apps/api/window";

/**
 * Resizes the current application window using logical pixels
 * @param {number} width - Width in logical pixels
 * @param {number} height - Height in logical pixels
 * @returns {Promise<void>}
 */
export const resizeWindow = async (width, height) => {
  try {
    const appWindow = Window.getCurrent();
    await appWindow.setSize({
      type: "Logical",
      width,
      height,
    });
  } catch (error) {
    console.error("Error resizing window:", error);
    throw error;
  }
};

/**
 * Centers the current window on screen
 * @returns {Promise<void>}
 */
export const centerWindow = async () => {
  try {
    const appWindow = Window.getCurrent();
    await appWindow.center();
  } catch (error) {
    console.error("Error centering window:", error);
    throw error;
  }
};

/**
 * Resizes and centers the window with a small delay between operations
 * @param {number} width - Width in logical pixels
 * @param {number} height - Height in logical pixels
 * @param {number} delay - Delay in ms between resize and center operations
 * @returns {Promise<void>}
 */
export const resizeAndCenterWindow = async (width, height, delay = 100) => {
  try {
    await resizeWindow(width, height);

    await centerWindow();

    setTimeout(async () => {
      try {
        await centerWindow();
      } catch (err) {
        console.error("Error during recentering:", err);
      }
    }, delay);
  } catch (error) {
    console.error("Error resizing and centering window:", error);
  }
};

/**
 * Sets the window to fullscreen mode
 * @returns {Promise<void>}
 */
export const setFullscreen = async () => {
  try {
    const appWindow = Window.getCurrent();
    
    await appWindow.maximize();
    
    await appWindow.setFullscreen(true);
    
  } catch (error) {
    console.error("Failed to set fullscreen mode:", error);
    throw error;
  }
};

/**
 * Exits fullscreen mode if the window is currently in fullscreen
 * @returns {Promise<void>}
 */
export const exitFullscreen = async () => {
  try {
    const appWindow = Window.getCurrent();
    if (await appWindow.isFullscreen()) {
      await appWindow.setFullscreen(false);
    }
  } catch (error) {
    console.error("Failed to exit fullscreen mode:", error);
    throw error;
  }
};

/**
 * Maximizes the window
 * @returns {Promise<void>}
 */
export const maximizeWindow = async () => {
  try {
    const appWindow = Window.getCurrent();
    await appWindow.maximize();
  } catch (error) {
    console.error("Failed to maximize window:", error);
    throw error;
  }
};

/**
 * Minimizes the window
 * @returns {Promise<void>}
 */
export const minimizeWindow = async () => {
  try {
    const appWindow = Window.getCurrent();
    await appWindow.minimize();
  } catch (error) {
    console.error("Failed to minimize window:", error);
    throw error;
  }
}; 