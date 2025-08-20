import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { ThreeDots } from "react-loader-spinner";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function SignUp() {
  const [inputClicked, setInputClicked] = useState({
    name: false,
    userName: false,
    email: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigate();
  const [formValue, setFormValue] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios
        .post(serverUrl + "/api/auth/signup", formValue, {
          withCredentials: true,
        })
        .then((e) => {
          console.log(e);
          setLoading(false);
          dispatch(setUserData(e?.data?.user));
          navigation("/");
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
    <div className="flex justify-center items-center w-screen h-screen bg-gradient-to-br from-[#0a0a0a] to-[#181817]">
      <div className="w-[20em] h-[32em] bg-[#ededec] rounded-2xl drop-shadow-lg drop-shadow-white flex flex-col justify-center">
        <div className="flex justify-center items-center">
          <p className="text-2xl font-semibold text-[#22292e]">SignUp to</p>
          <img src={logo} alt="Yaari verse logo" className="h-12 w-fit mt-1" />
        </div>
        <div className="flex justify-center items-center flex-col mt-6 gap-8">
          <div
            className="relative flex items-center justify-start w-[90%] h-12 rounded-2xl border-2 border-[#181817]"
            onClick={() => setInputClicked({ ...inputClicked, name: true })}
          >
            <label
              htmlFor="name"
              className={`text-[#181817] px-1 absolute left-5 bg-[#ededec] text-[15px] ${
                inputClicked.name ? "top-[-15px]" : ""
              }`}
            >
              Enter Your Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full h-full rounded-2xl px-5 outline-none border-none"
              required
              value={formValue.name}
              onChange={(e) =>
                setFormValue({ ...formValue, name: e.target.value })
              }
            />
          </div>
          <div
            className="relative flex items-center justify-start w-[90%] h-12 rounded-2xl border-2 border-[#181817]"
            onClick={() => setInputClicked({ ...inputClicked, userName: true })}
          >
            <label
              htmlFor="username"
              className={`text-[#181817] px-1 absolute left-5 bg-[#ededec] text-[15px] ${
                inputClicked.userName ? "top-[-15px]" : ""
              }`}
            >
              Enter Your Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full h-full rounded-2xl px-5 outline-none border-none"
              required
              value={formValue.userName}
              onChange={(e) =>
                setFormValue({ ...formValue, userName: e.target.value })
              }
            />
          </div>
          <div
            className="relative flex items-center justify-start w-[90%] h-12 rounded-2xl border-2 border-[#181817]"
            onClick={() => setInputClicked({ ...inputClicked, email: true })}
          >
            <label
              htmlFor="email"
              className={`text-[#181817] px-1 absolute left-5 bg-[#ededec] text-[15px] ${
                inputClicked.email ? "top-[-15px]" : ""
              }`}
            >
              Enter Your Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full h-full rounded-2xl px-5 outline-none border-none"
              required
              value={formValue.email}
              onChange={(e) =>
                setFormValue({ ...formValue, email: e.target.value })
              }
            />
          </div>
          <div
            className="relative flex items-center justify-start w-[90%] h-12 rounded-2xl border-2 border-[#181817]"
            onClick={() => setInputClicked({ ...inputClicked, password: true })}
          >
            <label
              htmlFor="password"
              className={`text-[#181817] px-1 absolute left-5 bg-[#ededec] text-[15px] ${
                inputClicked.password ? "top-[-15px]" : ""
              }`}
            >
              Enter Your Password
            </label>
            <input
              type={`${showPassword ? "text" : "password"}`}
              id="password"
              className="w-full h-full rounded-2xl px-5 outline-none border-none"
              required
              value={formValue.password}
              onChange={(e) =>
                setFormValue({ ...formValue, password: e.target.value })
              }
            />
            {showPassword ? (
              <EyeOff
                className="absolute right-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            ) : (
              <Eye
                className="absolute right-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            )}
          </div>
          <div className="flex items-center flex-col gap-2">
            <button
              className="bg-[#181817] text-white py-2 px-16 rounded-full cursor-pointer hover:bg-[#181817cd] transition-all duration-300"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ThreeDots width={50} height={25} color="white" />
              ) : (
                "SignUp"
              )}
            </button>
            <p>
              Already Have an account ?{" "}
              <span
                onClick={() => navigation("/signin")}
                className="hover:underline text-blue-500 cursor-pointer"
              >
                Sign In
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
