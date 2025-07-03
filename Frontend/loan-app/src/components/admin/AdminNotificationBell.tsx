import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCheck, faCheckDouble, faClock, faExclamationCircle, faAngleRight,faTrophy } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/axiosConfig';
import { Notification } from '../../constants/interfaces/notificationInterface';
import { formatDate } from '../../utils/formatDate';
import { useMyContext } from '../../context/MyContext';

interface NotificationBellProps {
  id: number | undefined;
}
import { useNavigate } from 'react-router-dom';
const AdminNotificationBell: React.FC<NotificationBellProps> = () => {
  const id = 28
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
 
 
  const goToAdminNotifications = () => {
    nav('/dashboard/admin/notifications');
  }
  const fetchNotifications = async () => {
    try {
      const response = await adminApi.get(`/notifications/`);
      
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
    const admin_id = 28
    setConnectionStatus('connecting');
    const socket = new WebSocket(`ws://localhost:8000/ws/admin-notifications/${admin_id}/`);
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
      
      
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
      
      
      reconnectTimeoutRef.current = setTimeout(() => {
        
        connectWebSocket();
      }, 3000); 
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
    }, 30000); // 30 seconds
  };

  useEffect(() => {
    // Initialize the processed notifications set
    processedNotificationsRef.current = new Set();
    
    fetchNotifications();

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.notification-container')) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
   
    connectWebSocket();
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      
    
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
   
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      
      
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

  const handleBellClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    goToAdminNotifications();
  };

 

 
  return (
    <div className="relative notification-container">
      <button
        className="p-2 text-gray-600 cursor-pointer hover:text-gray-800  rounded-full relative transition duration-200"
        onClick={handleBellClick}
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

    </div>
  );
};

export default AdminNotificationBell;