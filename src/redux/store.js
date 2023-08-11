import { createStore, combineReducers } from "redux";
import { CollapsedReducer } from "./reducer/CollapsedReducer";
const reducer = combineReducers({
  CollapsedReducer,
});
const store = createStore(reducer);

export default store;
