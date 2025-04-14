import { Window } from "@tauri-apps/api/window";

/**
 * Resizes the current application window
 * @param {number} width - Width in pixels
 * @param {number} height - Height in pixels
 * @returns {Promise<void>}
 */
export const resizeWindow = async (width, height) => {
  try {
    const appWindow = Window.getCurrent();
    await appWindow.setSize({
      type: "Physical",
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
 * @param {number} width - Width in pixels
 * @param {number} height - Height in pixels
 * @param {number} delay - Delay in ms between resize and center operations
 * @returns {Promise<void>}
 */
export const resizeAndCenterWindow = async (width, height, delay = 100) => {
  try {
    await centerWindow();

    await resizeWindow(width, height);

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
