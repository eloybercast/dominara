import React from "react";
import styles from "./ModeSelector.module.scss";
import { translate } from "../../../../utils/i18n";
import useLobbbyModeStore from "../../../../stores/common/lobbyMode";

const ModeSelector = () => {
  const { selectedMode, setSelectedMode } = useLobbbyModeStore();

  const modes = [
    { id: "play", key: "lobby.modes.play" },
    { id: "locker", key: "lobby.modes.locker" },
    { id: "season_pass", key: "lobby.modes.season_pass" },
    { id: "item_shop", key: "lobby.modes.item_shop" },
  ];

  return (
    <div className={styles.modeSelector}>
      {modes.map((mode) => (
        <div
          key={mode.id}
          className={`${styles.modeOption} ${selectedMode === mode.id ? styles.active : ""}`}
          onClick={() => setSelectedMode(mode.id)}
        >
          <h4>{translate(mode.key)}</h4>
        </div>
      ))}
    </div>
  );
};

export default ModeSelector;
