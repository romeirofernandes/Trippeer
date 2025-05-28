import React, { useState, useEffect } from "react";
import Button from "./Button";
import GradientText from "./GradientText";
import { ArrowRight, Compass, User, LogOut } from "lucide-react";
import DarkEarth from "../spline/DarkEarth";
import DeviceMockup from "../../components/DeviceMockup";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase.config";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-20 py-4 md:py-6">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Compass className="w-6 h-6 md:w-8 md:h-8 text-[#9cadce]" />
            <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-[#9cadce] to-[#ffffff] bg-clip-text text-transparent">
              Trippeer
            </span>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {loading ? (
              <div className="h-8 w-16 md:h-10 md:w-24 bg-indigo-200/30 rounded-md animate-pulse"></div>
            ) : user ? (
              <>
                <div className="hidden md:flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-indigo-300"
                      />
                    ) : (
                      <User className="w-5 h-5 md:w-6 md:h-6 text-[#9cadce]" />
                    )}
                    <span className="text-xs md:text-sm text-white">
                      {user.displayName || user.email}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => navigate("/dashboard")}
                  primary
                  className="group text-sm md:text-base px-4 py-2 md:px-6 md:py-3"
                >
                  <span className="hidden sm:inline">Dashboard</span>
                  <span className="sm:hidden">Go</span>
                  <ArrowRight className="ml-1 md:ml-2 w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <button
                  onClick={handleLogout}
                  className="p-1 md:p-2 text-white/70 hover:text-white"
                >
                  <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                primary
                className="group text-sm md:text-base px-4 py-2 md:px-6 md:py-3"
              >
                Sign Up
                <ArrowRight className="ml-1 md:ml-2 w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleAction = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <section className="min-h-screen flex flex-col justify-center relative overflow-hidden pt-24 md:pt-0">
      <Navbar />

      {/* Animated background elements */}
      <div className="absolute w-full h-full">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#9cadce]/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#9cadce]/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1/2 bg-gradient-to-r from-[#9cadce]/20 via-[#ffffff]/20 to-[#9cadce]/20 blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 z-10 flex flex-col lg:flex-row items-center gap-12 max-w-5xl">
        <div className="flex-1 flex flex-col items-center lg:items-start relative z-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center lg:text-left mb-6 leading-tight">
            Smarter Travel, <br />
            <GradientText className="bg-gradient-to-r from-[#9cadce] via-[#ffffff] to-[#9cadce] bg-clip-text text-transparent">
              Instantly Planned
            </GradientText>
          </h1>

          <p className="text-lg md:text-xl text-[#ffffff]/80 mb-8 text-center lg:text-left max-w-2xl">
            Plan your entire trip with AI-powered suggestions, real-time maps,
            and personalized recommendations. Experience travel like never
            before.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleAction}
              primary
              className="group text-lg px-8 py-4"
            >
              {user ? "Go to Dashboard" : "Start Planning"}
              <ArrowRight className="ml-2 inline-block w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Mobile Device Mockup - only on mobile */}
          {isMobile && (
            <div className="mt-12">
              <DeviceMockup
                type="phone"
                image="/path/to/your/app-screenshot.png"
                alt="Trippeer Mobile App"
              />
            </div>
          )}
        </div>

        {/* Desktop Earth - behind text, properly centered */}
        {!isMobile && (
          <div className="absolute inset-0 w-full h-full z-0">
            <div className="relative w-full h-full">
              <DarkEarth />
            </div>
          </div>
        )}
      </div>

    </section>
  );
};

export default Hero;
