import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userInfoSlice from "./global/userInfoSlice";
import HomeSlice from "../container/home/HomeSlice";
import productsPresentationSlice from "../component/products-presentation/productsPresentationSlice";
import cartSlice from "../container/order/cartSlice";
import globalConfigSlice from "./global/globalConfigSlice";
import messageSlice from "../component/message/messageSlice";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import notificationSlice from "../component/popper/noti-poper/notificationSlice";
import orderSlice from "./global/orderSlice";

const persistConfig = {
   key: "root",
   version: 1,
   storage,
   // if you do not want to persist this part of the state
   blacklist: [
      "homeData",
      "productsPresentationData",
      "fileControlSlice",
      "messageSlice",
      "userInfoSlice",
      "orderSlice"
   ],
};
const reducer = combineReducers({
   userInfoSlice: userInfoSlice.reducer,
   homeData: HomeSlice.reducer,
   productsPresentationData: productsPresentationSlice.reducer,
   cartSlice: cartSlice.reducer,
   globalConfigSlice: globalConfigSlice.reducer,
   messageSlice: messageSlice.reducer,
   notificationSlice: notificationSlice.reducer,
   orderSlice: orderSlice.reducer
});
const persistedReducer = persistReducer(persistConfig, reducer);
const store = configureStore({
   reducer: persistedReducer,
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: false,
      }),
});
export default store;
