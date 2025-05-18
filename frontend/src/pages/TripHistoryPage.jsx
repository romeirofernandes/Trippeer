import React from "react";
import Sidebar, { SidebarProvider, useSidebar } from "../components/Sidebar";
import TripHistory from "../components/TripHistory";
import { motion } from "framer-motion";

const TripHistoryContent = () => {
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
          <h1 className="text-3xl font-bold mb-8 text-[#f8f8f8]">Trip History</h1>
          <TripHistory />
        </div>
      </motion.main>
    </div>
  );
};

const TripHistoryPage = () => (
  <SidebarProvider>
    <TripHistoryContent />
  </SidebarProvider>
);

export default TripHistoryPage;
