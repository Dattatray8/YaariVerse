import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  VolumeOff,
  Volume2,
  Heart,
  MessageSquareIcon,
  SendHorizonal,
  X,
} from "lucide-react";
import "../index.css";
import user from "../assets/user.png";
import { useDispatch, useSelector } from "react-redux";
import { toggleFollowUser } from "../utils/followService";
import { setFollowing, toggleFollow } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { setShortData } from "../redux/shortVerseSlice";
import axios from "axios";
import { serverUrl } from "../App";
import { useSocket } from "../hooks/useSocket";

function VideoPlayer({ media, data }) {
  let videoTag = useRef();
  const [mute, setMute] = useState(false);
  const [play, setPlay] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const { userData, following } = useSelector((state) => state.user);
  const { shortData } = useSelector((state) => state.short);
  const isFollowing = following.includes(data?.author?._id);
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const [doubleClicked, setDoubleClicked] = useState(false);
  const [comment, setComment] = useState("");
  const [showComment, setShowComment] = useState(false);
  const commentRef = useRef();
  const { socket } = useSocket();

  useEffect(() => {
    const handleClickOutside = (e) => {
      {
        if (commentRef.current && !commentRef.current.contains(e.target)) {
          setShowComment(false);
        }
      }
    };

    if (showComment) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showComment]);

  useEffect(() => {
    if (data?.author?._id && userData?._id) {
      setIsCurrentUser(data?.author?.userName === userData.userName);
    }
  }, [data, userData]);

  const handleClick = () => {
    if (play) {
      videoTag.current.pause();
      setPlay(false);
    } else {
      videoTag.current.play();
      setPlay(true);
    }
  };

  useEffect(() => {
    const video = videoTag.current;
    if (!video) return;

    const handleLoading = () => setIsLoaded(true);
    const handlePlay = () => setPlay(true);
    const handlePause = () => setPlay(false);

    video.addEventListener("loadeddata", handleLoading);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    const observer = new IntersectionObserver(
      (entry) => {
        if (entry[0].isIntersecting) {
          video.play().catch(console.error);
        } else {
          video.pause();
        }
      },
      { threshold: 0.6 }
    );
    if (video) {
      observer.observe(video);
    }
    return () => {
      video.removeEventListener("loadeddata", handleLoading);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);

      if (video) {
        observer.unobserve(video);
      }
    };
  }, [isLoaded]);

  const handleProgressBar = () => {
    const video = videoTag.current;
    if (video) {
      const percent = (video.currentTime / video.duration) * 100;
      setProgress(percent);
    }
  };

  const handleFollow = async () => {
    try {
      const result = await toggleFollowUser(data?.author?._id);
      dispatch(toggleFollow(data?.author?._id));
      dispatch(setFollowing(result.following));
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/short/like/${data._id}`,
        {
          withCredentials: true,
        }
      );
      const updatedShort = result?.data?.short;
      const updatedShorts = shortData.map((p) =>
        p._id == data._id ? updatedShort : p
      );
      dispatch(setShortData(updatedShorts));
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/short/comment/${data._id}`,
        { message: comment },
        {
          withCredentials: true,
        }
      );
      const updatedPost = result?.data?.short;
      const updatedPosts = shortData.map((p) =>
        p._id == data._id ? updatedPost : p
      );
      setComment("");
      dispatch(setShortData(updatedPosts));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDoubleClickOnVideo = () => {
    setDoubleClicked(true);
    setTimeout(() => {
      setDoubleClicked(false);
    }, 6000);
    {
      !data?.likes?.includes(userData?._id) && handleLike();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleComment();
    }
  };

  useEffect(() => {
    socket?.on("likedShort", (updatedData) => {
      const updatedShort = shortData?.map((p) =>
        p._id == updatedData?.shortId ? { ...p, likes: updatedData?.likes } : p
      );
      dispatch(setShortData(updatedShort));
    });

    socket?.on("commentedShort", (updatedData) => {
      const updatedShort = shortData?.map((p) =>
        p._id == updatedData?.shortId
          ? { ...p, comments: updatedData?.comments }
          : p
      );
      dispatch(setShortData(updatedShort));
    });
    return () => {
      socket?.off("likedShort");
      socket?.off("commentedShort");
    };
  }, [socket, shortData, dispatch]);

  return (
    <div className="h-[100%] relative cursor-pointer w-full max-w-full overflow-hidden flex justify-center items-center">
      {play ? (
        <div
          onClick={handleClick}
          className="absolute top-5 z-[100] right-20 bg-black/40 backdrop-blur-md rounded-full p-2 hover:bg-black/60 transition duration-200 cursor-pointer"
        >
          <Pause className="text-white h-6 w-6" />
        </div>
      ) : (
        <div
          onClick={handleClick}
          className="absolute inset-0 z-[100] flex items-center justify-center bg-black/30 rounded-full p-6 w-fit h-fit m-auto hover:bg-black/50 transition duration-200 cursor-pointer"
        >
          <Play className="text-white h-10 w-10" />
        </div>
      )}

      {mute ? (
        <div
          onClick={() => setMute(false)}
          className="absolute z-[100] top-5 right-5 bg-black/40 backdrop-blur-md rounded-full p-2 hover:bg-black/60 transition duration-200 cursor-pointer"
        >
          <VolumeOff className="text-white h-6 w-6" />
        </div>
      ) : (
        <div
          onClick={() => setMute(true)}
          className="absolute z-[100] top-5 right-5 bg-black/40 backdrop-blur-md rounded-full p-2 hover:bg-black/60 transition duration-200 cursor-pointer"
        >
          <Volume2 className="text-white h-6 w-6" />
        </div>
      )}

      <video
        src={media}
        ref={videoTag}
        autoPlay
        loop
        muted={mute}
        preload="metadata"
        playsInline
        className="h-[100%] w-full cursor-pointer object-contain"
        onClick={handleClick}
        onTimeUpdate={handleProgressBar}
        onDoubleClick={handleDoubleClickOnVideo}
      />

      <div className="absolute w-full h-1 bottom-0 bg-gray-500">
        <div
          className="h-full bg-white transition-all duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="absolute bottom-2 flex flex-col w-full h-20 px-4 gap-2">
        <div className="flex items-center gap-3">
          <div
            className="flex gap-3 items-center sm:w-1/3 w-1/2"
            onClick={() => navigation(`/profile/${data?.author?.userName}`)}
          >
            <img
              src={data?.author?.profileImage || user}
              alt=""
              className="border rounded-full h-10 w-10 border-white"
            />
            <p className="font-semibold text-white max-w-1/2 truncate">
              {data?.author?.userName}
            </p>
          </div>
          {!isCurrentUser && (
            <button
              className="bg-white text-black py-1 px-3 rounded-full cursor-pointer hover:bg-gray-300 transition-all duration-700"
              onClick={handleFollow}
            >
              {isFollowing ? "UnFollow" : "Follow"}
            </button>
          )}
        </div>
        <div className="text-white w-full truncate">{data?.caption}</div>
      </div>

      <div className="flex flex-col items-center gap-4 w-20 absolute z-10 right-0 bottom-25">
        <div className="flex justify-center items-center flex-col">
          <Heart
            className="text-white cursor-pointer"
            fill={`${data?.likes.includes(userData?._id) && "white"}`}
            onClick={handleLike}
          />
          <p className="text-white">{data?.likes.length}</p>
        </div>
        <div className="flex justify-center items-center flex-col">
          <MessageSquareIcon
            className="text-white cursor-pointer"
            fill={`${data?.comments.includes(userData?._id) && "white"}`}
            onClick={() => setShowComment(!showComment)}
          />
          <p className="text-white">{data?.comments.length}</p>
        </div>
      </div>

      {doubleClicked && (
        <div className="absolute w-48 h-48 flex justify-center items-center z-50 heart-animation">
          <Heart
            className="text-white h-full w-full drop-shadow-2xl"
            fill="white"
          />
        </div>
      )}

      {showComment && (
        <div
          className="flex flex-col mt-3 gap-2 absolute top-1/2 z-10 bg-[#181817] text-white w-full pt-4 bottom-0 border-t border-gray-500 rounded-t-2xl ease-in-out transition-all duration-100"
          ref={commentRef}
        >
          <div className="h-10 flex justify-end items-center px-5">
            <X onClick={() => setShowComment(false)} />
          </div>
          <div className="flex gap-4 items-center justify-center">
            <img
              src={userData?.profileImage || user}
              alt="User profile image"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <input
              type="text"
              placeholder="Write comment..."
              className="border-b border-[#ededec] text-white outline-none w-[70%] sm:w-[80%] md:w-[85%]"
              value={comment}
              onKeyDown={handleKeyPress}
              onChange={(e) => setComment(e.target.value)}
            />
            <SendHorizonal className="cursor-pointer" onClick={handleComment} />
          </div>
          {data?.comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <MessageSquareIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg font-medium mb-1">
                Be the first to comment
              </p>
              <p className="text-gray-500 text-sm text-center">
                Share your thoughts about this post
              </p>
            </div>
          ) : (
            <div className="w-full mt-2 max-h-[50vh] overflow-y-auto px-5 py-2">
              <div className="flex flex-col gap-4">
                {data?.comments?.map((com, index) => (
                  <div
                    key={com._id || index}
                    className="flex gap-3 items-start"
                  >
                    <img
                      src={com?.author?.profileImage || user}
                      alt="Commenter profile"
                      className="w-8 h-8 rounded-full border border-gray-600 object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-900 rounded-2xl px-4 py-2 border border-gray-800">
                        <p className="text-blue-400 text-xs font-medium mb-1">
                          {com?.author?.userName || "Unknown User"}
                        </p>
                        <p className="text-white text-sm leading-relaxed break-words">
                          {com?.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
