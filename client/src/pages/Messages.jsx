import { ArrowLeft, MessageCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import { useSelector } from "react-redux";
import { useState } from "react";
import usercopy from "../assets/usercopy.png";

function Messages() {
  const navigation = useNavigate();
  const { onlineUsers } = useSocket();
  const { userData } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");

  const onlineFollowing =
    userData?.following?.filter((user) => onlineUsers?.includes(user?._id)) ||
    [];

  const allFollowing =
    userData?.following?.filter((user) =>
      user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleChatClick = (userName) => {
    navigation(`/chat/${userName}`);
  };

  return (
    <div className="w-full min-h-[100vh] flex flex-col bg-gradient-to-br from-[#0a0a0a] to-[#181817]">
      <div className="w-full h-20 flex items-center justify-between px-6 border-b border-gray-800 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <ArrowLeft
            className="text-white cursor-pointer lg:hidden hover:text-blue-400 transition-colors duration-200"
            onClick={() => navigation("/")}
            size={24}
          />
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <MessageCircle className="text-white" size={20} />
            </div>
            <h1 className="text-white font-bold text-2xl bg-gradient-to-r from-white to-gray-300 bg-clip-text">
              Messages
            </h1>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-300"
          />
        </div>
      </div>

      {onlineFollowing.length > 0 && (
        <div className="px-6 mb-6">
          <h2 className="text-green-400 font-semibold text-sm mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            ONLINE NOW ({onlineFollowing.length})
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {onlineFollowing.map((user, index) => (
              <div
                key={index}
                onClick={() => handleChatClick(user?.userName)}
                className="flex-shrink-0 cursor-pointer group"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={user?.profileImage || usercopy}
                      alt={user?.name}
                      className="w-full h-full rounded-2xl object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=ffffff&size=64&rounded=true`;
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-black rounded-full"></div>
                </div>
                <p className="text-white text-xs text-center max-w-[64px] truncate">
                  {user?.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 px-6">
        <h2 className="text-gray-400 font-semibold text-sm mb-4">
          ALL CONVERSATIONS
        </h2>
        <div className="space-y-2">
          {allFollowing.length > 0 ? (
            [...allFollowing]
              .sort((a, b) => {
                const aOnline = onlineUsers?.includes(a?._id);
                const bOnline = onlineUsers?.includes(b?._id);
                return bOnline - aOnline; // online first
              })
              .map((user, index) => {
                const isOnline = onlineUsers?.includes(user?._id);
                return (
                  <div
                    key={index}
                    onClick={() => handleChatClick(user?.userName)}
                    className="group flex items-center gap-4 p-4 hover:bg-gray-800/50 rounded-2xl cursor-pointer transition-all duration-300 border border-transparent hover:border-gray-700"
                  >
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl overflow-hidden">
                        <img
                          src={user?.profileImage || usercopy}
                          alt={user?.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${user?.name}&background=4b5563&color=ffffff&size=56&rounded=true`;
                          }}
                        />
                      </div>
                      {isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-black rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                          {user?.name}
                        </h3>
                      </div>
                      <p className="text-gray-400 text-sm truncate mt-1">
                        {isOnline ? "Active now" : "Click to start chatting..."}
                      </p>
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="text-gray-600" size={32} />
              </div>
              <h3 className="text-white font-semibold mb-2">
                No conversations yet
              </h3>
              <p className="text-gray-500 text-sm">
                Start following people to begin chatting
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="h-20 lg:hidden"></div>
    </div>
  );
}

export default Messages;
