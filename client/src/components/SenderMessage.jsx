function SenderMessage({ message }) {
  return (
    <div className="flex justify-end mb-1">
      <div className="max-w-xs lg:max-w-md">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-2xl rounded-br-md shadow-lg">
          <p className="text-sm leading-relaxed break-words">
            {message?.message || "No message content"}
          </p>
        </div>

        <div className="flex justify-end mt-1">
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

export default SenderMessage;
