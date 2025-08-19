import { ArrowLeft, ImagePlus, SendHorizonal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import user from "../assets/user.png";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { setMessages, setSelectedUser } from "../redux/chatSlice";
import SenderMessage from "../components/SenderMessage";
import ReceiverMessage from "../components/ReceiverMessage";

function Chatting() {
  const { selectedUser, messages } = useSelector((state) => state.chat);
  const { userData } = useSelector((state) => state.user);
  const [input, setInput] = useState("");
  const navigation = useNavigate();
  const imageInput = useRef();
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const dispatch = useDispatch();
  const { userName } = useParams();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  const handleProfile = async () => {
    try {
      await axios
        .get(serverUrl + "/api/user/profile/" + userName, {
          withCredentials: true,
        })
        .then((e) => {
          dispatch(setSelectedUser(e?.data?.user));
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser?._id}`,
        { message: input },
        { withCredentials: true }
      );
      console.log(result);
      dispatch(setMessages([...messages, result?.data?.newMessage]));
      setInput("");
    } catch (error) {
      console.log(error);
    }
  };

  const getAllMessages = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/message/getAll/${selectedUser?._id}`,
        { withCredentials: true }
      );
      console.log(result.data);
      dispatch(setMessages(result?.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllMessages();
  }, [selectedUser, dispatch]);

  useEffect(() => {
    handleProfile();
  }, [userName]);

  return (
    <div className="w-full h-[100vh] bg-[#181817] relative">
      <div className="flex gap-4 p-6 z-[100] top-0 w-full items-center fixed bg-[#181817]">
        <ArrowLeft
          className="text-white cursor-pointer"
          onClick={() => navigation(-1)}
        />
        <div className="flex gap-4 items-center">
          <img
            src={selectedUser?.profileImage || user}
            alt="User Image"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-white text-xl">{selectedUser?.userName}</p>
            <p className="text-gray-400 text-sm">{selectedUser?.name}</p>
          </div>
        </div>
      </div>

      <div className="w-full h-[90%] px-10 flex flex-col gap-2 overflow-auto pt-24 pb-28">
        {messages &&
          messages.map((message, index) =>
            message?.sender == userData?._id ? (
              <SenderMessage key={index} message={message} />
            ) : (
              <ReceiverMessage key={index} message={message} />
            )
          )}
      </div>

      <div
        className="w-full fixed bottom-2 flex justify-center items-center bg-[#181817] z-[100]"
        onSubmit={handleSendMessage}
      >
        <form className="w-[95%] max-w-[50rem] flex flex-col items-end gap-3">
          {frontendImage && (
            <div className="w-[100px] h-[100px] rounded-2xl border border-white overflow-hidden">
              <img
                src={frontendImage}
                alt="selected preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex bg-[#323232] rounded-full px-4 py-2 gap-3 w-full">
            <input
              type="file"
              accept="image/*"
              ref={imageInput}
              hidden
              onChange={handleImage}
            />

            <input
              type="text"
              className="flex-grow bg-transparent p-2 text-base text-white outline-none"
              placeholder="Send a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button type="button" onClick={() => imageInput.current.click()}>
              <ImagePlus className="text-white w-6 h-6 cursor-pointer" />
            </button>

            {(input || frontendImage) && (
              <button
                type="submit"
                className="flex items-center justify-center bg-[#4a4a4a] p-2 rounded-full hover:bg-[#5a5a5a] cursor-pointer"
              >
                <SendHorizonal className="text-white w-5 h-5" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chatting;
