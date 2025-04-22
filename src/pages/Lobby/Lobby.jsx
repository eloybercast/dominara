import React, { useEffect } from "react";
import { setFullscreen, exitFullscreen } from "../../utils/tauri/windowUtils";
import styles from "./Lobby.module.scss";

const Lobby = () => {
  useEffect(() => {
    setFullscreen().catch(error => {
      console.error("Error in Lobby fullscreen setup:", error);
    });

    return () => {
      exitFullscreen().catch(error => {
        console.error("Error exiting fullscreen:", error);
      });
    };
  }, []);

  return (
    <div className={styles.lobby}>
      <h1>test</h1>
    </div>
  );
};

export default Lobby;
