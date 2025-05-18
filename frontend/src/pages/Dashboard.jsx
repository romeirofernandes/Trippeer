import React from "react";
import Sidebar, { SidebarProvider, useSidebar } from "../components/Sidebar";
import { motion } from "framer-motion";

const DashboardContent = () => {
  const { isOpen } = useSidebar();

  return (
    <div className="flex min-h-screen bg-[#080808]">
      <Sidebar />
      <motion.main
        initial={{ marginLeft: "64px" }}
        animate={{
          marginLeft: isOpen ? "240px" : "64px",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-1 p-8"
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-[#f8f8f8]">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="bg-[#111111] rounded-xl p-6 hover:bg-[#161616] transition-all duration-300 border border-[#232323]"
              >
                <h2 className="text-xl font-semibold mb-4 text-[#f8f8f8]">
                  Card Title
                </h2>
                <p className="text-[#a0a0a0]">Card content goes here...</p>
              </div>
            ))}
          </div>
        </div>
      </motion.main>
    </div>
  );
};

const Dashboard = () => {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
};

export default Dashboard;
