// textNode.js
import React, { useState, useEffect, useRef } from 'react';
import { Position } from 'reactflow';
import { Type } from 'lucide-react';
import { useStore } from '../store';
import { BaseNode } from './BaseNode';

export const TextNode = ({ id, data, selected }) => {
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
    // Auto-resize textarea based on content
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Handle keyboard events to ensure all standard shortcuts work
  const onKeyDown = (e) => {
    // Allow all standard keyboard shortcuts to work
    if (e.ctrlKey || e.metaKey) {
      // Don't prevent default for Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, etc.
      return;
    }
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

  const handles = [
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-output`,
    },
    ...variables.map((variable, index) => ({
      type: 'target',
      position: Position.Left,
      id: `${id}-var-${variable}`,
      style: { top: `${60 + (index * 26)}px` },
    })),
  ];

  return (
    <BaseNode
      title="Text"
      icon={<Type size={16} />}
      handles={handles}
      selected={selected}
      darkMode={darkMode}
    >
      <textarea
        ref={textareaRef}
        value={data.text || ''}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="Enter text here..."
        className={`w-full p-2 rounded-lg border text-sm resize-none overflow-hidden ${
          darkMode
            ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-purple-500'
            : 'bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-purple-500'
        } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
        style={{ minHeight: '60px' }}
      />
      {/* Variables Display */}
      {variables.length > 0 && (
        <div className="space-y-2">
          <div className={`text-xs font-medium ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Variables ({variables.length})
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
    </BaseNode>
  );
}