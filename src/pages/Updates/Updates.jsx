import React, { useEffect } from "react";
import useUpdateStore from "../../stores/tauri/updates";
import useUserStore from "../../stores/backend/user";
import useFriendsStore from "../../stores/backend/friends";
import logoIcon from "../../assets/logo.svg";
import styles from "./Updates.module.scss";
import ProgressBar from "../../components/Progress/ProgressBar/ProgressBar";
import { useNavigate } from "react-router-dom";
import { resizeAndCenterWindow } from "../../utils/tauri/windowUtils";

const formatBytes = (bytes) => {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${units[i]}`;
};

const Updates = () => {
  const {
    errorMessage,
    checkForUpdates,
    downloadProgress,
    updateStatus,
    isUpdating,
  } = useUpdateStore();
  const { fetchMe, fetchCoins } = useUserStore();
  const { fetchFriends } = useFriendsStore();
  const navigate = useNavigate();

  useEffect(() => {
    resizeAndCenterWindow(300, 500).catch((err) => {
      console.error("Failed to resize window:", err);
    });

    checkForUpdates().then(async (updateAvailable) => {
      if (!updateAvailable) {
        try {
          await Promise.all([
            fetchMe().catch((error) =>
              console.error("Error fetching user data:", error)
            ),
            fetchCoins().catch((error) =>
              console.error("Error fetching coins:", error)
            ),
            fetchFriends().catch((error) =>
              console.error("Error fetching friends:", error)
            ),
          ]);

          navigate("/lobby");
        } catch (error) {
          console.error("Error loading data:", error);
          navigate("/lobby");
        }
      }
    });
  }, [checkForUpdates, fetchMe, fetchCoins, fetchFriends, navigate]);

  return (
    <main className={styles.updates}>
      <section className={styles.updates__logo}>
        <img src={logoIcon} alt="Logo" className={styles.logo} />
      </section>
      <section className={styles.updates__progress}>
        {isUpdating ? (
          <ProgressBar
            progress={downloadProgress.downloaded}
            total={downloadProgress.total}
          />
        ) : (
          <small>
            {formatBytes(downloadProgress.downloaded)} /{" "}
            {formatBytes(downloadProgress.total)}
          </small>
        )}
      </section>
    </main>
  );
};

export default Updates;
