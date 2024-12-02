import { useState, useEffect } from "react";
import axios from "../../util/Api";
import styles from "./stores.module.css";
import { GoStarFill } from "react-icons/go";
import { useRouter } from "next/router";
import { Element } from "react-scroll";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { toast } from "react-toastify";
import { UtensilModal } from "../modal/individual-meal-product";
import { addToCart } from "../../actions";
import { useDispatch } from "react-redux";
import { canItemBeAddedToCart } from "../../util/canAddToCart";

export const SuggestedUtensils = () => {
  const [meals, setMeals] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [selectGrocery, setSelectGrocery] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [show, setShow] = useState(false);
  const [openList, setOpenList] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (id, value) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const dispatch = useDispatch();

  const router = useRouter();
  const [itemToAdd, setItemAdd] = useState({
    listName: "",
  });

  const addItemToGrocery = async (listName) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const payload = {
      userId: user._id,
      groceryList: {
        listName: itemToAdd.listName || listName,
        groceryItems: {
          itemId: selectedItem._id,
          quantity: quantity.toString(),
        },
      },
    };

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

  const addItemToCart = (item, qty) => {
    const user = JSON.parse(localStorage.getItem("user"));
    let canAddToCart = canItemBeAddedToCart(item);

    if (qty == 0) {
      toast.error("Add a quantity");
    } else {
      if (canAddToCart) {
        const payload = {
          userId: user && user._id ? user._id : "",
          storeId: "",
          store_name: "",
          itemId: item._id,
          quantity: qty,
          item_price: item.item_price,
          currency: "",
          item_image: item.itemImage0,
          itemName: item.item_name,
          item_type: item.item_type ? item.item_type : "Product",
        };
        try {
          dispatch(addToCart(payload));
          setOpenList(false);
          setShow(false);
          setOpenModal(false);
        } catch (error) {
          console.log(error);
        }
      }
    }
  };
  const [details, setDetails] = useState({
    listName: "",
    description: "",
    id: "",
    status: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);

  const [uniqueItemIds, setUniqueItemIds] = useState(new Set());
  const fetchProducts = async () => {
    try {
      const response = await axios(
        `/items/${currentPage}?type=Utensil&status=Public&limit=8`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const totalItems = response.data.data.count;
      const allItems = response.data.data.items;

      const filteredItems = allItems.filter((meal) => meal.average_rating);

      const newItems = filteredItems.filter(
        (item) => !uniqueItemIds.has(item._id)
      );

      setMeals([...meals, ...newItems]);
      setUniqueItemIds(
        new Set([...uniqueItemIds, ...newItems.map((item) => item._id)])
      );

      setHasMoreData(totalItems > currentPage * 8);
    } catch (error) {
      console.log(error);
    }
  };

  const loadMore = async () => {
    setCurrentPage(currentPage + 1);
    await fetchProducts();
  };
  useEffect(() => {
    fetchProducts();
  }, [currentPage]);
  const fetchGroceryList = async () => {
    try {
      const response = await axios(`/groceries/list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setSelectGrocery(response.data.data.data);
    } catch (error) {}
  };
  useEffect(() => {
    fetchGroceryList();
  }, []);

  useEffect(() => {
    // Get the hash value from the URL
    const hash = window.location.hash;

    // Use the hash value as the target ID for scrolling
    const targetId = hash ? hash.substring(1) : "utensils";

    // Scroll to the target section
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <div className={styles.mealContainer}>
      <Element
        name="utensils"
        id="utensils"
        style={{ fontSize: "2rem", marginBottom: "1rem" }}
      >
        Suggested Utensils for you
      </Element>
      <div className={styles.stores2}>
        {meals.map((utensil, idx) => {
          return (
            <div
              className={styles.card1}
              key={idx}
              onClick={() => {
                setSelectedItem(utensil);
                setOpenModal(true);
              }}
            >
              {
                <div className={styles.box}>
                  <img
                    src={
                      utensil?.itemImage0
                        ? utensil?.itemImage0
                        : "/assets/store_pics/no-image-utensil.png"
                    }
                    className={styles.storeImg1}
                  />
                  <div className={styles.flex}>
                    <p className={styles.name2}>{utensil.item_name}</p>
                    <p>$8.43</p>
                  </div>
                  <p className={styles.storeName}>Chop Chow Official Store</p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      marginTop: ".7rem",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      {Array(5)
                        .fill("_")
                        .map((_, idx) => (
                          <GoStarFill
                            key={idx + _}
                            color={
                              utensil.average_rating > idx
                                ? "#04D505"
                                : "rgba(0,0,0,0.5)"
                            }
                            style={{ marginLeft: ".2rem" }}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              }
            </div>
          );
        })}
        <UtensilModal
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
          setQuantity={(qty) => {
            handleQuantityChange(selectedItem._id, qty);
          }}
          quantity={quantities[selectedItem?._id] || 0}
          setShow={setShow}
          addToCart={addItemToCart}
        />
      </div>
      <p className={styles.view} onClick={hasMoreData ? loadMore : () => {}}>
        View More
      </p>
    </div>
  );
};
