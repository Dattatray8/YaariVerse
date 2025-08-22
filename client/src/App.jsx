import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
export const serverUrl = "https://yaariverse-backend.onrender.com";
function App() {
  return (
    <div className="overflow-hidden">
      <AppRoutes />
      <ToastContainer />
    </div>
  );
}

export default App;
