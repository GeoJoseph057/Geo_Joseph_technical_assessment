import React, { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { FileOutput, Image, FileText, Download } from 'lucide-react';

export const OutputNode = ({ id, data, selected }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');
  const [format, setFormat] = useState(data?.format || 'json');
  const darkMode = data?.darkMode ?? true;

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e) => {
    setOutputType(e.target.value);
  };

  const handleFormatChange = (e) => {
    setFormat(e.target.value);
  };

  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-value`,
    },
  ];

  const getTypeIcon = () => {
    switch (outputType) {
      case 'Image':
        return <Image size={16} />;
      case 'File':
        return <FileText size={16} />;
      default:
        return <FileOutput size={16} />;
    }
  };

  const getFormatOptions = () => {
    if (outputType === 'Image') {
      return ['png', 'jpg', 'svg', 'pdf'];
    } else if (outputType === 'File') {
      return ['json', 'csv', 'xml', 'txt'];
    }
    return ['json', 'text', 'html'];
  };

  return (
    <BaseNode 
      title="Output" 
      handles={handles} 
      icon={<FileOutput size={16} />}
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
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-400' 
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500'
            } focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-20`}
            placeholder="Enter output name"
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
              value={outputType} 
              onChange={handleTypeChange}
              className={`w-full px-3 py-2 text-sm rounded-lg border transition-colors appearance-none ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-green-400' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-green-500'
              } focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-20`}
            >
              <option value="Text">Text</option>
              <option value="File">File</option>
              <option value="Image">Image</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              {getTypeIcon()}
            </div>
          </div>
        </div>

        <div>
          <label className={`block text-xs font-medium mb-1 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Format
          </label>
          <select 
            value={format} 
            onChange={handleFormatChange}
            className={`w-full px-2 py-1.5 text-sm rounded border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}
          >
            {getFormatOptions().map(opt => (
              <option key={opt} value={opt}>{opt.toUpperCase()}</option>
            ))}
          </select>
        </div>

        {/* Export preview */}
        <div className={`text-xs p-2 rounded border-l-2 border-green-400 ${
          darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-green-50 text-gray-600'
        }`}>
          <div className="flex items-center justify-between">
            <span>
              <span className="font-medium">Export:</span> {currName}.{format}
            </span>
            <Download size={12} />
          </div>
        </div>
      </div>
    </BaseNode>
  );
};