import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import SkeletonLoader from "../components/SkeletonLoader";
import MobileFeedLoader from "../components/MobileFeedLoader";

function ProtectedRoute({ children }) {
  const { userData, loading } = useSelector((state) => state.user);
  if (loading) {
    return (
      <div>
        <div className="lg:flex hidden">
          <SkeletonLoader />
        </div>
        <div className="lg:hidden">
          <MobileFeedLoader />
        </div>
      </div>
    );
  }
  if (!userData) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}

export default ProtectedRoute;
