// BaseNode.js
import React from 'react';
import { Handle, Position } from 'reactflow';

/**
 * BaseNode component - provides a consistent structure for all node types
 * @param {Object} props
 * @param {string} props.title - The title to display in the node header
 * @param {React.ReactNode} props.children - The content to display in the node body
 * @param {Array} props.handles - Array of handle objects with type, position, id, and optional style
 */
export const BaseNode = ({ title, children, handles = [] }) => {
  return (
    <div style={{
      width: 200,
      minHeight: 80,
      border: '1px solid #ddd',
      borderRadius: '8px',
      background: 'white',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{
        padding: '8px 12px',
        fontWeight: 'bold',
        borderBottom: '1px solid #ddd',
        background: '#f7f7f7',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        fontSize: '14px'
      }}>
        {title}
      </div>
      
      {/* Content */}
      <div style={{ 
        padding: '12px',
        fontSize: '12px'
      }}>
        {children}
      </div>
      
      {/* Handles */}
      {handles.map((handle, index) => (
        <Handle
          key={handle.id || `handle-${index}`}
          type={handle.type}
          position={handle.position}
          id={handle.id}
          style={{ 
            width: '10px',
            height: '10px',
            backgroundColor: handle.type === 'source' ? '#4CAF50' : '#2196F3',
            border: '1px solid white',
            ...handle.style 
          }}
        />
      ))}
    </div>
  );
};
