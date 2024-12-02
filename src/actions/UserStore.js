import axios from "../util/Api";
import { toast } from "react-toastify";
import {
  FETCH_START,
  USER_ADDED_TO_STORE,
  FETCH_ERROR,
  IS_AUTHENTICATED,
  USER_REMOVE_FROM_STORE,
  FETCH_SUCCESS
} from "../constants/ActionTypes";

export const addUserToStore = (storeId, form) => {
  return (dispatch) => {
    dispatch({ type: FETCH_START });
    return axios
      .post(`/stores/add-user/${storeId}`, { ...form })
      .then(({ data }) => {
        console.log("__ Add User to Store api res __ : ", data);

        dispatch({ type: FETCH_SUCCESS });
        dispatch({ type: USER_ADDED_TO_STORE, payload: data });

        return data; // Return the data to be handled by the calling function
      })
      .catch((err) => {
        console.error("xxx addUserToStore Request ERROR xxx");
        console.log(err.message, 'rrrrr');

        if (err.response?.status === 422) {
          dispatch({
            type: FETCH_ERROR,
            payload:
              "Email address was already taken. If you are owner, please proceed to login with this email.",
          });
        }
        throw err
      });
  };
};

export const removeUserFromStore = (storeId, userId) => {
  return (dispatch) => {
    dispatch({ type: FETCH_START });
    return axios
      .delete(`/stores/removeuser/${userId}/${storeId}`)
      .then(() => {
        console.log(
          "__ Remove User from Store API response __ : ",
          `User ${userId} removed from store ${storeId}`
        );

        dispatch({ type: FETCH_SUCCESS });
        dispatch({ type: USER_REMOVE_FROM_STORE });

        return { userId, storeId };
      })
      .catch((err) => {
        console.error("xxx removeUserFromStore Request ERROR xxx");
        console.log(err?.response);

        const errorMessage =
          err.response?.status === 422 &&
          "An error occurred while trying to remove the user. Please try again later.";

        dispatch({
          type: FETCH_ERROR,
          payload: errorMessage,
        });
      });
  };
};
