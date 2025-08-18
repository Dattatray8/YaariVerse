import { Heart, MessagesSquare } from "lucide-react";
import logo from "/public/icon.png";
import StorySection from "./StorySection";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import Post from "./Post";
import { useNavigate } from "react-router-dom";

function Feed() {
  const { postData } = useSelector((state) => state.post);
  const { userData } = useSelector((state) => state.user);
  const { storyList, currentUserStory } = useSelector((state) => state.story);
  const navigation = useNavigate();

  return (
    <div className="lg:w-[50%] w-full bg-[#181817] min-h-[100vh] lg:h-[100vh] relative lg:overflow-y-auto">
      <div className="flex justify-between items-center px-4 py-2 lg:hidden">
        <div className="flex items-center">
          <img src={logo} alt="Yaari verse logo" className="w-14" />
          <p className="text-white text-xl font-semibold">Yaariverse</p>
        </div>
        <div className="flex gap-4 justify-center items-center">
          <Heart className="text-white cursor-pointer" />
          <MessagesSquare
            className="text-white cursor-pointer"
            onClick={() => navigation("/messages")}
          />
        </div>
      </div>
      <div className="flex w-full justify-start overflow-x-auto gap-4 items-center lg:p-4 px-4 py-2">
        <StorySection
          userName={"You"}
          profileImage={userData?.profileImage}
          story={currentUserStory}
        />
        {storyList?.map((story, index) => (
          <StorySection
            userName={story?.author?.userName || "unknown"}
            profileImage={story?.author?.profileImage}
            story={story}
            key={index}
          />
        ))}
      </div>
      <div className="w-full min-h-[100vh] flex flex-col items-center gap-2 bg-gray-400 mb-16">
        {postData.map((post, index) => (
          <Post post={post} key={index} />
        ))}
      </div>
      <Navbar />
    </div>
  );
}

export default Feed;
