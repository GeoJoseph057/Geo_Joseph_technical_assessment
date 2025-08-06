// timerNode.js
import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { Clock, Play, Pause } from 'lucide-react';

export const TimerNode = ({ id, data, selected }) => {
  const [duration, setDuration] = useState(data?.duration || 1000);
  const [isRunning, setIsRunning] = useState(false);
  const darkMode = data?.darkMode ?? true;

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
    <BaseNode 
      title="Timer" 
      handles={handles}
      icon={<Clock size={16} />}
      selected={selected}
      darkMode={darkMode}
    >
      <div className="space-y-3">
        <div>
          <label className={`block text-xs font-medium mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Duration (milliseconds)
          </label>
          <input 
            type="number" 
            value={duration} 
            onChange={handleDurationChange}
            min="100"
            step="100"
            className={`w-full p-2 rounded-lg border text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-blue-500' 
                : 'bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            placeholder="Timer duration"
          />
        </div>
        
        <div>
          <button 
            onClick={toggleTimer}
            className={`w-full flex items-center justify-center space-x-2 p-2 rounded-lg font-medium text-sm transition-all ${
              isRunning 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isRunning ? <Pause size={14} /> : <Play size={14} />}
            <span>{isRunning ? 'Stop Timer' : 'Start Timer'}</span>
          </button>
        </div>
        
        {/* Status indicator */}
        <div className={`text-xs p-2 rounded ${
          darkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-50 text-yellow-600'
        }`}>
          <div className="flex items-center space-x-2">
            <Clock size={12} />
            <span>Timer: {duration}ms {isRunning ? '(Running)' : '(Stopped)'}</span>
          </div>
        </div>
      </div>
    </BaseNode>
  );
};
