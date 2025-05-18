import React from 'react';
import { motion } from 'framer-motion';
import { FaPlane } from 'react-icons/fa';
import Sidebar, { SidebarProvider, useSidebar } from '../components/Sidebar';
import TripHistory from '../components/TripHistory';
import { Link } from 'react-router-dom';
import { auth, onAuthStateChanged } from '../firebase.config';

const DashboardContent = () => {
  const { isOpen } = useSidebar();
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-[#f8f8f8]">Dashboard</h1>
              {user && (
                <div className="text-sm text-gray-400">
                  Welcome back, {user.displayName || user.email.split('@')[0]}
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/itinerary">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-800 p-6 rounded-lg text-center hover:bg-indigo-700 transition-colors"
                >
                  <FaPlane className="text-3xl mx-auto mb-2" />
                  <h3 className="font-medium">Plan Trip</h3>
                </motion.div>
              </Link>
              
              {/* Add more quick actions here as needed */}
            </div>
          </motion.div>
          
          {/* Trip History Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TripHistory />
          </motion.div>
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
