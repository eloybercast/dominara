import React, { useState, useEffect } from "react";
import styles from "./AddFriend.module.scss";
import addFriendIcon from "../../../../../assets/icons/social_add.svg";
import { translate } from "../../../../../utils/i18n";
import useFriendsStore from "../../../../../stores/backend/friends";

const AddFriend = () => {
  const [friendUsername, setFriendUsername] = useState("");
  const [lastSentUsername, setLastSentUsername] = useState("");
  const { sendRequest, sendRequestStatus, resetSendRequestStatus } =
    useFriendsStore();

  useEffect(() => {
    return () => resetSendRequestStatus();
  }, [resetSendRequestStatus]);

  const handleInputChange = (e) => {
    setFriendUsername(e.target.value);
    if (sendRequestStatus.success || sendRequestStatus.error) {
      resetSendRequestStatus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!friendUsername.trim()) return;

    try {
      setLastSentUsername(friendUsername.trim());
      await sendRequest(friendUsername.trim());
      setFriendUsername("");
    } catch (error) {
      console.error("Failed to send friend request:", error);
    }
  };

  const getFriendlyErrorMessage = (error) => {
    if (!error) return "";

    const username = lastSentUsername || friendUsername;

    switch (error.code) {
      case "error_user_not_found":
        return translate("friends.error_user_not_found", { username });
      case "error_self_request":
        return translate("friends.error_self_request");
      case "error_friendship_exists":
        return translate("friends.error_friendship_exists");
      default:
        return translate(`error.${error.code}`, {
          defaultValue: error.message,
        });
    }
  };

  return (
    <div className={styles.addFriendContainer}>
      <form className={styles.addFriend} onSubmit={handleSubmit}>
        <input
          className={`${styles.input} ${
            sendRequestStatus.loading ? styles.loading : ""
          }`}
          type="text"
          maxLength={16}
          placeholder={translate("friends.add_friend_placeholder")}
          value={friendUsername}
          onChange={handleInputChange}
          disabled={sendRequestStatus.loading}
        />
        <button
          className={`${styles.button} ${
            sendRequestStatus.loading ? styles.loading : ""
          }`}
          type="submit"
          disabled={sendRequestStatus.loading || !friendUsername.trim()}
        >
          <img src={addFriendIcon} alt="add friend" />
        </button>
      </form>

      {sendRequestStatus.success && (
        <div className={`${styles.statusMessage} ${styles.success}`}>
          {translate("friends.request_sent_success", {
            username: lastSentUsername,
          })}
        </div>
      )}

      {sendRequestStatus.error && (
        <div className={`${styles.statusMessage} ${styles.error}`}>
          {getFriendlyErrorMessage(sendRequestStatus.error)}
        </div>
      )}
    </div>
  );
};

export default AddFriend;
