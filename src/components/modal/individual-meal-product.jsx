import styles from "../../components/public-market/stores.module.css";
import modalStyles from "./modal.module.css";
import { GrStar } from "react-icons/gr";
import { AiOutlineClose } from "react-icons/ai";
import Link from "next/link";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Modal } from "../modal/popup-modal";
import { useRouter } from "next/router";
import { BsCurrencyDollar } from "react-icons/bs";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import { addToCart } from "../../actions";
import { useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
export const IndividualModal = ({
  openList,
  openModal,
  setOpenModal,
  setOpenList,
  show,
  setShow,
  selectGrocery,
  addItemToGrocery,
  details,
  setDetails,
  setItemAdd,
  setQuantity,
  quantity,
  selectedItem,
  addToCart,
  serve,
  setServe,
  selectedItemId,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const dropdownRef = useRef();
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpenModal(false);
    }
  };

  useEffect(() => {
    if (openModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openModal]);

  const handleNavigation = () => {
    if (selectedItemId) {
      localStorage.setItem("selectedItemId", selectedItemId);
      const targetURL = `/meal/${selectedItem.meal_chef}/${selectedItem.item_name}`;
      console.log("Navigating to:", targetURL);
      router.push(targetURL);
    } else {
      toast.error("No valid item selected. Please try again.");
    }
  };

  return (
    <div>
      {openModal && (
        <div className={styles.modalContainer}>
          <div className={styles.modalCard2} ref={dropdownRef}>
            <div className={styles.flexed2}>
              <div className={styles.images2}>
                <img
                  src={selectedItem?.itemImage0}
                  alt=""
                  className={styles.modalImg}
                />
                <div className={styles.images1}>
                  {selectedItem?.item_images?.slice(1, 4).map((image, idx) => {
                    return (
                      <div className={styles.img1}>
                        <img src={image} />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={styles.right2}>
                <div className={styles.flex3}>
                  <h6 className={styles.itemName}>{selectedItem.item_name}</h6>
                  {/* <div className={styles.round} onClick={() => setOpenModal(false)}> <AiOutlineClose /></div> */}
                </div>
                <p className={styles.storeName}>
                  {" "}
                  From {selectedItem.store_name}
                </p>
                <div className={styles.rates}>
                  {Array(5)
                    .fill("_")
                    .map((_, idx) => (
                      <GrStar
                        size={20}
                        key={idx + _}
                        color={
                          selectedItem.average_rating > idx
                            ? "#04D505"
                            : "rgba(0,0,0,0.5)"
                        }
                      />
                    ))}
                </div>
                <p className={styles.intro}>{selectedItem.item_intro}</p>
                <div className={styles.flex1}>
                  <h4 className={styles.modalTitle}>Meal Category:</h4>
                  <div className={styles.cat} style={{ marginTop: "-.5rem" }}>
                    <p className={styles.intro}>
                      {selectedItem?.item_categories
                        .map((cat) => cat.category_name)
                        ?.toString()}
                    </p>
                  </div>
                </div>
                <div className={styles.flexer}>
                  <div>
                    <span className={styles.prepspan}>
                      <p className={styles.prep}>PrepTime: </p>
                      <p
                        style={{ marginLeft: ".8rem" }}
                        className={styles.preptext}
                      >
                        {selectedItem.meal_cook_time} Minutes
                      </p>
                    </span>
                    <div className={styles.flex1}>
                      <h4 className={styles.prep}>Serves:</h4>
                      <div
                        className={styles.flex2}
                        style={{ marginLeft: "1rem" }}
                      >
                        <p
                          onClick={() => {
                            if (quantity !== 0) setServe((prev) => prev - 1);
                          }}
                          className={styles.box2}
                        >
                          -
                        </p>
                        <p style={{ marginRight: "1rem" }}>{serve}</p>
                        <p
                          onClick={() => setServe((prev) => prev + 1)}
                          className={styles.box2}
                        >
                          +
                        </p>
                      </div>
                    </div>
                    <div className={styles.flex1}>
                      <h4 className={styles.prep}>Meal Quantity:</h4>
                      <div
                        className={styles.flex2}
                        style={{ marginLeft: "1rem" }}
                      >
                        <p
                          onClick={() => {
                            if (quantity !== 0) setQuantity(quantity - 1);
                          }}
                          className={styles.box2}
                        >
                          -
                        </p>
                        <p style={{ marginRight: "1rem" }}>{quantity}</p>
                        <p
                          onClick={() => setQuantity(quantity + 1)}
                          className={styles.box2}
                        >
                          +
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className={styles.prepspan}>
                      <p className={styles.prep}>CookTime: </p>
                      <p
                        style={{ marginLeft: ".8rem" }}
                        className={styles.preptext}
                      >
                        {selectedItem.meal_prep_time} Minutes
                      </p>
                    </span>
                    <span className={styles.prepspan}>
                      <p className={styles.prep}>Chef:</p>
                      <p
                        className={styles.underline}
                        onClick={() =>
                          router.push(`/chef/${selectedItem.user._id}`)
                        }
                      >
                        {selectedItem.meal_chef}
                      </p>
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: "1rem", paddingBottom: "3rem" }}>
                  <p className={styles.prep}>Add Meal Ingredients</p>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      marginTop: "1rem",
                    }}
                  >
                    <thead className={styles.thead}>
                      <th className={styles.th}>Names</th>
                      <th className={styles.th}>Quantity</th>
                      <th className={styles.th}>Measurement</th>
                      <th className={styles.th}>Price</th>
                    </thead>
                    <tbody>
                      {selectedItem.ingredeints_in_item.map((elem, index) => (
                        <tr key={index} className={styles.tr}>
                          <td className={styles.td}>{elem.item_name}</td>
                          <td className={styles.td}>{elem.item_quantity}</td>
                          <td className={styles.td}>{elem.item_measurement}</td>
                          <td className={styles.td}>
                            {elem?.item_price ? `$${elem?.item_price}` : "N/A"}
                          </td>{" "}
                          {/* Use the correct property for the price */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className={styles.third}>
                <div className={styles.close}>
                  <div
                    className={styles.round}
                    onClick={() => setOpenModal(false)}
                  >
                    <AiOutlineClose />
                  </div>
                </div>
                <p style={{ marginBottom: "1rem" }}>Recipe Steps</p>
                <div className={styles.adjust}>
                  <Carousel
                    width="100%"
                    showStatus={false}
                    showIndicators={false}
                    axis="horizontal"
                    showThumbs={false}
                    renderArrowPrev={(clickHandler, hasPrev) => {
                      return (
                        <div
                          style={{
                            position: "absolute",
                            top: "60%",
                            bottom: 0,
                            left: 0,
                            display: hasPrev ? "flex" : "none",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "3px",
                            opacity: 0.3,
                            zIndex: 1000,
                          }}
                          onClick={clickHandler}
                        >
                          <BsArrowLeftCircleFill
                            size={30}
                            className={styles.arr}
                          />
                        </div>
                      );
                    }}
                    renderArrowNext={(clickHandler, hasNext) => {
                      const arrowStyle = {
                        position: "absolute",
                        top: "60%",
                        bottom: 0,
                        right: 0,
                        display: hasNext ? "flex" : "none",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "3px",
                        opacity: 0.3,
                        cursor: "pointer",
                        zIndex: 20,
                      };

                      return (
                        <div style={arrowStyle} onClick={clickHandler}>
                          <BsArrowRightCircleFill
                            size={30}
                            className={styles.arr}
                          />
                        </div>
                      );
                    }}
                  >
                    {selectedItem.meal_formatted_instructions?.map(
                      (elem, index) => {
                        return (
                          <div key={index}>
                            {/\.(jpg|png|jpeg)$/i.test(elem.dataName) ? (
                              <img
                                src={
                                  selectedItem[
                                    `meal_image_or_video_content${index + 1}`
                                  ]
                                }
                                className={styles.instruction_img}
                              />
                            ) : (
                              <>
                                {elem.dataName.includes("mp4") && (
                                  <video
                                    controls
                                    className={styles.popup2_step_img}
                                    height={150}
                                  >
                                    <source
                                      src={
                                        selectedItem[
                                          `meal_image_or_video_content${
                                            index + 1
                                          }`
                                        ]
                                      }
                                      type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                  </video>
                                )}
                              </>
                            )}
                            <span
                              style={{ paddingTop: "2rem" }}
                              className={styles.carouselText}
                            >
                              <h6>{elem.title}</h6>
                              {elem.instructionSteps.map((ele) => (
                                <p className={styles.instructionStep}>{ele}</p>
                              ))}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </Carousel>
                </div>
              </div>
            </div>
            <div className={styles.border2} />
            <div className={styles.buttons}>
              <button
                className={styles.outlinebtn}
                onClick={() => handleNavigation()}
              >
                See Full Recipe
              </button>
              <button
                className={styles.outlinebtn}
                onClick={() => {
                  setOpenList(true);

                  // setOpenModal(false);
                }}
              >
                Add to Grocery List
              </button>
              <button
                className={styles.btn}
                onClick={() => addToCart(selectedItem, quantity)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
      {openList && (
        <div className={styles.modalContainer}>
          <div className={styles.modalCard3}>
            <div className={styles.flex}>
              <h4 className={styles.addTitle}>Add Item to Grocery List</h4>
              <div onClick={() => setOpenList(false)} className={styles.round}>
                <AiOutlineClose />
              </div>
            </div>
            <div className={styles.lists}>
              {selectGrocery?.map((elem) => {
                return (
                  <div
                    onClick={() => setItemAdd({ listName: elem.listName })}
                    className={styles.list}
                  >
                    <input type="checkbox" />
                    <p>{elem.listName}</p>
                  </div>
                );
              })}
            </div>
            <div className={styles.flex} style={{ marginTop: "2rem" }}>
              <button onClick={addItemToGrocery} className={styles.btn}>
                Done
              </button>
              <button
                className={styles.outlinebtn}
                onClick={() => {
                  setOpenList(false);
                  setShow(true);
                }}
              >
                Add to New List
              </button>
            </div>
          </div>
        </div>
      )}
      {show && (
        <Modal
          addItemToGrocery={addItemToGrocery}
          details={details}
          setDetails={setDetails}
          setShow={setShow}
          show={show}
        />
      )}
    </div>
  );
};

export const ProductModal = ({
  openList,
  openModal,
  setOpenModal,
  setOpenList,
  show,
  setShow,
  selectedItem,
  selectGrocery,
  addItemToGrocery,
  details,
  setDetails,
  setItemAdd,
  setQuantity,
  quantity,
  addToCart,
}) => {
  const dropdownRef = useRef();

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpenModal(false);
    }
  };

  useEffect(() => {
    if (openModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openModal]);
  return (
    <div>
      {openModal && (
        <div className={styles.modalContainer}>
          <div className={styles.modalCard} ref={dropdownRef}>
            <div className={styles.flexed}>
              <div className={styles.images}>
                <img
                  src={selectedItem?.itemImage0}
                  alt=""
                  className={styles.modalImg}
                />
                <div className={styles.images1}>
                  {selectedItem.item_images.slice(1, 3).map((image, idx) => {
                    return (
                      <div className={styles.img1}>
                        <img src={image} />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={styles.right}>
                <div className={styles.flex3}>
                  <h6 className={styles.itemName}>{selectedItem.item_name}</h6>
                  <div className={styles.left2}>
                    <div
                      className={styles.round}
                      onClick={() => setOpenModal(false)}
                    >
                      {" "}
                      <AiOutlineClose />
                    </div>
                  </div>
                </div>
                <p className={styles.storeName}>
                  {" "}
                  From {selectedItem.store_name}
                </p>
                <div className={styles.rates}>
                  {Array(5)
                    .fill("_")
                    .map((_, idx) => (
                      <GrStar
                        className={styles.rate}
                        key={idx + _}
                        color={
                          selectedItem.average_rating > idx
                            ? "#04D505"
                            : "rgba(0,0,0,0.5)"
                        }
                      />
                    ))}
                </div>
                <p className={styles.intro}>{selectedItem.item_intro}</p>
                <div>
                  <h4 className={styles.modalTitle}>Product Category</h4>
                  <div
                    className={styles.intro}
                    style={{ marginTop: "-.5rem", display: "flex" }}
                  >
                    <p className={styles.intro}>
                      {selectedItem?.item_categories
                        .map((cat) => cat.category_name)
                        .toString()}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className={styles.modalTitle2}>Quantity</h4>
                  <div className={styles.flex2}>
                    <p
                      onClick={() => {
                        if (quantity !== 0) setQuantity(quantity - 1);
                      }}
                      className={styles.box2}
                    >
                      -
                    </p>
                    <p style={{ marginRight: "1rem" }}>{quantity}</p>
                    <p
                      onClick={() => setQuantity(quantity + 1)}
                      className={styles.box2}
                    >
                      +
                    </p>
                  </div>
                  <div>
                    <h4 className={styles.modalTitle2}>Available Quantity</h4>
                    <p className={styles.intro} style={{ marginTop: "-.5rem" }}>
                      43 left
                    </p>
                  </div>
                  <div className={styles.end}>
                    <h4
                      className={styles.modalTitle}
                      style={{ marginRight: "6.3rem" }}
                    >
                      Price
                    </h4>
                    <span className={styles.span}>
                      {" "}
                      <h2
                        style={{ display: "flex", alignItems: "center" }}
                        className={styles.price}
                      >
                        <BsCurrencyDollar /> {selectedItem.item_price}
                      </h2>
                      <p className={styles.piece}> /piece</p>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.border} />
            <div className={styles.buttons}>
              <button className={styles.outlinebtn}>
                <Link
                  href={`/product/${selectedItem?.user?.first_name} ${selectedItem?.user?.last_name}/${selectedItem.item_name}`}
                >
                  View More
                </Link>
              </button>
              <button
                className={styles.outlinebtn}
                onClick={() => {
                  setOpenModal(false);
                  setOpenList(true);
                }}
              >
                Add to Grocery List
              </button>
              <button
                className={styles.btn}
                onClick={() => addToCart(selectedItem, quantity)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
      {openList && (
        <div className={styles.modalContainer}>
          <div className={styles.modalCard3}>
            <div className={styles.flex}>
              <h4 className={styles.addTitle}>Add Item to Grocery List</h4>
              <div onClick={() => setOpenList(false)} className={styles.round}>
                <AiOutlineClose />
              </div>
            </div>
            <div className={styles.lists}>
              {selectGrocery.map((elem) => {
                return (
                  <div
                    onClick={() => setItemAdd({ listName: elem.listName })}
                    className={styles.list}
                  >
                    <input type="checkbox" />
                    <p>{elem.listName}</p>
                  </div>
                );
              })}
            </div>
            <div className={styles.flex} style={{ marginTop: "2rem" }}>
              <button onClick={addItemToGrocery} className={styles.btn}>
                Done
              </button>
              <button
                className={styles.outlinebtn}
                onClick={() => {
                  setOpenList(false);
                  setShow(true);
                }}
              >
                Add to New List
              </button>
            </div>
          </div>
        </div>
      )}
      {show && (
        <Modal
          addItemToGrocery={addItemToGrocery}
          details={details}
          setDetails={setDetails}
          setShow={setShow}
          show={show}
        />
      )}
    </div>
  );
};
export const UtensilModal = ({
  openList,
  openModal,
  setOpenModal,
  setOpenList,
  show,
  setShow,
  selectedItem,
  selectGrocery,
  addItemToGrocery,
  details,
  setDetails,
  setItemAdd,
  setQuantity,
  quantity,
  addToCart,
}) => {
  const dropdownRef = useRef();

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpenModal(false);
    }
  };

  useEffect(() => {
    if (openModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openModal]);
  return (
    <div>
      {openModal && (
        <>
          <div
            className={modalStyles.backdrop}
            onClick={() => setOpenModal(false)}
          ></div>
          <div className={styles.modalContainer}>
            <div className={styles.modalCard} ref={dropdownRef}>
              <div className={styles.flexed}>
                <div className={styles.images}>
                  <img
                    src={selectedItem?.itemImage0}
                    alt=""
                    className={styles.modalImg}
                  />
                  <div className={styles.images1}>
                    {selectedItem.item_images.map((image, idx) => {
                      return (
                        <div className={styles.img1}>
                          <img src={image} />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className={styles.right}>
                  <div className={styles.flex3}>
                    <h6 className={styles.itemName}>
                      {selectedItem.item_name}
                    </h6>
                    <div
                      className={styles.round}
                      onClick={() => setOpenModal(false)}
                    >
                      {" "}
                      <AiOutlineClose />
                    </div>
                  </div>
                  <p className={styles.storeName}>
                    {" "}
                    From {selectedItem.store_name}
                  </p>
                  <div className={styles.rates}>
                    {Array(5)
                      .fill("_")
                      .map((_, idx) => (
                        <GrStar
                          size={20}
                          key={idx + _}
                          color={
                            selectedItem.average_rating > idx
                              ? "#04D505"
                              : "rgba(0,0,0,0.5)"
                          }
                        />
                      ))}
                  </div>
                  <p className={styles.intro}>{selectedItem.item_intro}</p>
                  <div>
                    <h4 className={styles.modalTitle}>Description</h4>
                    <div className={styles.des}>
                      {selectedItem.item_description.map((elem) => {
                        return (
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <p className={styles.intro}>Material</p>
                              <div
                                style={{
                                  borderBottom: "1px dashed #949494",
                                  width: "100%",
                                  marginTop: ".8rem",
                                }}
                              />
                              <p className={styles.intro}>
                                {elem.description_key}
                              </p>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <div>
                                <p className={styles.intro}>Weight</p>
                              </div>
                              <div
                                style={{
                                  borderBottom: "1px dashed #949494",
                                  width: "90%",
                                  height: "1px",
                                  marginTop: ".8rem",
                                }}
                              />
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <p className={styles.intro}>
                                  {elem.object_quantity}
                                </p>
                                <p
                                  className={styles.intro}
                                  style={{ marginLeft: ".5rem" }}
                                >
                                  {elem.object_measurement}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className={styles.end2}>
                      <h4 className={styles.modalTitle2}>Quantity</h4>
                      <div className={styles.flex2}>
                        <p
                          onClick={() => {
                            if (quantity !== 0) setQuantity(quantity - 1);
                          }}
                          className={styles.box2}
                        >
                          -
                        </p>
                        <p style={{ marginRight: "1rem" }}>{quantity}</p>
                        <p
                          onClick={() => setQuantity(quantity + 1)}
                          className={styles.box2}
                        >
                          +
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className={styles.modalTitle}>Product Category</h4>
                    <div
                      className={styles.intro}
                      style={{ marginTop: "-.5rem", display: "flex" }}
                    >
                      <p className={styles.intro}>
                        {selectedItem?.item_categories
                          .map((cat) => cat.category_name)
                          .toString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h4 className={styles.modalTitle2}>Available Quantity</h4>
                      <p
                        className={styles.intro}
                        style={{ marginTop: "-.5rem" }}
                      >
                        43 left
                      </p>
                    </div>
                    <div className={styles.end2}>
                      <h4
                        className={styles.modalTitle}
                        style={{ marginRight: "6.3rem" }}
                      >
                        Price
                      </h4>
                      <span className={styles.span}>
                        {" "}
                        <h2
                          style={{ display: "flex", alignItems: "center" }}
                          className={styles.price}
                        >
                          <BsCurrencyDollar /> {selectedItem.item_price}
                        </h2>
                        <p className={styles.piece}> /piece</p>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.border} />
              <div className={styles.buttons}>
                <button className={styles.outlinebtn}>
                  <Link
                    href={`/product/${selectedItem?.user?.first_name} ${selectedItem?.user?.last_name}/${selectedItem.item_name}`}
                  >
                    View More
                  </Link>
                </button>
                <button
                  className={styles.outlinebtn}
                  onClick={() => {
                    setOpenModal(false);
                    setOpenList(true);
                    console.log(openList, "setOpenList");
                  }}
                >
                  Add to Grocery List
                </button>
                <button
                  className={styles.btn}
                  onClick={() => addToCart(selectedItem, quantity)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {openList && (
        <div className={styles.modalContainer}>
          <div className={styles.modalCard3}>
            <div className={styles.flex}>
              <h4 className={styles.addTitle}>Add Item to Grocery List</h4>
              <div onClick={() => setOpenList(false)} className={styles.round}>
                <AiOutlineClose />
              </div>
            </div>
            <div className={styles.lists}>
              {selectGrocery.map((elem) => {
                return (
                  <div
                    onClick={() => setItemAdd({ listName: elem.listName })}
                    className={styles.list}
                  >
                    <input type="checkbox" />
                    <p>{elem.listName}</p>
                  </div>
                );
              })}
            </div>
            <div className={styles.flex} style={{ marginTop: "2rem" }}>
              <button onClick={addItemToGrocery} className={styles.btn}>
                Done
              </button>
              <button
                className={styles.outlinebtn}
                onClick={() => {
                  setOpenList(false);
                  setShow(true);
                }}
              >
                Add to New List
              </button>
            </div>
          </div>
        </div>
      )}
      {show && (
        <Modal
          addItemToGrocery={addItemToGrocery}
          details={details}
          setDetails={setDetails}
          setShow={setShow}
          show={show}
        />
      )}
    </div>
  );
};
