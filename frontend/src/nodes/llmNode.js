import React, { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { Brain, Settings, Zap } from 'lucide-react';

export const LLMNode = ({ id, data, selected }) => {
  const [model, setModel] = useState(data?.model || 'gpt-4');
  const [temperature, setTemperature] = useState(data?.temperature || 0.7);
  const [maxTokens, setMaxTokens] = useState(data?.maxTokens || 1000);
  const [showSettings, setShowSettings] = useState(false);
  const darkMode = data?.darkMode ?? true;

  const handleModelChange = (e) => {
    setModel(e.target.value);
  };

  const handleTemperatureChange = (e) => {
    setTemperature(parseFloat(e.target.value));
  };

  const handleMaxTokensChange = (e) => {
    setMaxTokens(parseInt(e.target.value));
  };

  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-system`,
      style: { top: '33%' },
    },
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-prompt`,
      style: { top: '66%' },
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-response`,
    },
  ];

  return (
    <BaseNode 
      title="LLM" 
      handles={handles} 
      icon={<Brain size={16} />}
      selected={selected}
      darkMode={darkMode}
    >
      <div className="space-y-3">
        <div>
          <label className={`block text-xs font-medium mb-1 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Model
          </label>
          <select 
            value={model} 
            onChange={handleModelChange}
            className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-orange-400' 
                : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-orange-500'
            } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20`}
          >
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="claude-3">Claude-3</option>
            <option value="llama-2">LLaMA-2</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Advanced Settings
          </span>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1 rounded transition-colors ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <Settings size={14} />
          </button>
        </div>

        {showSettings && (
          <div className="space-y-2 pt-2 border-t border-gray-600">
            <div>
              <label className={`block text-xs font-medium mb-1 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Temperature: {temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={handleTemperatureChange}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className={`block text-xs font-medium mb-1 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Max Tokens
              </label>
              <input
                type="number"
                value={maxTokens}
                onChange={handleMaxTokensChange}
                min="1"
                max="4000"
                className={`w-full px-2 py-1 text-xs rounded border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>
        )}

        {/* Status indicator */}
        <div className={`flex items-center space-x-2 text-xs p-2 rounded ${
          darkMode ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-50 text-orange-600'
        }`}>
          <Zap size={12} />
          <span>Ready for inference</span>
        </div>
      </div>
    </BaseNode>
  );
};