import React from "react";
import styles from "./FriendsList.module.scss";
import useFriendsStore from "../../../../../stores/backend/friends";
import Friend from "./components/Friend/Friend";

const FriendsList = () => {
  const { friends } = useFriendsStore();

  return (
    <div className={styles.friendsList}>
      {friends.map((friend) => (
        <Friend key={friend.id} friend={friend} />
      ))}
    </div>
  );
};

export default FriendsList;
