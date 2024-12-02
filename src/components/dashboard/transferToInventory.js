import CancelIcon from "@mui/icons-material/Cancel";
import styles from "./transferToInventory.module.css";
import styled from "styled-components";
import Switch from "react-switch";
import { useEffect, useState } from "react";
import axios from "../../util/Api";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Image from "next/image";
import { AiFillInfoCircle } from "react-icons/ai";
import { useMediaQuery } from "../../hooks/usemediaquery";
import Select from "react-select";
import { toast } from "react-toastify";

// const CustomSwitch = ({ checked, onChange }) => {
//   return (
//     <SwitchContainer onClick={() => onChange(!checked)}>
//       <SwitchSlider checked={checked}>
//         <SwitchBackground />
//         <SwitchLabel checked={checked}>{checked ? "Yes" : "No"}</SwitchLabel>
//       </SwitchSlider>
//     </SwitchContainer>
//   );
// };
const CustomSwitch = ({ checked, onChange }) => {
  const handleClick = () => {
    const newChecked = !checked;
    onChange(newChecked);
  };

  return (
    <div className={styles.switch} onClick={handleClick}>
      <div className={styles.flexed}>
        <p style={{ fontSize: "12px", marginLeft: "2px" }}>Yes</p>
        <p style={{ fontSize: "12px", marginLeft: "2px" }}>No</p>
      </div>
      <div className={checked ? styles.roundSwitch : styles.roundSwitch2}>
        <p>{checked ? "Yes" : "No"}</p>
      </div>
    </div>
  );
};

const SwitchContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  background-color: "#FFF"
  box-shadow: "0px 4px 5px 0px #0000001A",

`;

const SwitchSlider = styled.div`
  position: relative;
  cursor: pointer;
  width: 60px;
  height: 34px;
  background-color: ${(props) => (props.checked ? "#fff" : "#4CAF50")};
  border-radius: 34px;
`;

const SwitchBackground = styled.div`
  position: absolute;
  width: ${(props) => (props.checked ? "100%" : "0%")};
  height: 100%;
  background-color: #4caf50;
  border-radius: 34px;
  transition: width 0.2s ease;
`;

const SwitchLabel = styled.span`
  color: black;
  position: absolute;
  top: 50%;
  left: ${(props) => (props.checked ? "5px" : "calc(100% - 25px)")};
  transform: translate(-50%, -50%);
  transition: left 0.2s ease;
`;

export default function TransferToInventory(props) {
  const matches = useMediaQuery("(min-width: 700px)");
  const [restockOption, setRestockOption] = useState();
  const [restockTime, setRestockTime] = useState("1 day");
  const [message, setMessage] = useState({
    response: "",
    success: false,
  });
  const [show, setShow] = useState(false);
  const [currency, setCurrency] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [formState, setFormState] = useState({
    prepackagedMeal: false,
    ingredientsAvailable: [],
    estimated_preparation_time: 0,
    item_type: "Meal",
    in_stock: true,
  });
  const { reloadData } = props;

  const { ingredientsAvailable, item_type, in_stock } = formState;

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "meal_type") {
      if (value === "packaged") {
        setFormState({
          ...formState,
          [name]: value,
          ["prepackagedMeal"]: true,
        });
      } else {
        setFormState({
          ...formState,
          [name]: value,
          ["prepackagedMeal"]: false,
        });
      }
    } else {
      setFormState({ ...formState, [name]: value });
    }
  }

  function handleInStockChange(value) {
    setFormState({ ...formState, in_stock: value });
  }

  function handleIngredientChange(e, id, key) {
    const { value } = e.target;
    let ingredientsAvailable = formState.ingredientsAvailable;
    ingredientsAvailable[id][key] = value;
    setFormState({
      ...formState,
      ["ingredientsAvailable"]: ingredientsAvailable,
    });
  }

  function handleIngredientAvailabilityChange(value, id, key) {
    // Create a shallow copy of the ingredientsAvailable array
    const updatedIngredientsAvailable = [...formState.ingredientsAvailable];

    // Update the availability of the ingredient at the specified index
    updatedIngredientsAvailable[id] = {
      ...updatedIngredientsAvailable[id],
      [key]: value,
    };

    // Update the formState with the updated ingredientsAvailable array
    setFormState({
      ...formState,
      ingredientsAvailable: updatedIngredientsAvailable,
    });
  }

  function sendToInventory() {
    let fields = formState;
    if (!fields["meal_price"] || fields["meal_price"] == 0) {
      toast.error(`Meal price cannot be empty!`);
    }
    delete fields.meal_type;
    fields["item"] = props.meal._id;
    fields.ingredients = formState.ingredientsAvailable;
    delete formState.ingredientsAvailable;
    fields.user = JSON.parse(localStorage.getItem("user"))?._id ?? "";
    axios
      .post("/inventory/create-inventory", fields)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          props.setTransferToInventoryState(false);
          setShow(true);
          setTimeout(() => {
            setShow(false);
          }, 4000);
          setMessage({
            response:
              "Your request has been sent to the administrator; you will be notified when it is approved or rejected. It might take up to 2-3 hours, so please be patient.",
            success: true,
          });
          reloadData();
          // window.location.href = "/SuggestMeal"
        } else {
          setMessage("Something wrong happened");
        }
      })
      .catch((error) => {
        props.setTransferToInventoryState(false);
        setShow(true);
        setTimeout(() => {
          setShow(false);
        }, 4000);
        setMessage({
          response:
            "Your request cannot be completed as Item is already in Inventory",
          success: false,
        });
        console.log(error);
      });
  }

  function handleRestockTimeChange(type) {
    setRestockTime(type);
    toggleRestockTimeOption();
  }

  function toggleRestockTimeOption() {
    setRestockOption(!restockOption);
  }

  useEffect(() => {
    if (
      Array.isArray(props?.meal?.ingredeints_in_item) &&
      props?.meal?.ingredeints_in_item?.length
    ) {
      const resp = props?.meal?.ingredeints_in_item?.map((element) => {
        return {
          item_name: element.item_name,
          item_quantity: element.item_quantity,
          set_price: "",
          product_available: true,
        };
      });
      setFormState({ ...formState, ingredientsAvailable: resp });
    }
  }, [props]);
  const [allStores, setAllStores] = useState([]);
  const getSelectedStoreCurrencySymbol = () => {
    const selectedStoreObj = allStores.find(
      (store) => store._id === formState.storeId
    );

    return selectedStoreObj?.currency?.symbol || "$"; // Default to '$' if not found
  };
  const fetchOneUserStore = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"))?._id;
      const response = await axios(`/stores/user/${user}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setAllStores(response.data.data);
      setCurrency(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchOneUserStore();
  }, []);
  if (in_stock) {
  } else {
  }

  const storeOptions = allStores?.map((elem) => ({
    value: elem?._id,
    label: elem?.store_name,
  }));

  return (
    <>
      {show && (
        <div className={styles.transToIn_container}>
          <div className={styles.success}>
            <div className={styles.top}>
              {message.success ? (
                <Image
                  width={60}
                  height={60}
                  src="/assets/icons/sent.png"
                  objectFit="cover"
                  objectPosition="center"
                />
              ) : (
                <Image
                  width={60}
                  height={60}
                  src="/assets/icons/not-sent.png"
                  objectFit="cover"
                  objectPosition="center"
                />
              )}
              <h4>{message.success ? "Sent" : "Not Sent"}</h4>
              <p>{message.response}</p>
            </div>
            {message.success && (
              <div>
                <div className={styles.bor} />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AiFillInfoCircle color="#6D6D6D" />
                  <p style={{ marginLeft: ".3rem" }}>
                    It might take up to 2-3 hours, so please be patient.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {props.transferToInventory && (
        <div className={styles.transToIn_container}>
          <div className={styles.transToIn}>
            <div className={styles.transToIn_top}>
              <h2>Transfer {" " + item_type + " "} to Inventory</h2>

              <div onClick={props.toggleTransferToInventory}>
                <CancelIcon className={styles.transToIn_cancel_con} />
              </div>
            </div>

            <div className={styles.transToIn_details_con}>
              <div
                style={{
                  flexDirection: "column",
                  display: "flex",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
                }}
              >
                <label
                  htmlFor="mySelect"
                  style={{ paddingBottom: "1rem", fontSize: "14px" }}
                >
                  Which store are you sending from?
                </label>

                <div className={styles.dropdown}>
                  {/* <button className={styles.dropdownButton}>Select Stores</button> */}
                  <div>
                    {allStores?.map((store) => (
                      <label key={store._id} style={{ marginLeft: "1rem" }}>
                        <input
                          style={{ marginRight: ".5rem" }}
                          type="checkbox"
                          value={store._id}
                          checked={
                            formState.storeId?.includes(store._id) || false
                          }
                          onChange={(e) => {
                            const storeIds = formState.storeId || [];
                            const selectedValues = e.target.checked
                              ? [...storeIds, e.target.value]
                              : storeIds.filter((id) => id !== e.target.value);

                            setFormState({
                              ...formState,
                              storeId: selectedValues,
                            });
                            setSelectedStore(selectedValues);
                          }}
                        />
                        {store.store_name}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.transToIn_meal_types}>
                <p>Choose Meal Type</p>
                {props?.meal?.item_type === "Meal" ? (
                  <div className={styles.transToIn_meal_type}>
                    <div className={styles.transToIn_meal_type_option}>
                      <input
                        onChange={handleChange}
                        className={styles.transToIn_meal_type_radioInput}
                        type="radio"
                        id="non packaged"
                        name="meal_type"
                        value="non packaged"
                      />
                      <label
                        htmlFor="non packaged"
                        className={styles.transToIn_meal_type_radio_button}
                      ></label>
                      <label
                        htmlFor="non packaged"
                        className={styles.transToIn_meal_type_radioLabel}
                      >
                        Non-prepackaged meal
                      </label>
                      <label
                        htmlFor="non packaged"
                        className={styles.transToIn_meal_type_radioLabel2}
                      >
                        Includes all the ingredients needed in preparation of
                        this meal
                      </label>
                    </div>
                    <div className={styles.transToIn_meal_type_option}>
                      <input
                        className={styles.transToIn_meal_type_radioInput}
                        type="radio"
                        onChange={handleChange}
                        id="packaged"
                        name="meal_type"
                        value="packaged"
                      />
                      <label
                        htmlFor="packaged"
                        className={styles.transToIn_meal_type_radio_button}
                      ></label>
                      <label
                        htmlFor="packaged"
                        className={styles.transToIn_meal_type_radioLabel}
                      >
                        Prepackaged Meal
                      </label>
                      <label
                        htmlFor="packaged"
                        className={styles.transToIn_meal_type_radioLabel2}
                      >
                        Meal without the ingredients
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className={styles.transToIn_meal_type}>
                    <div className={styles.transToIn_meal_type_option}>
                      <input
                        onChange={handleChange}
                        className={styles.transToIn_meal_type_radioInput}
                        type="radio"
                        id="Product"
                        name="item_type"
                        value="Product"
                      />
                      <label
                        htmlFor="Product"
                        className={styles.transToIn_meal_type_radio_button}
                      ></label>
                      <label
                        htmlFor="Product"
                        className={styles.transToIn_meal_type_radioLabel}
                      >
                        Product
                      </label>
                    </div>
                    <div className={styles.transToIn_meal_type_option}>
                      <input
                        className={styles.transToIn_meal_type_radioInput}
                        type="radio"
                        onChange={handleChange}
                        id="Kitchen Utensils"
                        name="item_type"
                        value="Kitchen Utensils"
                      />
                      <label
                        htmlFor="Kitchen Utensils"
                        className={styles.transToIn_meal_type_radio_button}
                      ></label>
                      <label
                        htmlFor="Kitchen Utensils"
                        className={styles.transToIn_meal_type_radioLabel}
                      >
                        Kitchen Utensils
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.transToIn_details_col2}>
                <div>
                  <h3>Set {" " + item_type + " "} Price</h3>
                  <div>
                    <p>Enter {" " + item_type + " "} Price</p>
                    <h4>{getSelectedStoreCurrencySymbol()}</h4>

                    <input onChange={handleChange} name="meal_price" />
                  </div>
                </div>
                <div>
                  <h3>Set Estimated preparation time</h3>
                  <div>
                    <p>Set time for pickup</p>
                    <input
                      onChange={handleChange}
                      name="estimated_preparation_time"
                      type="number"
                    />
                    <h4>Minutes</h4>
                  </div>
                </div>
              </div>

              <div className={styles.transToIn_details_col3}>
                {props?.meal?.item_type === "Meal" &&
                  <div>
                    <h3>Are the ingredients available in your store</h3>
                    <CustomSwitch
                      checked={in_stock}
                      onChange={handleInStockChange}
                    />
                  </div>
                }
                <div>
                  <h3>Out of Stock? How long before restock</h3>
                  <div className={styles.select_container}>
                    <div
                      onClick={toggleRestockTimeOption}
                      className={styles.select_box}
                    >
                      <p>{restockTime}</p>
                      <ArrowDropDownIcon className={styles.select_box_icon} />
                    </div>
                    {restockOption && (
                      <div className={styles.select_options}>
                        <p onClick={() => handleRestockTimeChange("1 day")}>
                          1 day
                        </p>
                        <p onClick={() => handleRestockTimeChange("2 days")}>
                          2 days
                        </p>
                        <p onClick={() => handleRestockTimeChange("3 days")}>
                          3 days
                        </p>
                        <p
                          onClick={() =>
                            handleRestockTimeChange("About 1 week")
                          }
                        >
                          About 1 week
                        </p>
                        <p onClick={() => handleRestockTimeChange("2 Weeks")}>
                          2 Weeks
                        </p>
                        <p
                          onClick={() =>
                            handleRestockTimeChange("About 1 month")
                          }
                        >
                          About 1 month
                        </p>
                        <p onClick={() => handleRestockTimeChange("2 months")}>
                          2 months
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {props?.meal?.item_type === "Meal" && (
                <>
                  {formState.meal_type === "non packaged" && (
                    <div className={styles.transToIn_details_col4}>
                      <p>Set ingredient prices and availability</p>
                      <table
                        className={styles.request_table}
                        style={{ height: "2px" }}
                      >
                        <thead>
                          {matches ? (
                            <div
                              className={styles.request_tr1}
                              style={{ backgroundColor: "transparent" }}
                            >
                              <th className={styles.request_th}>Items</th>
                              <th
                                className={
                                  styles.request_th + " " + styles.hideData
                                }
                              >
                                Quantity
                              </th>
                              <th className={styles.request_th}>Set Price</th>
                              <th className={styles.request_th}>
                                Product Available
                              </th>
                            </div>
                          ) : (
                            <div
                              className={styles.request_tr1}
                              style={{ backgroundColor: "transparent" }}
                            >
                              <th className={styles.request_th}>Items</th>
                              <th
                                className={
                                  styles.request_th + " " + styles.hideData
                                }
                              >
                                Quantity
                              </th>
                              <th className={styles.request_th}>Set Price</th>
                            </div>
                          )}
                        </thead>
                        <tbody className={styles.tbody}>
                          {formState.ingredientsAvailable?.map(
                            (ingredient, index) => {
                              return (
                                <div
                                  className={
                                    styles.refId + " " + styles.request_tr
                                  }
                                >
                                  <div className={styles.request_td}>
                                    {ingredient.item_name}
                                  </div>
                                  <div
                                    className={
                                      styles.request_td + " " + styles.hideData
                                    }
                                  >
                                    <input
                                      value={
                                        formState.ingredientsAvailable[index]
                                          ?.item_quantity
                                      }
                                      onChange={(e) =>
                                        handleIngredientChange(
                                          e,
                                          index,
                                          "item_quantity"
                                        )
                                      }
                                      name="meal_price"
                                    />
                                  </div>
                                  <div className={styles.request_td}>
                                    {getSelectedStoreCurrencySymbol()}
                                    <input
                                      value={
                                        formState.ingredientsAvailable[index]
                                          ?.set_price
                                      }
                                      onChange={(e) =>
                                        handleIngredientChange(
                                          e,
                                          index,
                                          "set_price"
                                        )
                                      }
                                      name="meal_price"
                                    />
                                  </div>
                                  <div className={styles.request_td}>
                                    <CustomSwitch
                                      checked={
                                        formState.ingredientsAvailable[index]
                                          ?.product_available
                                      }
                                      onChange={(e) =>
                                        handleIngredientAvailabilityChange(
                                          !ingredient.product_available,
                                          index,
                                          "product_available"
                                        )
                                      }
                                      inputProps={{
                                        "aria-label": "ant design",
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className={styles.transToIn_footer}>
              <button
                className={styles.transToIn_footer_button}
                onClick={props.toggleTransferToInventory}
              >
                Cancel
              </button>
              <button
                onClick={sendToInventory}
                className={styles.transToIn_footer_button2}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
