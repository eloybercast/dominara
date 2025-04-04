import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

class UpdateService {
  async checkForUpdates(callbacks = {}) {
    const { onStatusChange = () => {}, onError = () => {}, onProgress = () => {} } = callbacks;

    try {
      const update = await check();

      if (update) {
        onStatusChange(`Found update ${update.version} from ${update.date}`);
        let downloaded = 0;
        let contentLength = 0;

        await update.downloadAndInstall((event) => {
          switch (event.event) {
            case "Started":
              contentLength = event.data.contentLength || "unknown";
              onStatusChange(`Starting download of ${contentLength} bytes`);
              break;
            case "Progress":
              downloaded += event.data.chunkLength;
              onProgress(downloaded, contentLength);
              onStatusChange(`Downloaded ${downloaded} of ${contentLength} bytes`);
              break;
            case "Finished":
              onStatusChange("Download finished, installing...");
              break;
            default:
              onError(`Unknown event during update: ${event.event}`);
              console.error("Unknown event:", event);
          }
        });

        onStatusChange("Update installed, restarting...");
        await this.restartApp();
        return true;
      }

      onStatusChange("No updates available");
      return false;
    } catch (error) {
      console.error("Update process failed:", error);
      const errorDetails = error.message || JSON.stringify(error) || "Unknown error occurred";
      onError(`Update failed: ${errorDetails}`);
      throw error;
    }
  }

  async restartApp() {
    await relaunch();
  }
}

export default new UpdateService();
