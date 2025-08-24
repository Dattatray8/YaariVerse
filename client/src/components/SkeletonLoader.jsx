const SkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white lg:flex hidden w-full">
      <div className="w-80 bg-gray-800 p-6 border-r border-gray-700">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gray-700 rounded-full animate-pulse"></div>
          <div className="ml-3">
            <div className="h-4 bg-gray-600 rounded animate-pulse mb-2 w-24"></div>
            <div className="h-3 bg-gray-700 rounded animate-pulse w-20"></div>
          </div>
        </div>

        <div className="mb-8">
          <div className="h-5 bg-gray-600 rounded animate-pulse mb-4 w-32"></div>
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between mb-4 p-2"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse"></div>
                <div className="ml-3">
                  <div className="h-3 bg-gray-600 rounded animate-pulse mb-1 w-20"></div>
                  <div className="h-2 bg-gray-700 rounded animate-pulse w-16"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-600 rounded animate-pulse w-16"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full animate-pulse"></div>
              <div className="ml-4">
                <div className="h-6 bg-gray-600 rounded animate-pulse mb-2 w-32"></div>
                <div className="h-4 bg-gray-700 rounded animate-pulse w-24"></div>
              </div>
            </div>
            <div className="h-8 bg-gray-600 rounded animate-pulse w-20"></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {[1, 2, 3].map((post) => (
              <div
                key={post}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="ml-3 flex-1">
                    <div className="h-4 bg-gray-600 rounded animate-pulse mb-1 w-32"></div>
                    <div className="h-3 bg-gray-700 rounded animate-pulse w-20"></div>
                  </div>
                  <div className="w-6 h-6 bg-gray-700 rounded animate-pulse"></div>
                </div>

                <div className="mb-4">
                  <div className="h-4 bg-gray-700 rounded animate-pulse mb-2 w-full"></div>
                  <div className="h-4 bg-gray-700 rounded animate-pulse mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2"></div>
                </div>

                <div className="w-full h-64 bg-gray-700 rounded-lg animate-pulse mb-4"></div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-700 rounded animate-pulse w-8"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-700 rounded animate-pulse w-8"></div>
                    </div>
                    <div className="w-6 h-6 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div className="w-6 h-6 bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-700">
          <div className="flex justify-center space-x-12">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="w-8 h-8 bg-gray-700 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-80 bg-gray-800 p-6 border-l border-gray-700">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse mr-3"></div>
          <div className="h-5 bg-gray-600 rounded animate-pulse w-24"></div>
        </div>

        <div className="mb-6">
          <div className="h-10 bg-gray-700 rounded-lg animate-pulse"></div>
        </div>

        <div className="h-4 bg-gray-600 rounded animate-pulse mb-4 w-36"></div>

        {[1, 2, 3].map((item) => (
          <div key={item} className="flex items-center mb-4 p-2 rounded-lg">
            <div className="w-12 h-12 bg-gray-700 rounded-full animate-pulse"></div>
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-center mb-1">
                <div className="h-4 bg-gray-600 rounded animate-pulse w-20"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"></div>
              </div>
              <div className="h-3 bg-gray-700 rounded animate-pulse w-32"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
