import React, { useState, useEffect } from 'react';

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'payment',
      title: 'Payment Received',
      message: 'Rahul Kumar paid ₹25,000 for Loan #L12345',
      time: '2 minutes ago',
      icon: '💰',
      color: 'green'
    },
    {
      id: 2,
      type: 'overdue',
      title: 'New Overdue Case',
      message: 'Priya Singh - Loan #L12346 moved to X bucket',
      time: '15 minutes ago',
      icon: '⚠️',
      color: 'orange'
    },
    {
      id: 3,
      type: 'legal',
      title: 'Legal Notice Sent',
      message: 'Notice sent to Amit Sharma for Loan #L12347',
      time: '1 hour ago',
      icon: '⚖️',
      color: 'red'
    },
    {
      id: 4,
      type: 'target',
      title: 'Collection Target',
      message: 'Delhi branch achieved 95% of daily target',
      time: '2 hours ago',
      icon: '🎯',
      color: 'blue'
    }
  ]);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`fixed top-4 right-4 w-80 z-50 transition-all duration-500 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🔔</span>
              <h3 className="font-bold">Live Updates</h3>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notification, index) => (
            <div 
              key={notification.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  notification.color === 'green' ? 'bg-green-100' :
                  notification.color === 'orange' ? 'bg-orange-100' :
                  notification.color === 'red' ? 'bg-red-100' :
                  'bg-blue-100'
                }`}>
                  <span className="text-sm">{notification.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm">{notification.title}</h4>
                  <p className="text-gray-600 text-xs mt-1">{notification.message}</p>
                  <p className="text-gray-400 text-xs mt-2">{notification.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 text-center">
          <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
            View All Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
