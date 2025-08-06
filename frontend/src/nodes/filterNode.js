// filterNode.js
import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const FilterNode = ({ id, data }) => {
  const [filterType, setFilterType] = useState(data?.filterType || 'contains');
  const [filterValue, setFilterValue] = useState(data?.filterValue || '');

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
    <BaseNode title="Filter" handles={handles}>
      <label>
        Type:
        <select value={filterType} onChange={handleFilterTypeChange}>
          <option value="contains">Contains</option>
          <option value="equals">Equals</option>
          <option value="starts_with">Starts With</option>
          <option value="ends_with">Ends With</option>
        </select>
      </label>
      <label>
        Value:
        <input 
          type="text" 
          value={filterValue} 
          onChange={handleFilterValueChange}
          placeholder="Filter criteria"
        />
      </label>
    </BaseNode>
  );
};
