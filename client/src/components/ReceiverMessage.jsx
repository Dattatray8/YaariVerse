function ReceiverMessage({ message }) {
  return (
    <div className="flex justify-start mb-1">
      <div className="max-w-xs lg:max-w-md">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-2xl rounded-bl-md shadow-lg">
          <p className="text-sm leading-relaxed break-words">
            {message?.message || "No message content"}
          </p>
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
      </div>
    </div>
  );
}

export default ReceiverMessage;
