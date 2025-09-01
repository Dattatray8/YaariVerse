import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setFollowing, toggleFollow } from "../redux/userSlice";
import { toggleFollowUser } from "../utils/followService";
import axios from "axios";
import { serverUrl } from "../App";
import userImg from "../assets/user.png";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [typeHeadUsers, setTypeHeadUsers] = useState([]);
  const { suggestedUsers } = useSelector((state) => state.user);
  const [showTypeHead, setShowTypeHead] = useState(true);

  const { following, userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigation = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        setError("");
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setShowTypeHead(false);
      searchUsers(searchTerm);
    }
    if (e.key === "Backspace") {
      setShowTypeHead(false);
      if (searchTerm === "") {
        setShowTypeHead(true);
      }
    }
  };

  const typeHead = (value) => {
    if (value && showTypeHead) {
      let searchedUsers = suggestedUsers.filter((user) =>
        (user?.name || user?.userName)
          .toLowerCase()
          .includes(value.toLowerCase())
      );
      setTypeHeadUsers(searchedUsers);
    }
  };

  const searchUsers = async (keyword) => {
    if (!keyword.trim()) return;

    setLoading(true);
    setError("");
    setShowTypeHead(false);

    try {
      const res = await axios.get(
        `${serverUrl}/api/user/search?keyword=${keyword}`,
        { withCredentials: true }
      );
      setSearchResults(res?.data?.users);
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to search users. Please try again.");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      const result = await toggleFollowUser(userId);
      dispatch(toggleFollow(userId));
      dispatch(setFollowing(result.following));
    } catch (error) {
      console.log(error);
    }
  };

  const UserCard = ({ user }) => {
    const isFollowing = following.includes(user?._id);

    return (
      <div className="bg-gradient-to-r from-gray-800/30 to-gray-700/20 backdrop-blur-sm border border-gray-700/50 rounded-xl p-3 sm:p-4 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
        <div className="flex items-start sm:items-center justify-between gap-3">
          <div
            className="flex items-start sm:items-center gap-3 flex-1 cursor-pointer min-w-0"
            onClick={() => navigation(`/profile/${user.userName}`)}
          >
            <div className="relative flex-shrink-0">
              <img
                src={user.profileImage || userImg}
                alt="User Avatar"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-gray-600 hover:border-blue-500 transition-colors duration-300"
              />
            </div>

            <div className="flex-1 min-w-0 pt-1 sm:pt-0">
              <div className="block sm:flex sm:items-center sm:gap-2">
                <h3 className="text-white font-semibold text-base sm:text-lg truncate">
                  {user.userName}
                </h3>
                <div className="hidden sm:block w-1 h-1 bg-gray-500 rounded-full"></div>
                <span className="text-blue-400 text-sm hidden sm:inline">
                  @{user.userName}
                </span>
              </div>
              <p className="text-gray-400 text-sm truncate mt-0.5 sm:mt-0">
                {user.name}
              </p>
              <div className="flex items-center gap-3 sm:gap-4 mt-2 text-xs text-gray-500 max-[425px]:hidden">
                <span>{user.followers?.length || 0} followers</span>
                <span>{user.following?.length || 0} following</span>
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFollow(user._id);
            }}
            className={`px-4 py-2 sm:px-6 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 flex-shrink-0 ${
              isFollowing
                ? "bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 hover:scale-105"
                : "bg-blue-500/20 text-blue-400 border border-blue-500/50 hover:bg-blue-500/30 hover:scale-105"
            }`}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-[#0a0a0a] to-[#181817] w-full min-h-[100vh] flex flex-col overflow-x-hidden">
      <div className="w-full p-4 flex items-center min-h-16 sm:h-20 border-b border-gray-800/50">
        <ArrowLeft
          className="text-white h-5 w-5 sm:h-6 sm:w-6 cursor-pointer hover:text-blue-400 transition-colors flex-shrink-0"
          onClick={() => navigation(-1)}
        />
        <div className="flex-1 text-center px-4">
          <h1 className="text-white font-semibold text-lg sm:text-xl">
            Discover People
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm hidden sm:block">
            Find and connect with others
          </p>
        </div>
        <div className="w-5 h-5 sm:w-6 sm:h-6"></div>
      </div>

      <div
        className={`px-4 sm:px-6 pt-4 sm:pt-6${
          showTypeHead ? "pb-1" : " pb-4  sm:pb-6"
        }`}
      >
        <div className="relative max-w-2xl mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={() => {
              searchUsers(searchTerm);
            }}
          >
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
          </svg>
          <input
            type="text"
            placeholder="Search by username or name..."
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value;
              setSearchTerm(value);
              setShowTypeHead(true);
              typeHead(value);
            }}
            onKeyDown={handleKeyPress}
            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-300 text-base sm:text-lg"
          />
          {loading && (
            <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-blue-400"></div>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 sm:px-6 flex-1 pb-6 flex justify-center overflow-x-hidden">
        {error && (
          <div className="text-center py-8 sm:py-12">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 sm:p-6 max-w-sm sm:max-w-md mx-auto">
              <p className="text-red-400 font-medium text-sm sm:text-base">
                ⚠️ {error}
              </p>
            </div>
          </div>
        )}

        {!loading &&
          !error &&
          searchTerm &&
          searchResults.length === 0 &&
          typeHeadUsers.length === 0 &&
          !showTypeHead && (
            <div className="text-center py-8 sm:py-12">
              <div className="bg-gray-800/30 rounded-xl p-6 sm:p-8 max-w-sm sm:max-w-md mx-auto">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🔍</div>
                <p className="text-gray-300 font-medium mb-2 text-base sm:text-lg">
                  No users found
                </p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Try searching with different keywords for "{searchTerm}"
                </p>
              </div>
            </div>
          )}

        {typeHeadUsers.length > 0 && searchTerm && showTypeHead && (
          <div className="w-full max-w-2xl h-fit bg-gray-900/95 border border-gray-700/50 rounded-xl shadow-lg overflow-hidden z-20">
            <ul className="divide-y divide-gray-700/40">
              {typeHeadUsers.map((user) => (
                <li
                  key={user._id}
                  className="flex items-center gap-3 p-3 hover:bg-gray-800/70 transition-colors cursor-pointer"
                  onClick={() => {
                    setSearchTerm(user.userName);
                    setShowTypeHead(false);
                    setTypeHeadUsers([]);
                    searchUsers(user.userName);
                  }}
                >
                  <img
                    src={user.profileImage || userImg}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover border border-gray-600"
                  />
                  <div className="flex flex-col">
                    <span className="text-white font-medium text-sm">
                      {user.userName}
                    </span>
                    <span className="text-gray-400 text-xs">{user.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {typeHeadUsers.length === 0 && searchTerm && showTypeHead && (
          <div className="w-full max-w-2xl h-fit bg-gray-900/95 border border-gray-700/50 rounded-xl shadow-lg overflow-hidden z-20">
            <ul className="divide-y divide-gray-700/40">
              <li className="flex items-center gap-3 p-3 hover:bg-gray-800/70 transition-colors cursor-pointer text-white justify-center">
                No users found
              </li>
            </ul>
          </div>
        )}

        {!loading && searchResults.length > 0 && !showTypeHead && (
          <div className="max-w-2xl mx-auto w-full">
            <div className="mb-4 sm:mb-6 text-center">
              <p className="text-gray-400 text-sm sm:text-base">
                Found{" "}
                <span className="text-blue-400 font-semibold">
                  {searchResults.length}
                </span>{" "}
                user{searchResults.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {searchResults?.map(
                (user) =>
                  user?._id != userData?._id && (
                    <UserCard key={user?._id} user={user} />
                  )
              )}
            </div>
          </div>
        )}

        {!searchTerm && (
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="max-w-sm sm:max-w-md mx-auto">
              <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">👥</div>
              <h2 className="text-gray-300 font-semibold text-lg sm:text-xl mb-3 sm:mb-4">
                Start Your Search
              </h2>
              <p className="text-gray-500 leading-relaxed text-sm sm:text-base">
                Type in the search box above to find people by their username or
                display name. Connect with friends and discover new profiles!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
