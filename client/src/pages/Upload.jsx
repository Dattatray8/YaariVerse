import { ArrowLeft, SquarePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { ThreeDots } from "react-loader-spinner";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setPostData } from "../redux/postSlice";
import { setShortData } from "../redux/shortVerseSlice";
import { setCurrentUserStory } from "../redux/storySlice";

function Upload() {
  const navigation = useNavigate();
  const [uploadType, setUploadType] = useState("Post");
  const [frontendMedia, setFrontendMedia] = useState(null);
  const [backendMedia, setBackendMedia] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const mediaInput = useRef();
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const dispatch = useDispatch();
  const { postData } = useSelector((state) => state.post);
  const { shortData } = useSelector((state) => state.short);

  const handlemedia = (e) => {
    const file = e.target.files[0];
    if (file.type.includes("image")) {
      setMediaType("image");
    } else {
      setMediaType("video");
    }
    setBackendMedia(file);
    setFrontendMedia(URL.createObjectURL(file));
  };

  const uploadPost = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("mediaType", mediaType);
      formData.append("media", backendMedia);
      await axios
        .post(serverUrl + "/api/post/upload", formData, {
          withCredentials: true,
        })
        .then((e) => {
          setLoading(false);
          console.log(e);
          setResponse(e?.data?.message);
          let post = e?.data?.populatedPost;
          dispatch(setPostData({ ...postData, post }));
          setFrontendMedia(null);
          setCaption(null);
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const uploadShort = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("media", backendMedia);
      await axios
        .post(serverUrl + "/api/short/upload", formData, {
          withCredentials: true,
        })
        .then((e) => {
          setLoading(false);
          console.log(e);
          setResponse(e?.data?.message);
          let short = e?.data?.populatedShort;
          dispatch(setShortData({ ...shortData, short }));
          setFrontendMedia(null);
          setCaption(null);
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const uploadStory = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("mediaType", mediaType);
      formData.append("media", backendMedia);
      await axios
        .post(serverUrl + "/api/story/upload", formData, {
          withCredentials: true,
        })
        .then((e) => {
          setLoading(false);
          setResponse(e?.data?.message);
          dispatch(setCurrentUserStory(e?.data?.populatedStory));
          setFrontendMedia(null);
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleUpload = () => {
    if (uploadType === "Post") {
      uploadPost();
    } else if (uploadType === "Story") {
      uploadStory();
    } else if (uploadType === "Short") {
      uploadShort();
    }
  };

  useEffect(() => {
    if (response) {
      toast.success(response);
    }
  }, [response]);

  return (
    <div className="bg-[#181817] w-full min-h-[100vh] flex flex-col items-center md:gap-10 gap-5">
      <div className="w-full py-4 px-6 md:px-8 flex items-center gap-8 sm:h-20 h-16">
        <ArrowLeft
          className="text-white h-full cursor-pointer"
          onClick={() => navigation(-1)}
        />
        <p className="text-white font-semibold">Upload Media</p>
      </div>
      <div className="bg-white flex justify-around items-center w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] h-14 md:h-16 rounded-full">
        <div
          className={`font-semibold md:text-xl text-lg cursor-pointer px-4 py-1 sm:px-6 sm:py-2 md:py-2.5 md:px-8 lg:px-10 xl:px-12 hover:bg-black hover:text-white transition-all duration-300 rounded-full ${
            uploadType === "Post" ? "bg-black text-white" : ""
          }`}
          onClick={() => setUploadType("Post")}
        >
          Post
        </div>
        <div
          className={`font-semibold md:text-xl text-lg cursor-pointer px-4 py-1 sm:px-6 sm:py-2 md:py-2.5 md:px-8 lg:px-10 xl:px-12 hover:bg-black hover:text-white transition-all duration-300 rounded-full ${
            uploadType === "Story" ? "bg-black text-white" : ""
          }`}
          onClick={() => setUploadType("Story")}
        >
          Story
        </div>
        <div
          className={`font-semibold md:text-xl text-lg cursor-pointer px-4 py-1 sm:px-6 sm:py-2 md:py-2.5 md:px-8 lg:px-10 xl:px-12 hover:bg-black hover:text-white transition-all duration-300 rounded-full ${
            uploadType === "Short" ? "bg-black text-white" : ""
          }`}
          onClick={() => setUploadType("Short")}
        >
          Short
        </div>
      </div>
      {frontendMedia ? (
        <div className="w-[90%] sm:w-[60%] md:w-[50%] lg:w-[40%] xl:w-[30%] bg-[#252523] hover:bg-[#31312f]  mt-4 flex justify-center items-center rounded-2xl cursor-pointer flex-col">
          {mediaType === "image" ? (
            <div className="w-full h-full">
              <img
                src={frontendMedia}
                className="object-cover h-60 sm:h-70 md:h-80 lg:h-90 w-full rounded-2xl"
              />
            </div>
          ) : (
            <div className="w-full h-full">
              <video
                src={frontendMedia}
                controls
                className="object-contain h-full w-full rounded-2xl"
              ></video>
            </div>
          )}
        </div>
      ) : (
        <div
          className="w-[70%] sm:w-[60%] md:w-[50%] lg:w-[40%] xl:w-[30%] bg-[#252523] hover:bg-[#31312f] h-50 md:h-80 sm:h-65 flex justify-center items-center font-semibold text-2xl text-white rounded-2xl cursor-pointer flex-col"
          onClick={() => mediaInput.current.click()}
        >
          <input
            type="file"
            hidden
            className="w-full h-full"
            ref={mediaInput}
            onChange={handlemedia}
          />
          <SquarePlus />
          <p>Upload {uploadType}</p>
        </div>
      )}
      {frontendMedia && (
        <>
          {(uploadType === "Post" || uploadType === "Short") && (
            <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%]">
              <input
                type="text"
                placeholder={`Enter ${uploadType} Caption`}
                className="text-white px-8 py-2 border border-[#ededec] rounded-md w-full"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>
          )}
          <button
            className="bg-white px-10 py-2 rounded-full cursor-pointer hover:bg-[#ffffffdd] transition-all duration-300"
            onClick={handleUpload}
          >
            {loading ? (
              <ThreeDots width={50} height={25} color="black" />
            ) : (
              <p>Upload {uploadType}</p>
            )}
          </button>
        </>
      )}
    </div>
  );
}

export default Upload;
