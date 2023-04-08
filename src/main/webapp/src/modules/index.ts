import {combineReducers} from "redux";
import filterReducer from "./filterReducer";
import userReducer from "./userReducer";
import viewReducer from "./viewReducer";
import cafeInfoReducer from "./cafeInfoReducer";

const rootReducer = combineReducers({
    filterReducer,
    userReducer,
    viewReducer,
    cafeInfoReducer
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;