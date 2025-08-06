// outputNode.js

import { useState } from 'react';
import { Handle, Position } from 'reactflow';

export const OutputNode = ({ id, data, selected }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data.outputType || 'Text');
  const darkMode = data?.darkMode ?? true;

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e) => {
    setOutputType(e.target.value);
  };

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
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-value`}
        style={{ 
          background: '#10b981',
          top: '30px',
          width: '10px',
          height: '10px',
          border: `2px solid ${darkMode ? '#0f172a' : '#ffffff'}`
        }}
      />
      
      {/* Node Header */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#10b981', // Green header
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ 
            fontWeight: 600,
            fontSize: '14px',
            color: '#ffffff'
          }}>Output</span>
        </div>
      </div>
      
      <div style={{ padding: '16px' }}>
        <div style={{ marginBottom: '12px' }}>
          <div style={{
            marginBottom: '6px',
            color: darkMode ? '#94a3b8' : '#64748b',
            fontWeight: 500,
            fontSize: '12px',
          }}>
            Name
          </div>
          <input 
            type="text" 
            value={currName} 
            onChange={handleNameChange}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
              color: darkMode ? '#e5e7eb' : '#0f172a',
              border: `1px solid ${darkMode ? '#334155' : '#cbd5e1'}`,
              outline: 'none',
              fontSize: '14px',
            }}
          />
        </div>
        
        <div style={{ marginBottom: '12px' }}>
          <div style={{
            marginBottom: '6px',
            color: darkMode ? '#94a3b8' : '#64748b',
            fontWeight: 500,
            fontSize: '12px',
          }}>
            Type
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '10px 12px',
            borderRadius: '6px',
            backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
            color: darkMode ? '#e5e7eb' : '#0f172a',
            border: `1px solid ${darkMode ? '#334155' : '#cbd5e1'}`,
            fontSize: '14px',
          }}>
            Text
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 8V5H8V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 16V19H16V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="4" y="8" width="16" height="8" rx="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <div style={{
            marginBottom: '6px',
            color: darkMode ? '#94a3b8' : '#64748b',
            fontWeight: 500,
            fontSize: '12px',
          }}>
            Format
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '10px 12px',
            borderRadius: '6px',
            backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
            color: darkMode ? '#e5e7eb' : '#0f172a',
            border: `1px solid ${darkMode ? '#334155' : '#cbd5e1'}`,
            fontSize: '14px',
          }}>
            JSON
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div style={{
          marginTop: '12px',
          display: 'flex',
          alignItems: 'center',
          padding: '8px',
          borderLeft: '3px solid #10b981',
          backgroundColor: darkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
          borderRadius: '4px',
        }}>
          <div style={{ marginRight: '8px', fontWeight: 500, fontSize: '12px', color: '#10b981' }}>Export:</div>
          <div style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#64748b' }}>output_1.json</div>
          <svg style={{ marginLeft: 'auto' }} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
