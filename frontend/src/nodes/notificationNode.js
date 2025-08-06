// notificationNode.js
import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { Bell, Mail, MessageCircle, Webhook } from 'lucide-react';

export const NotificationNode = ({ id, data, selected }) => {
  const [notificationType, setNotificationType] = useState(data?.notificationType || 'email');
  const [recipient, setRecipient] = useState(data?.recipient || '');
  const [priority, setPriority] = useState(data?.priority || 'normal');
  const darkMode = data?.darkMode ?? true;

  const handleTypeChange = (e) => {
    setNotificationType(e.target.value);
  };

  const handleRecipientChange = (e) => {
    setRecipient(e.target.value);
  };

  const handlePriorityChange = (e) => {
    setPriority(e.target.value);
  };

  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-trigger`,
      style: { top: '30%' },
    },
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-message`,
      style: { top: '70%' },
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-status`,
    },
  ];

  const getNotificationIcon = () => {
    switch (notificationType) {
      case 'email':
        return <Mail size={12} />;
      case 'sms':
        return <MessageCircle size={12} />;
      case 'slack':
        return <MessageCircle size={12} />;
      case 'webhook':
        return <Webhook size={12} />;
      default:
        return <Bell size={12} />;
    }
  };

  const getPriorityColor = () => {
    switch (priority) {
      case 'low':
        return 'text-gray-500';
      case 'normal':
        return 'text-blue-500';
      case 'high':
        return 'text-yellow-500';
      case 'urgent':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <BaseNode 
      title="Notification" 
      handles={handles}
      icon={<Bell size={16} />}
      selected={selected}
      darkMode={darkMode}
    >
      <div className="space-y-3">
        <div>
          <label className={`block text-xs font-medium mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Notification Type
          </label>
          <select 
            value={notificationType} 
            onChange={handleTypeChange}
            className={`w-full p-2 rounded-lg border text-sm ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500' 
                : 'bg-gray-100 border-gray-300 text-gray-800 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="slack">Slack</option>
            <option value="webhook">Webhook</option>
          </select>
        </div>
        
        <div>
          <label className={`block text-xs font-medium mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Recipient
          </label>
          <input 
            type="text" 
            value={recipient} 
            onChange={handleRecipientChange}
            placeholder="Enter recipient"
            className={`w-full p-2 rounded-lg border text-sm ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-blue-500' 
                : 'bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          />
        </div>
        
        <div>
          <label className={`block text-xs font-medium mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Priority
          </label>
          <select 
            value={priority} 
            onChange={handlePriorityChange}
            className={`w-full p-2 rounded-lg border text-sm ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500' 
                : 'bg-gray-100 border-gray-300 text-gray-800 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          >
            <option value="low">Low Priority</option>
            <option value="normal">Normal Priority</option>
            <option value="high">High Priority</option>
            <option value="urgent">Urgent Priority</option>
          </select>
        </div>
        
        {/* Status indicator */}
        <div className={`text-xs p-2 rounded ${
          darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-600'
        }`}>
          <div className="flex items-center space-x-2">
            {getNotificationIcon()}
            <span>Send to: {recipient || 'Not set'}</span>
            <span className={`font-semibold ${getPriorityColor()}`}>
              [{priority.toUpperCase()}]
            </span>
          </div>
        </div>
      </div>
    </BaseNode>
  );
};
