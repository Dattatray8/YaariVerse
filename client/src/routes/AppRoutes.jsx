import { Route, Routes } from "react-router-dom";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import ForgotPassword from "../pages/ForgotPassword";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";
import useFetchUser from "../hooks/useFetchUser";
import useSuggestedUsers from "../hooks/useSuggestedUsers";
import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";
import Upload from "../pages/Upload";
import useAllPosts from "../hooks/useAllPosts";
import Shorts from "../pages/Shorts";
import useAllShorts from "../hooks/useAllShorts";
import Story from "../pages/Story";
import useAllStories from "../hooks/useAllStories";
import Messages from "../pages/Messages";
import Chatting from "../pages/Chatting";
import useFollowingList from "../hooks/useFollowingList";
import Search from "../pages/Search";
import useAllNotifications from "../hooks/useAllNotifications";
import Notifications from "../pages/Notifications";
import { useEffect } from "react";
import { useSocket } from "../hooks/useSocket";
import { useDispatch, useSelector } from "react-redux";
import { setNotificationData } from "../redux/userSlice";

function AppRoutes() {
  useAllPosts();
  useFetchUser();
  useSuggestedUsers();
  useAllShorts();
  useAllStories();
  useFollowingList();
  useAllNotifications();
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return notificationDate.toLocaleDateString();
  };

  const { socket } = useSocket();
  const { notificationData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    socket?.on("newNotification", (noti) => {
      dispatch(setNotificationData([...notificationData, noti]));
      if (Notification.permission === "granted") {
        new Notification(`${noti?.sender?.name} ${noti?.message}`, {
          body: `${getTimeAgo(noti?.createdAt)}`,
          icon: `${noti?.sender?.profileImage}`,
        });
      }
    });
    return () => socket?.off("newNotification");
  }, [socket, dispatch]);

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="/profile/:userName" element={<Profile />} />
      <Route path="/editprofile" element={<EditProfile />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/shorts" element={<Shorts />} />
      <Route path="/story/:userName" element={<Story />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/chat/:userName" element={<Chatting />} />
      <Route path="/search" element={<Search />} />
      <Route path="/notifications" element={<Notifications />} />
    </Routes>
  );
}

export default AppRoutes;
