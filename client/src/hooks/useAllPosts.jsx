import axios from "axios";
import { serverUrl } from "../App";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPostData } from "../redux/postSlice";

function useAllPosts() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        await axios
          .get(serverUrl + "/api/post/getAll", {
            withCredentials: true,
          })
          .then((e) => {
            console.log(e?.data?.posts);
            dispatch(setPostData(e?.data?.posts));
          });
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, [dispatch]);
}

export default useAllPosts;
