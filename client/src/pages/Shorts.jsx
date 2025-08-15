import { ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ShortCard from "../components/ShortCard";

function Shorts() {
  const navigation = useNavigate();
  const { shortData } = useSelector((state) => state.short);
  return (
    <div className="w-screen h-screen bg-black overflow-hidden flex justify-center items-center">
      <div className="w-full py-4 px-6 md:px-8 flex items-center  gap-4 h-20 fixed top-0 z-10">
        <ArrowLeft
          className="text-white h-full cursor-pointer"
          onClick={() => navigation(-1)}
        />
        <p className="text-white font-semibold">Shorts</p>
      </div>
      <div className="h-[100vh] overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
        {shortData.map((short, index) => (
          <div className="h-screen snap-start" key={index}>
            <ShortCard short={short} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shorts;
