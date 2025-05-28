import React from "react";

const DeviceMockup = ({ image, alt = "App Preview", type = "phone" }) => {
  if (type === "phone") {
    return (
      <div className="relative mx-auto w-64 h-[520px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[2.5rem] p-2 shadow-2xl mb-16">
        {/* Phone frame */}
        <div className="w-full h-full bg-black rounded-[2.2rem] relative overflow-hidden">
          {/* Screen */}
          <div className="w-full h-full bg-[#080808] rounded-[2rem] overflow-hidden relative p-1">
            {image ? (
              <img
                src={image}
                alt={alt}
                className="w-full h-full object-cover rounded-[2.2rem]"
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
                className="w-full h-full object-cover rounded-[1.2rem]"
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
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="relative mx-auto w-64 h-[520px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-2 shadow-2xl">
      <div className="w-full h-full bg-black rounded-[2.5rem] relative overflow-hidden">
        <div className="w-full h-full bg-white rounded-[2.2rem] overflow-hidden relative">
          {image ? (
            <img
              src={image}
              alt={alt}
              className="w-full h-full object-cover rounded-[2.2rem]"
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
      </div>

      {/* Side buttons */}
      <div className="absolute left-0 top-20 w-1 h-8 bg-gray-700 rounded-r-lg"></div>
      <div className="absolute left-0 top-32 w-1 h-12 bg-gray-700 rounded-r-lg"></div>
      <div className="absolute left-0 top-48 w-1 h-12 bg-gray-700 rounded-r-lg"></div>
      <div className="absolute right-0 top-32 w-1 h-16 bg-gray-700 rounded-l-lg"></div>
    </div>
  );
};

export default DeviceMockup;
