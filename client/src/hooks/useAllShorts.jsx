import axios from "axios";
import { serverUrl } from "../App";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setShortData } from "../redux/shortVerseSlice";

function useAllShorts() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchShorts = async () => {
      try {
        await axios
          .get(serverUrl + "/api/short/getAll", {
            withCredentials: true,
          })
          .then((e) => {
            dispatch(setShortData(e?.data?.shorts));
          });
      } catch (error) {
        console.log(error);
      }
    };
    fetchShorts();
  }, [dispatch, userData]);
}

export default useAllShorts;
