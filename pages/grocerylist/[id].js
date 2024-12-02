import { useRouter } from "next/router";
import Head from "next/head";
import Header, { Header2 } from "../../src/components/Header/Header";
import GoBack from "../../src/components/CommonComponents/goBack";
import styles from "../../src/components/grocery/grocery.module.css";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { BsArrowRight } from "react-icons/bs";
import Image from "next/image";
import noteGif from "../../public/assets/icons/gif.gif";
import { DropDownSelect } from "../../src/components/select/select";
import { useEffect, useState } from "react";
import { Modal } from "../../src/components/modal/popup-modal";
import Footer from "../../src/components/Footer/Footer";
import { IoMdCloseCircle } from "react-icons/io";
import axios from "../../src/util/Api";
import { toast } from "react-toastify";
import { GroceryModal } from "../../src/components/modal/grocery-modal";
import Popup1 from "../../src/components/popups/popup1";
import Popup2 from "../../src/components/popups/popup2";
import { useCart } from "../../src/context/cart.context";
import { SuggestModal } from "../../src/components/modal/suggest-modal";
import { useMediaQuery } from "../../src/hooks/usemediaquery";
import { MobileTable } from "../../src/components/mobile/table.mobile";
import { MobileInputs } from "../../src/components/mobile/inputs.mobile";
import { Cards } from "../../src/components/cards/cards";
import { CardDropdown } from "../../src/components/dropdown/dropdown";
import { useDispatch } from "react-redux";

import {
  addItemToLocalGroceryList,
  getOneGroceryList,
  removeItemFromLocalGroceryList,
} from "../../src/util";
import { LoginPrompt } from "../../src/components/modal/login-prompt";
import { UserIcon } from "../../src/components/icons";
import { useSelector } from "react-redux";
import { addMultipleItemsToCart } from "../../src/actions/Cart";

const GroceryPage = () => {
  const customStyles = {
    option: (defaultStyles, state) => ({
      ...defaultStyles,
      color: "#6D6D6D;",
      fontSize: "15px",
      fontWeight: "200",
      marginTop: "1.2rem",
      marginBottom: "1.2rem",
      backgroundColor: state.isSelected ? "#FFFFFF" : "#FFFFFF",
      placeholder: (base) => ({
        ...base,
        className: "placeholder",
      }),
    }),

    control: (defaultStyles, state) => ({
      ...defaultStyles,
      borderRadius: "4px",
      outline: state.isFocused
        ? "1px solid rgba(4, 213, 5, 0.90)"
        : "1px solid rgba(4, 213, 5, 0.10)",
      border: state.isFocused ? "2px " : "1px solid rgba(4, 213, 5, 0.60)",
      borderColor: state.isSelected
        ? "1px solid rgba(4, 213, 5, 0.90)"
        : "1px solid rgba(4, 213, 5, 0.60)",
      height: "51px",
      color: "#6D6D6D;",
      textAlign: "justify",
      paddingLeft: ".5rem",
      "&:hover": {
        borderColor: "1px solid rgba(4, 213, 5, 0.60)",
      },
    }),
    // singleValue: (defaultStyles) => ({ ...defaultStyles, color: "#fff" }),
  };
  const matches = useMediaQuery("(min-width: 920px)");
  const [isShow, setIsShow] = useState(false);
  const [open, setOpen] = useState({
    isOpen: false,
    id: "",
  });
  const [show, setShow] = useState(false);
  const [itemList, setItemList] = useState({});
  const [similar, setSimilar] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModal1, setOpenModalState] = useState(false);
  const [openModal2, setOpenModal2State] = useState(false);
  const [suggestion, setSuggestionState] = useState({});
  const router = useRouter();
  const [value, setValue] = useState("");
  const [measurement_value, setMeasurementValue] = useState("");
  const [measurement_value_1, setMeasurementValue_1] = useState("");
  const { addItemsToCart, cartItems, cartHasItem, AddSelectionToCart } =
    useCart();
  const [isUserOnline, setIsUserOnline] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { authUser } = useSelector((state) => state.Auth);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [selectList, setSelectList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();

  const SelectItemLogic = (data, checked) => {
    if (checked) {
      const newList = [...selectedItem, data];
      setSelectedItem(newList);
    } else {
      const newList = selectedItem.filter((item) => item.id !== data.id);
      setSelectedItem(newList);
    }
  };
  const addMultipleIToCart = () => {
    selectedItem.map((item) => {
      if (item.inventories.length < 1) {
        toast.info(`Item ${item.item_name} not available for sale!`);
        return;
      }

      if (!item.inventories.some((inventory) => inventory.in_stock)) {
        toast.info(`Item ${item.item_name}  is out of stock!`);
        return;
      }
    });
    const payload = selectedItem.map((item) => {
      return {
        userId: item.user,
        storeId: "",
        store_name: "",
        itemId: item._id,
        quantity: item.qty,
        item_price: item.item_price,
        currency: "$",
        item_image: item.itemImage0,
        itemName: item.item_name,
        item_type: item.item_type ? item.item_type : "Meal",
      };
    });

    dispatch(addMultipleItemsToCart(payload));
  };

  const [measurements, setMeasurement] = useState([
    {
      value: "",
      label: "",
    },
  ]);

  const [item, setItems] = useState([
    {
      value: "",
      label: "",
    },
  ]);
  const [itemsToAdd, setItemsToAdd] = useState({
    itemId: "",
    quantity: "",
    measurement: "",
  });
  const [details, setDetails] = useState({
    listName: "",
    description: "",
    id: "",
    status: "",
  });

  function closeModal() {
    setOpenModalState(false);
    setOpenModal2State(false);
  }

  const id = router?.query?.id;

  const getAllMeasurement = async (newPage = 1) => {
    try {
      setLoading(true);
      const resp = await axios.get(`/measurement/${newPage}`);

      if (
        Array.isArray(resp?.data?.data?.measurement) &&
        resp?.data?.data?.measurement?.length
      ) {
        const response = resp.data.data?.measurement
          .filter((elem) => elem.status === "Public")
          .map((element) => ({
            label: element.measurement_name?.split("_").join(" "),
            value: element._id,
          }));

        setMeasurement((prevMeasurements) => [
          ...prevMeasurements,
          ...response,
        ]);

        if (response.length === 0) {
          setHasMore(false);
        }
      }
    } catch (e) {
      console.log("Error fetching measurements:", e);
    } finally {
      setLoading(false);
    }
  };

  const addItemToGrocery = async () => {
    if (isUserOnline) {
      const user = JSON.parse(localStorage.getItem("user"));
      const payload = {
        userId: user._id,
        groceryList: {
          listName: itemList.listName,
          groceryItems: {
            itemId: itemsToAdd.itemId,
          },
        },
      };
      if (itemsToAdd.quantity) {
        payload.groceryList.groceryItems.quantity = itemsToAdd.quantity;
      }
      if (itemsToAdd.measurement) {
        payload.groceryList.groceryItems.measurement = itemsToAdd.measurement;
      }
      try {
        const response = await axios(`/groceries`, {
          method: "post",
          data: payload,
        });
        setItemsToAdd({
          itemId: "",
          quantity: "",
          measurement: "",
        });
        getList();
        toast.success("Item added successfully");
      } catch (error) {
        console.log(error);
      }
    } else {
      const item_name =
        item.find((element) => element?.value === itemsToAdd.itemId) || {};
      const response = await axios.get(`/items/filter/${item_name?.label}`);

      const resp = await axios.get(`/measurement/1?status=Public`);
      const measurement = resp.data.data?.measurement?.find(
        (ele) => ele?._id === itemsToAdd.measurement
      );
      const resp_ = addItemToLocalGroceryList(
        Number(id),
        response.data.data[0],
        itemsToAdd.quantity,
        measurement ?? null
      );
      getList();
      toast.success("Item added successfully");
    }
  };

  const getList = async () => {
    if (isUserOnline) {
      try {
        const response = await axios(`/groceries/list/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        setItemList(response.data.data.data.groceryList);
        setSelectList(response.data.data.data.groceryList.groceryItems);
        //setItemList(response.data.data.data.groceryList.groceryItems.map(item => ({ ...item.item, selected: false })));
        setSimilar(response.data.data.data.similar[0]);
      } catch (error) {
        console.log(error);
      }
    } else {
      const response = getOneGroceryList(Number(id));
      if (response) {
        setItemList(response);
        setSimilar([]);
      }
    }
  };

  const addJsonDataToGroceryList = async () => {
    try {
      let data = {
        listName: itemList.listName,
        item_name: value,
      };
      if (itemsToAdd.quantity) {
        data.quantity = itemsToAdd.quantity;
      }
      if (itemsToAdd.measurement) {
        data.measurement = itemsToAdd.measurement;
      }
      const response = await axios(`/groceries/grocery-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      });
      setItemsToAdd({
        itemId: "",
        quantity: "",
        measurement: "",
      });
      getList();
      toast.success("Item added successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const addJsonMeasurementToGroceryList = async () => {
    try {
      let data = {
        listName: itemList.listName,
      };

      if (measurement_value_1) {
        data.measurement = measurement_value_1;
      }
      const response = await axios(`/groceries/grocery-measurement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      });
      setItemsToAdd({
        itemId: "",
        quantity: "",
        measurement: "",
      });
      getList();
      toast.success("Measurement added successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const getItem = async (name) => {
    try {
      const response = await axios.get(`/items/filter/${name}`);
      const resp = response.data.data.map((element) => {
        return {
          label: element.item_name,
          value: element._id,
          image: element?.itemImage0,
          price: element?.item_price ? `$${element?.item_price}` : "No Price",
          store: element?.store_available?.store_name || "No store",
        };
      });
      setItems(resp);
    } catch (error) {
      console.log(error);
    }
    return name;
  };

  const deleteItemFromGrocery = async (id) => {
    try {
      await axios.patch(`/groceries/remove/${itemList._id}/${id}`);
      getList();
      toast.success("Deleted Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (status) => {
    try {
      const response = await axios(`/groceries/create/${itemList._id}`, {
        method: "PATCH",
        data: {
          listName: itemList.listName,
          description: itemList.description,
          status,
        },
      });
      getList();

      toast.success("Grocery list edited successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const toggle = (selection) => {
    setSuggestionState(selection?.item);
    if (selection?.item?.item_type === "Meal") {
      setOpenModalState(true);
    } else {
      setOpenModal2State(true);
    }
  };

  useEffect(() => {
    getList();
  }, [isUserOnline, id]);
  useEffect(() => {
    getAllMeasurement(page);
  }, [page]);
  const loadMoreMeasurements = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setIsUserOnline(Boolean(Object.keys(user).length));
  }, []);
  useEffect(() => {
    if (measurement_value) {
      setMeasurementValue_1(measurement_value);
    }
  }, [measurement_value]);

  return (
    <div className={styles.container1}>
      <Head>
        <title>Chop Chow Grocery List</title>
        <meta
          key="title"
          name="viewport"
          content="initial-scale=1.0, width=device-width"
        />
      </Head>
      <Header />
      <Header2 />
      <div className={styles.header}>
        <div className={styles.one}>
          <GoBack />
          <p className={styles.title3}>My Grocery List </p>
          <p className={styles.titles}>/ {itemList.listName}</p>
        </div>

        {itemList?.groceryItems?.length === 0 ? (
          <div
            className={styles.two3}
            style={{ background: "rgba(148, 148, 148, 1)" }}
          >
            <p className={styles.button_text}>
              <AiFillEyeInvisible
                className={styles.eye}
                style={{ marginRight: ".6rem" }}
              />
              Make Public
            </p>
          </div>
        ) : (
          <div
            onClick={() => {
              setDetails({
                listName: itemList.listName,
                description: itemList.description,
                status: itemList?.status,
                id: itemList._id,
              });
              setOpenModal(true);
            }}
            className={styles.two3}
            style={{ background: "#F47900" }}
          >
            <p className={styles.button_text}>
              <AiFillEye
                className={styles.eye}
                style={{ marginRight: ".6rem" }}
              />
              Make Public
            </p>
          </div>
        )}
        {openModal && (
          <GroceryModal
            details={details}
            openModal={openModal}
            setOpenModal={setOpenModal}
            refetch={() => fetchList()}
          />
        )}
        {showLoginPrompt && (
          <LoginPrompt setShowLoginPrompt={setShowLoginPrompt} />
        )}
      </div>
      <div className={styles.button_text2}>
        <h4 className={styles.title2}>{itemList.listName}</h4>

        <p className={styles.text} style={{ width: "85%", fontSize: "12px" }}>
          {itemList.description}
        </p>
        <div className={styles.top1}>
          {authUser?.profile_picture !== "" &&
          authUser?.profile_picture !== undefined ? (
            <Image
              width={50}
              height={50}
              style={{ borderRadius: 30 }}
              alt={itemList.user?.first_name}
              src={authUser?.profile_picture}
              className={styles.user_img}
            />
          ) : (
            <div className={styles.user_img}>
              <UserIcon />
            </div>
          )}

          <p
            className={styles.text}
            style={{ marginLeft: "1rem", textTransform: "capitalize" }}
          >
            {itemList.user?.first_name} {itemList.user?.last_name}
          </p>
        </div>
        <div className={styles.top2}>
          <h5 className={styles.text4}>Add new item from store</h5>

          {matches ? (
            <div className={styles.grid}>
              <DropDownSelect
                onChange={(value) => {
                  getItem(value);
                  setValue(value);
                }}
                customStyles={customStyles}
                noOptionsMessage={() => (
                  <div className={styles.noOptions}>
                    <p className={styles.no_item}>Item Not Found</p>
                    <button
                      onClick={addJsonDataToGroceryList}
                      className={styles.btn3}
                    >
                      Add Item to List
                    </button>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: "2rem",
                      }}
                    >
                      <div className={styles.line}></div>
                      <p className={styles.or}>OR</p>
                      <div className={styles.line}></div>
                    </div>
                    <p className={styles.add}>Add Details to Suggested Item</p>
                    <button
                      className={styles.btnOutline}
                      onClick={() => {
                        if (isUserOnline) {
                          setIsShow(true);
                        } else {
                          setShowLoginPrompt(true);
                        }
                      }}
                    >
                      Suggest Item
                    </button>
                  </div>
                )}
                options={item}
                onSelect={(option) =>
                  setItemsToAdd({ ...itemsToAdd, itemId: option.value })
                }
                placeholder="Search meals, products and ingredients"
                formatOptionLabel={(e, { context }) =>
                  context === "value" ? (
                    <div>
                      <p className={styles.labelName}>{e.label}</p>
                    </div>
                  ) : (
                    <div className={styles.data}>
                      <div className={styles.flex3}>
                        {e.image ? (
                          <Image
                            src={e.image}
                            width={40}
                            objectPosition="center"
                            objectFit="cover"
                            height={40}
                            borderRadius="4px"
                            style={{ borderRadius: "4px" }}
                          />
                        ) : (
                          <Image
                            src="/assets/store_pics/no-image-meal.png"
                            width={40}
                            height={40}
                            objectPosition="center"
                            objectFit="cover"
                            borderRadius="10px"
                            style={{ borderRadius: "4px" }}
                          />
                        )}
                        <p
                          className={styles.labelName}
                          style={{ marginLeft: "13px" }}
                        >
                          {e.label}
                        </p>
                      </div>
                      <div className={styles.second}>
                        <p className={styles.labelName}>{e.store}</p>
                      </div>
                      <div className={styles.third}>
                        <p
                          className={styles.labelName}
                          style={{ textAlign: "center" }}
                        >
                          {" "}
                          {e.price}
                        </p>
                      </div>
                    </div>
                  )
                }
              />
              <input
                placeholder="Quantity"
                value={itemsToAdd.quantity}
                onChange={(e) =>
                  setItemsToAdd({ ...itemsToAdd, quantity: e.target.value })
                }
                className={styles.inputbg}
              />
              <DropDownSelect
                onChange={(value) => setMeasurementValue(value)}
                onSelect={(option) =>
                  setItemsToAdd({ ...itemsToAdd, measurement: option.value })
                }
                options={measurements}
                placeholder="Measurement"
                customStyles={customStyles}
              />
              <button
                className={styles.btn}
                onClick={() => {
                  if (
                    itemsToAdd.itemId ||
                    itemsToAdd.quantity ||
                    itemsToAdd.measurement
                  ) {
                    addItemToGrocery();
                  } else if (
                    !Boolean(itemsToAdd.measurement) &&
                    measurement_value_1
                  ) {
                    addJsonMeasurementToGroceryList();
                  }
                }}
              >
                Add New Item
              </button>
            </div>
          ) : (
            <MobileInputs
              getItem={getItem}
              addItemToGrocery={addItemToGrocery}
              setIsShow={setIsShow}
              setValue={setValue}
              itemsToAdd={itemsToAdd}
              setItemsToAdd={setItemsToAdd}
              item={item}
              measurements={measurements}
              addJsonDataToGroceryList={addJsonDataToGroceryList}
            />
          )}
        </div>
        {itemList?.groceryItems?.length === 0 ? (
          <>
            <div className={styles.card} style={{ width: "100%" }}>
              <Image
                src={noteGif}
                height={200}
                width={250}
                className={styles.image}
              />
              <div className={styles.flex}>
                <p className={styles.card_text}>
                  No item in your Grocery list.
                </p>
                <div>
                  <p
                    className={styles.card_text}
                    style={{
                      color: "#F47900",
                      marginLeft: ".5rem",
                      cursor: "pointer",
                    }}
                  >
                    Add new items
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ width: "100%", marginTop: "5rem" }}>
            {matches ? <h5 className={styles.text4}>Items</h5> : ""}
            {matches ? (
              <table className={styles.table1}>
                <thead
                  style={{
                    textAlign: "left",
                    paddingBottom: "4rem",
                    width: "100%",
                  }}
                >
                  <div className={styles.thead}>
                    <th
                      style={{ display: "flex", alignItems: "center" }}
                      className={styles.th}
                    >
                      <input
                        type="checkbox"
                        value="select_all"
                        checked={selectAll}
                        onClick={() => handleSelectAllChange()}
                        style={{ width: "2rem", height: "2rem" }}
                      />
                      <p style={{ marginLeft: "2rem" }}>Select All</p>
                    </th>
                    <th className={styles.th}>Name</th>
                    <th className={styles.th}>Quantity</th>
                    <th className={styles.th}>Price</th>
                    <th className={styles.th}>Store</th>
                    <th className={styles.th}>Action</th>
                  </div>
                </thead>
                <tbody style={{ height: "100%" }}>
                  {itemList?.groceryItems?.map((element, idx) => (
                    <>
                      {element.hasOwnProperty("itemData") ? (
                        <tr key={element?.itemData?._id} className={styles.tr}>
                          <td className={styles.td}>
                            <input
                              type="checkbox"
                              style={{
                                marginRight: "2rem",
                                marginLeft: "1rem",
                                color: "rgba(244, 121, 0, 1)",
                                width: "2rem",
                                height: "2rem",
                              }}
                            />
                            <Image
                              src="/assets/store_pics/no-image-meal.png"
                              height={50}
                              width={55}
                              style={{ borderRadius: "5px" }}
                            />
                          </td>
                          <td className={styles.td}>
                            {element?.itemData?.item_name}
                          </td>
                          <td className={styles.td}>
                            {element?.itemData?.quantity}{" "}
                            {element?.itemData?.measurement?.measurement_name}
                          </td>
                          <td className={styles.td}>N/A</td>
                          <td className={styles.td}>-</td>
                          <td
                            onClick={() => deleteItemFromGrocery(element._id)}
                            className={styles.td}
                            style={{ textAlign: "center" }}
                          >
                            <IoMdCloseCircle size={23} color="#949494" />
                          </td>
                        </tr>
                      ) : element.hasOwnProperty("other") ? (
                        <tr key={element?.itemData?._id} className={styles.tr}>
                          <td className={styles.td}>
                            <input
                              type="checkbox"
                              style={{
                                marginRight: "2rem",
                                marginLeft: "1rem",
                                color: "rgba(244, 121, 0, 1)",
                                width: "2rem",
                                height: "2rem",
                              }}
                            />
                            <Image
                              src={element?.other?.item_image}
                              height={50}
                              width={55}
                              style={{ borderRadius: "5px" }}
                            />
                          </td>
                          <td className={styles.td}>
                            {element?.other?.item_name}
                          </td>
                          <td className={styles.td}>N/A</td>
                          <td className={styles.td}>N/A</td>
                          <td className={styles.td}>-</td>
                          <td
                            onClick={() => deleteItemFromGrocery(element._id)}
                            className={styles.td}
                            style={{ textAlign: "center" }}
                          >
                            <IoMdCloseCircle size={23} color="#949494" />
                          </td>
                        </tr>
                      ) : (
                        <tr key={element?._id} className={styles.tr}>
                          <td className={styles.td}>
                            <input
                              name={element?.item?.item_name}
                              value={element?.item?.item_name}
                              checked={
                                selectedItem.find(
                                  (item) =>
                                    item.name === element?.item?.item_name
                                )?.selected
                              }
                              onChange={(e) => {
                                SelectItemLogic(
                                  {
                                    ...element?.item,
                                    qty: element?.quantity,
                                    element: element,
                                  },
                                  e.target.checked
                                );
                              }}
                              type="checkbox"
                              style={{
                                marginRight: "2rem",
                                marginLeft: "1rem",
                                color: "rgba(244, 121, 0, 1)",
                                width: "2rem",
                                height: "2rem",
                              }}
                            />
                            {element?.item?.itemImage0 ? (
                              <Image
                                src={element?.item?.itemImage0}
                                height={50}
                                width={55}
                                style={{ borderRadius: "4px" }}
                              />
                            ) : element.item?.item_type === "Meal" ? (
                              <Image
                                src="/assets/store_pics/no-image-meal.png"
                                height={50}
                                width={55}
                                style={{ borderRadius: "5px" }}
                              />
                            ) : element.item?.item_type === "Product" ? (
                              <Image
                                src="/assets/store_pics/no-image-product.png"
                                height={50}
                                width={55}
                                style={{ borderRadius: "5px" }}
                              />
                            ) : element.item?.item_type === "Utensil" ? (
                              <Image
                                src="/assets/store_pics/no-image-utensil.png"
                                height={50}
                                width={55}
                                style={{ borderRadius: "5px" }}
                              />
                            ) : (
                              <Image
                                src="/assets/store_pics/no-image-meal.png"
                                height={50}
                                width={55}
                                style={{ borderRadius: "5px" }}
                              />
                            )}
                          </td>
                          <td
                            className={styles.td}
                            style={{
                              cursor: "pointer",
                              flexDirection: "column",
                              alignItems: "flex-start",
                              justifyContent: "center",
                              marginTop: "1.5rem",
                            }}
                          >
                            <p
                              onClick={() => {
                                toggle(element);
                              }}
                            >
                              {element?.item?.item_name}
                            </p>
                            {element?.item?.item_type === "Meal" &&
                            element?.quantity ? (
                              <div>
                                <p
                                  className={styles.ingredients}
                                  onClick={() => {
                                    setOpen({
                                      id: element._id,
                                      isOpen: !open.isOpen,
                                    });
                                  }}
                                >
                                  Include Ingredients
                                </p>
                                {open.isOpen && element?._id === open.id && (
                                  <CardDropdown element={element} />
                                )}
                              </div>
                            ) : (
                              <div></div>
                            )}
                          </td>

                          <td
                            className={styles.td}
                            style={{ textAlign: "center" }}
                          >
                            {element?.quantity}{" "}
                            {element?.measurement?.measurement_name}
                          </td>
                          <td className={styles.td}>
                            {element?.item?.item_price
                              ? `$${element?.item?.item_price}`
                              : "N/A"}
                          </td>
                          <td
                            className={styles.td}
                            style={{ textAlign: "center" }}
                          >
                            {element?.item?.store_name
                              ? element?.item?.store_name
                              : "-"}
                          </td>
                          <td
                            onClick={() => {
                              if (isUserOnline) {
                                deleteItemFromGrocery(element._id);
                              } else {
                                removeItemFromLocalGroceryList(
                                  Number(id),
                                  element?.item?._id
                                );
                                getList();
                              }
                            }}
                            className={styles.td}
                            style={{ textAlign: "center" }}
                          >
                            <IoMdCloseCircle size={23} color="#949494" />
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            ) : (
              <MobileTable
                itemList={itemList}
                addItemsToCart={addItemsToCart}
                cartHasItem={cartHasItem}
                deleteItemFromGrocery={deleteItemFromGrocery}
                toggle={toggle}
                open={open}
                setOpen={setOpen}
              />
            )}
            <div className={styles.cartBtns}>
              <button className={styles.cartbtn1} onClick={addMultipleIToCart}>
                Add Selection to Cart
              </button>
              <button
                className={styles.cartbtn2}
                onClick={() => router.push("/cart")}
              >
                Go to Cart
                <BsArrowRight size={18} />
              </button>
            </div>
            <div className={styles.top}>
              {similar?.length ? (
                <h5 className={styles.sugTitle}>
                  Suggested Meals Based On Items In Your Grocery List
                </h5>
              ) : (
                ""
              )}
              <Cards similar={similar} />
            </div>
          </div>
        )}
      </div>
      {show && <Modal show={show} setShow={setShow} />}
      {isShow && (
        <SuggestModal
          value={value}
          refetch={() => getList()}
          listName={itemList.listName}
          addJsonDataToGroceryList={addJsonDataToGroceryList}
          isShow={isShow}
          setIsShow={setIsShow}
        />
      )}
      {openModal2 && (
        <Popup1
          popup="product"
          openModal={openModal2}
          closeModal={closeModal}
          name={suggestion?.meal_name}
          description={suggestion?.item_name}
          imageData={suggestion?.item_images}
          image={suggestion?.item_images[0]}
          // imagesData={suggestion.product_images.slice(1)}
          categories={suggestion?.item_categories?.map(
            (ele) => ele?.category_name
          )}
          sizesList={suggestion.item_data?.product_size}
          ingredientsList={
            suggestion.formatted_ingredients?.length
              ? suggestion.formatted_ingredients
              : []
          }
          suggested={true}
          id={suggestion.id}
          ingredientGroupList={suggestion.formatted_ingredients}
          item_description={suggestion.item_description}
        />
      )}
      {openModal1 && (
        <Popup2
          popupType="Meal Suggestion Preview"
          openModal={openModal1}
          closeModal={closeModal}
          name={suggestion.item_name}
          isDashboard={true}
          description={suggestion.item_intro}
          // imageData={suggestion?.item_images[0]}
          imagesData={suggestion?.item_images}
          // image={suggestion?.item_images[0]}
          // imagesData={suggestion.meal_images.slice(1)} categories={JSON.parse(suggestion.meal_categories).toString().split(',')}
          prepTime={suggestion.meal_prep_time}
          cookTime={suggestion.meal_cook_time}
          serves={suggestion.meal_servings}
          chef={suggestion.meal_chef}
          ingredientsList={
            suggestion.formatted_ingredients?.length
              ? suggestion.formatted_ingredients
              : []
          }
          utensilsList={suggestion.meal_kitchen_utensils}
          ingredientsInItem={suggestion.ingredeints_in_item}
          instructionChunk1={suggestion.meal_formatted_instructions[0]?.title}
          instructionChunk2={suggestion.meal_formatted_instructions[1]?.title}
          instructionChunk3={suggestion.meal_formatted_instructions[2]?.title}
          instructionChunk4={suggestion.meal_formatted_instructions[3]?.title}
          instructionChunk5={suggestion.meal_formatted_instructions[4]?.title}
          instructionChunk6={suggestion.meal_formatted_instructions[5]?.title}
          instructionChunk1Step={
            suggestion.meal_formatted_instructions[0]?.instructionSteps
          }
          instructionChunk2Step={
            suggestion.meal_formatted_instructions[1]?.instructionSteps
          }
          instructionChunk3Step={
            suggestion.meal_formatted_instructions[2]?.instructionSteps
          }
          instructionChunk4Step={
            suggestion.meal_formatted_instructions[3]?.instructionSteps
          }
          instructionChunk5Step={
            suggestion.meal_formatted_instructions[4]?.instructionSteps
          }
          instructionChunk6Step={
            suggestion.meal_formatted_instructions[5]?.instructionSteps
          }
          instructionChunk1DataName={
            suggestion.meal_formatted_instructions[0]?.dataName
          }
          instructionChunk2DataName={
            suggestion.meal_formatted_instructions[1]?.dataName
          }
          instructionChunk3DataName={
            suggestion.meal_formatted_instructions[2]?.dataName
          }
          instructionChunk4DataName={
            suggestion.meal_formatted_instructions[3]?.dataName
          }
          instructionChunk5DataName={
            suggestion.meal_formatted_instructions[4]?.dataName
          }
          instructionChunk6DataName={
            suggestion.meal_formatted_instructions[5]?.dataName
          }
          chunk1Content={suggestion?.meal_image_or_video_content1}
          chunk2Content={suggestion?.meal_image_or_video_content2}
          chunk3Content={suggestion?.meal_image_or_video_content3}
          chunk4Content={suggestion?.meal_image_or_video_content4}
          chunk5Content={suggestion?.meal_image_or_video_content5}
          chunk6Content={suggestion?.meal_image_or_video_content6}
          instructionWordlength={suggestion?.instructionWordlength}
          tips={suggestion?.meal_tips}
          mealImageData={suggestion?.itemImage0}
          suggested={true}
          id={suggestion.id}
          categories={suggestion?.item_categories?.map(
            (ele) => ele?.category_name
          )}
          ingredientGroupList={suggestion.formatted_ingredients}
        />
      )}

      {/* GroceryPage: {id} */}
      <Footer />
    </div>
  );
};

export default GroceryPage;
