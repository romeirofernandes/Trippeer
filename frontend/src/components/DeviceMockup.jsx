import React from "react";

const DeviceMockup = ({ image, alt = "App Preview", type = "phone" }) => {
  if (type === "phone") {
    return (
      <div className="relative mx-auto w-64 h-[520px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-2 shadow-2xl">
        {/* Phone frame */}
        <div className="w-full h-full bg-black rounded-[2.5rem] relative overflow-hidden">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>

          {/* Screen */}
          <div className="w-full h-full bg-white rounded-[2.2rem] overflow-hidden relative">
            {image ? (
              <img
                src={image}
                alt={alt}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#9cadce]/20 to-[#ffffff]/10 flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[#9cadce]/20 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-[#9cadce]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">Travel Planner</p>
                </div>
              </div>
            )}
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-white/30 rounded-full"></div>
        </div>

        {/* Side buttons */}
        <div className="absolute left-0 top-20 w-1 h-8 bg-gray-700 rounded-r-lg"></div>
        <div className="absolute left-0 top-32 w-1 h-12 bg-gray-700 rounded-r-lg"></div>
        <div className="absolute left-0 top-48 w-1 h-12 bg-gray-700 rounded-r-lg"></div>
        <div className="absolute right-0 top-32 w-1 h-16 bg-gray-700 rounded-l-lg"></div>
      </div>
    );
  }

  if (type === "tablet") {
    return (
      <div className="relative mx-auto w-80 h-[500px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[2rem] p-3 shadow-2xl">
        {/* Tablet frame */}
        <div className="w-full h-full bg-black rounded-[1.5rem] relative overflow-hidden">
          {/* Screen */}
          <div className="w-full h-full bg-white rounded-[1.2rem] overflow-hidden relative">
            {image ? (
              <img
                src={image}
                alt={alt}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#9cadce]/20 to-[#ffffff]/10 flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <div className="w-20 h-20 mx-auto mb-4 bg-[#9cadce]/20 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-[#9cadce]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                  </div>
                  <p className="text-base font-medium">AI Travel Dashboard</p>
                </div>
              </div>
            )}
          </div>

          {/* Home button */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gray-800 rounded-full border-2 border-gray-600"></div>
        </div>
      </div>
    );
  }

  // Laptop mockup
  return (
    <div className="relative mx-auto">
      {/* Laptop screen */}
      <div className="w-96 h-60 bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-xl p-2 shadow-2xl">
        <div className="w-full h-full bg-black rounded-t-lg overflow-hidden relative">
          <div className="w-full h-full bg-white rounded-t-lg overflow-hidden">
            {image ? (
              <img
                src={image}
                alt={alt}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#9cadce]/20 to-[#ffffff]/10 flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <div className="w-16 h-16 mx-auto mb-3 bg-[#9cadce]/20 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-[#9cadce]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">Travel Dashboard</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Laptop base */}
      <div className="w-[420px] h-6 bg-gradient-to-b from-gray-300 to-gray-400 rounded-b-2xl relative -mt-1 mx-auto">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-500 rounded-t-lg"></div>
      </div>
    </div>
  );
};

export default DeviceMockup;
