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
import {
  ArrowLeft,
  Settings,
  MessageCircle,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { useState } from "react";
import user from "../assets/user.png";
import Navbar from "../components/Navbar";
import { toggleFollowUser } from "../utils/followService";
import Post from "../components/Post";
import { setSelectedUser } from "../redux/chatSlice";

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
        .then(() => {
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
    <div className="bg-gradient-to-br from-[#0a0a0a] to-[#181817] w-full min-h-screen flex flex-col">
      <div className="w-full p-4 flex items-center justify-between border-b border-gray-800/50">
        <ArrowLeft
          className="text-white h-6 w-6 cursor-pointer hover:text-blue-400 transition-colors"
          onClick={() => navigation(-1)}
        />
        <h1 className="text-white font-semibold text-lg">
          @{profileData?.userName}
        </h1>
        {isCurrentUser ? (
          <Settings
            className="text-white h-6 w-6 cursor-pointer hover:text-blue-400 transition-colors"
            onClick={() => navigation("/editprofile")}
          />
        ) : (
          <div className="w-6 h-6"></div>
        )}
      </div>

      <div className="px-4 sm:px-6 py-6">
        {isCurrentUser && (
          <div className="flex justify-end mb-4">
            <button
              onClick={handleLogOut}
              className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        )}

        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src={profileData?.profileImage || user}
              alt="Profile"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-gray-800 bg-gray-800"
            />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-white text-2xl font-bold mb-1">
            {profileData?.name}
          </h2>
          <p className="text-gray-400 text-base mb-2">
            @{profileData?.userName}
          </p>

          {profileData?.profession && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 mb-4">
              <span className="text-blue-400 text-sm font-medium">
                {profileData.profession}
              </span>
            </div>
          )}

          {profileData?.bio && (
            <p className="text-gray-300 text-sm leading-relaxed mb-4 max-w-md">
              {profileData.bio}
            </p>
          )}

          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="text-center">
              <p className="text-white font-bold text-lg">
                {profileData?.posts?.length || 0}
              </p>
              <p className="text-gray-400 text-xs">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg">
                {profileData?.followers?.length || 0}
              </p>
              <p className="text-gray-400 text-xs">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg">
                {profileData?.following?.length || 0}
              </p>
              <p className="text-gray-400 text-xs">Following</p>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            {isCurrentUser ? (
              <button
                onClick={() => navigation("/editprofile")}
                className="flex items-center gap-2 px-6 py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 flex-1 sm:flex-none justify-center"
              >
                <Settings className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleFollow}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 flex-1 sm:flex-none justify-center ${
                    isFollowing
                      ? "bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30"
                      : "bg-blue-500/20 text-blue-400 border border-blue-500/50 hover:bg-blue-500/30"
                  }`}
                >
                  {isFollowing ? (
                    <UserMinus className="w-4 h-4" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
                <button
                  onClick={() => {
                    dispatch(setSelectedUser(profileData));
                    navigation(`/chat/${profileData?.userName}`);
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gray-700/50 text-white border border-gray-600/50 rounded-xl hover:bg-gray-700/70 font-semibold transition-all duration-300 flex-1 sm:flex-none justify-center"
                >
                  <MessageCircle className="w-4 h-4" />
                  Message
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="sticky top-0 bg-gradient-to-br from-[#0a0a0a]/95 to-[#181817]/95 backdrop-blur-md border-b border-gray-800/50 z-40">
        <div className="flex">
          {isCurrentUser ? (
            <>
              <button
                onClick={() => setNav("posts")}
                className={`flex-1 py-4 text-center font-medium transition-all duration-300 ${
                  nav === "posts"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => setNav("saved")}
                className={`flex-1 py-4 text-center font-medium transition-all duration-300 ${
                  nav === "saved"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Saved
              </button>
            </>
          ) : (
            <div className="flex-1 py-4 text-center font-medium text-blue-400 border-b-2 border-blue-400">
              Posts
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 pb-24">
        {nav === "posts" && (
          <div className="max-w-2xl mx-auto px-4">
            {postData.filter((post) => post?.author?._id === profileData?._id)
              .length === 0 ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">📝</div>
                <p className="text-gray-400 font-medium mb-2">No posts yet</p>
                <p className="text-gray-500 text-sm">
                  {isCurrentUser
                    ? "Share your first post!"
                    : "This user hasn't posted anything yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-6 py-6">
                {postData.map(
                  (post, index) =>
                    post?.author?._id === profileData?._id && (
                      <div
                        key={index}
                        className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:border-gray-600/50 transition-all duration-300"
                      >
                        <Post post={post} />
                      </div>
                    )
                )}
              </div>
            )}
          </div>
        )}

        {nav === "saved" && (
          <div className="max-w-2xl mx-auto px-4">
            {!userData?.saved || userData.saved.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">🔖</div>
                <p className="text-gray-400 font-medium mb-2">No saved posts</p>
                <p className="text-gray-500 text-sm">
                  Posts you save will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-6 py-6">
                {userData.saved.map((postId) => {
                  const post = postData.find((p) => p._id === postId);
                  if (!post) return null;
                  return (
                    <div
                      key={post._id}
                      className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:border-gray-600/50 transition-all duration-300"
                    >
                      <Post post={post} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex justify-center bg-gradient-to-br from-[#0a0a0a]/95 to-[#181817]/95 backdrop-blur-md border-t border-gray-800/50 z-50">
        <Navbar />
      </div>
    </div>
  );
}

export default Profile;
