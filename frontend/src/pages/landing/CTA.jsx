import React from "react";
import Button from "./Button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 md:py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#080808] to-[#080808] z-0" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-4xl">
        <div className="text-center bg-gradient-to-br from-[#161616] to-[#0f0f0f] rounded-xl md:rounded-2xl p-6 md:p-12 border border-[#232323] hover:shadow-[0_0_50px_rgba(156,173,206,0.1)] transition-all duration-300">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">
            Ready to Plan Your Next Adventure?
          </h2>
          <p className="text-base md:text-xl text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of travelers who trust our AI for intelligent,
            personalized travel planning.
          </p>
          <div className="flex justify-center">
            <Button
              onClick={() => navigate("/auth")}
              primary
              className="group text-base md:text-lg px-6 py-3 md:px-8 md:py-4 w-full sm:w-auto max-w-xs"
            >
              Start Planning for Free
              <ArrowRight className="ml-2 inline-block w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
