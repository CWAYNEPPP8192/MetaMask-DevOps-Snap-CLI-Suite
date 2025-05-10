import React, { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  type: string;
  severity: "info" | "warning" | "critical";
  message: string;
  timestamp: string;
}

const DeFiNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [connected, setConnected] = useState(false);
  const socket = useRef<WebSocket | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up WebSocket connection
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    socket.current = new WebSocket(wsUrl);
    
    socket.current.onopen = () => {
      setConnected(true);
    };
    
    socket.current.onclose = () => {
      setConnected(false);
    };
    
    socket.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Handle connection message differently
        if (data.type === 'connection') {
          console.log('WebSocket connected:', data.message);
          return;
        }
        
        // Add other notifications to our list
        setNotifications(prev => [data, ...prev].slice(0, 10)); // Keep only the 10 most recent
        
        // Show a toast for critical alerts
        if (data.severity === 'critical') {
          toast({
            title: "Critical DeFi Alert",
            description: data.message,
            variant: "destructive"
          });
        } else if (data.severity === 'warning') {
          toast({
            title: "DeFi Warning",
            description: data.message,
            variant: "default"
          });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    // Clean up on unmount
    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, [toast]);

  return (
    <div className="h-full overflow-y-auto bg-white p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium text-gray-700">DeFi Notifications</h2>
        <div className="flex items-center">
          <span 
            className={`inline-block w-2 h-2 rounded-full mr-1 ${connected ? 'bg-green-500' : 'bg-red-500'}`}
          ></span>
          <span className="text-xs text-gray-500">
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <p>No notifications yet</p>
            <p className="text-xs">Real-time DeFi alerts will appear here</p>
          </div>
        ) : (
          notifications.map((notification, index) => (
            <div 
              key={index} 
              className={`border rounded-md p-3 ${
                notification.severity === 'critical' 
                  ? 'bg-red-50 border-red-200' 
                  : notification.severity === 'warning'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  {notification.severity === 'critical' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  {notification.severity === 'warning' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  {notification.severity === 'info' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="text-sm font-medium capitalize">{notification.type.replace(/-/g, ' ')}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(notification.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm mt-1">{notification.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DeFiNotifications;