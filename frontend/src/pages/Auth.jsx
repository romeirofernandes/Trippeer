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
import { FaGoogle, FaRegEnvelope, FaUser } from "react-icons/fa";
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
        name: user.displayName || name || email.split("@")[0],
        email: user.email,
        firebaseUID: user.uid,
        profilePic: user.photoURL || "",
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
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      } else {
        // Register with email/password
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

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
      
      // Handle Firebase auth errors
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
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Try again later.";
          break;
        default:
          errorMessage = error.message || "Authentication failed";
      }
      
      setError(errorMessage);
      
      // Only sign out for registration errors - not login errors
      if (!isLogin && userCredential?.user) {
        try {
          await auth.signOut();
        } catch (signOutError) {
          console.error("Error signing out after failed registration:", signOutError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#080808]">
      <div className="max-w-md w-full space-y-8 bg-[#111111] p-8 rounded-xl shadow-2xl relative overflow-hidden border border-[#232323]">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#9cadce] opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#8b9dbd] opacity-20 rounded-full blur-3xl"></div>

        <div className="relative">
          <h2 className="text-center text-3xl font-extrabold text-[#f8f8f8] mb-6">
            {isLogin ? "Sign In" : "Create Account"}
          </h2>

          {/* Toggle Switch */}
          <div className="flex justify-center mb-8">
            <div className="bg-[#161616] rounded-lg p-1 inline-flex">
              <button
                onClick={() => setIsLogin(true)}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  isLogin
                    ? "bg-[#9cadce] text-[#f8f8f8]"
                    : "text-gray-300 hover:text-[#f8f8f8]"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  !isLogin
                    ? "bg-[#9cadce] text-[#f8f8f8]"
                    : "text-gray-300 hover:text-[#f8f8f8]"
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-200 rounded-md text-sm">
              {error}
            </div>
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
              className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-[#161616] hover:bg-[#232323] transition-all duration-200 text-[#f8f8f8] font-medium group border border-[#232323]"
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
              <div className="w-full border-t border-[#232323]"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-[#111111] text-gray-400 text-sm">
                or continue with email
              </span>
            </div>
          </div>

          {/* Form inputs styling update */}
          <form onSubmit={handleEmailAuth} className="space-y-6">
            {/* Name field (only for registration) */}
            {!isLogin && (
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-[#161616] border border-[#232323] rounded-lg text-[#f8f8f8] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9cadce] transition-all"
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
                className="w-full pl-10 pr-3 py-3 bg-[#161616] border border-[#232323] rounded-lg text-[#f8f8f8] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9cadce] transition-all"
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
                className="w-full pl-10 pr-3 py-3 bg-[#161616] border border-[#232323] rounded-lg text-[#f8f8f8] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9cadce] transition-all"
                placeholder="Password"
              />
            </div>

            <div>
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 rounded-lg text-[#f8f8f8] bg-[#9cadce] hover:bg-[#8b9dbd] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9cadce] transition-all duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
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
          </form>
          
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
