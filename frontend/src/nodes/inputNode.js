// inputNode.js

import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Database } from 'lucide-react';

export const InputNode = ({ id, data, selected }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data.inputType || 'Text');
  const darkMode = data?.darkMode ?? true;

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e) => {
    setInputType(e.target.value);
  };

  return (
    <div className={`
      w-72 rounded-lg shadow-lg border transition-all
      ${selected ? 'ring-2 ring-blue-500' : ''}
      ${darkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
      }
    `}>
      {/* Node Header */}
      <div className="bg-blue-500 text-white p-3 rounded-t-lg flex items-center space-x-2">
        <Database size={16} />
        <span className="font-semibold text-sm">Input</span>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <label className={`block text-xs font-medium mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Name
          </label>
          <input 
            type="text" 
            value={currName} 
            onChange={handleNameChange}
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
            Type
          </label>
          <select 
            value={inputType} 
            onChange={handleTypeChange}
            className={`w-full p-2 rounded-lg border text-sm ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500' 
                : 'bg-gray-100 border-gray-300 text-gray-800 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          >
            <option value="Text">Text</option>
            <option value="File">File</option>
          </select>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-value`}
        style={{
          width: '12px',
          height: '12px',
          background: '#3b82f6',
          border: '2px solid #ffffff'
        }}
      />
    </div>
  );
}
