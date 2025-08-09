// outputNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { LogOut, Download } from 'lucide-react';
import { BaseNode } from './BaseNode';

export const OutputNode = ({ id, data, selected }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputFormat, setOutputFormat] = useState(data?.outputFormat || 'json');
  const darkMode = data?.darkMode ?? true;

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  const handleFormatChange = (e) => {
    setOutputFormat(e.target.value);
  };

  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-value`,
    },
  ];

  const formatOptions = [
    { value: 'json', label: 'JSON', extension: '.json', color: 'text-blue-500' },
    { value: 'csv', label: 'CSV', extension: '.csv', color: 'text-green-500' },
    { value: 'xml', label: 'XML', extension: '.xml', color: 'text-orange-500' },
    { value: 'yaml', label: 'YAML', extension: '.yaml', color: 'text-purple-500' },
    { value: 'txt', label: 'Text', extension: '.txt', color: 'text-gray-500' },
  ];

  const currentFormat = formatOptions.find(f => f.value === outputFormat) || formatOptions[0];

  return (
    <BaseNode
      title="Output"
      icon={<LogOut size={16} />}
      handles={handles}
      selected={selected}
      darkMode={darkMode}
    >
      <div>
        <label className={`block text-xs font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Name
        </label>
        <input
          type="text"
          value={currName}
          onChange={handleNameChange}
          className={`w-full p-2 rounded-lg border text-sm ${
            darkMode
              ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-green-500'
              : 'bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-green-500'
          } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
        />
      </div>
      
      <div>
        <label className={`block text-xs font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Export Format
        </label>
        <select
          value={outputFormat}
          onChange={handleFormatChange}
          className={`w-full p-2 rounded-lg border text-sm ${
            darkMode
              ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-green-500'
              : 'bg-gray-100 border-gray-300 text-gray-800 focus:border-green-500'
          } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
        >
          {formatOptions.map(format => (
            <option key={format.value} value={format.value}>
              {format.label}
            </option>
          ))}
        </select>
      </div>

      {/* Export Preview */}
      <div className={`p-3 rounded-lg border-2 border-dashed ${
        darkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300 bg-gray-50'
      }`}>
        <div className="flex items-center space-x-2">
          <Download size={14} className="text-green-500" />
          <div className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Export Preview:
          </div>
        </div>
        <div className="mt-1 flex items-center space-x-2">
          <span className={`text-sm font-mono ${currentFormat.color}`}>
            {currName}{currentFormat.extension}
          </span>
          <span className={`text-xs px-2 py-1 rounded ${
            darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-600'
          }`}>
            {currentFormat.label}
          </span>
        </div>
      </div>

      {/* Format Description */}
      <div className={`text-xs p-2 rounded ${
        darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-600'
      }`}>
        <div className="flex items-center space-x-2">
          <LogOut size={12} />
          <span>Ready to export as {currentFormat.label}</span>
        </div>
      </div>
    </BaseNode>
  );
};
