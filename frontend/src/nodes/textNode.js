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
      '#3b82f6', // blue
      '#10b981', // green
      '#f59e0b', // amber
      '#ef4444', // red
      '#8b5cf6', // violet
      '#ec4899', // pink
      '#06b6d4', // cyan
      '#f97316', // orange
    ];

    return colors[Math.abs(hash) % colors.length];
  }

  return (
    <div style={{
      width: 300,
      position: 'relative',
      backgroundColor: darkMode ? '#0f172a' : '#ffffff',
      border: `1px solid ${darkMode ? '#1e293b' : '#e2e8f0'}`,
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
      borderColor: selected ? '#3b82f6' : undefined
    }}>
      {/* Node Header */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#10b981', // Green color matching the Output node
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Type size={16} style={{ marginRight: '8px', color: '#ffffff' }} />
          <span style={{ 
            fontWeight: 600,
            fontSize: '14px',
            color: '#ffffff'
          }}>Text</span>
        </div>
        {variables.length > 0 && (
          <div style={{
            padding: '1px 4px',
            borderRadius: '4px',
            backgroundColor: darkMode ? '#374151' : '#e2e8f0',
            fontSize: '11px',
            fontWeight: 500,
            color: darkMode ? '#d1d5db' : '#4b5563'
          }}>
            {variables.length}
          </div>
        )}
      </div>

      {/* Node Content */}
      <div style={{ padding: '16px' }}>
        <textarea
          ref={textareaRef}
          style={{
            width: '100%',
            minHeight: '60px',
            padding: '10px 12px',
            borderRadius: '6px',
            resize: 'none',
            backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
            color: darkMode ? '#e5e7eb' : '#0f172a',
            border: `1px solid ${darkMode ? '#334155' : '#cbd5e1'}`,
            outline: 'none',
            fontSize: '14px',
            lineHeight: '1.5',
            overflow: 'hidden', // Hide scrollbar
          }}
          placeholder="Enter text here..."
          value={data.text || ''}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onInput={() => {
            if (textareaRef.current) {
              // Auto-resize logic
              textareaRef.current.style.height = 'auto';
              textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            }
          }}
        />

        {/* Variables Display - Styled like Output */}
        {variables.length > 0 && (
          <div style={{ 
            marginTop: '12px'
          }}>
            <div style={{ 
              marginBottom: '6px', 
              color: darkMode ? '#94a3b8' : '#64748b',
              fontWeight: 500,
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
            }}>
              Variables
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {variables.map(variable => (
                <div key={variable} style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: darkMode ? '#f1f5f9' : '#1e293b',
                  backgroundColor: darkMode ? '#334155' : '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <span style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    backgroundColor: getVariableColor(variable),
                    marginRight: '6px'
                  }}></span>
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
          background: '#10b981', // Green color matching header
          top: '30px',
          width: '10px',
          height: '10px',
          border: `2px solid ${darkMode ? '#0f172a' : '#ffffff'}`
        }}
      />

      {/* Variable Handles */}
      {variables.map((variable, index) => (
        <React.Fragment key={`handle-${variable}`}>
          <Handle
            type="target"
            position={Position.Left}
            id={`${id}-var-${variable}`}
            style={{ 
              top: `${60 + (index * 26)}px`,
              background: getVariableColor(variable),
              border: `2px solid ${darkMode ? '#0f172a' : '#ffffff'}`,
              width: '10px',
              height: '10px'
            }}
          />
          <div 
            style={{
              position: 'absolute',
              left: '20px',
              top: `${56 + (index * 26)}px`,
              fontSize: '11px',
              color: darkMode ? '#cbd5e1' : '#475569',
              pointerEvents: 'none'
            }}
          >
            {variable}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
