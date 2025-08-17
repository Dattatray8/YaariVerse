import { useNavigate } from "react-router-dom";
import { toggleFollowUser } from "../utils/followService";
import { setFollowing, toggleFollow } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import user from "../assets/user.png";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Eye, X } from "lucide-react";

function StoryCard({ storyData }) {
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const { userData, following } = useSelector((state) => state.user);
  const isFollowing = following.includes(storyData?.author?._id);
  const [holded, setHolded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showViewers, setShowViewers] = useState(false);

  const viewersRef = useRef();

  const handleFollow = async () => {
    try {
      const result = await toggleFollowUser(storyData?.author?._id);
      dispatch(toggleFollow(storyData?.author?._id));
      dispatch(setFollowing(result.following));
    } catch (error) {
      console.log(error);
    }
  };

  const videoRef = useRef();
  const imageref = useRef();

  useEffect(() => {
    if (storyData?.mediaType == "video") {
      if (videoRef.current) {
        {
          holded ? videoRef.current.pause() : videoRef.current.play();
        }
      }
    }
  }, [holded]);

  useEffect(() => {
    if (storyData?.author?._id && userData?._id) {
      setIsCurrentUser(storyData?.author?.userName === userData.userName);
    }
  }, [storyData, userData]);

  const handleProgressBar = () => {
    if (videoRef.current) {
      const percent =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(percent);
    }
  };

  useEffect(() => {
    if (!holded) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [storyData, holded, navigation]);

  useEffect(() => {
    if (progress >= 100) {
      navigation("/");
    }
  }, [progress, navigation]);

  return (
    <div
      className="relative w-full max-w-[30rem] h-[100vh] flex flex-col overflow-hidden bg-[#181817]"
      onMouseDown={() => setHolded(true)}
      onMouseUp={() => setHolded(false)}
      onMouseLeave={() => setHolded(false)}
      onTouchStart={() => setHolded(true)}
      onTouchEnd={() => setHolded(false)}
    >
      <div className="absolute w-full h-1 top-0 bg-gray-500">
        <div
          className="h-full bg-white transition-all duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="absolute flex items-center w-full gap-4 top-1 left-0 px-4 py-3 bg-gradient-to-b from-black/60 to-transparent z-10">
        <div className="flex items-center gap-3">
          <ArrowLeft
            className="text-white cursor-pointer"
            onClick={() => navigation(-1)}
          />
          <div
            className="flex gap-2 items-center cursor-pointer"
            onClick={() =>
              navigation(`/profile/${storyData?.author?.userName}`)
            }
          >
            <img
              src={storyData?.author?.profileImage || user}
              alt=""
              className="border rounded-full h-10 object-cover w-10 border-white"
            />
            <p className="font-semibold text-white truncate max-w-30">
              {storyData?.author?.userName}
            </p>
          </div>
          {!isCurrentUser && (
            <button
              className="bg-white text-black py-1 px-3 rounded-full cursor-pointer hover:bg-gray-300 transition-all duration-300"
              onClick={handleFollow}
            >
              {isFollowing ? "UnFollow" : "Follow"}
            </button>
          )}
        </div>
      </div>

      <div className="w-full flex justify-center items-center h-full">
        {storyData?.mediaType === "image" ? (
          <div className="w-full h-full">
            <img
              src={storyData?.media}
              ref={imageref}
              className="object-cover w-full h-full"
              onClick={() => setShowViewers(false)}
            />
          </div>
        ) : (
          <video
            src={storyData?.media}
            autoPlay
            className="object-cover h-full w-full"
            ref={videoRef}
            onTimeUpdate={handleProgressBar}
            onClick={() => setShowViewers(false)}
            preload="metadata"
          ></video>
        )}
      </div>

      {storyData?.author?.userName === userData?.userName && (
        <div
          className="flex items-center absolute text-white bottom-0 h-20 justify-start gap-3 px-4 cursor-pointer"
          onClick={() => setShowViewers(true)}
        >
          <div>
            <Eye />
          </div>
          <div>{storyData?.viewers?.length}</div>
        </div>
      )}

      {showViewers && (
        <div
          className="flex flex-col mt-3 gap-2 absolute top-1/2 z-10 bg-[#181817] text-white w-full pt-4 bottom-0 border-t border-gray-500 rounded-t-2xl ease-in-out transition-all duration-100"
          ref={viewersRef}
        >
          <div className="h-10 flex justify-end items-center px-5">
            <X
              onClick={() => setShowViewers(false)}
              className="cursor-pointer"
            />
          </div>
          <div className="w-full mt-2 max-h-[50vh] overflow-y-auto px-5 py-2">
            <div className="flex flex-col gap-4 justify-center">
              {storyData?.viewers?.map((viewer, index) => (
                <div
                  className="flex gap-4 items-center cursor-pointer"
                  onClick={() => navigation(`/profile/${viewer?.userName}`)}
                  key={index}
                >
                  <img
                    src={viewer?.profileImage || user}
                    alt=""
                    className="border rounded-full h-10 object-cover w-10 border-white"
                  />
                  <p className="font-semibold text-white truncate max-w-30">
                    {viewer?.userName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StoryCard;
