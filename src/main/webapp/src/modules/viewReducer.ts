const SET_IS_OPENED_CAFE_INFO = "viewReducer/SET_IS_OPENED_CAFE_INFO" as const;
const SET_IS_OPENED_POST_CAFE = "viewReducer/SET_IS_OPENED_POST_CAFE" as const;

const SET_CURRENT_MY_PAGE_VIEW = "viewReducer/SET_CURRENT_MY_PAGE_VIEW" as const;

export const setIsOpenedCafeInfo = (isOpenedCafeInfo: boolean) => ({
    type: SET_IS_OPENED_CAFE_INFO,
    payload: isOpenedCafeInfo
});

export const setIsOpenedPostCafe = (isOpenedPostCafe: boolean) => ({
    type: SET_IS_OPENED_POST_CAFE,
    payload: isOpenedPostCafe
});

export const setCurrentMyPageView = (currentMyPageView: string) => ({
    type: SET_CURRENT_MY_PAGE_VIEW,
    payload: currentMyPageView
});

type ViewAction =
    | ReturnType<typeof setIsOpenedCafeInfo>
    | ReturnType<typeof setIsOpenedPostCafe>
    | ReturnType<typeof setCurrentMyPageView>;

type ViewState = {
    isOpenedCafeInfo: boolean,
    isOpenedPostCafe: boolean,

    currentMyPageView: string
}

const initialState: ViewState = {
    isOpenedCafeInfo: false,
    isOpenedPostCafe: false,
    currentMyPageView: "photo"
}

function viewReducer(
    state: ViewState = initialState,
    action: ViewAction
): ViewState {
    switch (action.type) {
        case SET_IS_OPENED_CAFE_INFO:
            return {...state, isOpenedCafeInfo: action.payload};
        case SET_IS_OPENED_POST_CAFE:
            return {...state, isOpenedPostCafe: action.payload};
        case SET_CURRENT_MY_PAGE_VIEW:
            return {...state, currentMyPageView: action.payload};
        default:
            return state;
    }
}

export default viewReducer;