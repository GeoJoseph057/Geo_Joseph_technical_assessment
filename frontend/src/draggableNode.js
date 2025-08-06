import React from 'react';
import { Database, Cpu, FileOutput, Type, Calculator, Clock, Filter, Shuffle, Bell } from 'lucide-react';

const iconMap = {
  Database,
  Cpu, 
  FileOutput,
  Type,
  Calculator,
  Clock,
  Filter,
  Shuffle,
  Bell
};

const colorClasses = {
  blue: {
    bg: 'from-blue-500 to-blue-600',
    hover: 'hover:from-blue-600 hover:to-blue-700',
    shadow: 'shadow-blue-500/20'
  },
  purple: {
    bg: 'from-purple-500 to-purple-600',
    hover: 'hover:from-purple-600 hover:to-purple-700', 
    shadow: 'shadow-purple-500/20'
  },
  orange: {
    bg: 'from-orange-500 to-orange-600',
    hover: 'hover:from-orange-600 hover:to-orange-700',
    shadow: 'shadow-orange-500/20'
  },
  green: {
    bg: 'from-green-500 to-green-600',
    hover: 'hover:from-green-600 hover:to-green-700',
    shadow: 'shadow-green-500/20'
  }
};

export const DraggableNode = ({ type, label, icon, color = 'blue', darkMode = true }) => {
  const Icon = iconMap[icon] || Cpu;
  const colors = colorClasses[color];

  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragEnd = (event) => {
    event.target.style.cursor = 'grab';
  };

  return (
    <div
      className={`
        group cursor-grab active:cursor-grabbing
        flex items-center space-x-3 p-3 rounded-lg
        bg-gradient-to-r ${colors.bg}
        ${colors.hover}
        shadow-lg ${colors.shadow}
        transform transition-all duration-200
        hover:scale-105 hover:shadow-xl
        active:scale-95
        border border-white/10
      `}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={onDragEnd}
      draggable
    >
      <div className="flex-shrink-0">
        <Icon size={16} className="text-white" />
      </div>
      <span className="text-white font-medium text-sm truncate">
        {label}
      </span>
      
      {/* Drag indicator */}
      <div className="flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
        <svg width="12" height="8" viewBox="0 0 12 8" className="text-white">
          <circle cx="2" cy="2" r="1" fill="currentColor" />
          <circle cx="6" cy="2" r="1" fill="currentColor" />
          <circle cx="10" cy="2" r="1" fill="currentColor" />
          <circle cx="2" cy="6" r="1" fill="currentColor" />
          <circle cx="6" cy="6" r="1" fill="currentColor" />
          <circle cx="10" cy="6" r="1" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
};