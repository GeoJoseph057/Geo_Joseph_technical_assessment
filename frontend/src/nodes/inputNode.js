// inputNode.js

import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Database } from 'lucide-react';
import { useStore } from '../store';

export const InputNode = ({ id, data, selected }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data.inputType || 'Text');
  const [inputValue, setInputValue] = useState(data?.inputValue || '');
  const { updateNodeField } = useStore();
  const darkMode = data?.darkMode ?? true;

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setCurrName(newName);
    updateNodeField(id, 'inputName', newName);
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setInputType(newType);
    updateNodeField(id, 'inputType', newType);
  };

  const handleValueChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    updateNodeField(id, 'inputValue', newValue);
  };

  const getPlaceholder = () => {
    switch (inputType) {
      case 'Text':
        return 'Enter your text here...';
      case 'File':
        return 'Enter file content or path...';
      case 'Number':
        return 'Enter a number...';
      default:
        return 'Enter value...';
    }
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
            <option value="Number">Number</option>
          </select>
        </div>

        <div>
          <label className={`block text-xs font-medium mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Value
          </label>
          {inputType === 'Text' || inputType === 'File' ? (
            <textarea 
              value={inputValue}
              onChange={handleValueChange}
              placeholder={getPlaceholder()}
              rows={3}
              className={`w-full p-2 rounded-lg border text-sm resize-none ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-blue-500' 
                  : 'bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
          ) : (
            <input 
              type={inputType === 'Number' ? 'number' : 'text'}
              value={inputValue}
              onChange={handleValueChange}
              placeholder={getPlaceholder()}
              className={`w-full p-2 rounded-lg border text-sm ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-blue-500' 
                  : 'bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
          )}
        </div>

        {inputValue && (
          <div className={`text-xs p-2 rounded ${
            darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-600'
          }`}>
            <div className="flex items-center space-x-2">
              <Database size={10} />
              <span>Ready: {inputValue.length} characters</span>
            </div>
          </div>
        )}
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
