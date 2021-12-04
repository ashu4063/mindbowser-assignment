import { createStore, applyMiddleware } from "redux";
import reducer from "./Redux/reducer";
import thunk from "redux-thunk";
// add middleware asynchronous data flow support
const store = createStore(reducer, applyMiddleware(thunk));

export default store;
