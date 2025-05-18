import React from "react";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  return (
    <div className="flex bg-[#080808]">
      <Sidebar />
      <div className="flex-1 p-7">
        <h1 className="text-3xl font-bold mb-8 text-[#f8f8f8]">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard cards */}
          {[1, 2, 3].map((_, i) => (
            <div
              key={i}
              className="bg-[#111111] rounded-xl p-6 hover:bg-[#161616] transition-all duration-300"
            >
              <h2 className="text-xl font-semibold mb-4 text-[#f8f8f8]">
                Card Title
              </h2>
              <p className="text-[#a0a0a0]">Card content goes here...</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
