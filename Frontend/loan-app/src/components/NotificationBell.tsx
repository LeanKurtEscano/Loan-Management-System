import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCheck, faCheckDouble, faClock, faExclamationCircle, faAngleRight,faTrophy } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { userApi } from '../services/axiosConfig';
import { Notification } from '../constants/interfaces/notificationInterface';
import { formatDate } from '../utils/formatDate';
import { useMyContext } from '../context/MyContext';

interface NotificationBellProps {
  id: number | undefined;
}
import { useNavigate } from 'react-router-dom';
const NotificationBell: React.FC<NotificationBellProps> = ({ id }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const {unreadCount, setUnreadCount} = useMyContext();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');
  const nav = useNavigate();
 
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Store processed notification IDs to prevent duplicates
  const processedNotificationsRef = useRef<Set<number>>(new Set());

  // Get latest notifications (maximum 2)
  const latestNotifications = notifications.slice(0, 2);

  const fetchNotifications = async () => {
    try {
      const response = await userApi.get(`/notifications/`);
      
      // Update the processed notifications set with existing IDs
      response.data.forEach((notif: Notification) => {
        processedNotificationsRef.current.add(notif.id);
      });
      
      setNotifications(response.data);
      setUnreadCount(response.data.filter((notif: Notification) => !notif.is_read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const connectWebSocket = () => {
    if (!id) return;
    
    // Close existing connection if any
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.close();
    }
    
    setConnectionStatus('connecting');
    const socket = new WebSocket(`ws://localhost:8000/ws/notifications/${id}/`);
    socketRef.current = socket;
    
    socket.onopen = () => {
    
      setConnectionStatus('connected');
      
      // Start heartbeat when connected
      startHeartbeat();
    };
    
    socket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        
        // Handle connection established message
        if (data.type === 'connection_established') {
         
          return;
        }
        
        // Handle heartbeat response
        if (data.type === 'heartbeat_response') {
         
          return;
        }
        
        // Handle notification message
        if (data.notification) {
          const newNotification: Notification = data.notification;
          const notificationId = newNotification.id;
          
          // Check if we've already processed this notification
          if (processedNotificationsRef.current.has(notificationId)) {
            console.log(`Skipping duplicate notification ${notificationId}`);
            return;
          }
          
          // Add to processed set
          processedNotificationsRef.current.add(notificationId);
          
          setNotifications((prevNotifications) => {
            // Check if notification already exists in the array (double check)
            if (prevNotifications.some(notif => notif.id === notificationId)) {
              return prevNotifications;
            }
            
            const updatedNotifications = [newNotification, ...prevNotifications];
            const newUnreadCount = updatedNotifications.filter(notif => !notif.is_read).length;
            setUnreadCount(newUnreadCount);
            return updatedNotifications;
          });
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };
    
    socket.onclose = (event) => {
     
      setConnectionStatus('disconnected');
      
      // Stop heartbeat
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
      
      // Attempt to reconnect after a delay
      reconnectTimeoutRef.current = setTimeout(() => {
        
        connectWebSocket();
      }, 3000); // Reconnect after 3 seconds
    };
    
    socket.onerror = (error) => {
      
      socket.close();
    };
  };
  
  const startHeartbeat = () => {
    // Clear any existing heartbeat interval
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
    
    // Start a new heartbeat interval
    heartbeatIntervalRef.current = setInterval(() => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ type: 'heartbeat' }));
      }
    }, 30000); // Send heartbeat every 30 seconds
  };

  useEffect(() => {
    // Initialize the processed notifications set
    processedNotificationsRef.current = new Set();
    
    fetchNotifications();
    
    // Close notifications panel when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.notification-container')) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    // Initialize WebSocket connection
    connectWebSocket();
    
    // Clean up function
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      
      // Clear any pending reconnect timeouts
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      // Clear heartbeat interval
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      
      // Close WebSocket connection
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [id]);

  // Reconnect if ID changes
  useEffect(() => {
    if (id) {
      // Reset the processed notifications set when ID changes
      processedNotificationsRef.current = new Set();
      connectWebSocket();
    }
  }, [id]);

  const toggleNotifications = () => {
    setShowNotifications((prevShow) => !prevShow);
  };

  const markAllAsRead = async () => {
    try {
      const response = await userApi.post('/notifications/mark-all-read/',{});
      if (response.status === 200) {
        fetchNotifications();
       
      }
     
    
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const markAsRead = async (notificationId: number) => {

    const notification = latestNotifications.find(n => n.id === notificationId);

    if(notification?.is_read) {
      nav(`/notifications/${notificationId}`);
      return;
    }
    try {
      const response = await userApi.post(`/notifications/${notificationId}/mark-read/`,{
      });

      if(response.status === 200) {
        nav(`/notifications/${notificationId}`);
        setUnreadCount(prev => Math.max(0, prev - 1));

      }
      
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Function to get notification icon based on message content
  const getNotificationIcon = (message: string) => {
    if (message.includes("rejected")) {
      return <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500" />;
    } else if (message.includes("approved")) {
      return <FontAwesomeIcon icon={faCheckDouble} className="text-green-500" />;
    } else if (message.includes("pending")) {
      return <FontAwesomeIcon icon={faClock} className="text-yellow-500" />;
    } else if (message.includes("Congratulations") && message.includes("fully paid")) {
      return <FontAwesomeIcon icon={faTrophy} className="text-purple-500" />;
    }
    return <FontAwesomeIcon icon={faCheck} className="text-blue-500" />;
  };

  return (
    <div className="relative notification-container">
      <button
        className="p-2 text-gray-600 cursor-pointer hover:text-gray-800 hover:bg-gray-100 rounded-full relative transition duration-200"
        onClick={toggleNotifications}
        aria-label="Notifications"
      >
        <FontAwesomeIcon icon={faBell} className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        
        {/* Connection status indicator removed */}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg overflow-hidden z-50 border border-gray-200 shadow-lg">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                className="text-xs cursor-pointer text-blue-600 hover:text-blue-800 font-medium transition duration-150"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {/* Connection status message removed */}
            
            {latestNotifications.length > 0 ? (
              <>
                {latestNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`px-4 py-3 border-b border-gray-300  hover:bg-gray-200 cursor-pointer flex items-start ${!notification.is_read ? 'bg-blue-50' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="mr-3 mt-1">
                      {getNotificationIcon(notification.message)}
                    </div>
                    <div className="flex-grow">
                      <p className={`text-sm ${!notification.is_read ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(notification.created_at)}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <div className="text-gray-300 mb-3">
                  <FontAwesomeIcon icon={faBell} className="w-12 h-12" />
                </div>
                <p className="text-sm text-gray-500">No notifications yet</p>
              </div>
            )}
          </div>
          
          <Link 
            to="/notifications" 
            className="block px-4 py-3 bg-gray-50 border-t border-gray-200 text-center group"
            onClick={() => setShowNotifications(false)}
          >
            <div className="flex items-center justify-center text-sm text-blue-600 hover:text-blue-800 font-medium transition duration-150">
              <span>View all notifications</span>
              <FontAwesomeIcon icon={faAngleRight} className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;