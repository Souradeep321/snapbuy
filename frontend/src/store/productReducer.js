import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
    name: 'searchProduct',
    initialState: {
        searchQuery: '',
    },
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
    },
});

export const { setSearchQuery } = productSlice.actions;
export default productSlice.reducer;
