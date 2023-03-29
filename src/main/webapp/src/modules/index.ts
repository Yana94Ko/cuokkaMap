import {combineReducers} from "redux";
import filterReducer from "./filterReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
    filterReducer,
    userReducer
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;