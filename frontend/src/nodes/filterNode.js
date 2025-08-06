// filterNode.js
import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { Filter } from 'lucide-react';

export const FilterNode = ({ id, data, selected }) => {
  const [filterType, setFilterType] = useState(data?.filterType || 'contains');
  const [filterValue, setFilterValue] = useState(data?.filterValue || '');
  const darkMode = data?.darkMode ?? true;

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleFilterValueChange = (e) => {
    setFilterValue(e.target.value);
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
      id: `${id}-passed`,
      style: { top: '30%' },
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-failed`,
      style: { top: '70%' },
    },
  ];

  return (
    <BaseNode 
      title="Filter" 
      handles={handles}
      icon={<Filter size={16} />}
      selected={selected}
      darkMode={darkMode}
    >
      <div className="space-y-3">
        <div>
          <label className={`block text-xs font-medium mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Filter Type
          </label>
          <select 
            value={filterType} 
            onChange={handleFilterTypeChange}
            className={`w-full p-2 rounded-lg border text-sm ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500' 
                : 'bg-gray-100 border-gray-300 text-gray-800 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          >
            <option value="contains">Contains</option>
            <option value="equals">Equals</option>
            <option value="starts_with">Starts With</option>
            <option value="ends_with">Ends With</option>
          </select>
        </div>
        
        <div>
          <label className={`block text-xs font-medium mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Filter Value
          </label>
          <input 
            type="text" 
            value={filterValue} 
            onChange={handleFilterValueChange}
            placeholder="Filter criteria"
            className={`w-full p-2 rounded-lg border text-sm ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-blue-500' 
                : 'bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          />
        </div>
        
        {/* Status indicator */}
        <div className={`text-xs p-2 rounded ${
          darkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-50 text-purple-600'
        }`}>
          <div className="flex items-center space-x-2">
            <Filter size={12} />
            <span>Filter: {filterType} "{filterValue || '...'}"</span>
          </div>
        </div>
      </div>
    </BaseNode>
  );
};
