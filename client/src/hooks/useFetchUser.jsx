import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { setLoading, setUserData } from "../redux/userSlice";
import { setCurrentUserStory } from "../redux/storySlice";

function useFetchUser() {
  const dispatch = useDispatch();
  const { storyData } = useSelector((state) => state.story);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        dispatch(setLoading(true));
        await axios
          .get(serverUrl + "/api/user/currentuser", {
            withCredentials: true,
          })
          .then((e) => {
            dispatch(setUserData(e?.data?.user || null));
            dispatch(setCurrentUserStory(e?.data?.user?.story || null));
          });
      } catch (error) {
        console.log(error);
        dispatch(setUserData(null));
      }
    };
    fetchUser();
  }, [dispatch, storyData]);
}

export default useFetchUser;
