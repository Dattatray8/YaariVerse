import axios from "axios";
import { ArrowLeft, Heart, MessageCircle, UserPlus, Share } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { setNotificationData } from "../redux/userSlice";
import { useEffect } from "react";

function Notifications() {
  const navigation = useNavigate();
  const { notificationData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart className="h-5 w-5 text-red-500" fill="currentColor" />;
      case "comment":
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case "follow":
        return <UserPlus className="h-5 w-5 text-green-500" />;
      default:
        return <Heart className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return notificationDate.toLocaleDateString();
  };

  const fetchNotifications = async () => {
    try {
      await axios
        .get(serverUrl + "/api/user/getallnotification", {
          withCredentials: true,
        })
        .then((e) => {
          dispatch(setNotificationData(e?.data));
        });
    } catch (error) {
      console.log(error);
    }
  };

  const ids = notificationData
    ?.filter((n) => n?.isRead === false)
    .map((n) => n?._id);

  const markAsRead = async () => {
    try {
      await axios.post(
        `${serverUrl}/api/user/markasread`,
        { notificationId: ids },
        {
          withCredentials: true,
        }
      );
      await fetchNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    markAsRead();
  }, [notificationData, navigation]);

  return (
    <div className="bg-gradient-to-br from-[#0a0a0a] to-[#181817] w-full min-h-[100vh] flex flex-col">
      <div className="w-full p-4 flex items-center min-h-16 sm:h-20 border-b border-gray-800/50">
        <ArrowLeft
          className="text-white h-5 w-5 sm:h-6 sm:w-6 cursor-pointer hover:text-blue-400 transition-colors flex-shrink-0"
          onClick={() => navigation(-1)}
        />
        <div className="flex-1 text-center px-4">
          <h1 className="text-white font-semibold text-lg sm:text-xl">
            Notifications
          </h1>
        </div>
      </div>

      <div className="flex-1 p-4">
        {notificationData && notificationData.length > 0 ? (
          <div className="space-y-3">
            {notificationData.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 rounded-lg border transition-all duration-200 hover:bg-gray-800/30 cursor-pointer ${
                  notification.isRead
                    ? "bg-gray-900/30 border-gray-800/30"
                    : "bg-gray-800/50 border-gray-700/50 shadow-lg"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-white text-sm">
                          <span className="font-semibold">
                            {notification.sender?.name || "Unknown User"}
                          </span>
                          <span className="text-gray-300 ml-1">
                            {notification.message}
                          </span>
                        </p>

                        {notification.post?.caption && (
                          <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                            "{notification.post.caption}"
                          </p>
                        )}

                        <p className="text-gray-500 text-xs mt-1">
                          {getTimeAgo(notification.createdAt)}
                        </p>
                      </div>

                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2 mt-2"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-800/50 flex items-center justify-center mb-4">
              <Heart className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-white text-lg font-medium mb-2">
              No notifications yet
            </h3>
            <p className="text-gray-400 text-sm text-center max-w-sm">
              When someone likes, comments, or follows you, you'll see it here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
