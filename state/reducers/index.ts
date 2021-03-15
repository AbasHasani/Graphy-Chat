import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "../persisted";
import currentRoom from "./currentRoom";
import currents from "./currents";
const rootReducer = combineReducers({
  currents,
  currentRoom
});

const persistConfig = {
  timeout: 0,
  key: "root",
  whitelist: ["currents", "currentRoom"],
  storage,
};

export const persestedReducer = persistReducer(persistConfig, rootReducer);

export default rootReducer;
