import React from 'react';
import { Compass, Mail, Github, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 bg-[#080808] text-[#ffffff]/80 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-8">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <Compass className="text-[#9cadce] w-8 h-8 mr-2" />
              <span className="text-2xl font-bold text-white">Trippeer</span>
            </div>
            <p className="text-sm text-gray-400 max-w-xs">
              AI-powered travel planning that creates perfect itineraries based on your preferences.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#9cadce] transition-colors">About</a></li>
                <li><a href="#" className="hover:text-[#9cadce] transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-[#9cadce] transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#9cadce] transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-[#9cadce] transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-[#9cadce] transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-[#9cadce] transition-colors">Terms</a></li>
              </ul>
            </div>
            
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#9cadce]/20 transition-colors">
                  <Twitter className="w-5 h-5 text-[#9cadce]" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#9cadce]/20 transition-colors">
                  <Instagram className="w-5 h-5 text-[#9cadce]" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#9cadce]/20 transition-colors">
                  <Github className="w-5 h-5 text-[#9cadce]" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#9cadce]/20 transition-colors">
                  <Mail className="w-5 h-5 text-[#9cadce]" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 text-center md:text-left text-sm text-gray-500">
          <p>© {currentYear} Trippeer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;