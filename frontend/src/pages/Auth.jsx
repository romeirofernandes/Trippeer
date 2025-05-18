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
import { FaGoogle, FaRegEnvelope,FaUser } from "react-icons/fa";
import { IoKeyOutline } from "react-icons/io5";
import axios from "axios";

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
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 to-black">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl relative overflow-hidden border border-gray-700">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500 opacity-20 rounded-full blur-3xl"></div>
        
        <div className="relative">
          <h2 className="text-center text-3xl font-extrabold text-white mb-6">
            {isLogin ? "Sign In" : "Create Account"}
          </h2>
          
          {/* Toggle Switch */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-700 rounded-lg p-1 inline-flex">
              <button
                onClick={() => setIsLogin(true)}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  isLogin
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  !isLogin
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Register
              </button>
            </div>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500 text-red-200 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {/* Google Sign In */}
          <div className="mb-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 rounded-md bg-white hover:bg-gray-100 transition-all duration-200 text-gray-800 font-medium group"
            >
              <FaGoogle className="h-5 w-5 mr-2 text-blue-600" />
              <span>Continue with Google</span>
              <span className="ml-1 opacity-0 group-hover:opacity-100 group-hover:ml-2 transition-all duration-200">
                →
              </span>
            </button>
          </div>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-gray-800 text-gray-400 text-sm">
                or continue with email
              </span>
            </div>
          </div>
          
          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-6">
            {/* Name field (only for registration) */}
            {!isLogin && (
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full pl-10 pr-3 py-3 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full pl-10 pr-3 py-3 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
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
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
