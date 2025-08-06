// dataFormatNode.js
import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const DataFormatNode = ({ id, data }) => {
  const [fromFormat, setFromFormat] = useState(data?.fromFormat || 'json');
  const [toFormat, setToFormat] = useState(data?.toFormat || 'csv');

  const handleFromFormatChange = (e) => {
    setFromFormat(e.target.value);
  };

  const handleToFormatChange = (e) => {
    setToFormat(e.target.value);
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
      id: `${id}-output`,
    },
  ];

  return (
    <BaseNode title="Data Format" handles={handles}>
      <label>
        From:
        <select value={fromFormat} onChange={handleFromFormatChange}>
          <option value="json">JSON</option>
          <option value="csv">CSV</option>
          <option value="xml">XML</option>
          <option value="yaml">YAML</option>
        </select>
      </label>
      <label>
        To:
        <select value={toFormat} onChange={handleToFormatChange}>
          <option value="json">JSON</option>
          <option value="csv">CSV</option>
          <option value="xml">XML</option>
          <option value="yaml">YAML</option>
        </select>
      </label>
      <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
        Convert: {fromFormat.toUpperCase()} → {toFormat.toUpperCase()}
      </div>
    </BaseNode>
  );
};
