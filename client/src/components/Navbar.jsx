import { CirclePlus, Search, Video } from "lucide-react";
import user from "../assets/user.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Navbar() {
  const navigation = useNavigate();
  const { userData } = useSelector((state) => state.user);
  return (
    <div className="w-full lg:w-[50%] h-14 lg:h-16 bg-[#181817] flex justify-around items-center fixed bottom-0 lg:border-none border-t border-[#ededec]">
      <div onClick={() => navigation("/")}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-white cursor-pointer"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 9.75L12 3l9 6.75M4.5 10.5V21h15V10.5M9 21V15h6v6"
          />
        </svg>
      </div>
      <div>
        <Search className="text-white cursor-pointer" />
      </div>
      <div onClick={() => navigation("/upload")}>
        <CirclePlus className="text-white cursor-pointer" />
      </div>
      <div>
        <Video className="text-white cursor-pointer" />
      </div>
      <div onClick={() => navigation(`/profile/${userData?.userName}`)}>
        <div className="cursor-pointer">
          <img
            src={userData?.profileImage || user}
            alt="User Image"
            className="object-cover w-8 h-8 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
