import React, { useEffect, useState } from "react";
import useUpdateStore from "../../stores/updates";
import logoIcon from "../../assets/logo.svg";
import styles from "./Updates.module.scss";
import ProgressBar from "../../components/Progress/ProgressBar/ProgressBar";
import { Window } from "@tauri-apps/api/window"; // Importar la API de ventana de Tauri

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
    checkForUpdates().then((updateAvailable) => {
      if (!updateAvailable) {
        const authWindow = new Window("auth");
        authWindow.show();
        authWindow.unminimize();
        authWindow.setFocus();
        const updaterWindow = Window.getCurrent();
        updaterWindow.close();
      }
    });
  }, [checkForUpdates]);

  return (
    <main className={styles.updates}>
      <section className={styles.updates__logo}>
        <img src={logoIcon} alt="Logo" className={styles.logo} />
      </section>
      <section className={styles.updates__progress}>
        <ProgressBar
          progress={isUpdating ? (downloadProgress.downloaded / downloadProgress.total) * 100 : 90}
          total={100}
        />
        {isUpdating && (
          <small>
            {formatBytes(downloadProgress.downloaded)} / {formatBytes(downloadProgress.total)}
          </small>
        )}
      </section>
    </main>
  );
};

export default Updates;
