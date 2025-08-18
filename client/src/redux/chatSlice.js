import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    selectedUSer: null,
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUSer = action.payload;
    },
  },
});

export const { setSelectedUser } = chatSlice.actions;
export default chatSlice.reducer;
