import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiMenuAlt3 } from "react-icons/hi";
import { FaRoute, FaCompass } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { title: "Plan Trip", path: "/plan", icon: <FaRoute size={20} /> },
    { title: "Explore", path: "/explore", icon: <FaCompass size={20} /> },
  ];

  return (
    <section className="flex gap-6">
      <div
        className={`bg-[#0F0F0F] min-h-screen ${
          isOpen ? "w-60" : "w-16"
        } duration-500 text-[#f8f8f8] px-4`}
      >
        <div className="py-3 flex justify-end">
          <HiMenuAlt3
            size={26}
            className="cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
        <div className="mt-4 flex flex-col gap-4 relative">
          {navLinks?.map((link, i) => (
            <Link
              to={link?.path}
              key={i}
              className={`${
                location.pathname === link?.path ? "bg-[#232323]" : ""
              } group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-[#232323] rounded-md transition-all duration-300`}
            >
              <div>{link?.icon}</div>
              <h2
                style={{
                  transitionDelay: `${i + 3}00ms`,
                }}
                className={`whitespace-pre duration-500 ${
                  !isOpen && "opacity-0 translate-x-28 overflow-hidden"
                }`}
              >
                {link?.title}
              </h2>
              <h2
                className={`${
                  isOpen && "hidden"
                } absolute left-48 bg-[#232323] font-semibold whitespace-pre text-[#f8f8f8] rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}
              >
                {link?.title}
              </h2>
            </Link>
          ))}
          <button
            onClick={() => {
              /* Add logout logic */
            }}
            className={`group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-[#232323] rounded-md mt-auto mb-8`}
          >
            <div>
              <BiLogOut size={20} />
            </div>
            <h2
              style={{
                transitionDelay: "600ms",
              }}
              className={`whitespace-pre duration-500 ${
                !isOpen && "opacity-0 translate-x-28 overflow-hidden"
              }`}
            >
              Logout
            </h2>
            <h2
              className={`${
                isOpen && "hidden"
              } absolute left-48 bg-[#232323] font-semibold whitespace-pre text-[#f8f8f8] rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}
            >
              Logout
            </h2>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Sidebar;
