// textNode.js
import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { Type } from 'lucide-react';
import { useStore } from '../store';

export const TextNode = ({ id, data, selected }) => {
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef(null);
  const darkMode = data?.darkMode ?? true;
  const [variables, setVariables] = useState([]);
  
  // Import the store to update the node
  const updateNodeField = useStore((state) => state.updateNodeField);

  // Extract variables from text using regex
  useEffect(() => {
    if (!data.text) return;
    
    const variableRegex = /\{\{\s*([a-zA-Z][a-zA-Z0-9_]*)\s*\}\}/g;
    const matches = [...data.text.matchAll(variableRegex)];
    const extractedVars = matches.map(match => match[1]);
    
    // Filter out duplicates
    const uniqueVars = [...new Set(extractedVars)];
    setVariables(uniqueVars);
  }, [data.text]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      
      // Set the height to scrollHeight to fit all content
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [data.text]);

  const onChange = (e) => {
    const newValue = e.target.value;
    // Update the node data in the store
    updateNodeField(id, 'text', newValue);
  };

  // Function to get variable colors
  function getVariableColor(varName) {
    // Simple hash function to generate consistent colors
    const hash = [...varName].reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500',
      'bg-purple-500', 'bg-pink-500', 'bg-cyan-500', 'bg-orange-500'
    ];

    return colors[Math.abs(hash) % colors.length];
  }

  return (
    <div className={`
      w-72 rounded-lg shadow-lg border transition-all relative
      ${selected ? 'ring-2 ring-green-500' : ''}
      ${darkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
      }
    `}>
      {/* Node Header */}
      <div className="bg-green-500 text-white p-3 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Type size={16} />
          <span className="font-semibold text-sm">Text</span>
        </div>
        {variables.length > 0 && (
          <span className="bg-green-600 px-2 py-1 rounded text-xs font-medium">
            {variables.length}
          </span>
        )}
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <textarea
            ref={textareaRef}
            value={data.text || ''}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onInput={() => {
              if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
              }
            }}
            placeholder="Enter text here..."
            className={`w-full p-2 rounded-lg border text-sm resize-none overflow-hidden ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-green-500' 
                : 'bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-green-500'
            } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
            style={{ minHeight: '60px' }}
          />
        </div>

        {/* Variables Display */}
        {variables.length > 0 && (
          <div className="space-y-2">
            <div className={`text-xs font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Variables
            </div>
            <div className="flex flex-wrap gap-2">
              {variables.map(variable => (
                <div 
                  key={variable}
                  className={`px-2 py-1 rounded text-xs font-medium text-white ${getVariableColor(variable)}`}
                >
                  {variable}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{
          width: '12px',
          height: '12px',
          background: '#10b981',
          border: '2px solid #ffffff'
        }}
      />

      {/* Variable Handles */}
      {variables.map((variable, index) => {
        const colorMap = {
          'bg-blue-500': '#3b82f6',
          'bg-green-500': '#10b981',
          'bg-yellow-500': '#eab308',
          'bg-red-500': '#ef4444',
          'bg-purple-500': '#8b5cf6',
          'bg-pink-500': '#ec4899',
          'bg-cyan-500': '#06b6d4',
          'bg-orange-500': '#f97316'
        };
        
        return (
          <React.Fragment key={`handle-${variable}`}>
            <Handle
              type="target"
              position={Position.Left}
              id={`${id}-var-${variable}`}
              style={{
                width: '12px',
                height: '12px',
                background: colorMap[getVariableColor(variable)] || '#3b82f6',
                border: '2px solid #ffffff',
                top: `${60 + (index * 26)}px`
              }}
            />
            <div 
              className={`absolute left-5 text-xs pointer-events-none ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
              style={{ top: `${56 + (index * 26)}px` }}
            >
              {variable}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
