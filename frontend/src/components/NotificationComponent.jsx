import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Calendar, User, MessageSquare } from "lucide-react";
import { FcIdea } from "react-icons/fc";

const NotificationComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const drawerRef = useRef(null);

  const token = localStorage.getItem("token");

  // Mock notifications for demonstration - replace with your actual API call
  // const fetchNotifications = async () => {
  //   if (!token) return;

  //   setIsLoading(true);
  //   try {
  //     // Replace with your actual API endpoint
  //     const response = await fetch("http://localhost:5000/api/notifications", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (!response.ok) throw new Error("Failed to fetch notifications");

  //     const data = await response.json();
  //     setNotifications(data.notifications || []);

  //     // Count unread notifications
  //     const unreadNotifications = data.notifications.filter(
  //       (notification) => !notification.isRead
  //     );
  //     setUnreadCount(unreadNotifications.length);
  //   } catch (error) {
  //     console.error("Error fetching notifications:", error);
  //     // Fallback to empty notifications
  //     setNotifications([]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const markAsRead = async (notificationId) => {
    if (!token) return;

    try {
      // Replace with your actual API endpoint
      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to mark notification as read");

      // Update the local state to reflect the change
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );

      // Update unread count
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // const markAllAsRead = async () => {
  //   if (!token || notifications.length === 0) return;

  //   try {
  //     // Replace with your actual API endpoint
  //     const response = await fetch(
  //       "http://localhost:5000/api/notifications/read-all",
  //       {
  //         method: "PATCH",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (!response.ok)
  //       throw new Error("Failed to mark all notifications as read");

  //     // Update the local state to reflect the change
  //     setNotifications((prev) =>
  //       prev.map((notification) => ({ ...notification, isRead: true }))
  //     );

  //     // Reset unread count
  //     setUnreadCount(0);
  //   } catch (error) {
  //     console.error("Error marking all notifications as read:", error);
  //   }
  // };

  // Click outside handler to close drawer
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch notifications when component mounts
  // useEffect(() => {
  //   fetchNotifications();

  //   // Set up polling for new notifications (every 30 seconds)
  //   const intervalId = setInterval(fetchNotifications, 30000);

  //   return () => clearInterval(intervalId);
  // }, [token]);

  // Sample test data - remove in production
  useEffect(() => {
    // For testing/demo only - remove in production
    if (!token) return;

    const demoNotifications = [
      {
        _id: "1",
        title: "Project Approved",
        message: "Your smart home project has been approved by the faculty!",
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        type: "project",
        isRead: false,
      },
      {
        _id: "2",
        title: "New Badge Earned",
        message:
          "Congratulations! You've earned the 'Innovation Master' badge.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        type: "achievement",
        isRead: false,
      },
      {
        _id: "3",
        title: "Team Invite",
        message: "Sarah invited you to join team 'Circuit Breakers'.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        type: "invitation",
        isRead: true,
      },
      {
        _id: "4",
        title: "Deadline Reminder",
        message: "Project submission deadline is in 3 days!",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        type: "reminder",
        isRead: true,
      },
    ];

    // Use this for demo purposes only
    if (notifications.length === 0 && !isLoading) {
      setNotifications(demoNotifications);
      setUnreadCount(demoNotifications.filter((n) => !n.isRead).length);
    }
  }, [notifications, isLoading, token]);

  // Helper to get the icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "project":
        return <FcIdea className="text-xl" />;
      case "achievement":
        return (
          <div className="text-amber-400">
            <Bell size={18} />
          </div>
        );
      case "invitation":
        return (
          <div className="text-blue-400">
            <User size={18} />
          </div>
        );
      case "reminder":
        return (
          <div className="text-purple-400">
            <Calendar size={18} />
          </div>
        );
      default:
        return (
          <div className="text-gray-400">
            <MessageSquare size={18} />
          </div>
        );
    }
  };

  // Format the time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    }
  };

  return (
    <>
      {/* Floating Notification Button */}
      <motion.div
        className="fixed left-6 bottom-6 z-40"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.3,
        }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
        >
          <Bell size={24} />

          {/* Notification Badge */}
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.div>
          )}
        </motion.button>
      </motion.div>

      {/* Notification Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={drawerRef}
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 z-50 w-full sm:w-96 max-h-[80vh] bg-gray-900/95 backdrop-blur-md shadow-xl rounded-tr-2xl overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between bg-gray-800 px-6 py-4 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Bell size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Notifications
                </h2>

                {/* Unread count badge */}
                {unreadCount > 0 && (
                  <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {unreadCount} new
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4">
                {unreadCount > 0 && (
                  <button
                    // onClick={markAllAsRead}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[calc(80vh-64px)]">
              {isLoading ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin h-8 w-8 border-3 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                  <div className="bg-gray-800 p-4 rounded-full mb-3">
                    <Bell size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-400 mb-2">No notifications yet</p>
                  <p className="text-gray-500 text-sm">
                    When you get notifications, they'll appear here
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-700">
                  {notifications.map((notification) => (
                    <motion.li
                      key={notification._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ backgroundColor: "rgba(75, 85, 99, 0.3)" }}
                      // onClick={() => markAsRead(notification._id)}
                      className={`px-6 py-4 transition-colors cursor-pointer ${
                        !notification.isRead ? "bg-blue-900/20" : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="bg-gray-800 p-2 rounded-lg flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p
                              className={`font-medium ${
                                !notification.isRead
                                  ? "text-white"
                                  : "text-gray-300"
                              }`}
                            >
                              {notification.title}
                            </p>
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                              {formatTime(notification.createdAt)}
                            </span>
                          </div>
                          <p
                            className={`text-sm mt-1 ${
                              !notification.isRead
                                ? "text-gray-300"
                                : "text-gray-400"
                            }`}
                          >
                            {notification.message}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2"></div>
                        )}
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="border-t border-gray-700 p-4 text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationComponent;
