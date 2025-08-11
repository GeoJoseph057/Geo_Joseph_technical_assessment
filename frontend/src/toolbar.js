import React, { useState } from 'react';
import { DraggableNode } from './draggableNode';
import { Search, Database, Cpu, FileOutput, Type, Calculator, Clock, Filter, Shuffle, Bell } from 'lucide-react';

const nodeCategories = [
  {
    title: 'Data Sources',
    icon: Database,
    color: 'blue',
    nodes: [
      { type: 'customInput', label: 'Input', icon: Database }
    ]
  },
  {
    title: 'Processing',
    icon: Cpu,
    color: 'purple',
    nodes: [
      { type: 'calculator', label: 'Calculator', icon: Calculator },
      { type: 'filter', label: 'Filter', icon: Filter },
      { type: 'dataFormat', label: 'Data Format', icon: Shuffle },
      { type: 'timer', label: 'Timer', icon: Clock }
    ]
  },
  {
    title: 'AI & ML',
    icon: Cpu,
    color: 'orange',
    nodes: [
      { type: 'llm', label: 'LLM', icon: Cpu }
    ]
  },
  {
    title: 'Output',
    icon: FileOutput,
    color: 'green',
    nodes: [
      { type: 'customOutput', label: 'Output', icon: FileOutput },
      { type: 'text', label: 'Text', icon: Type },
      { type: 'notification', label: 'Notification', icon: Bell }
    ]
  }
];

// Color classes for node styling
// const colorClasses = {
//   blue: 'from-blue-500 to-blue-600',
//   purple: 'from-purple-500 to-purple-600', 
//   orange: 'from-orange-500 to-orange-600',
//   green: 'from-green-500 to-green-600'
// };

export const PipelineToolbar = ({ darkMode = true }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState(new Set(['Data Sources', 'Processing', 'AI & ML', 'Output']));

  const toggleCategory = (categoryTitle) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryTitle)) {
      newExpanded.delete(categoryTitle);
    } else {
      newExpanded.add(categoryTitle);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredCategories = nodeCategories.map(category => ({
    ...category,
    nodes: category.nodes.filter(node => 
      node.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.nodes.length > 0);

  return (
    <div className={`h-full border-r flex flex-col ${
      darkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm transition-colors ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
          />
        </div>
      </div>

      {/* Node Categories */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredCategories.map((category) => {
          const Icon = category.icon;
          const isExpanded = expandedCategories.has(category.title);
          
          return (
            <div key={category.title} className="space-y-2">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.title)}
                className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon size={16} className={`text-${category.color}-500`} />
                  <span className="font-medium text-sm">{category.title}</span>
                </div>
                <svg
                  className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Category Nodes */}
              {isExpanded && (
                <div className="space-y-2 ml-2">
                  {category.nodes.map((node) => (
                    <DraggableNode
                      key={node.type}
                      type={node.type}
                      label={node.label}
                      icon={node.icon}
                      color={category.color}
                      darkMode={darkMode}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className={`p-4 border-t text-xs ${
        darkMode 
          ? 'border-gray-700 text-gray-500' 
          : 'border-gray-200 text-gray-400'
      }`}>
        <p>Drag nodes to canvas to build your pipeline</p>
      </div>
    </div>
  );
};