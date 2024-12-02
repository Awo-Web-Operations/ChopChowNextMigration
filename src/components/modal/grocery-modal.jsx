
import styles from "../../components/modal/modal.module.css";
import { useEffect, useRef, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import axios from "../../util/Api";
import { toast } from "react-toastify";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

export const GroceryModal = ({ openModal, setOpenModal, details, refetch }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleRadioChange = (value) => {
    setSelectedOption(value);
  };
  const targetElementRef = useRef(null);

  const handleEdit = async () => {
    try {
      await axios(`/groceries/create/${details.id}`, {
        method: "PATCH",
        data: {
          listName: details.listName,
          description: details.description,
          status: selectedOption,
        },
      });

      toast.success("Grocery list updated successfully");
      setOpenModal(false);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.modal} ref={targetElementRef}>
      <div className={styles.modal_card2}>
        <div className={styles.flex2}>
          <h5 className={styles.header}>Grocery List Visibilty</h5>
          <div
            onClick={() => {
              setOpenModal(false);
            }}
          >
            <IoMdCloseCircle className={styles.closed} color="#949494" />
          </div>
        </div>

        <div>
          <p className={styles.sub}>
            Control who can see your list by selecting either public or private
            settings.
          </p>
        </div>
        <div className={styles.radio}>
          <div className={styles.border}>
            <input
              type="radio"
              name="private"
              id="option1"
              value="Private"
              color="#F47900"
              checked={selectedOption === "Private"}
              onChange={() => handleRadioChange("Private")}
            />
          </div>
          <AiFillEyeInvisible style={{ marginLeft: ".5rem" }} />
          <div className={styles.radiosub}>
            <label htmlFor="option1" className={styles.radioLabel}>
              Private
            </label>
            <p className={styles.text2}>
              Keep your grocery list confidential and accessible only to you.
            </p>
          </div>
        </div>
        <div className={styles.radio}>
          <div className={styles.border}>
            <input
              type="radio"
              name="label"
              id="option2"
              value="Public"
              color="#F47900"
              checked={selectedOption === "Public"}
              onChange={() => handleRadioChange("Public")}
            />
          </div>
          <AiFillEye style={{ marginLeft: ".5rem" }} />
          <div className={styles.radiosub}>
            <label htmlFor="option2" className={styles.radioLabel}>
              Public
            </label>
            <p className={styles.text2}>
              Make your grocery list visible to others
            </p>
          </div>
        </div>
        <button onClick={handleEdit} className={styles.button}>
          Done
        </button>
      </div>
    </div>
  );
};
