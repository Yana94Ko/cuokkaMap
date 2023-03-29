const SET_CURRENT_FILTER = "filterReducer/SET_CURRENT_FILTER" as const;


export const setCurrentFilter = (currentFilter: string) => ({

    type: SET_CURRENT_FILTER,
    payload: currentFilter
});

type FilterAction = ReturnType<typeof setCurrentFilter>;

type FilterState = {
    currentFilter: string
}

const initialState: FilterState = {
    currentFilter: "all"
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
        default:
            return state;
    }
}

export default filterReducer;