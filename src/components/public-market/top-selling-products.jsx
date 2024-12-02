import { useState, useEffect } from "react";
import axios from "../../util/Api";
import styles from "./stores.module.css";
import { GoStarFill } from "react-icons/go";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { ProductModal } from "../modal/individual-meal-product";
import { Element } from "react-scroll";
import { useDispatch } from "react-redux";
import { addToCart } from "../../actions";
import { canItemBeAddedToCart } from "../../util/canAddToCart";

export const TopSellingProducts = () => {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [selectGrocery, setSelectGrocery] = useState({});
  const [openList, setOpenList] = useState(false);
  const [show, setShow] = useState(false);
  const router = useRouter();
  const [quantity, setQuantity] = useState(0);

  const dispatch = useDispatch();

  //items to add
  const [itemToAdd, setItemAdd] = useState({
    listName: "",
  });

  // const loadMore = () => {
  //   setVisibleProducts(visibleProducts + 5);
  // };

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

  // Generate a random integer between a specified range
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Example usage to generate an ID between 1 and 1000
  let randomId = getRandomInt(1, 1000);

  const addItemToCart = (item, qty) => {
    const user = JSON.parse(localStorage.getItem("user"));

    let canAddToCart = canItemBeAddedToCart(item);

    if (qty == 0) {
      toast.error("Pls add a quantity");
    } else {
      if (canAddToCart) {
        const payload = {
          userId: user && user._id ? user._id : "",
          storeId: "",
          store_name: "",
          itemId: item._id,
          quantity: qty,
          item_price: item.item_price,
          currency: "$",
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
  const [hasMoreData, setHasMoreData] = useState(true); // Initially assume there's more data

  const [uniqueItemIds, setUniqueItemIds] = useState(new Set());

  const fetchProducts = async () => {
    try {
      const response = await axios(
        `/items/${currentPage}?type=Product&status=Public&limit=8`,
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

      setProducts([...products, ...newItems]);
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
    const targetId = hash ? hash.substring(1) : "product";

    // Scroll to the target section
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <div className={styles.mealContainer1}>
      <Element
        name="product"
        style={{ fontSize: "2rem", marginBottom: "1rem" }}
      >
        Top Selling Products
      </Element>
      <div className={styles.stores3}>
        {products?.map((product, idx) => {
          return (
            <div
              className={styles.card1}
              key={idx}
              onClick={() => {
                setSelectedItem(product);
                setOpenModal(true);
              }}
            >
              <div className={styles.box}>
                <img
                  src={
                    product?.itemImage0
                      ? product?.itemImage0
                      : "assets/store_pics/no-image-product.png"
                  }
                  className={styles.storeImg2}
                />
                <div className={styles.flex}>
                  <p className={styles.name2}>{product.item_name}</p>
                  <p>{product?.item_price ? product.item_price : "$0.00"}</p>
                </div>
                <p className={styles.storeName}>Chop Chow Official Store</p>
                <div className={styles.flex}>
                  <div>
                    {Array(5)
                      .fill("_")
                      .map((_, idx) => (
                        <GoStarFill
                          key={idx + _}
                          color={
                            product.average_rating > idx
                              ? "#04D505"
                              : "rgba(0,0,0,0.5)"
                          }
                          style={{ marginLeft: ".2rem" }}
                        />
                      ))}
                  </div>
                  <p className={styles.prep}> 23 mins </p>
                </div>
              </div>
            </div>
          );
        })}
        <ProductModal
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
          quantity={quantity}
          setQuantity={setQuantity}
          addToCart={addItemToCart}
        />
      </div>
      <p className={styles.view} onClick={hasMoreData ? loadMore : () => {}}>
        View More
      </p>
      <div className={styles.border} />
    </div>
  );
};
