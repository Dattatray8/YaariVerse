import { useDispatch, useSelector } from "react-redux";
import user from "../assets/user.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import {
  Bookmark,
  Heart,
  MessageSquareIcon,
  SendHorizonal,
} from "lucide-react";
import { setPostData } from "../redux/postSlice";
import { setUserData } from "../redux/userSlice";

function Post({ post }) {
  const { userData } = useSelector((state) => state.user);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const { postData } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (post?.author?._id && userData?._id) {
      setIsCurrentUser(post?.author?.userName === userData.userName);
    }
    setIsSaved(userData?.saved?.includes(post?._id) || false);
  }, [post, userData]);

  const handleLike = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/post/like/${post._id}`, {
        withCredentials: true,
      });
      const updatedPost = result?.data?.post;
      const updatedPosts = postData.map((p) =>
        p._id == post._id ? updatedPost : p
      );
      dispatch(setPostData(updatedPosts));
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/post/comment/${post._id}`,
        { message: comment },
        {
          withCredentials: true,
        }
      );
      const updatedPost = result?.data?.post;
      const updatedPosts = postData.map((p) =>
        p._id == post._id ? updatedPost : p
      );
      setComment("");
      dispatch(setPostData(updatedPosts));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaved = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/post/saved/${post._id}`,
        {
          withCredentials: true,
        }
      );
      dispatch(setUserData(result?.data?.user));
      setIsSaved(userData?.saved?.includes(post?._id) || false);
    } catch (error) {
      setIsSaved(false);
      console.log(error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleComment();
    }
  };
  return (
    <div className="bg-black text-white w-full flex flex-col p-3">
      <div className="flex justify-center items-center">
        <div className="w-full h-20 flex gap-5 items-center">
          <img
            src={post?.author?.profileImage || user}
            alt="User profile image"
            className="w-16 h-16 rounded-full border-2 border-white"
          />
          <p className="w-30 truncate font-semibold text-lg">
            {post?.author?.userName}
          </p>
        </div>
        {!isCurrentUser && (
          <button className="bg-white text-black py-1 px-3 rounded-full cursor-pointer hover:bg-gray-300 transition-all duration-700">
            Follow
          </button>
        )}
      </div>
      <div className="w-full flex justify-center items-center flex-col">
        {post?.mediaType === "image" ? (
          <div className="w-full h-full">
            <img
              src={post?.media}
              className="object-cover w-full rounded-2xl"
            />
          </div>
        ) : (
          <div className="w-full h-full">
            <video
              src={post?.media}
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
              fill={`${post?.likes.includes(userData?._id) && "white"}`}
              onClick={handleLike}
            />
            <p>{post?.likes.length}</p>
          </div>
          <div className="flex justify-center items-center gap-1">
            <MessageSquareIcon
              className="cursor-pointer"
              fill={`${post?.comments.includes(userData?._id) && "white"}`}
              onClick={() => setShowComment(!showComment)}
            />
            <p>{post?.comments.length}</p>
          </div>
        </div>
        <Bookmark
          className="cursor-pointer"
          fill={userData?.saved.includes(post?._id) ? "white" : ""}
          onClick={handleSaved}
        />
      </div>
      {post?.caption && (
        <div className="w-full mt-3">
          <span className="w-30 truncate font-semibold ">
            {post?.author?.userName} -{" "}
          </span>
          <span>{post?.caption} </span>
        </div>
      )}
      {showComment && (
        <div className="flex flex-col mt-3 gap-2">
          <div className="flex gap-4 items-center justify-center">
            <img
              src={userData?.profileImage || user}
              alt="User profile image"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <input
              type="text"
              placeholder="Write comment..."
              className="border-b border-[#ededec] outline-none w-[70%] sm:w-[80%] md:w-[85%]"
              value={comment}
              onKeyDown={handleKeyPress}
              onChange={(e) => setComment(e.target.value)}
            />
            <SendHorizonal className="cursor-pointer" onClick={handleComment} />
          </div>
          {post?.comments.length === 0 ? (
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
            <div className="w-full mt-2 max-h-[50vh] overflow-y-auto">
              <div className="flex flex-col gap-4">
                {post?.comments?.map((com, index) => (
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

export default Post;
