import React, { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { Database, File, Type } from 'lucide-react';

export const InputNode = ({ id, data, selected }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data?.inputType || 'Text');
  const darkMode = data?.darkMode ?? true;

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e) => {
    setInputType(e.target.value);
  };

  const handles = [
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-value`,
    },
  ];

  const getTypeIcon = () => {
    switch (inputType) {
      case 'File':
        return <File size={16} />;
      case 'Text':
        return <Type size={16} />;
      default:
        return <Database size={16} />;
    }
  };

  return (
    <BaseNode 
      title="Input" 
      handles={handles} 
      icon={<Database size={16} />}
      selected={selected}
      darkMode={darkMode}
    >
      <div className="space-y-3">
        <div>
          <label className={`block text-xs font-medium mb-1 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Name
          </label>
          <input 
            type="text" 
            value={currName} 
            onChange={handleNameChange}
            className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400' 
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
            placeholder="Enter input name"
          />
        </div>
        
        <div>
          <label className={`block text-xs font-medium mb-1 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Type
          </label>
          <div className="relative">
            <select 
              value={inputType} 
              onChange={handleTypeChange}
              className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors appearance-none ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
            >
              <option value="Text">Text</option>
              <option value="File">File</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              {getTypeIcon()}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className={`text-xs p-2 rounded border-l-2 border-blue-400 ${
          darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-blue-50 text-gray-600'
        }`}>
          <span className="font-medium">Output:</span> {currName}
        </div>
      </div>
    </BaseNode>
  );
};