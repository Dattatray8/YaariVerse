import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { useSelector } from "react-redux";
import { serverUrl } from "../App";
import { io } from "socket.io-client";

const SocketContext = createContext();

export default SocketContext;

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (userData) {
      const socketIo = io(serverUrl, {
        query: {
          userId: userData?._id,
        },
      });
      setSocket(socketIo);
      socketIo.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });
      return () => socketIo.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [userData?._id]);

  const value = {
    onlineUsers,
    socket,
  };
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
