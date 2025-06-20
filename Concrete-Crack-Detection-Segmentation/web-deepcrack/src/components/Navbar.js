import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaHome,
  FaStore,
  FaBars,
  FaTimes,
  FaEye,
  FaBrain,
} from "react-icons/fa";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMenuOpen(false); // auto close on route change
  }, [pathname]);

  const links = [
    { to: "/", label: "Landing", icon: <FaHome /> },
    { to: "/home", label: "Home", icon: <FaHome /> },
    { to: "/store", label: "Store", icon: <FaStore /> },
    { to: "/select-model", label: "Analyze", icon: <FaBrain /> },
  ];

  return (
    <header className="w-full bg-slate-900 text-white shadow-lg z-50 fixed top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 text-xl font-bold">
          <FaEye className="text-blue-400" />
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            DigitalTouchCorp
          </span>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden p-2 rounded focus:outline-none"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Nav Links */}
        <nav
          className={`md:flex md:items-center md:space-x-6 ${
            menuOpen ? "block" : "hidden"
          } absolute md:static top-full left-0 w-full md:w-auto bg-slate-800 md:bg-transparent py-4 md:py-0`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:space-x-6 px-4 md:px-0">
            {links.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-700 text-white"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`
                }
              >
                {icon}
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
