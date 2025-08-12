import { useNavigate } from "react-router-dom";
import userImg from "../assets/user.png";

function OtherUsers({ user }) {
  const navigation = useNavigate();
  return (
    <div className="w-full h-20 flex items-center justify-between hover:bg-[#37373582] ">
      <div
        className="flex items-center w-full gap-4 px-2 justify-center"
        onClick={() => navigation(`/profile/${user.userName}`)}
      >
        <div className="w-[20%] cursor-pointer flex justify-center items-center rounded-full">
          <img
            src={user.profileImage || userImg}
            alt="User Image"
            className="object-cover w-14 h-14 rounded-full"
          />
        </div>
        <div className="flex justify-between w-[80%] items-center cursor-pointer">
          <div>
            <div className="text-[#ededec] text-[1.3em] font-semibold">
              {user.userName}
            </div>
            <div className="text-[#ededecaa] font-semibold">{user.name}</div>
          </div>
          <div>
            <p className="text-blue-500 hover:scale-105 transition-all hover:text-blue-400 text-md xl:text-xl font-semibold cursor-pointer">
              Follow
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtherUsers;
