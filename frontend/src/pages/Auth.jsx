import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  auth,
  provider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "../firebase.config";
import { FaGoogle, FaRegEnvelope, FaUser, FaPlane } from "react-icons/fa";
import { IoKeyOutline } from "react-icons/io5";
import axios from "axios";
import { motion } from 'framer-motion';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  // Function to register user with backend
  const registerWithBackend = async (user) => {
    try {
      const backendUser = {
        name: user.displayName || name || email.split('@')[0],
        email: user.email,
        firebaseUID: user.uid,
        profilePic: user.photoURL || '',
      };
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/auth`,
        backendUser
      );
      
      return response.data;
    } catch (error) {
      console.error("Backend registration failed:", error);
      // Sign out user from Firebase if backend registration fails
      await auth.signOut();
      throw error;
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Register with backend
      await registerWithBackend(user);
      
      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let userCredential;
      
      if (isLogin) {
        // Login with email/password
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Register with email/password
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update profile with name if provided
        if (name) {
          await updateProfile(userCredential.user, { displayName: name });
        }
      }
      
      // Register with backend
      await registerWithBackend(userCredential.user);
      
      navigate("/dashboard");
    } catch (error) {
      let errorMessage = "Authentication failed";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email already in use. Try logging in instead.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters";
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      // Sign out if there was an error (either with Firebase or backend)
      try {
        await auth.signOut();
      } catch (signOutError) {
        console.error("Error signing out after authentication failure:", signOutError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#080808]">
      <div className="max-w-md w-full space-y-8 bg-[#111111] p-8 rounded-xl shadow-2xl relative overflow-hidden border border-[#232323]">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-800 opacity-20 rounded-full blur-3xl"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#9cadce] opacity-20 rounded-full blur-3xl"
        ></motion.div>
        
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <div className="flex justify-center mb-2">
              <FaPlane className="text-3xl text-[#9cadce]" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#f8f8f8]">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {isLogin ? "Sign in to access your trips" : "Join us to start planning your adventures"}
            </p>
          </motion.div>
          
          {/* Toggle Switch */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-[#1a1a1a] rounded-lg p-1 inline-flex">
              <button
                onClick={() => setIsLogin(true)}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  isLogin
                    ? "bg-indigo-800 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  !isLogin
                    ? "bg-indigo-800 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Register
              </button>
            </div>
          </motion.div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-700 text-red-400 rounded-md text-sm"
            >
              <p className="flex items-center">
                <span className="mr-2">⚠</span> {error}
              </p>
            </motion.div>
          )}
          
          {/* Google Sign In */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-6"
          >
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 rounded-md bg-[#1a1a1a] hover:bg-[#232323] border border-[#323232] transition-all duration-200 text-[#f8f8f8] font-medium group"
            >
              <FaGoogle className="h-5 w-5 mr-2 text-[#9cadce]" />
              <span>Continue with Google</span>
              <span className="ml-1 opacity-0 group-hover:opacity-100 group-hover:ml-2 transition-all duration-200">
                →
              </span>
            </button>
          </motion.div>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-[#111111] text-gray-400 text-sm">
                or continue with email
              </span>
            </div>
          </div>
          
          {/* Email/Password Form */}
          <motion.form 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onSubmit={handleEmailAuth} 
            className="space-y-6"
          >
            {/* Name field (only for registration) */}
            {!isLogin && (
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-[#1a1a1a] border border-[#323232] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9cadce] focus:border-transparent"
                  placeholder="Full Name"
                />
              </div>
            )}
            
            <div className="relative">
              <FaRegEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-3 bg-[#1a1a1a] border border-[#323232] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9cadce] focus:border-transparent"
                placeholder="Email address"
              />
            </div>
            
            <div className="relative">
              <IoKeyOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-3 bg-[#1a1a1a] border border-[#323232] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9cadce] focus:border-transparent"
                placeholder="Password"
              />
            </div>
            
            <div>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-white bg-indigo-800 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </div>
          </motion.form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              onClick={handleToggle}
              className="text-[#9cadce] hover:text-white focus:outline-none transition-colors"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
