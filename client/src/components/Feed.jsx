import { Heart } from "lucide-react";
import logo from "/public/icon.png";
import StorySection from "./StorySection";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import Post from "./Post";

function Feed() {
  const { postData } = useSelector((state) => state.post);
  return (
    <div className="lg:w-[50%] w-full bg-[#181817] min-h-[100vh] lg:h-[100vh] relative lg:overflow-y-auto">
      <div className="flex justify-between items-center px-4 py-2 lg:hidden">
        <div className="flex items-center">
          <img src={logo} alt="Yaari verse logo" className="w-14" />
          <p className="text-white text-xl font-semibold">Yaariverse</p>
        </div>
        <Heart className="text-white" />
      </div>
      <div className="flex w-full justify-start overflow-x-auto gap-4 items-center lg:p-4 px-4 py-2">
        <StorySection userName={"hdiwuhduwidhiw8d"} />
        <StorySection userName={"hdiwuhduwidhiw8d"} />
        <StorySection userName={"hdiwuhduwidhiw8d"} />
        <StorySection userName={"hdiwuhduwidhiw8d"} />
        <StorySection userName={"hdiwuhduwidhiw8d"} />
        <StorySection userName={"hdiwuhduwidhiw8d"} />
        <StorySection userName={"hdiwuhduwidhiw8d"} />
        <StorySection userName={"hdiwuhduwidhiw8d"} />
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
