import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { setLoading, setSuggestedUsers } from "../redux/userSlice";

function useSuggestedUsers() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        dispatch(setLoading(true));
        await axios
          .get(serverUrl + "/api/user/suggestedusers", {
            withCredentials: true,
          })
          .then((e) => {
            console.log(e?.data);
            dispatch(setSuggestedUsers(e?.data || null));
          });
      } catch (error) {
        console.log(error);
        dispatch(setSuggestedUsers(null));
      } finally {
        dispatch(setLoading(false));
      }
    };
    if (userData) {
      fetchUser();
    }
  }, [dispatch, userData]);
}

export default useSuggestedUsers;
