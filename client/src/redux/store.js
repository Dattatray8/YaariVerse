import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import postSlice from "./postSlice";
import storySlice from "./storySlice";
import shortVerseSlice from "./shortVerseSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    post: postSlice,
    story: storySlice,
    short: shortVerseSlice,
  },
});
