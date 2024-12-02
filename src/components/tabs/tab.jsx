import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useEffect } from "react";
import axios from "../../../src/util/Api";
import styles from "./tabs.module.css";
import Frame from "../../../public/assets/logos/Frame.png";
import girl from "../../../public/assets/icons/girl.jpg";
import Image from "next/image";
import { useRouter } from "next/router";
import { GoStarFill } from "react-icons/go";
import { ImArrowUp, ImArrowDown } from "react-icons/im";
import { BiSolidMessageRounded, BiSolidShareAlt } from "react-icons/bi";
import { IndividualModal } from "../modal/individual-meal-product";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { UserIcon } from "../icons";
import { FaUser } from "react-icons/fa6";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  // const {authUser} = useSelector(state => state.Auth)

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div>
          <div>{children}</div>
        </div>
      )}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const MyTabs = ({ id }) => {
  const [value, setValue] = React.useState(0);
  const [groceryList, setGroceryList] = useState([]);
  const [suggestedItems, setSuggestedItems] = useState([]);
  const [selectGrocery, setSelectGrocery] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [comments, setComments] = useState([]);
  const [itemsLength, setItemsLength] = useState(4);
  const [openModal, setOpenModal] = useState(false);
  const [show, setShow] = useState(false);
  const [openList, setOpenList] = useState(false);
  const router = useRouter();
  const [itemToAdd, setItemAdd] = useState({
    listName: "",
  });
  const { authUser } = useSelector((state) => state.Auth);

  const addItemToGrocery = async (listName) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const payload = {
      userId: user._id,
      groceryList: {
        listName: itemToAdd.listName || listName,
        groceryItems: {
          itemId: selectedItem._id,
        },
      },
    };

    console.log(payload, "payload");
    try {
      const response = await axios(`/groceries`, {
        method: "post",
        data: payload,
      });
      toast.success("Item added successfully");
      setOpenList(false);
      setShow(false);
    } catch (error) {
      console.log(error);
    }
  };
  const [details, setDetails] = useState({
    listName: "",
    description: "",
    id: "",
    status: "",
  });

  const fetchList = async () => {
    try {
      const response = await axios(`/groceries/list?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data.data.data, "resp");
      setGroceryList(response.data.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchList();
    console.log(groceryList, "grocerylist");
  }, []);

  const getSuggestedItems = async (id) => {
    try {
      const response = await axios(`/items/users/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data.data, "44resp");
      setSuggestedItems(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    console.log(id, "id");
    if (id) {
      getSuggestedItems(id);
      fetchUserComments(id);
    }
  }, [id]);

  const fetchGroceryList = async () => {
    try {
      const response = await axios(`/groceries/list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data.data.data, "groceries");
      setSelectGrocery(response.data.data.data);
    } catch (error) {}
  };
  useEffect(() => {
    fetchGroceryList();
  }, []);
  const filteredMeals = () => {
    return suggestedItems.filter((meal) => meal.item_type === "Meal");
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const fetchUserComments = async (id) => {
    try {
      const response = await axios(`/comment/user/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data.data, "wwresp");
      setComments(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        className={styles.tabsContainer}
      >
        <Tab label="Grocery List" {...a11yProps(0)} />
        <Tab label="Suggested Meals" {...a11yProps(1)} />
        <Tab label="Comments" {...a11yProps(2)} />
      </Tabs>
      <CustomTabPanel value={value} index={0}>
        <div className={styles.all_cards}>
          {groceryList
            .filter((elem) => elem.status === "Public")
            .map((ele, id) => (
              <div
                className={
                  ele.groceryItems.length > 0 ? styles.card2 : styles.noImages
                }
                key={id}
              >
                <div className={styles.column1}>
                  <div className={styles.flex2}>
                    <h4 className={styles.title2}>{ele.listName}</h4>
                  </div>
                  <p className={styles.text}>{ele.description}</p>
                  <p
                    className={
                      ele.groceryItems.length > 0
                        ? styles.length
                        : styles.length2
                    }
                  >
                    {ele.groceryItems?.length} Items
                  </p>
                  <div
                    className={
                      ele.groceryItems?.length ? styles.images : styles.noimages
                    }
                  >
                    {ele.groceryItems?.length ? (
                      ele.groceryItems?.slice(0, 3)?.map((elem, idx) => (
                        <>
                          {!elem.hasOwnProperty("itemData") ? (
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                              key={idx}
                            >
                              <div className={styles.oneImage}>
                                {elem.item?.itemImage0 ? (
                                  <Image
                                    src={elem?.item?.itemImage0}
                                    width={95}
                                    height={100}
                                    className={styles.imgs}
                                  />
                                ) : (
                                  <Image
                                    src={Frame}
                                    width={95}
                                    height={100}
                                    objectFit="cover"
                                    objectPosition="center"
                                    className={styles.imgs2}
                                  />
                                )}
                                <p className={styles.name2}>
                                  {elem?.item?.item_name}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                              key={idx}
                            >
                              <div className={styles.oneImage}>
                                <Image
                                  src={Frame}
                                  width={95}
                                  height={100}
                                  objectFit="cover"
                                  objectPosition="center"
                                  className={styles.imgs}
                                />
                                <p className={styles.name2}>
                                  {elem?.itemData?.item_name}
                                </p>
                              </div>
                            </div>
                          )}
                        </>
                      ))
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
                <div
                  className={styles.flex2}
                  style={{ marginBottom: "1rem", marginTop: "1rem" }}
                >
                  <div className={styles.flex}>
                    {/* <Image src={authUser !== null && authUser !==undefined ? authUser.profile_picture: girl} width={40} height={40} className={styles.person} /> */}
                    {authUser?.profile_picture !== "" &&
                    authUser?.profile_picture !== undefined ? (
                      <Image
                        width={50}
                        height={50}
                        style={{ borderRadius: 30 }}
                        alt={ele.user.first_name}
                        src={authUser?.profile_picture}
                        className={styles.user_img}
                      />
                    ) : (
                      <FaUser size={24} />
                    )}
                    <p className={styles.name}>
                      {ele.user.first_name} {ele.user.last_name}
                    </p>
                  </div>
                  <div
                    onClick={() =>
                      router.push(`/grocerylist/${ele._id}`)
                    }
                    className={styles.two2}
                  >
                    <p
                      className={styles.button_text}
                      style={{ cursor: "pointer" }}
                    >
                      {ele.groceryItems?.length ? "Show Items" : " Add Items"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <p className={styles.length}>{suggestedItems.length} Items</p>
        <div className={styles.meals}>
          {filteredMeals()
            .slice(0, itemsLength)
            .map((item, id) => {
              return (
                <div
                  className={styles.mealCard}
                  onClick={() => {
                    if (item.item_type === "Meal") {
                      setSelectedItem(item);
                      setOpenModal(true);
                    }
                  }}
                  key={id}
                >
                  <img src={item.itemImage0} />
                  <div className={styles.flexed}>
                    <p>{item.item_name}</p>
                    <p>{item.item_price ? `$${item.item_price}` : "N/A"}</p>
                  </div>
                  <div className={styles.flexed}>
                    <div>
                      {Array(5)
                        .fill("_")
                        .map((_, idx) => (
                          <GoStarFill
                            key={idx + _}
                            color={
                              item.average_rating > idx
                                ? "#04D505"
                                : "rgba(0,0,0,0.5)"
                            }
                          />
                        ))}
                    </div>
                    <p>{item.meal_cook_time}mins</p>
                  </div>
                </div>
              );
            })}
          <IndividualModal
            openList={openList}
            openModal={openModal}
            selectGrocery={selectGrocery}
            selectedItem={selectedItem}
            setOpenList={setOpenList}
            setOpenModal={setOpenModal}
            show={show}
            details={details}
            setDetails={setDetails}
            addItemToGrocery={addItemToGrocery}
            setItemAdd={setItemAdd}
            setShow={setShow}
          />
        </div>
        <p
          onClick={() => setItemsLength((PREV) => PREV + 4)}
          className={styles.more}
          style={{ cursor: "pointer" }}
        >
          View More
        </p>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <p
          style={{
            paddingLeft: "6rem",
            paddingTop: "2rem",
            color: "#6D6D6D",
            fontSize: "15px",
            fontWeight: "300",
          }}
        >
          {comments.length} Comments
        </p>
        {comments?.slice(0, itemsLength).map((elem, id) => {
          return (
            <div className={styles.commentRow} key={id}>
              <div className={styles.comment}>
                <div className={styles.flex}>
                  <span className={styles.nameRound}>
                    {elem.created_by?.last_name?.charAt(0)}
                  </span>
                  <h5 className={styles.username}>
                    {elem.created_by?.last_name} {elem.created_by.first_name}
                  </h5>
                </div>
                <div className={styles.flex}>
                  <div className={styles.secondFlex}>
                    <div style={{ display: "flex" }}>
                      <ImArrowUp style={{ color: "#F47900" }} />
                      <p className={styles.vote}>{elem.up_votes}</p>
                    </div>
                    <div style={{ display: "flex" }}>
                      <ImArrowDown style={{ color: "#949494" }} />
                      <p className={styles.vote}>{elem.down_votes}</p>
                    </div>
                  </div>
                  <div className={styles.flex}>
                    <BiSolidMessageRounded color="#000" size={18} />
                    <p className={styles.vote}>{elem.replies.length}</p>
                  </div>
                  <div className={styles.flex} style={{ marginLeft: "3rem" }}>
                    <BiSolidShareAlt size={18} />
                    <p className={styles.share}>Share Comment</p>
                  </div>
                </div>
              </div>
              <div className={styles.message}>
                <div>
                  {Array(5)
                    .fill("_")
                    .map((_, idx) => (
                      <GoStarFill
                        key={idx + _}
                        color={
                          elem.rating > idx ? "#04D505" : "rgba(0,0,0,0.5)"
                        }
                      />
                    ))}
                </div>
                <p>{elem.message}</p>
              </div>
            </div>
          );
        })}
        <p
          onClick={() => setItemsLength((PREV) => PREV + 4)}
          className={styles.more}
          style={{ cursor: "pointer" }}
        >
          View More
        </p>
      </CustomTabPanel>
    </>
  );
};

export default MyTabs;
