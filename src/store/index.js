


import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";
import { createWrapper } from "next-redux-wrapper";
import rootReducer from "../reducers/index";
import storage from 'redux-persist/lib/storage'
import { persistStore, persistReducer } from 'redux-persist'



const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

// middleware
const middleware = [thunk];

// creating store
export const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);
// assigning store to next wrapper
const makeStore = () => store;

export let persistor = persistStore(store)

export const wrapper = createWrapper(makeStore);


