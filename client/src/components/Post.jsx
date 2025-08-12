import { useSelector } from "react-redux";
import user from "../assets/user.png";
import { useEffect, useState } from "react";
import { Bookmark, Heart, MessageSquareIcon } from "lucide-react";

function Post({ postData }) {
  const { userData } = useSelector((state) => state.user);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  useEffect(() => {
    if (postData?.author?._id && userData?._id) {
      setIsCurrentUser(postData?.author?.userName === userData.userName);
    }
  }, [postData, userData]);
  return (
    <div className="bg-black text-white w-full flex flex-col p-3">
      <div className="flex justify-center items-center">
        <div className="w-full h-20 flex gap-5 items-center">
          <img
            src={postData?.author?.profileImage || user}
            alt="User profile image"
            className="w-16 h-16 rounded-full border-2 border-white"
          />
          <p className="w-30 truncate font-semibold text-lg">
            {postData?.author?.userName}
          </p>
        </div>
        {!isCurrentUser && (
          <button className="bg-white text-black py-1 px-3 rounded-full cursor-pointer hover:bg-gray-300 transition-all duration-700">
            Follow
          </button>
        )}
      </div>
      <div className="w-full flex justify-center items-center flex-col">
        {postData?.mediaType === "image" ? (
          <div className="w-full h-full">
            <img
              src={postData?.media}
              className="object-cover w-full rounded-2xl"
            />
          </div>
        ) : (
          <div className="w-full h-full">
            <video
              src={postData?.media}
              controls
              className="object-contain h-full w-full"
            ></video>
          </div>
        )}
      </div>
      <div className="w-full flex justify-between mt-3">
        <div className="flex gap-6">
          <div className="flex justify-center items-center gap-1">
            <Heart
              className="cursor-pointer"
              fill={`${postData?.likes.includes(userData?._id) && "white"}`}
            />
            <p>{postData?.likes.length}</p>
          </div>
          <div className="flex justify-center items-center gap-1">
            <MessageSquareIcon
              className="cursor-pointer"
              fill={`${postData?.comments.includes(userData?._id) && "white"}`}
            />
            <p>{postData?.comments.length}</p>
          </div>
        </div>
        <Bookmark
          className="cursor-pointer"
          fill={`${userData?.saved.includes(postData?._id) && "white"}`}
        />
      </div>
      {postData?.caption && (
        <div className="w-full mt-3">
          <span className="w-30 truncate font-semibold ">
            {postData?.author?.userName} -{" "}
          </span>
          <span>{postData?.caption} </span>
        </div>
      )}
    </div>
  );
}

export default Post;
