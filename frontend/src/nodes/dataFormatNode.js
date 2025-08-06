// dataFormatNode.js
import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { FileCode, ArrowRight } from 'lucide-react';

export const DataFormatNode = ({ id, data, selected }) => {
  const [fromFormat, setFromFormat] = useState(data?.fromFormat || 'json');
  const [toFormat, setToFormat] = useState(data?.toFormat || 'csv');
  const darkMode = data?.darkMode ?? true;

  const handleFromFormatChange = (e) => {
    setFromFormat(e.target.value);
  };

  const handleToFormatChange = (e) => {
    setToFormat(e.target.value);
  };

  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-input`,
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-output`,
    },
  ];

  return (
    <BaseNode 
      title="Data Format" 
      handles={handles}
      icon={<FileCode size={16} />}
      selected={selected}
      darkMode={darkMode}
    >
      <div className="space-y-3">
        <div>
          <label className={`block text-xs font-medium mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            From Format
          </label>
          <select 
            value={fromFormat} 
            onChange={handleFromFormatChange}
            className={`w-full p-2 rounded-lg border text-sm ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500' 
                : 'bg-gray-100 border-gray-300 text-gray-800 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="xml">XML</option>
            <option value="yaml">YAML</option>
          </select>
        </div>
        
        <div>
          <label className={`block text-xs font-medium mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            To Format
          </label>
          <select 
            value={toFormat} 
            onChange={handleToFormatChange}
            className={`w-full p-2 rounded-lg border text-sm ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500' 
                : 'bg-gray-100 border-gray-300 text-gray-800 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="xml">XML</option>
            <option value="yaml">YAML</option>
          </select>
        </div>
        
        {/* Conversion preview */}
        <div className={`text-center p-3 rounded-lg border-2 border-dashed ${
          darkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300 bg-gray-50'
        }`}>
          <div className={`text-sm font-mono flex items-center justify-center space-x-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <span className="text-blue-500 font-semibold">{fromFormat.toUpperCase()}</span>
            <ArrowRight size={16} className="text-gray-500" />
            <span className="text-green-500 font-semibold">{toFormat.toUpperCase()}</span>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className={`text-xs p-2 rounded ${
          darkMode ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-50 text-indigo-600'
        }`}>
          <div className="flex items-center space-x-2">
            <FileCode size={12} />
            <span>Ready to convert data format</span>
          </div>
        </div>
      </div>
    </BaseNode>
  );
};
