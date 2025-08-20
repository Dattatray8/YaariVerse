import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [inputClicked, setInputClicked] = useState({
    email: false,
    otp: false,
    newPassword: false,
    confirmNewPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();
  const [errorMessage, setErrorMessage] = useState(false);
  const handleStep1 = async () => {
    try {
      setLoading(true);
      console.log(email);
      await axios
        .post(
          serverUrl + "/api/auth/sendotp",
          { email },
          { withCredentials: true }
        )
        .then((e) => {
          console.log(e);
          setLoading(false);
          setStep(2);
        });
    } catch (error) {
      setLoading(false);
      setErrorMessage(error?.response?.data?.message);
      console.log(error);
    }
  };

  const handleStep2 = async () => {
    try {
      setLoading(true);
      await axios
        .post(
          serverUrl + "/api/auth/verifyotp",
          { email, otp },
          { withCredentials: true }
        )
        .then((e) => {
          setLoading(false);
          console.log(e);
          setStep(3);
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleStep3 = async () => {
    try {
      setLoading(true);
      if (newPassword !== confirmNewPassword) {
        console.log("Password not match");
        return;
      }
      await axios
        .post(
          serverUrl + "/api/auth/resetpassword",
          { email, password: newPassword },
          { withCredentials: true }
        )
        .then((e) => {
          setLoading(false);
          console.log(e);
          navigation("/signin");
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, []);
  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gradient-to-br from-[#0a0a0a] to-[#181817]">
      <div className="w-[20em] h-[24em] bg-[#ededec] rounded-2xl drop-shadow-lg drop-shadow-white flex flex-col justify-center">
        {step == 1 && (
          <div className="flex flex-col gap-6 justify-center items-center">
            <div className="flex justify-center items-center">
              <p className="text-2xl font-semibold text-[#22292e]">
                Forgot Password
              </p>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex items-center flex-col gap-2 mt-1">
              <button
                className="bg-[#181817] text-white py-2 px-16 rounded-full cursor-pointer hover:bg-[#181817cd] transition-all duration-300"
                onClick={handleStep1}
                disabled={loading}
              >
                {loading ? (
                  <ThreeDots width={50} height={25} color="white" />
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          </div>
        )}
        {step == 2 && (
          <div className="flex flex-col gap-6 justify-center items-center">
            <div className="flex justify-center items-center">
              <p className="text-2xl font-semibold text-[#22292e]">
                Forgot Password
              </p>
            </div>
            <div
              className="relative flex items-center justify-start w-[90%] h-12 rounded-2xl border-2 border-[#181817]"
              onClick={() => setInputClicked({ ...inputClicked, otp: true })}
            >
              <label
                htmlFor="otp"
                className={`text-[#181817] px-1 absolute left-5 bg-[#ededec] text-[15px] ${
                  inputClicked.otp ? "top-[-15px]" : ""
                }`}
              >
                Enter Your OTP
              </label>
              <input
                type="otp"
                id="otp"
                className="w-full h-full rounded-2xl px-5 outline-none border-none"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <div className="flex items-center flex-col gap-2 mt-1">
              <button
                className="bg-[#181817] text-white py-2 px-16 rounded-full cursor-pointer hover:bg-[#181817cd] transition-all duration-300"
                onClick={handleStep2}
                disabled={loading}
              >
                {loading ? (
                  <ThreeDots width={50} height={25} color="white" />
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        )}
        {step == 3 && (
          <div className="flex flex-col gap-6 justify-center items-center">
            <div className="flex justify-center items-center">
              <p className="text-2xl font-semibold text-[#22292e]">
                Reset Password
              </p>
            </div>
            <div
              className="relative flex items-center justify-start w-[90%] h-12 rounded-2xl border-2 border-[#181817]"
              onClick={() =>
                setInputClicked({ ...inputClicked, newPassword: true })
              }
            >
              <label
                htmlFor="newPassword"
                className={`text-[#181817] px-1 absolute left-5 bg-[#ededec] text-[15px] ${
                  inputClicked.newPassword ? "top-[-15px]" : ""
                }`}
              >
                Enter Your New Password
              </label>
              <input
                type="newPassword"
                id="newPassword"
                className="w-full h-full rounded-2xl px-5 outline-none border-none"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div
              className="relative flex items-center justify-start w-[90%] h-12 rounded-2xl border-2 border-[#181817]"
              onClick={() =>
                setInputClicked({ ...inputClicked, confirmNewPassword: true })
              }
            >
              <label
                htmlFor="confirmNewPassword"
                className={`text-[#181817] px-1 absolute left-5 bg-[#ededec] text-[15px] ${
                  inputClicked.confirmNewPassword ? "top-[-15px]" : ""
                }`}
              >
                Confirm Your Password
              </label>
              <input
                type="confirmNewPassword"
                id="confirmNewPassword"
                className="w-full h-full rounded-2xl px-5 outline-none border-none"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center flex-col gap-2 mt-1">
              <button
                className="bg-[#181817] text-white py-2 px-16 rounded-full cursor-pointer hover:bg-[#181817cd] transition-all duration-300"
                onClick={handleStep3}
                disabled={loading}
              >
                {loading ? (
                  <ThreeDots width={50} height={25} color="white" />
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
