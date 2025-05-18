import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase.config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { FaUser, FaCertificate, FaSignOutAlt } from "react-icons/fa";
import { MdDashboard, MdLogout } from "react-icons/md";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) navigate("/auth");
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Top Navigation Bar */}
      <nav className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-500">Certifiyo</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-300">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  {user?.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <FaUser />
                  )}
                </div>
                <span>{user?.displayName || user?.email || "User"}</span>
              </div>
              <button 
                onClick={handleSignOut}
                className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
              >
                <MdLogout className="mr-1" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
        {/* Sidebar */}
        <div className="w-64 mr-8">
          <div className="bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700">
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                    activeTab === "dashboard" 
                      ? "bg-blue-600 text-white" 
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <MdDashboard className="mr-3" /> Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab("certificates")}
                  className={`w-full flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                    activeTab === "certificates" 
                      ? "bg-blue-600 text-white" 
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <FaCertificate className="mr-3" /> Certificates
                </button>
              </li>
              <li className="mt-6 pt-6 border-t border-gray-700">
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center px-4 py-2 rounded-md transition-colors duration-200 text-gray-300 hover:bg-red-600 hover:text-white"
                >
                  <FaSignOutAlt className="mr-3" /> Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            {activeTab === "dashboard" ? (
              <div>
                <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-blue-600 bg-opacity-20">
                        <FaCertificate className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-400">Total Certificates</p>
                        <h3 className="text-xl font-bold">0</h3>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-green-600 bg-opacity-20">
                        <FaCertificate className="h-6 w-6 text-green-500" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-400">Verified</p>
                        <h3 className="text-xl font-bold">0</h3>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-purple-600 bg-opacity-20">
                        <FaCertificate className="h-6 w-6 text-purple-500" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-400">Pending</p>
                        <h3 className="text-xl font-bold">0</h3>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Welcome Card */}
                <div className="bg-gray-700 rounded-lg p-6 border border-gray-600 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500 opacity-10 rounded-full blur-3xl"></div>
                  
                  <h2 className="text-xl font-bold mb-2">Welcome to Certifiyo!</h2>
                  <p className="text-gray-300 mb-4">
                    Your one-stop platform for managing digital certificates. Get started by
                    creating your first certificate or exploring our features.
                  </p>
                  
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
                    Create Certificate
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold mb-6">Your Certificates</h1>
                
                <div className="bg-gray-700 rounded-lg p-6 border border-gray-600 flex flex-col items-center justify-center">
                  <div className="text-gray-400 mb-4">
                    <FaCertificate className="h-16 w-16 mx-auto opacity-30" />
                  </div>
                  <p className="text-center text-gray-300 mb-4">
                    You don't have any certificates yet.
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
                    Create Your First Certificate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
