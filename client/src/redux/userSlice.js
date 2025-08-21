import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    loading: true,
    suggestedUsers: null,
    profileData: null,
    following: [],
    notificationData: [],
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setProfileData: (state, action) => {
      state.profileData = action.payload;
    },
    setFollowing: (state, action) => {
      state.following = action.payload;
    },
    toggleFollow: (state, action) => {
      const targetUserId = action.payload;
      if (state.following.includes(targetUserId)) {
        state.following = state.following.filter((id) => id != targetUserId);
      } else {
        state.following.push(targetUserId);
      }
    },
    setNotificationData: (state, action) => {
      state.notificationData = action.payload;
    },
  },
});

export const {
  setUserData,
  setLoading,
  setSuggestedUsers,
  setProfileData,
  setFollowing,
  toggleFollow,
  setNotificationData
} = userSlice.actions;
export default userSlice.reducer;
