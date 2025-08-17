import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { setStoryList } from "../redux/storySlice";

function useAllStories() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { storyData } = useSelector((state) => state.story);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axios.get(serverUrl + "/api/story/getAll", {
          withCredentials: true,
        });
        dispatch(setStoryList(res?.data?.stories));
      } catch (error) {
        console.log(error);
      }
    };
    fetchStories();
  }, [dispatch, userData, storyData]);
}

export default useAllStories;
