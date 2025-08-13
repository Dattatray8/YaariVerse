import axios from "axios";
import { serverUrl } from "../App";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPostData } from "../redux/postSlice";

function useAllPosts() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        await axios
          .get(serverUrl + "/api/post/getAll", {
            withCredentials: true,
          })
          .then((e) => {
            dispatch(setPostData(e?.data?.posts));
          });
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, [dispatch, userData]);
}

export default useAllPosts;
