import Head from "next/head";
import React, { useState, useEffect, useCallback } from "react";
import Header, { Header2 } from "../src/components/Header/Header";
import GoBack from "../src/components/CommonComponents/goBack";
import styles from "../src/components/grocery/grocery.module.css";
import Image from "next/image";
import noteGif from "../public/assets/icons/gif.gif";
import Footer from "../src/components/Footer/Footer";
import { Modal } from "../src/components/modal/popup-modal";
import { AiFillEdit } from "react-icons/ai";
import { MdDelete, MdRemoveRedEye } from "react-icons/md";
import { HiDotsHorizontal } from "react-icons/hi";
import axios from "../src/util/Api";
import { useRouter } from "next/router";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { toast } from "react-toastify";
import Frame from "../public/assets/logos/Frame.png";
import { GroceryModal } from "../src/components/modal/grocery-modal";
import SideNav from "../src/components/Header/sidenav";
import { getLocalGroceryList } from "../src/util";
import { useSelector } from "react-redux";
import { UserIcon } from "../src/components/icons";
import { PiEyeFill } from "react-icons/pi";

const Grocery = () => {
  const [show, setShow] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [groceryList, setGroceryList] = useState([]);
  const [isUserOnline, setIsUserOnline] = useState(true);
  const router = useRouter();
  const { authUser } = useSelector((state) => state.Auth);

  const [localGroceryList, setLocalGroceryList] = useState([]);

  const [details, setDetails] = useState({
    listName: "",
    description: "",
    id: "",
    status: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setIsUserOnline(Boolean(Object.keys(user).length));
  }, []);

  const fetchList = async () => {
    if (isUserOnline) {
      try {
        const response = await axios(`/groceries/list`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        setGroceryList(response.data.data.data);
      } catch (error) {
        console.log(error);
      }
    } else {
      const list = getLocalGroceryList();
      setLocalGroceryList(list);
    }
  };

  const deleteLocalGrocery = (id) => {
    let localGrocery = getLocalGroceryList();
    let copy = [...localGrocery];
    copy.splice(
      copy.findIndex((ele) => ele?._id === id),
      1
    );
    localStorage.setItem("grocery-list", JSON.stringify([...copy]));
    toast.success("Deleted successfully");
    fetchList();
  };

  const deleteGrocery = async (id) => {
    if (isUserOnline) {
      try {
        const response = await axios.delete(`/groceries/create/${id}`);
        toast.success("Deleted successfully");
        fetchList();
      } catch (err) {
        console.log(err);
      }
    } else {
      deleteLocalGrocery(id);
    }
  };
  useEffect(() => {
    fetchList();
  }, [isUserOnline]);

  return (
    <div className={styles.container}>
      {" "}
      <Head>
        <title>Chop Chow Grocery List</title>
        <meta
          key="title"
          name="viewport"
          content="initial-scale=1.0, width=device-width"
        />
        <meta
          name="description"
          content="Add meals, ingredients, utensils 
        and other items to your chop chow grocery list. Get recommendations 
        on similar meals and ingredient alternatives from items in your
         grocery list."
        />
      </Head>
      <Header />
      <Header2 />
      <SideNav />
      {/* <div className={styles.grocery_container} id="modal_container"> */}
      {/* <GroceryComponent productNames={['prod1', 'prod2']} /> */}
      <div className={styles.header}>
        <div className={styles.one}>
          <GoBack />
          <h3 className={styles.title}>My Grocery List</h3>
        </div>
        <div className={styles.two}>
          <p onClick={() => setShow(!show)}>Create New List</p>
        </div>
      </div>
      {(isUserOnline ? groceryList : localGroceryList).length > 0 ? (
        <div className={styles.all_cards}>
          {(isUserOnline ? groceryList : localGroceryList)?.map((ele, id) => (
            <div
              className={
                ele.groceryItems.length > 0 ? styles.card2 : styles.noImages
              }
              key={id}
            >
              <div className={styles.column1}>
                <div className={styles.flex2}>
                  <h4 className={styles.title2}>{ele.listName}</h4>
                  <div
                    style={{
                      display: "flex",
                      gap: "2rem",
                      alignItems: "center",
                    }}
                  >
                    {ele?.status === "Public" && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: ".6rem",
                        }}
                      >
                        <PiEyeFill color="#00A001" />
                        <p className={styles.public}>{ele?.status}</p>
                      </div>
                    )}

                    <Popup
                      trigger={
                        <div>
                          {" "}
                          <HiDotsHorizontal className={styles.dots} />{" "}
                        </div>
                      }
                      position="bottom right"
                      className={styles.popup_content}
                    >
                      <div>
                        <div
                          onClick={() => {
                            setDetails({
                              listName: ele.listName,
                              description: ele.description,
                              id: ele._id,
                            });
                            setShow(true);
                          }}
                          className={styles.flex}
                          style={{
                            justifyContent: "flex-start",
                            cursor: "pointer",
                            padding: ".7rem",
                          }}
                        >
                          <AiFillEdit size={17} color="#F47900" />
                          <p
                            className={styles.text3}
                            style={{ marginLeft: ".5rem" }}
                          >
                            Edit List
                          </p>
                        </div>
                        <div
                          onClick={() => deleteGrocery(ele._id)}
                          className={styles.flex}
                          style={{
                            justifyContent: "flex-start",
                            cursor: "pointer",
                            padding: ".8rem",
                            zIndex: "1000",
                          }}
                        >
                          <MdDelete size={19} color="#F47900" />
                          <p
                            className={styles.text3}
                            style={{ marginLeft: ".5rem" }}
                          >
                            Delete List
                          </p>
                        </div>
                        {ele.groceryItems.length ? (
                          <div
                            className={styles.flex}
                            style={{
                              justifyContent: "flex-start",
                              cursor: "pointer",
                              padding: ".8rem",
                              opacity: ele?.groceryItems?.length ? "1" : "0.4",
                            }}
                          >
                            <MdRemoveRedEye size={17} color="#F47900" />
                            <p
                              className={styles.text3}
                              style={{ marginLeft: ".5rem" }}
                              onClick={() => {
                                setDetails({
                                  listName: ele.listName,
                                  description: ele.description,
                                  status: ele?.status,
                                  id: ele._id,
                                });
                                setOpenModal(true);
                              }}
                            >
                              Make Public
                            </p>
                          </div>
                        ) : (
                          <div
                            className={styles.flex}
                            style={{
                              justifyContent: "flex-start",
                              cursor: "pointer",
                              padding: ".8rem",
                              opacity: ele?.groceryItems?.length ? "1" : "0.4",
                            }}
                          >
                            <MdRemoveRedEye size={17} color="#F47900" />
                            <p
                              className={styles.text3}
                              style={{ marginLeft: ".5rem" }}
                            >
                              Make Public
                            </p>
                          </div>
                        )}
                      </div>
                    </Popup>
                  </div>
                </div>
                <p className={styles.text}>{ele.description}</p>
                <p
                  className={
                    ele.groceryItems.length > 0 ? styles.length : styles.length2
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
                              ) : elem.item?.item_type === "Meal" ? (
                                <Image
                                  src="/assets/store_pics/no-image-meal.png"
                                  width={95}
                                  height={95}
                                  objectFit="cover"
                                  objectPosition="center"
                                  className={styles.imgs}
                                />
                              ) : elem.item?.item_type === "Product" ? (
                                <Image
                                  src="/assets/store_pics/no-image-product.png"
                                  width={95}
                                  height={95}
                                  objectFit="cover"
                                  objectPosition="center"
                                  className={styles.imgs}
                                />
                              ) : elem.item?.item_type === "Utensil" ? (
                                <Image
                                  src="/assets/store_pics/no-image-utensil.png"
                                  width={95}
                                  height={95}
                                  objectFit="cover"
                                  objectPosition="center"
                                  className={styles.imgs}
                                />
                              ) : (
                                <Image
                                  src="/assets/store_pics/no-image-utensil.png"
                                  width={95}
                                  height={95}
                                  objectFit="cover"
                                  objectPosition="center"
                                  className={styles.imgs}
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
                                src="/assets/store_pics/no-image-meal.png"
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
                    <UserIcon style={styles.user_img} />
                  )}
                  <p className={styles.name}>
                    {ele.user.first_name} {ele.user.last_name}
                  </p>
                </div>
                {
                  <div
                    onClick={() => {
                      router.push(`/grocerylist/${ele._id}`);
                      // if (isUserOnline) {
                      //   router.push(`/grocerylist/${ele._id}`);
                      // } else {
                      // alert('Login to add Items to Grocery List')
                      // }
                    }}
                    className={styles.two2}
                  >
                    <p
                      className={styles.button_text}
                      style={{ cursor: "pointer" }}
                    >
                      {ele.groceryItems?.length ? "Show Items" : " Add Items"}
                    </p>
                  </div>
                }
              </div>
            </div>
          ))}{" "}
        </div>
      ) : (
        <div className={styles.card}>
          <Image
            src={noteGif}
            height={200}
            width={250}
            objectFit="contain"
            objectPosition="center"
          />
          <div className={styles.flex}>
            <p className={styles.card_text}>You have no Grocery List.</p>
            <div onClick={() => setShow(!show)}>
              <p
                className={styles.card_text}
                style={{
                  color: "#F47900",
                  marginLeft: ".5rem",
                  cursor: "pointer",
                }}
              >
                Create New List
              </p>
            </div>
          </div>
        </div>
      )}
      {/* </div> */}
      {show && (
        <Modal
          show={show}
          setShow={setShow}
          fetchList={fetchList}
          details={details}
          isUserOnline={isUserOnline}
          setDetails={setDetails}
        />
      )}
      {openModal && (
        <GroceryModal
          details={details}
          openModal={openModal}
          setOpenModal={setOpenModal}
          refetch={() => fetchList()}
        />
      )}
      <Footer />
    </div>
  );
};

export default Grocery;
