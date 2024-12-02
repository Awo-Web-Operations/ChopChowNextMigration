// import { CREATE_ORDER } from "../constants/ActionTypes";

// export const CreateOrder = (order, TotalPrice) => async (dispatch, getState) => {
    
//     dispatch({
//       type: CREATE_ORDER,
//       payload: {

//         name: order.itemName,
//         image: order.item_image,
//         price: order.item_price,
//         itemId: order.itemId,
//         userId: order.userId,
//         storeName: order.store_name,
//         currency: order.currency,
//         amount: order.quantity,
//         storeId: order.storeId
//       },
//     });
//     if (typeof window !== 'undefined') {
//     localStorage.setItem('cartItems', JSON.stringify(getState().Cart.cartItems));
//     }
//   };

  // export const removeFromCart = (productId) => async (dispatch, getState) => {
    
  //   dispatch({
  //     type: CART_REMOVE_ITEM,
  //     payload: {
  //       itemId: productId,
        
  //     },
  //   });
  //   if (typeof window !== 'undefined') {
  //   localStorage.setItem('cartItems', JSON.stringify(getState().Cart.cartItems));
  //   }
  // };

  // export const deleteFromCart = (productId) => (dispatch, getState) => {
  //   dispatch({ type: CART_DELETE_ITEM, payload: { itemId:productId} });
  //   if (typeof window !== 'undefined') {
  //     localStorage.setItem('cartItems', JSON.stringify(getState().Cart.cartItems));
  //     }
  // };

  // export const IsItemPresent = () => (dispatch) => {
  //   dispatch({ type: CART_HAS_ITEM});
  // };

  // export const EmptyCart = () => (dispatch, getState) => {
  //   dispatch({ type: CART_EMPTY});
  //   if (typeof window !== 'undefined') {
  //     localStorage.setItem('cartItems', JSON.stringify(getState().Cart.cartItems));
  //   }
  // };

  

  