import { ArrowLeft } from "lucide-react";
import user from "../assets/user.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { setProfileData, setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";

function EditProfile() {
  const navigation = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const imageInput = useRef();
  const [frontendImage, setFrontendImage] = useState(
    userData?.profileImage || user
  );
  const [backendImage, setBackendImage] = useState(null);
  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const [data, setData] = useState({
    name: "",
    userName: "",
    bio: "",
    profession: "",
  });

  useEffect(() => {
    if (userData) {
      setData({
        name: userData.name || "",
        userName: userData.userName || "",
        bio: userData.bio || "",
        profession: userData.profession || "",
      });
      setFrontendImage(userData.profileImage || user);
    }
  }, [userData]);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const handleEditProfile = async () => {
    try {
      setLoading(true);
      setErrorMessage(false);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("userName", data.userName);
      formData.append("bio", data.bio);
      formData.append("profession", data.profession);
      if (backendImage) {
        formData.append("profileImage", backendImage);
      } else {
        formData.append("profileImage", userData.profileImage);
      }
      await axios
        .post(serverUrl + "/api/user/editProfile", formData, {
          withCredentials: true,
        })
        .then((e) => {
          setLoading(false);
          dispatch(setUserData(e?.data?.user));
          dispatch(setProfileData(e?.data?.user));
          navigation(`/profile/${e?.data?.user.userName}`);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
      setErrorMessage(error?.response?.data?.message);
    }
  };
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]);
  return (
    <div className="bg-[#181817] w-full min-h-[100vh] flex flex-col md:gap-8 gap-4">
      <div className="w-full py-4 px-6 md:px-8 flex items-center gap-8 sm:h-20 h-16">
        <ArrowLeft
          className="text-white h-full cursor-pointer"
          onClick={() => navigation(-1)}
        />
        <p className="text-white font-semibold">Edit Profile</p>
      </div>
      <div className="w-full flex flex-col items-center gap-6">
        <div
          className="w-18 h-18 cursor-pointer"
          onClick={() => imageInput?.current.click()}
        >
          <input
            type="file"
            accept="image/*"
            ref={imageInput}
            hidden
            onChange={handleImage}
          />
          <img
            src={frontendImage}
            alt="User Image"
            className="object-conver0 w-full h-full rounded-full"
          />
        </div>
        <div className="flex flex-col gap-4 w-full items-center">
          <input
            type="text"
            placeholder="Enter Your Name"
            className="text-white py-2 px-4 border border-white rounded-md w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%]"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Enter Your UserName"
            className="text-white py-2 px-4 border border-white rounded-md w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%]"
            value={data.userName}
            onChange={(e) => setData({ ...data, userName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Enter Your Bio"
            className="text-white py-2 px-4 border border-white rounded-md w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%]"
            value={data.bio}
            onChange={(e) => setData({ ...data, bio: e.target.value })}
          />
          <input
            type="text"
            placeholder="Enter Your Profession"
            className="text-white py-2 px-4 border border-white rounded-md w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%]"
            value={data.profession}
            onChange={(e) => setData({ ...data, profession: e.target.value })}
          />
        </div>
        <div className="w-full flex justify-center">
          <button
            className="bg-white flex justify-center font-semibold py-2 w-1/2 text-center rounded-md cursor-pointer hover:bg-[#ffffffdd] transition-all duration-700"
            onClick={handleEditProfile}
          >
            {loading ? (
              <ThreeDots width={50} height={25} color="black" />
            ) : (
              "Save Profile"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
