import React, { useEffect } from "react";
import { setFullscreen, exitFullscreen } from "../../utils/tauri/windowUtils";
import styles from "./Lobby.module.scss";
import ModeSelector from "./components/ModeSelector/ModeSelector";
import Container from "./components/Container/Container";
import { FaUserFriends } from "react-icons/fa";
import { GiHamburgerMenu, GiTwoCoins } from "react-icons/gi";
import useFriendsStore from "../../stores/backend/friends";
import useUserStore from "../../stores/backend/user";

const Lobby = () => {
  const { friends } = useFriendsStore();
  const { user } = useUserStore();

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

  return (
    <main className={styles.lobby}>
      <section className={styles.lobby__topbar}>
        <div className={styles.lobby__topbar__left}>
          <Container icon={FaUserFriends} text={friends.length} />
        </div>
        <div className={styles.lobby__topbar__right}>
          <Container icon={GiTwoCoins} text={user?.coins} />
          <Container icon={GiHamburgerMenu} text={null} />
        </div>
      </section>
      <section className={styles.lobby__modeSelector}>
        <ModeSelector />
      </section>
    </main>
  );
};

export default Lobby;
