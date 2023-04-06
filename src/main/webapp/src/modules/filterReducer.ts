const SET_CURRENT_FILTER = "filterReducer/SET_CURRENT_FILTER" as const;
const SET_IS_BOOKMARK_MODE = "filterReducer/SET_IS_BOOKMARK_MODE" as const;


export const setCurrentFilter = (currentFilter: object) => ({
    type: SET_CURRENT_FILTER,
    payload: currentFilter
});
export const setIsBookmarkMode = (isBookmarkMode: boolean) => ({
    type: SET_IS_BOOKMARK_MODE,
    payload: isBookmarkMode
});

type FilterAction = ReturnType<typeof setCurrentFilter> | ReturnType<typeof setIsBookmarkMode>;

type FilterState = {
    currentFilter: any
    isBookmarkMode : boolean
}

const initialState: FilterState = {
    currentFilter: [],
    isBookmarkMode: false,
}


function filterReducer(
    state: FilterState = initialState,
    action: FilterAction
): FilterState {
    switch (action.type) {
        case SET_CURRENT_FILTER:
            return {
                ...state, currentFilter: action.payload
            };
        case SET_IS_BOOKMARK_MODE:
            return {
                ...state, isBookmarkMode: action.payload
            };
        default:
            return state;
    }
}

export default filterReducer;