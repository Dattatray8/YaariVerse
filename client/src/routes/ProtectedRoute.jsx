import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { userData, loading } = useSelector((state) => state.user);
  if (loading) {
    return <div>Loading....</div>;
  }
  if (!userData) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}

export default ProtectedRoute;
