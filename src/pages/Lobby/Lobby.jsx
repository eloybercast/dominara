import React, { useEffect } from "react";
import { setFullscreen, exitFullscreen } from "../../utils/tauri/windowUtils";
import { formatNumber } from "../../utils/format/numbersFormatting";
import styles from "./Lobby.module.scss";
import ModeSelector from "./components/ModeSelector/ModeSelector";
import Container from "./components/Container/Container";
import Play from "./components/Play/Play";
import Locker from "./components/Locker/Locker";
import Shop from "./components/Shop/Shop";
import BattlePass from "./components/BattlePass/BattlePass";
import { FaUserFriends } from "react-icons/fa";
import { GiHamburgerMenu, GiTwoCoins } from "react-icons/gi";
import useFriendsStore from "../../stores/backend/friends";
import useUserStore from "../../stores/backend/user";
import useLobbbyModeStore from "../../stores/common/lobbyMode";

const Lobby = () => {
  const { friends } = useFriendsStore();
  const { user } = useUserStore();
  const { selectedMode } = useLobbbyModeStore();

  useEffect(() => {
    setFullscreen().catch((error) => {
      console.error("Error in Lobby fullscreen setup:", error);
    });

    return () => {
      exitFullscreen().catch((error) => {
        console.error("Error exiting fullscreen:", error);
      });
    };
  }, []);

  const renderSelectedMode = () => {
    switch (selectedMode) {
      case "play":
        return <Play />;
      case "locker":
        return <Locker />;
      case "season_pass":
        return <BattlePass />;
      case "item_shop":
        return <Shop />;
      default:
        return <Play />;
    }
  };

  return (
    <main className={styles.lobby}>
      <section className={styles.lobby__topbar}>
        <div className={styles.lobby__topbar__left}>
          <Container icon={FaUserFriends} text={friends.length} />
        </div>
        <div className={styles.lobby__topbar__right}>
          <Container icon={GiTwoCoins} text={formatNumber(user.coins)} />
          <Container icon={GiHamburgerMenu} text={null} />
        </div>
      </section>
      <section className={styles.lobby__modeSelector}>
        <ModeSelector />
      </section>
      <section className={styles.lobby__content}>{renderSelectedMode()}</section>
    </main>
  );
};

export default Lobby;
