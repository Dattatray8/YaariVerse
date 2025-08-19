import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";

function Messages() {
  const navigation = useNavigate();
  const { onlineUsers } = useSocket();
  return (
    <div className="w-full min-h-[100vh] flex flex-col bg-[#181817] gap-4 px-4">
      <div className="w-full h-20 flex items-center gap-4 px-4">
        <ArrowLeft
          className="text-white cursor-pointer lg:hidden"
          onClick={() => navigation("/")}
        />
        <p className="text-white font-semibold text-xl">Messages</p>
      </div>
    </div>
  );
}

export default Messages;
