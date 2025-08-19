import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { setFollowing } from "../redux/userSlice";

function useFollowingList() {
  const dispatch = useDispatch();
  const { storyData } = useSelector((state) => state.story);
  useEffect(() => {
    const fetchList = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/followinglist`, {
          withCredentials: true,
        });
        dispatch(setFollowing(result?.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchList();
  }, [storyData]);
}

export default useFollowingList;
