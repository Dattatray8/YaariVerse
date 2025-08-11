import logo from "/public/icon.png";
import { Heart } from "lucide-react";
import user from "../assets/user.png";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import OtherUsers from "./OtherUsers";

function LeftHome() {
  const dispatch = useDispatch();
  const handleLogOut = async () => {
    try {
      await axios
        .get(serverUrl + "/api/auth/signout", {
          withCredentials: true,
        })
        .then((e) => {
          dispatch(setUserData(null));
        });
    } catch (error) {
      console.log(error);
    }
  };
  const { userData, suggestedUsers } = useSelector((state) => state.user);
  return (
    <div className="w-[25%] hidden lg:flex min-h-[100vh] bg-[#181817] border-r-2 border-[#ededec22] flex-col gap-2">
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex items-center">
          <img src={logo} alt="Yaari verse logo" className="w-14" />
          <p className="text-white text-xl font-semibold">Yaariverse</p>
        </div>
        <Heart className="text-white" />
      </div>
      <div className="flex items-center gap-4 px-4 justify-center">
        <div className="w-[20%] cursor-pointer">
          <img
            src={userData.profileImage || user}
            alt="User Image"
            className="object-cover w-16 h-12 rounded-full"
          />
        </div>
        <div className="flex justify-between w-[75%] items-center">
          <div>
            <div className="text-[#ededec] text-xl font-semibold">
              {userData.userName}
            </div>
            <div className="text-[#ededecaa] font-semibold">
              {userData.name}
            </div>
          </div>
          <div>
            <p
              className="text-blue-500 hover:scale-105 transition-all hover:text-blue-400 text-md xl:text-xl font-semibold cursor-pointer"
              onClick={handleLogOut}
            >
              Logout
            </p>
          </div>
        </div>
      </div>
      <hr className="text-[#ededec33] w-[90%] self-center my-2" />
      <div className="flex flex-col px-4 gap-3">
        <p className="text-white text-lg">Suggested Users</p>
        <div>
          {suggestedUsers &&
            suggestedUsers
              .slice(0, 3)
              .map((user, index) => <OtherUsers user={user} key={index} />)}
        </div>
      </div>
    </div>
  );
}

export default LeftHome;
