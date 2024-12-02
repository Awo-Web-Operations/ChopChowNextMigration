import { useCallback, useState } from "react";
import styles from "./rejection-modal.module.css";
import { IoIosCloseCircle } from "react-icons/io";
import axios from "../../util/Api";
import { toast } from "react-toastify";

export const RejectionModal = ({ setOpenModal, itemId, getUserItems }) => {
  const [form, setForm] = useState({
    title: "",
    message: "",
  });

  const handleReject = useCallback(
    async () => {
      try {
        const res = await axios.post(`/items/item-control`, {
          itemId: itemId,
          status: "Rejected",
          title: form.title,
          message: form.message,
        });
        console.log(res);
        setOpenModal(false);
        toast.success("Meal rejected successfully");
        getUserItems()
      } catch (e) {
        console.log(e);
      }
    },
    [form],
    itemId
  );
  return (
    <div className={styles.modalContainer}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <p>Reason for rejection</p>
          <div onClick={() => setOpenModal(false)}>
            {" "}
            <IoIosCloseCircle color="#fff" size={30} />
          </div>
        </div>
        <div className={styles.body}>
          <label>Title</label>
          <input
            onChange={(e) => {
              setForm({
                ...form,
                title: e.target.value,
              });
            }}
          />
        </div>
        <div className={styles.body}>
          <label>Add Note</label>
          <textarea
            onChange={(e) => {
              setForm({
                ...form,
                message: e.target.value,
              });
            }}
            type="text"
            name=""
          />
        </div>
        <div className={styles.flexend}>
          <button onClick={() => form.message && form.title && handleReject()}>
            Add Note
          </button>
        </div>
      </div>
    </div>
  );
};
