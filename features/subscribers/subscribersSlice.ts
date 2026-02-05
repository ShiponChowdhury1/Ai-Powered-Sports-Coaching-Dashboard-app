import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SubscribersState {
  currentPage: number;
  searchQuery: string;
}

const initialState: SubscribersState = {
  currentPage: 1,
  searchQuery: "",
};

const subscribersSlice = createSlice({
  name: "subscribers",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to first page on search
    },
    resetSubscribersState: () => initialState,
  },
});

export const { setCurrentPage, setSearchQuery, resetSubscribersState } = subscribersSlice.actions;
export default subscribersSlice.reducer;
