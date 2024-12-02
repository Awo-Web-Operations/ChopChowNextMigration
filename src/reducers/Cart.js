import {
  CART_ADD_ITEM,
  CART_DELETE_ITEM,
  CART_EMPTY,
  CART_HAS_ITEM,
  CART_REMOVE_ITEM,
  CART_STATE,
  FETCH_CART,
} from "../constants/ActionTypes";

const IntialState = {
  cartItems:
    typeof window !== "undefined" && localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
};

export default (state = IntialState, action) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload;
      const itemExist = state.cartItems.find((x) => x.itemId === item.itemId);
      if (itemExist) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x.itemId === itemExist.itemId ? { ...x, amount: x.amount + 1 } : x
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, { ...item, amount: 1 }],
        };
      }
    case CART_REMOVE_ITEM:
      const product = action.payload;
      const productExist = state.cartItems.find(
        (x) => x.itemId === product.itemId
      );
      if (productExist) {
        if (productExist.amount == 1) {
          return {
            ...state,
            cartItems: state.cartItems.filter(
              (x) => x.itemId !== productExist.itemId
            ),
          };
        } else {
          return {
            ...state,
            cartItems: state.cartItems.map((x) =>
              x.itemId === productExist.itemId
                ? { ...x, amount: x.amount - 1 }
                : x
            ),
          };
        }
      } else {
        return { ...state, cartItems: [...state.cartItems] };
      }

    case CART_DELETE_ITEM:
      const prodId = action.payload;
      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x.itemId !== prodId.itemId),
      };

    case CART_HAS_ITEM:
      return {
        cartItems: state.cartItems.some((x) => x.itemId === item.itemId),
      };

    case FETCH_CART:
      // console.log("action.payload ", action.payload )
      let array = action.payload.data;

      return { ...state, cartItems: [...array] };

    case CART_EMPTY:
      return { ...state, cartItems: [] };

    case CART_STATE:
      return { ...state, cartItems: [...state.cartItems] };

    default:
      return state;
  }
};
