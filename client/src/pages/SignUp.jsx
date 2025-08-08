import { useState } from "react";
import logo from "../assets/logo.png";
import { Eye, EyeOff } from "lucide-react";

function SignUp() {
  const [inputClicked, setInputClicked] = useState({
    name: false,
    userName: false,
    email: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex justify-center items-center w-screen h-screen bg-[#181817]">
      <div className="w-[20em] h-[30em] bg-[#ededec] rounded-2xl">
        <div className="flex justify-center items-center mt-4">
          <p className="text-2xl font-semibold text-[#22292e]">SignUp to</p>
          <img src={logo} alt="Yaari verse logo" className="h-12 w-fit mt-1" />
        </div>
        <div className="flex justify-center items-center flex-col mt-10 gap-8">
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
        </div>
      </div>
    </div>
  );
}

export default SignUp;
