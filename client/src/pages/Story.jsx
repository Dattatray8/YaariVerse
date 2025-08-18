import axios from "axios";
import { useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setStoryData } from "../redux/storySlice";
import { useEffect } from "react";
import StoryCard from "../components/StoryCard";
import LoadingSpinner from "../components/LoadingSpinner";

function Story() {
  const { userName } = useParams();
  const { storyData } = useSelector((state) => state.story);
  const dispatch = useDispatch();
  const handleStory = async () => {
    dispatch(setStoryData(null));
    try {
      const res = await axios.get(
        serverUrl + "/api/story/getByUserName/" + userName,
        { withCredentials: true }
      );
      dispatch(setStoryData(res?.data?.story || null));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userName) {
      handleStory();
    }
  }, [userName]);
  return (
    <div className="w-full h-[100vh] bg-[#181817] flex justify-center items-center">
      {storyData ? <StoryCard storyData={storyData} /> : <LoadingSpinner />}
    </div>
  );
}

export default Story;
