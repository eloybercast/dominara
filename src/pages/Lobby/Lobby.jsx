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
import FriendsMenu from "../../components/Menus/Friends/FriendsMenu";
import OptionsMenu from "../../components/Menus/OptionsMenu/OptionsMenu";
import { FaUserFriends } from "react-icons/fa";
import { GiHamburgerMenu, GiTwoCoins } from "react-icons/gi";
import useFriendsStore from "../../stores/backend/friends";
import useUserStore from "../../stores/backend/user";
import useLobbbyModeStore from "../../stores/common/lobbyMode";
import useFriendsMenuStore from "../../stores/common/friendsMenu";
import useOptionsMenuStore from "../../stores/common/optionsMenu";
import { AnimatePresence } from "framer-motion";

const Lobby = () => {
  const { friends } = useFriendsStore();
  const { user } = useUserStore();
  const { selectedMode, isExiting } = useLobbbyModeStore();
  const { openMenu } = useFriendsMenuStore();
  const { toggleMenu: toggleOptionsMenu } = useOptionsMenuStore();

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
        return <Play key="play" isExiting={isExiting} />;
      case "locker":
        return <Locker key="locker" isExiting={isExiting} />;
      case "season_pass":
        return <BattlePass key="season_pass" isExiting={isExiting} />;
      case "item_shop":
        return <Shop key="item_shop" isExiting={isExiting} />;
      default:
        return <Play key="play" isExiting={isExiting} />;
    }
  };

  return (
    <main className={styles.lobby}>
      <section className={styles.lobby__topbar}>
        <div className={styles.lobby__topbar__left}>
          <div className={styles.clickable} onClick={openMenu}>
            <Container icon={FaUserFriends} text={friends.length} />
          </div>
        </div>
        <div className={styles.lobby__topbar__right}>
          <Container icon={GiTwoCoins} text={formatNumber(user?.coins || 0)} />
          <div className={styles.clickable} onClick={toggleOptionsMenu}>
            <Container icon={GiHamburgerMenu} text={null} />
          </div>
        </div>
      </section>
      <section className={styles.lobby__modeSelector}>
        <ModeSelector />
      </section>
      <section className={styles.lobby__content}>
        <AnimatePresence mode="wait">{renderSelectedMode()}</AnimatePresence>
      </section>

      <FriendsMenu />
      <OptionsMenu />
    </main>
  );
};

export default Lobby;
