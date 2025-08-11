import React from 'react';
import { Handle } from 'reactflow';

const nodeTypeColors = {
  Input: { 
    bg: 'from-blue-500 to-blue-600',
    border: 'border-blue-400',
    icon: 'text-blue-100'
  },
  LLM: { 
    bg: 'from-orange-500 to-orange-600',
    border: 'border-orange-400',
    icon: 'text-orange-100'
  },
  Output: { 
    bg: 'from-green-500 to-green-600',
    border: 'border-green-400',
    icon: 'text-green-100'
  },
  Text: { 
    bg: 'from-purple-500 to-purple-600',
    border: 'border-purple-400',
    icon: 'text-purple-100'
  },
  Calculator: { 
    bg: 'from-indigo-500 to-indigo-600',
    border: 'border-indigo-400',
    icon: 'text-indigo-100'
  },
  Timer: { 
    bg: 'from-pink-500 to-pink-600',
    border: 'border-pink-400',
    icon: 'text-pink-100'
  },
  Filter: { 
    bg: 'from-teal-500 to-teal-600',
    border: 'border-teal-400',
    icon: 'text-teal-100'
  },
  'Data Format': { 
    bg: 'from-cyan-500 to-cyan-600',
    border: 'border-cyan-400',
    icon: 'text-cyan-100'
  },
  Notification: { 
    bg: 'from-red-500 to-red-600',
    border: 'border-red-400',
    icon: 'text-red-100'
  }
};

/**
 * BaseNode component - provides a consistent modern structure for all node types
 */
export const BaseNode = ({ 
  title, 
  children, 
  handles = [], 
  icon = null,
  selected = false,
  darkMode = true 
}) => {
  const colors = nodeTypeColors[title] || nodeTypeColors.Input;

  return (
    <div className={`
      relative group
      min-w-[220px] min-h-[100px]
      rounded-xl shadow-lg
      transition-all duration-200
      ${selected 
        ? 'ring-2 ring-blue-400 ring-opacity-75 shadow-xl' 
        : 'hover:shadow-xl'
      }
      ${darkMode 
        ? 'bg-gray-800 border border-gray-600' 
        : 'bg-white border border-gray-200'
      }
      hover:scale-[1.02]
    `}>
      {/* Header */}
      <div className={`
        px-4 py-3 rounded-t-xl
        bg-gradient-to-r ${colors.bg}
        border-b ${colors.border}
      `}>
        <div className="flex items-center space-x-2">
          {icon && (
            <div className={`flex-shrink-0 ${colors.icon}`}>
              {icon}
            </div>
          )}
          <h3 className="font-semibold text-sm text-white truncate">
            {title}
          </h3>
        </div>
      </div>
      
      {/* Content */}
      <div className={`
        p-4 space-y-3
        ${darkMode ? 'text-gray-200' : 'text-gray-800'}
      `}>
        {children}
      </div>
      
      {/* Handles */}
      {handles.map((handle, index) => {
        const handleStyle = {
          width: '12px',
          height: '12px',
          border: '2px solid white',
          borderRadius: '50%',
          backgroundColor: handle.type === 'source' ? '#10B981' : '#3B82F6',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'all 0.2s ease',
          ...handle.style
        };

        return (
          <Handle
            key={handle.id || `handle-${index}`}
            type={handle.type}
            position={handle.position}
            id={handle.id}
            style={handleStyle}
            className="hover:scale-125 hover:shadow-lg"
          />
        );
      })}

      {/* Connection indicator dots */}
      <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};