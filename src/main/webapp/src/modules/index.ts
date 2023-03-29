import {combineReducers} from "redux";
import filterReducer from "./filterReducer";

const rootReducer = combineReducers({
    filterReducer
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;