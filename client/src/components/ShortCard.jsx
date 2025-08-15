import VideoPlayer from "./VideoPlayer";

function ShortCard({ short }) {
  return (
    <div className="w-full lg:w-[30rem] h-[100vh] flex justify-center items-center relative">
      <VideoPlayer media={short?.media} data={short}/>
    </div>
  );
}

export default ShortCard;
