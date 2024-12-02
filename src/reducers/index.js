import { combineReducers } from "redux";
import userTypeReducer from "../reducers/userSlice";
// import {connectRouter} from 'connected-react-router'
import Auth from "./Auth";
import Common from "./Common";
import Cart from "./Cart";

export default combineReducers({
  Auth,
  Common,
  Cart,
  userType: userTypeReducer,
});
