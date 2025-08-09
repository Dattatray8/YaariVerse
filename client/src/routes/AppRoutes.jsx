import { Route, Routes } from "react-router-dom";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import ForgotPassword from "../pages/ForgotPassword";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}

export default AppRoutes;
