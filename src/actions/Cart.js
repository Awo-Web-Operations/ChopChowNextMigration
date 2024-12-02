import { toast } from "react-toastify";
import {
  CART_ADD_ITEM,
  CART_DELETE_ITEM,
  CART_EMPTY,
  CART_HAS_ITEM,
  CART_REMOVE_ITEM,
  CART_STATE,
  FETCH_CART,
} from "../constants/ActionTypes";
import axios from "../util/Api";

export const addToCart = (product) => async (dispatch, getState) => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user !== undefined && Object.keys(user).length !== 0 && user !== null) {
      axios
        .post("/cart/addtocart", {
          user: product.userId || user,
          item: product.itemId,
          item_type: product.item_type,
          storeId: product.storeId,
          quantity: product.quantity,
          item_price: product.item_price,
          item_Name: product.itemName,
          item_image: product.item_image,
        })
        .then(({ data }) => {
          if (data.data.message === "Added to cart successfully") {
            dispatch({
              type: CART_ADD_ITEM,
              payload: {
                name: product.itemName,
                image: product.item_image,
                price: product.item_price,
                itemId: product.itemId,
                userId: product.userId,
                storeName: product.store_name,
                currency: product.currency,
                amount: product.quantity,
                storeId: product.storeId,
                itemType: product.item_type,
              },
            });
            toast.success("Item added successfully");
          } else {
            toast.success(data.data.message);
          }
        });
    } else {
      dispatch({
        type: CART_ADD_ITEM,
        payload: {
          name: product.itemName,
          image: product.item_image,
          price: product.item_price,
          itemId: product.itemId,
          userId: product.userId,
          storeName: product.store_name,
          currency: product.currency,
          amount: product.quantity,
          storeId: product.storeId,
          itemType: product.item_type,
        },
      });
      toast.success("Item added successfully");
      console.log("line 58 ", payload);
    }
  } catch (error) {
    console.log(error.message, "cart error");
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().Cart.cartItems)
    );
  }
};

export const addMultipleItemsToCart =
  (products) => async (dispatch, getState) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      console.log("adding multiple items to cart");

      if (user !== undefined && user !== "{}" && user !== null) {
        // Post request to add multiple items to cart
        axios
          .post("/cart/addMultipleItemsToCart", {
            user: products[0].userId || user,
            items: products.map((product) => ({
              item: product.itemId,
              item_type: product.item_type,
              storeId: product.storeId,
              quantity: product.quantity,
              item_price: product.item_price,
              item_Name: product.itemName,
              item_image: product.item_image,
            })),
          })
          .then(({ data }) => {
            if (data.data.message === "Items processed successfully") {
              products.forEach((product) => {
                dispatch({
                  type: CART_ADD_ITEM,
                  payload: {
                    name: product.itemName,
                    image: product.item_image,
                    price: product.item_price,
                    itemId: product.itemId,
                    userId: product.userId,
                    storeName: product.store_name,
                    currency: product.currency,
                    amount: product.quantity,
                    storeId: product.storeId,
                    itemType: product.item_type,
                  },
                });
              });
              toast.success("Items added successfully");
            } else {
              toast.success(data.data.message);
            }
          });
      } else {
        products.forEach((product) => {
          dispatch({
            type: CART_ADD_ITEM,
            payload: {
              name: product.itemName,
              image: product.item_image,
              price: product.item_price,
              itemId: product.itemId,
              userId: product.userId,
              storeName: product.store_name,
              currency: product.currency,
              amount: product.quantity,
              storeId: product.storeId,
              itemType: product.item_type,
            },
          });
        });
        toast.success("Items added successfully");
      }
    } catch (error) {
      console.log(error.message, "cart error");
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "cartItems",
        JSON.stringify(getState().Cart.cartItems)
      );
    }
  };

export const removeFromCart = (productId) => async (dispatch, getState) => {
  console.log("line 90 ", productId);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user !== undefined && user !== "{}" && user !== null) {
    axios
      .post("/cart/removefromcart/", { user: user, item: productId })
      .then(({ data }) => {
        console.log("line 90 ", data);
        if (data) {
          dispatch({
            type: CART_REMOVE_ITEM,
            payload: {
              itemId: productId,
            },
          });
        }
      });
  } else {
    dispatch({
      type: CART_REMOVE_ITEM,
      payload: {
        itemId: productId,
      },
    });
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().Cart.cartItems)
    );
  }
};

export const deleteFromCart = (productId) => (dispatch, getState) => {
  console.log("delete from cart line 119", productId);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user !== undefined && user !== "{}" && user !== null) {
    axios
      .post("/cart/deletefromcart/", { user: user, item: productId })
      .then(({ data }) => {
        if (data) {
          dispatch({ type: CART_DELETE_ITEM, payload: { itemId: productId } });
        }
      });
  } else {
    dispatch({ type: CART_DELETE_ITEM, payload: { itemId: productId } });
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().Cart.cartItems)
    );
  }
};

export const IsItemPresent = () => (dispatch) => {
  dispatch({ type: CART_HAS_ITEM });
};

export const EmptyCart = () => (dispatch, getState) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  console.log("user cart action line 143", user._id);
  if (user !== undefined && user !== "{}" && user !== null) {
    axios.post("/cart/deletecart/", { user: user }).then(({ data }) => {
      if (data) {
        dispatch({ type: CART_EMPTY });
      }
    });
  } else {
    dispatch({ type: CART_EMPTY });
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().Cart.cartItems)
    );
  }
};

export const FetchCart = () => (dispatch, getState) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  console.log("user cart action line 143", user._id);
  if (user !== undefined && user !== "{}" && user !== null) {
    axios.post("/cart/cart/", { user: user }).then(({ data }) => {
      console.log("user cart action line 143", data);
      if (
        Array.isArray(data.data.data) &&
        data.data.data[0] != null &&
        data.data.data[0] > 0
      ) {
        let array = [];
        console.log("user cart action line 173", data);
        data.data.data.forEach((x) => {
          array.push({
            name: x.item_Name,
            image: x.item_image,
            price: x.item_price,
            itemId: x.item,
            userId: user._id,
            storeName: x.store.store_name ? x.store_name : "",
            currency: "$",
            amount: x.quantity_of_item,
            storeId: x.store._id ? x.store._id : "",
            itemType: x.item_type,
          });
        });
        console.log("user cart action line 143", array);

        dispatch({ type: FETCH_CART, payload: { data: array } });
      } else {
        dispatch({ type: CART_STATE });
      }
    });
  } else {
    dispatch({ type: CART_STATE });
  }
  if (typeof window !== "undefined") {
    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().Cart.cartItems)
    );
  }
};
