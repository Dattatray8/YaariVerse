import axios from "axios";
import { serverUrl } from "../App";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNotificationData } from "../redux/userSlice";

function useAllNotifications() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        await axios
          .get(serverUrl + "/api/user/getallnotification", {
            withCredentials: true,
          })
          .then((e) => {
            console.log(e?.data);
            dispatch(setNotificationData(e?.data));
          });
      } catch (error) {
        console.log(error);
      }
    };
    fetchNotifications();
  }, [dispatch, userData]);
}

export default useAllNotifications;
