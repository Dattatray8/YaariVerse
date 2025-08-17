import { Plus } from "lucide-react";
import user from "../assets/user.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { useEffect, useState } from "react";

function StorySection({ userName, profileImage, story }) {
  const { userData } = useSelector((state) => state.user);
  const { storyData, storyList } = useSelector((state) => state.story);
  const navigation = useNavigate();
  const [viewed, setViewed] = useState(false);

  useEffect(() => {
    if (story?.viewers?.some((viewer) => viewer?._id == userData?._id)) {
      setViewed(true);
    } else {
      setViewed(false);
    }
  }, [userData, story, storyData, storyList]);

  const handleViewers = async () => {
    try {
      await axios.get(serverUrl + "/api/story/view/" + story?._id, {
        withCredentials: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col w-18 lg:w-20 gap-2 lg:gap-0 items-center">
      <div className="h-13 lg:h-20 lg:w-20 w-16 flex justify-center items-center rounded-full">
        <div
          className="w-full cursor-pointer flex justify-center"
          onClick={() => {
            if (!story && userName === "You") {
              navigation("/upload");
            } else if (story && userName === "You") {
              handleViewers();
              navigation(`/story/${userData?.userName}`);
            } else {
              if (story) {
                handleViewers();
              }
              navigation(`/story/${userName}`);
            }
          }}
        >
          <img
            src={profileImage || user}
            alt="User Image"
            className={`object-cover w-16 h-16 rounded-full p-0.5 ${
              story
                ? !viewed
                  ? "bg-gradient-to-tr from-pink-400 to-purple-500"
                  : "bg-gradient-to-tr from-gray-400 to-gray-600"
                : ""
            }`}
          />
          {!story && userName === "You" && (
            <Plus className="text-white absolute top-30 left-15 cursor-pointer lg:top-17 lg:left-16" />
          )}
        </div>
      </div>
      <div className="text-white truncate w-full text-center">{userName}</div>
    </div>
  );
}

export default StorySection;
