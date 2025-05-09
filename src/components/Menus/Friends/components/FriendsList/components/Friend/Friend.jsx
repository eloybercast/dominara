import React, { useMemo } from "react";
import styles from "./Friend.module.scss";

const Friend = ({ friend }) => {
  const randomRotation = useMemo(() => {
    return (Math.random() - 0.75) * 1;
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "#4CAF50";
      case "offline":
        return "#9E9E9E";
      case "afk":
        return "#FFC107";
      case "ingame":
        return "#2196F3";
      default:
        return "#9E9E9E";
    }
  };

  return (
    <article
      className={`${styles.friend} ${styles[`friend--${friend.status}`]}`}
      style={{ "--random-rotation": `${randomRotation}deg` }}
    >
      <section
        className={styles.friend__image__status}
        style={{ backgroundColor: getStatusColor(friend.status) }}
      />
      <section className={styles.friend__image}>
        <img src={friend.profileIcon} alt={friend.username} />
      </section>
      <section className={styles.friend__info}>
        <h5>{friend.username}</h5>
        <p>{friend.bio}</p>
      </section>
    </article>
  );
};

export default Friend;
