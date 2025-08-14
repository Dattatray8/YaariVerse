import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  setFollowing,
  setProfileData,
  setUserData,
  toggleFollow,
} from "../redux/userSlice";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import user from "../assets/user.png";
import Navbar from "../components/Navbar";
import { toggleFollowUser } from "../utils/followService";
import Post from "../components/Post";

function Profile() {
  const { userName } = useParams();
  const dispatch = useDispatch();
  const { profileData, userData, following } = useSelector(
    (state) => state.user
  );
  const navigation = useNavigate();
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const isFollowing = following.includes(profileData?._id);
  const [nav, setNav] = useState("posts");
  const { postData } = useSelector((state) => state.post);

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

  const handleFollow = async () => {
    try {
      const result = await toggleFollowUser(profileData?._id);
      dispatch(toggleFollow(profileData?._id));
      dispatch(setFollowing(result.following));
      await handleProfile();
    } catch (error) {
      console.log(error);
    }
  };

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
            className="object-cover w-full h-full rounded-full"
          />
        </div>
        <div className="flex flex-col gap-1 justify-center">
          <p className="text-white font-semibold text-lg">
            {profileData?.name}
          </p>
          <p className="text-gray-400 text-sm font-semibold">
            @{profileData?.userName}
          </p>
          <p className="text-white font-semibold text-sm">
            {profileData?.profession || "Developer"}
          </p>
        </div>
      </div>
      <div className="w-full lg:px-[25%] flex justify-center items-center sm:gap-12 gap-12 mt-2">
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
          <button
            className="bg-white font-semibold py-2 w-3/4 rounded-md cursor-pointer hover:bg-[#ffffffdd] transition-all duration-700"
            onClick={() => navigation("/editprofile")}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <div className="w-full lg:px-[30%] flex justify-center items-center px-2 gap-2">
          <button
            className="bg-white font-semibold py-2 w-1/2 rounded-md cursor-pointer hover:bg-[#ffffffdd] transition-all duration-700"
            onClick={handleFollow}
          >
            {isFollowing ? "UnFollow" : "Follow"}
          </button>
          <button className="bg-white font-semibold py-2 w-1/2 rounded-md cursor-pointer hover:bg-[#ffffffdd] transition-all duration-700">
            Message
          </button>
        </div>
      )}

      {isCurrentUser ? (
        <div className="w-full lg:px-[30%] flex justify-center items-center px-2 gap-2">
          <p
            className={`w-1/2 cursor-pointer text-white text-center pb-3 ${
              nav === "posts" && "border-b-2 border-white"
            } transition-all `}
            onClick={() => setNav("posts")}
          >
            Posts
          </p>
          <p
            className={`w-1/2 cursor-pointer text-white text-center pb-3 ${
              nav === "saved" && "border-b-2 border-white"
            } transition-all `}
            onClick={() => setNav("saved")}
          >
            Saved
          </p>
        </div>
      ) : (
        <div className="w-full lg:px-[30%] flex justify-center items-center px-2 gap-2 mt-1">
          <p className="w-full cursor-pointer text-white text-center pb-3 border-b-2 border-white transition-all ">
            Posts
          </p>
        </div>
      )}

      {nav === "posts" && (
        <div className="w-full lg:px-[30%] flex justify-center items-center flex-col gap-3">
          {postData.map(
            (post, index) =>
              post?.author?._id == profileData?._id && (
                <div className="border-b-2 border-[#ededec]" key={index}>
                  <Post post={post} />
                </div>
              )
          )}
        </div>
      )}
      {nav === "saved" && (
        <div className="w-full lg:px-[30%] flex justify-center items-center flex-col gap-3 mb-10">
          {userData?.saved?.map((postId) => {
            const post = postData.find  ((p) => p._id === postId);
            if (!post) return null;
            return (
              <div className="border-b-2 border-[#ededec]" key={post._id}>
                <Post post={post} />
              </div>
            );
          })}
        </div>
      )}
      <div className="flex justify-center">
        <Navbar />
      </div>
    </div>
  );
}

export default Profile;
