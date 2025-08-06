// timerNode.js
import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const TimerNode = ({ id, data }) => {
  const [duration, setDuration] = useState(data?.duration || 1000);
  const [isRunning, setIsRunning] = useState(false);

  const handleDurationChange = (e) => {
    setDuration(Number(e.target.value));
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-trigger`,
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-output`,
    },
  ];

  return (
    <BaseNode title="Timer" handles={handles}>
      <label>
        Duration (ms):
        <input 
          type="number" 
          value={duration} 
          onChange={handleDurationChange}
          min="100"
          step="100"
        />
      </label>
      <button 
        onClick={toggleTimer}
        style={{ 
          marginTop: '5px', 
          padding: '2px 8px',
          backgroundColor: isRunning ? '#ff4444' : '#44ff44',
          color: 'white',
          border: 'none',
          borderRadius: '3px'
        }}
      >
        {isRunning ? 'Stop' : 'Start'}
      </button>
    </BaseNode>
  );
};
