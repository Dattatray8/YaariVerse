import axios from "axios";
import { serverUrl } from "../App";

export const toggleFollowUser = async (userId) => {
  try {
    const result = await axios.get(
      `${serverUrl}/api/user/follow/${userId}`,
      { withCredentials: true }
    );
    return result.data; 
  } catch (error) {
    throw error;
  }
};
