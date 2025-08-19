import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function ReceiverMessage({ message }) {
  const sender = useRef();
  const imageRef = useRef();
  const zoomImage = useRef();
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    sender.current.scrollIntoView({ behavior: "smooth" });
    if (zoomImage.current) {
      zoomImage.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message?.message, message?.image, showImage]);

  const handleImage = () => {
    if (imageRef.current) {
      setShowImage(true);
    }
  };

  return (
    <div className="flex justify-start mb-1 relative" ref={sender}>
      <div className="max-w-xs lg:max-w-md">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-2xl rounded-bl-md shadow-lg">
          {message?.image && (
            <img
              src={message?.image}
              alt="user received image"
              className="h-30 w-30 cursor-pointer"
              ref={imageRef}
              onClick={handleImage}
            />
          )}
          {message?.message && (
            <p className="text-sm leading-relaxed break-words">
              {message?.message || "No message content"}
            </p>
          )}
        </div>

        <div className="flex justify-start mt-1">
          <span className="text-xs text-gray-400">
            {message?.createdAt
              ? new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Now"}
          </span>
        </div>

        {showImage && (
          <div className="w-[90vw] h-[80vh] z-[100] absolute inset-0 bg-[#181817ca] flex justify-center">
            <img
              src={message?.image}
              alt="selected image"
              className="w-fit h-full object-contain"
              ref={zoomImage}
            />
            <X
              className="text-white absolute right-0 top-0 cursor-pointer"
              onClick={() => setShowImage(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ReceiverMessage;
