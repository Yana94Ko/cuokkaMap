const SET_IS_LOGGED_IN = "userReducer/SET_IS_LOGGED_IN" as const;
const SET_USER_ID = "userReducer/SET_USER_ID" as const;
const SET_IS_OPENED_LOGIN_MODAL = "userReducer/SET_IS_OPENED_LOGIN_MODAL" as const;

export const setIsLoggedin = (isLoggedin: boolean) => ({
    type: SET_IS_LOGGED_IN,
    payload: isLoggedin
});

export const setUserId = (userId: string) => ({
    type: SET_USER_ID,
    payload: userId
});

export const setIsOpenedLoginModal = (isOpenedLoginModal: boolean) => ({
    type: SET_IS_OPENED_LOGIN_MODAL,
    payload: isOpenedLoginModal
})

type UserAction =
    | ReturnType<typeof setIsOpenedLoginModal>
    | ReturnType<typeof setIsLoggedin>
    | ReturnType<typeof setUserId>;

type UserState = {
    isOpenedLoginModal: boolean,
    isLoggedin: boolean,
    userId: string,

}

const initialState: UserState = {
    isOpenedLoginModal: false,
    isLoggedin: sessionStorage.getItem("id") !== null,
    userId: sessionStorage.getItem("id")
}

function userReducer(
    state: UserState = initialState,
    action: UserAction
): UserState {
    switch (action.type) {
        case SET_IS_OPENED_LOGIN_MODAL:
            return {...state, isOpenedLoginModal: action.payload};
        case SET_IS_LOGGED_IN:
            return {...state, isLoggedin: action.payload};
        case SET_USER_ID:
            return {...state, userId: action.payload};
        default:
            return state;
    }
}

export default userReducer;