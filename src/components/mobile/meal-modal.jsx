import styles from "./meal-modal.module.css";
import { GrStar } from "react-icons/gr";
import { AiOutlineClose } from "react-icons/ai";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { BsCurrencyDollar } from "react-icons/bs";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Modal } from "../modal/popup-modal";
import { addToCart } from "../../actions";
import { useEffect, useRef } from "react";

export const Mealmodal = ({
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

  console.log(selectedItem, "selectedItem.meal_formatted_instructions");

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
          <div className={styles.modalCard} ref={dropdownRef}>
            <div className={styles.close}>
              <div className={styles.round} onClick={() => setOpenModal(false)}>
                <AiOutlineClose />
              </div>
            </div>
            <div className={styles.flexed}>
              <div className={styles.images2}>
                <img
                  src={selectedItem?.itemImage0}
                  alt=""
                  className={styles.modalImg}
                />
                <div className={styles.images1}>
                  {selectedItem.item_images?.slice(1, 4).map((image, idx) => {
                    return (
                      <div className={styles.img1} key={idx}>
                        <img src={image} />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h6 className={styles.itemName}>{selectedItem.item_name}</h6>
                <p className={styles.storeName}> {selectedItem.store_name}</p>
                <div className={styles.rates}>
                  {Array(5)
                    .fill("_")
                    .map((_, idx) => (
                      <GrStar
                        size={16}
                        key={idx + _}
                        color={
                          selectedItem.average_rating > idx
                            ? "#04D505"
                            : "rgba(0,0,0,0.5)"
                        }
                      />
                    ))}
                </div>
                <div>
                  <h4 className={styles.modalTitle}>Meal Category:</h4>
                  <div className={styles.cat} style={{ marginTop: "-.5rem" }}>
                    <p className={styles.intro}>
                      {selectedItem?.item_categories
                        ?.map((cat) => cat.category_name)
                        ?.toString()}
                    </p>
                  </div>
                </div>
                <div className={styles.flexer}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      marginTop: 10,
                    }}
                  >
                    <p className={styles.prep}>PrepTime:</p>
                    <p className={styles.prep}>CookTime:</p>

                    <p className={styles.prep}>Serves:</p>
                    <div className={styles.flex2}>
                      <p
                        style={{ fontSize: "15px", cursor: "pointer" }}
                        onClick={() => {
                          if (quantity !== 0) setServe((prev) => prev - 1);
                        }}
                        className={styles.box2}
                      >
                        -
                      </p>
                      <p style={{ fontSize: "11px" }}>{serve}</p>
                      <p
                        style={{ fontSize: "15px", cursor: "pointer" }}
                        onClick={() => setServe((prev) => prev + 1)}
                        className={styles.box2}
                      >
                        +
                      </p>
                    </div>
                    <p className={styles.prep}>Chef:</p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      marginTop: 10,
                    }}
                  >
                    <p className={styles.prep}>
                      {selectedItem.meal_cook_time} Minutes
                    </p>
                    <p className={styles.prep}>
                      {selectedItem.meal_prep_time} Minutes
                    </p>

                    <p className={styles.prep}>
                      {selectedItem.meal_servings} People
                    </p>
                    <p
                      onClick={() =>
                        router.push(`/chef/${selectedItem.user._id}`)
                      }
                      className={styles.prep}
                      style={{ color: "rgba(244, 121, 0, 1)" }}
                    >
                      {selectedItem.meal_chef}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <p className={styles.prep} style={{ marginTop: "3rem" }}>
              Intro:
            </p>
            <p className={styles.intro}>{selectedItem.item_intro}</p>
            <div>
              <h3 className={styles.modalTitle}>Ingredients</h3>
              <div style={{ marginTop: "1rem", paddingBottom: "3rem" }}>
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
                    {/* <th className={styles.th}>Price</th> */}
                  </thead>
                  <tbody>
                    {selectedItem.ingredeints_in_item.map((elem, index) => (
                      <tr
                        key={index}
                        className={styles.tr}
                        styles={{ color: "#353839" }}
                      >
                        <td className={styles.td}>{elem.item_name}</td>
                        <td className={styles.td}>{elem.item_quantity}</td>
                        <td className={styles.td}>{elem.item_measurement}</td>
                        {/* <td className={styles.td}>
                          {elem?.item_price ? `$${elem?.item_price}` : "N/A"}
                        </td>{" "} */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h3
                className={styles.modalTitle}
                style={{ marginTop: "-1.5rem" }}
              >
                Recipe Steps
              </h3>
              <Carousel
                showStatus={false}
                showIndicators={false}
                axis="horizontal"
                showThumbs={false}
                className={styles.recipe}
                renderArrowPrev={(clickHandler, hasPrev) => {
                  return (
                    <div
                      style={{
                        position: "absolute",
                        top: "10%",
                        bottom: 0,
                        left: "1%",
                        display: hasPrev ? "flex" : "none",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "3px",
                        opacity: 0.3,
                        zIndex: 1000,
                      }}
                      onClick={clickHandler}
                    >
                      <BsArrowLeftCircleFill size={30} className={styles.arr} />
                    </div>
                  );
                }}
                renderArrowNext={(clickHandler, hasNext) => {
                  const arrowStyle = {
                    position: "absolute",
                    top: "10%",
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
                      <div className={styles.recipes} key={index}>
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
                                width={70}
                              >
                                <source
                                  src={
                                    selectedItem[
                                      `meal_image_or_video_content${index + 1}`
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
                          style={{ textAlign: "left", paddingLeft: "1rem" }}
                        >
                          <h6
                            style={{
                              color: "#000",
                              fontWeight: "500",
                              fontSize: "14px",
                            }}
                          >
                            {elem.title}
                          </h6>
                          <ul className={styles.ul}>
                            {elem.instructionSteps.map((ele, i) => (
                              <li className={styles.instructionStep} key={i}>
                                {ele}
                              </li>
                            ))}
                          </ul>
                        </span>
                      </div>
                    );
                  }
                )}
              </Carousel>
            </div>
            <div className={styles.flex}>
              <h3 style={{ fontSize: "14px" }}>Meal Quantity</h3>
              <div className={styles.flex2}>
                <p
                  style={{ fontSize: "11px" }}
                  onClick={() => {
                    if (quantity !== 0) setQuantity((prev) => prev - 1);
                  }}
                  className={styles.box2}
                >
                  -
                </p>
                <p style={{ fontSize: "11px" }}>{quantity}</p>
                <p
                  style={{ fontSize: "11px" }}
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className={styles.box2}
                >
                  +
                </p>
              </div>
              <div>
                <p className={styles.prep}>Price</p>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <BsCurrencyDollar />
                  <p>{selectedItem.item_price}</p>
                </div>
              </div>
            </div>
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
                  // setOpenModal(false);
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
      )}
      {openList && (
        <div className={styles.modalContainer}>
          <div className={styles.modalCard3}>
            <div className={styles.flex3}>
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
    </div>
  );
};
