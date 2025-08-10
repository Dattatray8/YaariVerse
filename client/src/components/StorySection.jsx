import user from "../assets/user.png";

function StorySection({userName}) {
  return (
    <div className="flex flex-col w-18 lg:w-20 gap-2 lg:gap-0">
      <div className="h-13 lg:h-20 lg:w-20 w-16 flex justify-center items-center rounded-full">
        <div className="w-full cursor-pointer">
          <img
            src={user}
            alt="User Image"
            className="object-cover w-14 rounded-full border-3 border-blue-400"
          />
        </div>
      </div>
        <div className="text-center text-white truncate w-full">{userName}</div>
    </div>
  );
}

export default StorySection;
