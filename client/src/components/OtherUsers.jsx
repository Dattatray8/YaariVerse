import { useNavigate } from "react-router-dom";
import userImg from "../assets/user.png";
import { setFollowing, toggleFollow } from "../redux/userSlice";
import { toggleFollowUser } from "../utils/followService";
import { useDispatch, useSelector } from "react-redux";
import BlueTick from "./BlueTick";

function OtherUsers({ user }) {
  const { following } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const isFollowing = following.includes(user?._id);
  const handleFollow = async () => {
    try {
      const result = await toggleFollowUser(user?._id);
      dispatch(toggleFollow(user?._id));
      dispatch(setFollowing(result.following));
    } catch (error) {
      console.log(error);
    }
  };
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
            className="object-cover xl:w-14 xl:h-14 h-10 w-10 rounded-full"
          />
        </div>
        <div className="flex justify-between w-[80%] items-center cursor-pointer">
          <div>
            <div className="text-[#ededec] text-[1.3em] font-semibold w-30 truncate">
              {user.userName} {user?.userName === "yaariverse" && <BlueTick />}
            </div>
            <div className="text-[#ededecaa] font-semibold w-30 truncate">
              {user.name}
            </div>
          </div>
          <div>
            <p
              className="text-blue-500 hover:scale-105 transition-all hover:text-blue-400 text-md xl:text-xl font-semibold cursor-pointer"
              onClick={handleFollow}
            >
              {isFollowing ? "UnFollow" : "Follow"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtherUsers;
