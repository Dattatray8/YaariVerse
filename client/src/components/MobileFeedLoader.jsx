const MobileFeedLoader = () => {
  return (
    <div className="min-h-screen bg-black text-white w-full mx-auto relative overflow-hidden lg:hidden">
      <div className="flex items-center justify-between p-4 bg-gray-900">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
          <div className="ml-2">
            <div className="h-4 bg-gray-600 rounded animate-pulse w-20"></div>
          </div>
        </div>
        <div className="flex space-x-3">
          <div className="w-6 h-6 bg-gray-700 rounded animate-pulse"></div>
          <div className="w-6 h-6 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="px-4 py-5 border-b border-gray-800">
        <div className="flex space-x-3 overflow-x-hidden">
          {/* Your Story */}
          <div className="flex flex-col items-center min-w-fit">
            <div className="w-16 h-16 bg-gray-700 rounded-full animate-pulse relative mb-1">
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-gray-600 rounded-full animate-pulse border-2 border-black"></div>
            </div>
            <div className="h-3 bg-gray-600 rounded animate-pulse w-8"></div>
          </div>

          {/* Other Stories */}
          {[1, 2, 3, 4, 5].map((story) => (
            <div key={story} className="flex flex-col items-center min-w-fit">
              <div className="w-16 h-16 bg-gray-700 rounded-full animate-pulse mb-1 ring-2 ring-gray-600"></div>
              <div className="h-3 bg-gray-600 rounded animate-pulse w-10"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-20 mt-2">
        {[1, 2, 3].map((post) => (
          <div
            key={post}
            className="bg-gray-900 rounded-lg mb-4 border border-gray-800"
          >
            <div className="flex items-center p-4">
              <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse"></div>
              <div className="ml-3 flex-1">
                <div className="h-4 bg-gray-600 rounded animate-pulse mb-1 w-24"></div>
                <div className="h-3 bg-gray-700 rounded animate-pulse w-16"></div>
              </div>
              <div className="w-6 h-6 bg-gray-700 rounded animate-pulse"></div>
            </div>

            <div className="px-4 pb-3">
              <div className="h-4 bg-gray-700 rounded animate-pulse mb-2 w-full"></div>
              <div className="h-4 bg-gray-700 rounded animate-pulse w-2/3"></div>
            </div>

            <div className="w-full h-48 bg-gray-700 animate-pulse"></div>

            <div className="flex items-center justify-between p-4">
              <div className="flex space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-6 h-6 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-700 rounded animate-pulse w-6"></div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-6 h-6 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-700 rounded animate-pulse w-6"></div>
                </div>
                <div className="w-6 h-6 bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div className="w-6 h-6 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gray-900 p-4">
        <div className="flex justify-around items-center">
          {[1, 2, 3, 4, 5].map((item, index) => (
            <div
              key={item}
              className={`w-8 h-8 rounded animate-pulse ${
                index === 4 ? "bg-gray-600" : "bg-gray-700"
              }`}
            ></div>
          ))}
        </div>

        <div className="flex justify-center mt-3">
          <div className="w-32 h-1 bg-gray-700 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default MobileFeedLoader;
