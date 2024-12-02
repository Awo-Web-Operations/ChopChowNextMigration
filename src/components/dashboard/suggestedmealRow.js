import { CloseFillIcon, FillterIcon } from "../icons";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import styles from "./suggestedmeals.module.css";
import {
  status,
  approve,
  pending,
  rejected,
  actionIcon,
} from "./dashboard.module.css";
import { useState } from "react";
import Select from "react-select";

import ArrowDropUp from "@mui/icons-material/ArrowDropUp";
import { ReceivedModal } from "../modal/received-rejection";
import { useSelector } from "react-redux";
function SuggestedMealRow(props) {
  const [show, setShowState] = useState(false);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const { suggestion } = props;

  // console.log(JSON.parse(suggestion.meal_categories).toString(), "meal categories")

  function showDropDown() {
    setShowState(!show);
  }
  const [selectedAction, setSelectedAction] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showRejection, setShowRejection] = useState(false);

  const handleClickPopup = () => {
    setShowPopup(true);
  };
  const selectedUserType = useSelector((state) => state.userType.selectedUserType);

  const options = [
    { value: "default", label: "Select..." },
    {
      value: "sendForReview",
      label: "Send for review",
      // isDisabled:
      //   suggestion.item_status[0]?.status !== "Draft" &&
      //   suggestion.item_status[0]?.status !== "Rejected",
    },
    {
      value: "availableInInventory",
      label: "Available in Inventory",
      // isDisabled:
      //   suggestion.item_available === false ||
      //   suggestion.item_available === undefined,
    },
    {
      value: "sendToInventory",
      label: "Send to Inventory",
      // isDisabled: !(suggestion.item_status[0]?.status === "Public"),
    },
    {
      value: "Draft",
      label: "Draft",
      // isDisabled:
      //   suggestion.item_status[0]?.status === "Draft",
    }

  ];
  const handleSelectChange = async (selectedOption) => {
    console.log("Selected option:", selectedOption);
    setSelectedAction(selectedOption);

    if (selectedOption.value === "sendForReview") {
      props.handleSendForReview(suggestion._id, "Pending");
    } else if (selectedOption.value === "Draft") {
      props.handleStatusType("Draft", suggestion._id)
      console.log(suggestion, 'idd')

    } else if (
      selectedOption.value === "sendToInventory" &&
      suggestion.item_status[0]?.status === "Public"
    ) {
      props.toggleTransferToInventory(suggestion);
    }
  };


  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "100%",
    }),
  };
  console.log(suggestion, "suggested");
  return (
    <div key={suggestion._id} className={styles.request_tr_div}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <tbody>
          <tr
            className={
              selectedUserType === "supplier"
                ? styles.meal_tr
                : styles.meal_tr1
            }
          >
            <td className={styles.td_name}>
              <p
                onClick={
                  selectedUserType === "admin"
                    ? () => props.toggleOpenMeal(suggestion)
                    : props.searchType === "Item"
                      ? () => props.openMealDetailsModal(suggestion)
                      : () => props.openDetailsModal(suggestion)

                }
              >
                {selectedUserType === "supplier" &&
                  props.searchType === "Item"
                  ? suggestion.item_name.length > 25
                    ? suggestion.item_name.slice(0, 25) + "..."
                    : suggestion.item_name
                  : props.searchType === "Item"
                    ? suggestion.item_name
                    : suggestion?.category_name}
              </p>
            </td>
            <td className={styles.td_name}>
              <p
                onClick={
                  selectedUserType === "admin"
                    ? () => props.toggleOpenMeal(suggestion)
                    : props.searchType === "Item"
                      ? () => props.openMealDetailsModal(suggestion)
                      : () => props.openDetailsModal(suggestion)
                }
                className={styles.hide}
              >
                {props.searchType === "Item"
                  ? suggestion.item_type
                  : props.searchType === "Product"
                    ? suggestion.item_type
                    : suggestion?.category_name}
              </p>
            </td>
            <td
              className={styles.td_name}
              onMouseEnter={() => setShowRejection(true)}
              onMouseLeave={() => setShowRejection(false)}
            >
              <p
                onClick={
                  selectedUserType === "admin"
                    ? () => props.toggleOpenMeal(suggestion)
                    : props.searchType === "Item"
                      ? () => props.openMealDetailsModal(suggestion)
                      : () => props.openDetailsModal(suggestion)
                }
                className={
                  status +
                  " " +
                  (suggestion.item_status[0]?.status === "Draft" ||
                    suggestion.item_status[0]?.status === "Pending"
                    ? pending
                    : suggestion.item_status[0]?.status === "Public"
                      ? approve
                      : suggestion.item_status[0]?.status === "Rejected"
                        ? rejected
                        : "")
                }
              >
                {props.searchType !== "Category"
                  ? suggestion.item_status[0]?.status
                  : suggestion.publicly_available}
              </p>

              {suggestion.item_status[0]?.status === "Rejected" &&
                suggestion._id &&
                showRejection && <ReceivedModal suggestion={suggestion} />}
            </td>
            <td className={styles.td_cat}>
              <p
                onClick={
                  selectedUserType === "admin"
                    ? () => props.toggleOpenMeal(suggestion)
                    : props.searchType === "Item"
                      ? () => props.openMealDetailsModal(suggestion)
                      : () => props.openDetailsModal(suggestion)
                }
                className={styles.hideData}
              >
                {props.searchType === "Item"
                  ? suggestion.item_categories.length > 0 &&
                  suggestion.item_categories
                    .map((ele) => ele?.category_name)
                    .join(", ")
                  : suggestion.product_categories &&
                  suggestion.product_categories.length > 0 &&
                  suggestion.product_categories[0]}
              </p>
            </td>
            <td className={styles.td_cat}>
              <p
                onClick={
                  selectedUserType === "admin"
                    ? () => props.toggleOpenMeal(suggestion)
                    : props.searchType === "Item"
                      ? () => props.openMealDetailsModal(suggestion)
                      : () => props.openDetailsModal(suggestion)
                }
                className={styles.hideData}
              >
                {suggestion.createdAt &&
                  new Date(suggestion.createdAt).toDateString()}
              </p>
            </td>
            <td className={styles.td_name}>
              <div className={styles.actions_con}>
                {selectedUserType !== "admin" && (
                  <div className={styles.selectContainer}>
                    <Select
                      styles={customStyles}
                      defaultValue={selectedAction}
                      onChange={handleSelectChange}
                      options={options.filter((option) => {
                        const status = suggestion.item_status[0]?.status;
                        const hasPrice = !!suggestion.item_price;
                        if (status === "Draft") {
                          return option.value === "sendForReview";
                        }
                        if (status === "Public") {
                          if (option.value === "Draft") return true;
                          if (option.value === "availableInInventory") return hasPrice;
                          if (option.value === "sendToInventory") return !hasPrice;
                        }
                        return false;
                      })}

                    />
                  </div>
                )}

                <i
                  onClick={() => {
                    // props.deleteSuggestion(suggestion._id)

                    handleClickPopup();
                  }}
                >
                  <CloseFillIcon style={actionIcon} />
                </i>

                {showPopup && (
                  <div className={styles.addpublicMeal_container}>
                    <div className={styles.popup}>
                      <p>
                        Are you sure you want to delete {suggestion.item_name}?
                      </p>
                      <div className={styles.flexPopup}>
                        <div
                          className={styles.deletePopup}
                          onClick={() => props.deleteItem(suggestion._id)}
                        >
                          <p>Yes</p>
                        </div>
                        <div
                          className={styles.deleteOutline}
                          onClick={() => setShowPopup(false)}
                        >
                          {" "}
                          <p>No</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default SuggestedMealRow;
