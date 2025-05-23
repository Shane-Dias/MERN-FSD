import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, NavLink, Link } from "react-router-dom";
import { FaClipboardList } from "react-icons/fa";
import {
  Home,
  Grid,
  LogIn,
  Award,
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { FcIdea } from "react-icons/fc";

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Get values from localStorage with error handling and defaults
  const getLocalStorageItem = (key, defaultValue = null) => {
    try {
      const value = localStorage.getItem(key);
      return value !== null ? value : defaultValue;
    } catch (error) {
      console.error(`Error accessing localStorage for ${key}:`, error);
      return defaultValue;
    }
  };

  const token = getLocalStorageItem("token");
  const role = getLocalStorageItem("role");
  const userId = getLocalStorageItem("userId");

  const fetchUserDetails = async () => {
    if (!token) return null;

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/users/details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Server error:", errorData);
        throw new Error(`Failed to fetch user details: ${res.status}`);
      }

      const data = await res.json();
      // console.log(data);
      return data.user;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (mediaPath) => {
    if (!mediaPath) return null;
    mediaPath = mediaPath.replace(/\\/g, "/");
    return `http://localhost:5000/${mediaPath}`;
  };

  useEffect(() => {
    let isMounted = true;

    const loadUserData = async () => {
      if (!token) return;

      try {
        const user = await fetchUserDetails();

        if (!isMounted) return;

        if (user) {
          setUserData(user);

          // Only update localStorage if values actually changed
          if (user.role && user.role !== getLocalStorageItem("role")) {
            localStorage.setItem("role", user.role);
          }

          if (user._id && user._id !== getLocalStorageItem("userId")) {
            localStorage.setItem("userId", user._id);
          }
        }
      } catch (err) {
        console.error("Error loading user data:", err);

        // Handle invalid token by logging out
        if (err.message?.includes("401")) {
          handleLogout();
        }
      }
    };

    loadUserData();
    return () => {
      isMounted = false;
    };
  }, [token]);

  // Click outside dropdown handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      setUserData(null);
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      // Force navigation even if localStorage clearing fails
      navigate("/login");
    }
  };

  const getDashboardPath = () => {
    // Get user ID from state first, then fallback to localStorage
    const currentUserId = userData?._id || userId;

    // Get role from state first, then fallback to localStorage
    const currentRole = userData?.role || role;

    switch (currentRole) {
      case "Student":
        return `/student/${currentUserId}`;
      case "Faculty":
        return `/faculty/${currentUserId}`;
      case "Admin":
        return `/admin`;
      default:
        return `/user/${currentUserId}`;
    }
  };

  const getProfileOptions = () => {
    // Get user ID from state first, then fallback to localStorage
    const currentUserId = userData?._id || userId;

    // Early return with limited options if no user ID is available
    if (!currentUserId) {
      return [{ name: "Logout", action: handleLogout, icon: LogOut }];
    }

    const dashboardPath = getDashboardPath();

    const baseOptions = [
      { name: "Profile", path: `/userdetails/${currentUserId}`, icon: User },
      { name: "Logout", action: handleLogout, icon: LogOut },
    ];

    // For all roles, include dashboard option
    return [
      {
        name: "Dashboard",
        path: dashboardPath,
        icon: LayoutDashboard,
      },
      ...baseOptions,
    ];
  };

  // Get the display name for the user
  const getDisplayName = () => {
    if (userData?.fullName) return userData.fullName.split(" ")[0];
    if (userData?.name) return userData.name.split(" ")[0];
    return "User";
  };

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Projects", path: "/projects", icon: FaClipboardList },
    { name: "Leaderboards", path: "/leaderboards", icon: Award },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Website Name */}
        <div className="flex items-center space-x-3 group">
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
              transition: {
                type: "spring",
                stiffness: 500,
                damping: 15,
                mass: 0.5,
              },
            }}
            whileHover={{
              scale: 1.1,
              rotate: [0, 5, -5, 0],
              transition: { duration: 0.5 },
            }}
            className="p-2 bg-white rounded-xl shadow-lg shadow-amber-400/20 group-hover:shadow-amber-400/30 transition-all duration-300 backdrop-blur-sm bg-white/30"
          >
            <motion.div
              animate={{
                scale: [1.3, 1.1, 1],
                transition: {
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 1.7,
                  delay: 0.5,
                },
              }}
            >
              <FcIdea className="text-3xl" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: {
                delay: 0.3,
                type: "spring",
                stiffness: 300,
              },
            }}
            className="text-3xl font-delius font-extrabold bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 text-transparent bg-clip-text tracking-tighter"
          >
            <Link to={"/"}>BrightBuilds</Link>
          </motion.h1>
        </div>

        {/* Hamburger Menu Button - Only visible on mobile */}
        <button
          className="md:hidden flex items-center text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X size={24} className="text-white" />
          ) : (
            <Menu size={24} className="text-white" />
          )}
        </button>

        {/* Navigation Links - Hidden on mobile, visible on desktop */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => `
                relative group flex items-center space-x-2 
                text-gray-300 hover:text-white 
                transition-all duration-300 
                ${isActive ? "text-white" : ""}
              `}
            >
              {({ isActive }) => (
                <>
                  <link.icon size={20} />
                  <span className="font-medium">{link.name}</span>

                  {isActive && (
                    <motion.div
                      layoutId="navbar-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"
                    />
                  )}

                  <span
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 
                    rounded-lg opacity-0 group-hover:opacity-100 
                    transition-opacity duration-300 -z-10"
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* User Profile - Always visible on both mobile and desktop */}
        {!token ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            className="
              hidden md:flex items-center space-x-2 
              bg-gradient-to-r from-blue-600 to-purple-600 
              text-white px-4 py-2 rounded-full 
              hover:from-blue-700 hover:to-purple-700 
              transition-all duration-300 
              shadow-lg hover:shadow-xl
              group
            "
          >
            <LogIn
              size={20}
              className="group-hover:rotate-12 transition-transform"
            />
            <span>Login</span>
          </motion.button>
        ) : (
          <div className="relative hidden md:block" ref={dropdownRef}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="cursor-pointer flex items-center space-x-2"
            >
              <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-purple-500 shadow-lg hover:shadow-purple-500/30 transition-all duration-300">
                {isLoading ? (
                  <div className="h-full w-full bg-gray-700 flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  </div>
                ) : userData?.profileImage ? (
                  <img
                    src={getImageUrl(userData.profileImage)}
                    alt="User Profile"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = ""; // Clear src to prevent infinite loop
                      // Replace with fallback content
                      e.target.parentNode.innerHTML = `
                        <div class="h-full w-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                )}
              </div>
              <span className="text-white text-sm hidden md:block">
                {getDisplayName()}
              </span>
            </motion.div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl overflow-hidden z-50"
              >
                {userData && (
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-sm text-white font-medium truncate">
                      {userData.fullName || userData.name || "User"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {userData.role || role || "User"}
                    </p>
                  </div>
                )}
                <div className="py-1">
                  {getProfileOptions().map((option, index) => (
                    <div key={index}>
                      {option.path ? (
                        <Link
                          to={option.path}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <option.icon size={16} />
                          <span>{option.name}</span>
                        </Link>
                      ) : (
                        <button
                          onClick={() => {
                            option.action();
                            setIsDropdownOpen(false);
                          }}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 w-full text-left"
                        >
                          <option.icon size={16} />
                          <span>{option.name}</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed top-16 left-0 right-0 bg-gray-900/95 backdrop-blur-md shadow-lg z-40 overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col">
                {/* Mobile Navigation Links */}
                <div className="flex flex-col space-y-4 border-b border-gray-700 pb-4">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.name}
                      to={link.path}
                      className={({ isActive }) => `
                        flex items-center space-x-3 px-2 py-3
                        text-gray-300 hover:text-white 
                        ${
                          isActive ? "text-white bg-gray-800/50 rounded-lg" : ""
                        }
                      `}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <link.icon size={20} />
                      <span className="font-medium">{link.name}</span>
                    </NavLink>
                  ))}
                </div>

                {/* Mobile User Options */}
                <div className="pt-4">
                  {!token ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        navigate("/login");
                        setIsMobileMenuOpen(false);
                      }}
                      className="
                        w-full flex items-center justify-center space-x-2 
                        bg-gradient-to-r from-blue-600 to-purple-600 
                        text-white px-4 py-3 rounded-lg 
                        transition-all duration-300 
                        shadow-lg
                      "
                    >
                      <LogIn size={20} />
                      <span>Login</span>
                    </motion.button>
                  ) : (
                    <>
                      {/* User Profile Info */}
                      <div className="flex items-center space-x-3 mb-4 p-2">
                        <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-purple-500">
                          {isLoading ? (
                            <div className="h-full w-full bg-gray-700 flex items-center justify-center">
                              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                            </div>
                          ) : userData?.profileImage ? (
                            <img
                              src={getImageUrl(userData.profileImage)}
                              alt="User Profile"
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "";
                                e.target.parentNode.innerHTML = `
                                  <div class="h-full w-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                      <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                  </div>
                                `;
                              }}
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                              <User size={20} className="text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {userData?.fullName || userData?.name || "User"}
                          </p>
                          <p className="text-sm text-gray-400">
                            {userData?.role || role || "User"}
                          </p>
                        </div>
                      </div>

                      {/* User Options */}
                      <div className="flex flex-col space-y-2">
                        {getProfileOptions().map((option, index) => (
                          <div key={index}>
                            {option.path ? (
                              <Link
                                to={option.path}
                                className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800/50 rounded-lg hover:text-white transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <option.icon size={20} />
                                <span>{option.name}</span>
                              </Link>
                            ) : (
                              <button
                                onClick={() => {
                                  option.action();
                                  setIsMobileMenuOpen(false);
                                }}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800/50 rounded-lg hover:text-white transition-colors text-left"
                              >
                                <option.icon size={20} />
                                <span>{option.name}</span>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
