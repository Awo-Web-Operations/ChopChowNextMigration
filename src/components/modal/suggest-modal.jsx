
import styles from "../../components/modal/modal.module.css";
import { useEffect, useRef, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import axios from "../../util/Api";
import { toast } from "react-toastify";
import Image from "next/image";
import Frame from "../../../public/assets/logos/Frame.png";

export const SuggestModal = ({
  isShow,
  setIsShow,
  listName,
  value = "",
  refetch,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [itemName, setItemName] = useState(value);
  const handleRadioChange = (value) => {
    setSelectedOption(value);
  };
  const [itemImage, setItemImage] = useState({
    url: "",
    file: null,
  });
  const ref = useRef();
  const targetElementRef = useRef(null);

  console.log("value", value);

  // useEffect(() => {
  //   const targetElement = targetElementRef.current;

  //   if (isShow && targetElement) {
  //     disableBodyScroll(targetElement);
  //   } else {
  //     enableBodyScroll(targetElement);
  //   }

  //   return () => {
  //     clearAllBodyScrollLocks();
  //   };
  // }, [isShow]);

  const handleAdd = async () => {
    try {
      const form = new FormData();
      let value;
      if (selectedOption === "Meal") {
        value = "Meal";
      } else if (selectedOption === "Ingredient") {
        value = "Product";
      } else if (selectedOption === "Utensil") {
        value = "Utensil";
      } else {
        value = "Other"; // Default case or handle other options
      }
      form.append("item_type", value);
      form.append("item_name", itemName);
      form.append("user", JSON.parse(localStorage.getItem("user"))._id);
      form.append("listName", listName);
      if (itemImage.file) {
        form.append("item_images", itemImage.file);
      }
      const response = await axios(`/items`, {
        method: "POST",
        data: form,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      refetch();
      toast.success("Grocery list edited successfully");
      setIsShow(!isShow);
    } catch (error) {
      console.log(error);
    }
  };

  const addOtherToGroceryList = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const form = new FormData();
      form.append("listName", listName);
      form.append("item_name", itemName);
      form.append("item_type", "Other");
      form.append("user", user?._id.toString());
      if (itemImage.file) {
        form.append("item_images", itemImage.file);
      }

      const response = await axios(`/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: form,
      });

      refetch();
      toast.success("Other item added successfully");
      setIsShow(!isShow);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.modal} ref={targetElementRef}>
      <div className={styles.modal_card}>
        <div className={styles.flex2}>
          <h5 className={styles.header}>Add New Item to Grocery List</h5>
          <div
            onClick={() => {
              setIsShow(false);
            }}
          >
            <AiFillCloseCircle color="#949494" size={28} />
          </div>
        </div>
        <div style={{ width: "100%" }}>
          <p className={styles.label2}>Item Name</p>
          <input
            name="listName"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className={styles.input1}
          />
        </div>
        <div style={{ marginTop: "2.5rem" }}>
          <p className={styles.label2}>Item Image</p>
          <div>
            <div className={styles.img3}>
              <Image
                src={itemImage.url ? itemImage.url : Frame}
                width={100}
                height={120}
                objectFit="cover"
                objectPosition="center"
              />
              <p className={styles.or}>OR</p>
              <div
                onClick={() => {
                  ref.current.click();
                }}
              >
                <div className={styles.dot}>+</div>
                <p className={styles.upload}>Upload New</p>
              </div>
              <input
                type="file"
                onChange={(e) => {
                  setItemImage({
                    url: URL.createObjectURL(e.target.files[0]),
                    file: e.target.files[0],
                  });
                }}
                ref={ref}
                name="itemImage"
                style={{ display: "none" }}
              />
            </div>
            <p className={styles.label2} style={{ marginTop: "3rem" }}>
              Product Category
            </p>
            <div className={styles.radio} style={{ marginTop: "1.4rem" }}>
              <div className={styles.radioBtn}>
                <input
                  type="radio"
                  name="private"
                  id="Meal"
                  value="Private"
                  color="#F47900"
                  checked={selectedOption === "Meal"}
                  onChange={() => handleRadioChange("Meal")}
                />
              </div>
              <div className={styles.radiosub2}>
                <label htmlFor="Meal" className={styles.radioLabel}>
                  Meal
                </label>
              </div>
            </div>
            <div className={styles.radio} style={{ marginTop: "1.4rem" }}>
              <div className={styles.radioBtn}>
                <input
                  type="radio"
                  name="private"
                  id="option1"
                  value="Private"
                  color="#F47900"
                  checked={selectedOption === "Ingredient"}
                  onChange={() => handleRadioChange("Ingredient")}
                />
              </div>
              <div className={styles.radiosub2}>
                <label htmlFor="option1" className={styles.radioLabel}>
                  Ingredient
                </label>
              </div>
            </div>
            <div className={styles.radio} style={{ marginTop: "1.4rem" }}>
              <div className={styles.radioBtn}>
                <input
                  type="radio"
                  name="private"
                  id="Utensils"
                  value="Private"
                  color="#F47900"
                  checked={selectedOption === "Utensils"}
                  onChange={() => handleRadioChange("Utensils")}
                />
              </div>
              <div className={styles.radiosub2}>
                <label htmlFor="Utensils" className={styles.radioLabel}>
                  Utensils
                </label>
              </div>
            </div>
            <div className={styles.radio} style={{ marginTop: "1.4rem" }}>
              <div className={styles.radioBtn}>
                <input
                  type="radio"
                  name="private"
                  id="other"
                  value="other"
                  color="#F47900"
                  checked={selectedOption === "other"}
                  onChange={() => handleRadioChange("other")}
                />
              </div>
              <div className={styles.radiosub2}>
                <label htmlFor="other" className={styles.radioLabel}>
                  Other
                </label>
              </div>
            </div>
          </div>
        </div>
        <div
          className={styles.modal_btn2}
          onClick={() => {
            if (selectedOption === "other") {
              addOtherToGroceryList();
            } else {
              handleAdd();
            }
          }}
        >
          <p>Add Item to Grocery List</p>
        </div>
      </div>
    </div>
  );
};
