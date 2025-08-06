// notificationNode.js
import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const NotificationNode = ({ id, data }) => {
  const [notificationType, setNotificationType] = useState(data?.notificationType || 'email');
  const [recipient, setRecipient] = useState(data?.recipient || '');
  const [priority, setPriority] = useState(data?.priority || 'normal');

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

  return (
    <BaseNode title="Notification" handles={handles}>
      <label>
        Type:
        <select value={notificationType} onChange={handleTypeChange}>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="slack">Slack</option>
          <option value="webhook">Webhook</option>
        </select>
      </label>
      <label>
        Recipient:
        <input 
          type="text" 
          value={recipient} 
          onChange={handleRecipientChange}
          placeholder="Enter recipient"
        />
      </label>
      <label>
        Priority:
        <select value={priority} onChange={handlePriorityChange}>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </label>
    </BaseNode>
  );
};
