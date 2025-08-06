// calculatorNode.js
import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const CalculatorNode = ({ id, data }) => {
  const [operation, setOperation] = useState(data?.operation || 'add');

  const handleOperationChange = (e) => {
    setOperation(e.target.value);
  };

  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-input1`,
      style: { top: '30%' },
    },
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-input2`,
      style: { top: '70%' },
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-result`,
    },
  ];

  return (
    <BaseNode title="Calculator" handles={handles}>
      <label>
        Operation:
        <select value={operation} onChange={handleOperationChange}>
          <option value="add">Add (+)</option>
          <option value="subtract">Subtract (-)</option>
          <option value="multiply">Multiply (×)</option>
          <option value="divide">Divide (÷)</option>
        </select>
      </label>
    </BaseNode>
  );
};
