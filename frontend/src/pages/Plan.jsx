import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar, { SidebarProvider, useSidebar } from '../components/Sidebar';
import Itinerary from '../components/Itinerary';
import { useNavigate } from 'react-router-dom';
import { auth, onAuthStateChanged } from '../firebase.config';

const PlanContent = () => {
  const { isOpen } = useSidebar();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // If no user is logged in, redirect to auth page
      if (!currentUser && !loading) {
        navigate('/auth');
      }
    });

    return () => unsubscribe();
  }, [navigate, loading]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#080808]">
        <Sidebar />
        <motion.main
          initial={{ marginLeft: "64px" }}
          animate={{
            marginLeft: isOpen ? "240px" : "64px",
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-1 p-8 flex items-center justify-center"
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
        initial={{ marginLeft: "64px" }}
        animate={{
          marginLeft: isOpen ? "240px" : "64px",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-1 p-8"
      >
        <Itinerary />
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
