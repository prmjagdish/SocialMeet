import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaSearch, FaVideo, FaUser } from "react-icons/fa";
import { FiPlusSquare } from "react-icons/fi";
import SidebarMore from "./SidebarMore";

const Sidebar = () => {
  const [active, setActive] = useState("Home");
  const navigate = useNavigate();

  const menuItems = [
    { label: "Home", icon: <FaHome />, path: "/home" },
    { label: "Search", icon: <FaSearch />, path: "/search" },
    { label: "Reels", icon: <FaVideo />, path: "/reels" },
    { label: "Create", icon: <FiPlusSquare />, path: "/create" },
    { label: "Profile", icon: <FaUser />, path: "/profile" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 h-screen bg-white shadow-lg">
        {/* Logo */}
        <div className="px-6 py-6 flex justify-center">
          <img src=".././logo.png" alt="logo" className="h-12" />
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-2 mt-6 px-4">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setActive(item.label);
                navigate(item.path);
              }}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium
                ${active === item.label ? "bg-gray-100" : "hover:bg-gray-100"}`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden sm:block">
          <SidebarMore variant="sidebar" />
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-between px-6 py-3 z-50">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              setActive(item.label);
              navigate(item.path);
            }}
            className={`flex flex-col items-center text-xs ${
              active === item.label ? "text-gray-900" : "text-gray-400"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
          </button>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
