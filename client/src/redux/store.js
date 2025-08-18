import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import postSlice from "./postSlice";
import storySlice from "./storySlice";
import shortVerseSlice from "./shortVerseSlice";
import chatSlice from "./chatSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    post: postSlice,
    story: storySlice,
    short: shortVerseSlice,
    chat: chatSlice,
  },
});
