import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { setProfileData, setUserData } from "../redux/userSlice";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import user from "../assets/user.png";
import Navbar from "../components/Navbar";

function Profile() {
  const { userName } = useParams();
  const dispatch = useDispatch();
  const { profileData, userData } = useSelector((state) => state.user);
  const navigation = useNavigate();
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const handleProfile = async () => {
    try {
      await axios
        .get(serverUrl + "/api/user/profile/" + userName, {
          withCredentials: true,
        })
        .then((e) => {
          dispatch(setProfileData(e?.data?.user));
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogOut = async () => {
    try {
      await axios
        .get(serverUrl + "/api/auth/signout", {
          withCredentials: true,
        })
        .then((e) => {
          dispatch(setUserData(null));
          navigation("/signin");
        });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleProfile();
  }, [userName, dispatch]);
  useEffect(() => {
    if (profileData?._id && userData?._id) {
      setIsCurrentUser(profileData.userName === userData.userName);
    }
  }, [profileData, userData]);
  return (
    <div className="bg-[#181817] w-full min-h-[100vh] flex flex-col md:gap-8 gap-4">
      {isCurrentUser ? (
        <div className="w-full py-4 px-6 md:px-8 flex items-center justify-between sm:h-20 h-16">
          <ArrowLeft
            className="text-white h-full cursor-pointer"
            onClick={() => navigation(-1)}
          />
          <p className="text-white font-semibold">{profileData?.userName}</p>
          <p
            className="text-blue-500 hover:scale-105 transition-all hover:text-blue-400 text-md xl:text-xl font-semibold cursor-pointer"
            onClick={handleLogOut}
          >
            Logout
          </p>
        </div>
      ) : (
        <div className="w-full p-4 flex items-center h-20">
          <ArrowLeft
            className="text-white h-full cursor-pointer"
            onClick={() => navigation(-1)}
          />
          <div className="w-[80%] m-auto text-center">
            <p className="text-white font-semibold">{profileData?.userName}</p>
          </div>
        </div>
      )}
      <div className="w-full lg:px-[25%] flex justify-start px-10 h-20 items-center gap-10 min-[425px]:justify-center min-[425px]:gap-15">
        <div className="w-18 h-18">
          <img
            src={profileData?.profileImage || user}
            alt="User Image"
            className="object-cover w-full rounded-full"
          />
        </div>
        <div className="flex flex-col gap-1 justify-center">
          <p className="text-white font-semibold text-xl">
            {profileData?.name}
          </p>
          <p className="text-gray-400 text-sm font-semibold">
            @{profileData?.userName}
          </p>
          <p className="text-white font-semibold">
            {profileData?.profession || "Developer"}
          </p>
        </div>
      </div>
      <div className="w-full lg:px-[25%] flex justify-center items-center sm:gap-12 gap-12">
        <p className="text-white font-semibold hidden sm:block">
          {profileData?.posts.length} Posts
        </p>
        <p className="text-white font-semibold">
          {profileData?.followers.length} Followers
        </p>
        <p className="text-white font-semibold">
          {profileData?.following.length} Following
        </p>
      </div>
      {profileData?.bio && (
        <div className="w-full lg:px-[30%] sm:px-[10%] md:px-[20%] flex justify-start items-center text-white px-10">
          {profileData?.bio || "users bio"}
        </div>
      )}
      {isCurrentUser ? (
        <div className="w-full lg:px-[30%] flex justify-center items-center">
          <button className="bg-white font-semibold py-2 w-3/4 rounded-md cursor-pointer hover:bg-[#ffffffdd] transition-all duration-700">
            Edit Profile
          </button>
        </div>
      ) : (
        <div className="w-full lg:px-[30%] flex justify-center items-center px-2 gap-2">
          <button className="bg-white font-semibold py-2 w-1/2 rounded-md cursor-pointer hover:bg-[#ffffffdd] transition-all duration-700">
            Follow
          </button>
          <button className="bg-white font-semibold py-2 w-1/2 rounded-md cursor-pointer hover:bg-[#ffffffdd] transition-all duration-700">
            Message
          </button>
        </div>
      )}
      <div className="flex justify-center">
        <Navbar />
      </div>
    </div>
  );
}

export default Profile;
