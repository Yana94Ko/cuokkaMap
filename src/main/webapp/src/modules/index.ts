import {combineReducers} from "redux";
import filterReducer from "./filterReducer";
import userReducer from "./userReducer";
import viewReducer from "./viewReducer";

const rootReducer = combineReducers({
    filterReducer,
    userReducer,
    viewReducer
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;