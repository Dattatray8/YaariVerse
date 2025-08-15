import { createSlice } from "@reduxjs/toolkit";

const shortVerseSlice = createSlice({
  name: "short",
  initialState: {
    shortData: [],
  },
  reducers: {
    setShortData: (state, action) => {
      state.shortData = action.payload;
    },
  },
});

export const { setShortData } = shortVerseSlice.actions;

export default shortVerseSlice.reducer;
