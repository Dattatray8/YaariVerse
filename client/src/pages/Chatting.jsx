import { ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Chatting() {
  const { selectedUser } = useSelector((state) => state.chat);
  const navigation = useNavigate();
  return (
    <div className="w-full h-[100vh] bg-black relative">
      <div className="flex gap-4 p-6 z-[100] top-0 w-full items-center fixed">
        <ArrowLeft
          className="text-white cursor-pointer"
          onClick={() => navigation(-1)}
        />
        <div>
          <img src={selectedUser?.profileImage} alt="User Image" className="w-14 h-14"/>
          <div>
            <p className="text-white">{selectedUser?.userName}</p>
            <p></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatting;
