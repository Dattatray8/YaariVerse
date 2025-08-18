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

function AppRoutes() {
  useAllPosts();
  useFetchUser();
  useSuggestedUsers();
  useAllShorts();
  useAllStories();

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
      <Route path="/chat/conversation" element={<Chatting />} />
    </Routes>
  );
}

export default AppRoutes;
