import { useDispatch } from "react-redux";
import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { setFollowing, setLoading, setUserData } from "../redux/userSlice";

function useFetchUser() {
  const dispatch = useDispatch();
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
            dispatch(
              setFollowing(e.data.user.following.map((id) => id))
            );
          });
      } catch (error) {
        console.log(error);
        dispatch(setUserData(null));
      }
    };
    fetchUser();
  }, [dispatch]);
}

export default useFetchUser;
