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

function AppRoutes() {
  useFetchUser();
  useSuggestedUsers();
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
    </Routes>
  );
}

export default AppRoutes;
