import {stat} from "fs";

const SET_CAFE_INFO_CONTAINER = "cafeInfoReducer/SET_CAFE_INFO_CONTAINER" as const;

export const setCafeInfoContainer = (cafeInfoContainer: object) => ({
    type: SET_CAFE_INFO_CONTAINER,
    payload: cafeInfoContainer
})

type CafeInfoAction = ReturnType<typeof setCafeInfoContainer>;

type CafeInfoState = {
    cafeInfoContainer: any
}

const initialState: CafeInfoState = {
    cafeInfoContainer: undefined
}

function cafeInfoReducer(
    state: CafeInfoState = initialState,
    action: CafeInfoAction
): CafeInfoState {
    switch (action.type) {
        case SET_CAFE_INFO_CONTAINER:
            return {
                ...state, cafeInfoContainer: action.payload
            };
        default:
            return state;
    }
}

export default cafeInfoReducer;