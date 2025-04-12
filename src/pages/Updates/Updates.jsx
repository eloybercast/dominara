import React, { useEffect } from "react";
import useUpdateStore from "../../stores/updates";
import logoIcon from "../../assets/logo.svg";
import styles from "./Updates.module.scss";
import ProgressBar from "../../components/Progress/ProgressBar/ProgressBar";
import { Window } from "@tauri-apps/api/window";

const formatBytes = (bytes) => {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${units[i]}`;
};

const Updates = () => {
  const { errorMessage, checkForUpdates, downloadProgress, updateStatus, isUpdating } = useUpdateStore();

  useEffect(() => {
    const updaterWindow = Window.getCurrent();

    checkForUpdates().then(async (updateAvailable) => {
      if (!updateAvailable) {
        try {
          const authWindow = new Window("auth");
          await authWindow.show();
          await authWindow.unminimize();
          await authWindow.setFocus();

          await updaterWindow.close();
        } catch (error) {
          console.error("Error transitioning to auth window:", error);
        }
      }
    });
  }, [checkForUpdates]);

  return (
    <main className={styles.updates}>
      <section className={styles.updates__logo}>
        <img src={logoIcon} alt="Logo" className={styles.logo} />
      </section>
      <section className={styles.updates__progress}>
        {isUpdating ? (
          <ProgressBar progress={downloadProgress.downloaded} total={downloadProgress.total} />
        ) : (
          <small>
            {formatBytes(downloadProgress.downloaded)} / {formatBytes(downloadProgress.total)}
          </small>
        )}
      </section>
    </main>
  );
};

export default Updates;
