import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar, { SidebarProvider, useSidebar } from "../components/Sidebar";
import Itinerary from "../components/Itinerary";
import { useNavigate } from "react-router-dom";
import { auth, onAuthStateChanged } from "../firebase.config";

const PlanContent = () => {
  const { isOpen } = useSidebar();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);
  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // If no user is logged in, redirect to auth page
      if (!currentUser && !loading) {
        navigate("/auth");
      }
    });

    return () => unsubscribe();
  }, [navigate, loading]);

  const getMarginLeft = () => {
    if (isMobile) {
      return "64px";
    }
    return isOpen ? "240px" : "64px";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#080808]">
        <Sidebar />
        <motion.main
          initial={{ marginLeft: isMobile ? "0px" : "64px" }}
          animate={{
            marginLeft: getMarginLeft(),
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-1 p-4 md:p-8 pl-4 md:pl-8 flex items-center justify-center"
        >
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#9cadce] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#9cadce]">Loading...</p>
          </div>
        </motion.main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#080808]">
      <Sidebar />
      <motion.main
        initial={{ marginLeft: isMobile ? "0px" : "64px" }}
        animate={{
          marginLeft: getMarginLeft(),
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-1 p-4 md:p-8 pl-4 md:pl-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 md:mb-8"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-[#f8f8f8]">
              Plan Your Trip
            </h1>
            <p className="text-sm md:text-base text-[#9cadce] mt-2">
              Create amazing travel experiences with AI-powered planning
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Itinerary />
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
};

const Plan = () => {
  return (
    <SidebarProvider>
      <PlanContent />
    </SidebarProvider>
  );
};

export default Plan;
