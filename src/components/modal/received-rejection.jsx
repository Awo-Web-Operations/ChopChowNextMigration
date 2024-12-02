import { useCallback, useState } from "react";
import styles from "./rejection-modal.module.css";
import { IoIosCloseCircle } from "react-icons/io";
import axios from "../../util/Api";
import { toast } from "react-toastify";

export const ReceivedModal = (props) => {
  const { suggestion } = props;
  console.log(suggestion, "new received");
  return (
    <div className={styles.modal2}>
      <div className={styles.header2}>
        <p>Reason for rejection</p>
      </div>
      <div className={styles.body}>{suggestion.rejectionMessage?.title}</div>
      <div className={styles.border} />
      <div className={styles.body}>{suggestion.rejectionMessage?.message}</div>
    </div>
  );
};
