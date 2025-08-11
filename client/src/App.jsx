import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
export const serverUrl = "http://localhost:8000";
function App() {
  return (
    <div className="overflow-hidden">
      <AppRoutes />
      <ToastContainer />
    </div>
  );
}

export default App;
