import React, { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { Calculator, Plus, Minus, X, Divide, TrendingUp, BarChart3 } from 'lucide-react';
import { useStore } from '../store';

const CalculatorNode = ({ id, data, selected }) => {
  const [operation, setOperation] = useState(data?.operation || 'add');
  const darkMode = data?.darkMode ?? true;

  const handleOperationChange = (newOp) => {
    setOperation(newOp);
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

  const getOperationIcon = (op) => {
    switch (op) {
      case 'add':
        return <Plus size={14} />;
      case 'subtract':
        return <Minus size={14} />;
      case 'multiply':
        return <X size={14} />;
      case 'divide':
        return <Divide size={14} />;
      default:
        return <Plus size={14} />;
    }
  };

  const getOperationSymbol = (op) => {
    switch (op) {
      case 'add':
        return '+';
      case 'subtract':
        return '−';
      case 'multiply':
        return '×';
      case 'divide':
        return '÷';
      default:
        return '+';
    }
  };

  const operations = [
    { value: 'add', label: 'Add', symbol: '+', color: 'text-green-500' },
    { value: 'subtract', label: 'Subtract', symbol: '−', color: 'text-red-500' },
    { value: 'multiply', label: 'Multiply', symbol: '×', color: 'text-blue-500' },
    { value: 'divide', label: 'Divide', symbol: '÷', color: 'text-purple-500' }
  ];

  const currentOperation = operations.find(op => op.value === operation) || operations[0];

  return (
    <BaseNode 
      title="Calculator" 
      handles={handles} 
      icon={<Calculator size={16} />}
      selected={selected}
      darkMode={darkMode}
    >
      <div className="space-y-3">
        <div>
          <label className={`block text-xs font-medium mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Operation
          </label>
          
          {/* Custom operation selector */}
          <div className="grid grid-cols-2 gap-2">
            {operations.map((op) => (
              <button
                key={op.value}
                onClick={() => setOperation(op.value)}
                className={`flex items-center justify-center space-x-1 p-2 rounded-lg border transition-all ${
                  operation === op.value
                    ? darkMode
                      ? `bg-opacity-20 border-2 ${op.color.replace('text-', 'bg-').replace('-500', '-900')} ${op.color.replace('-500', '-400')} border-current`
                      : `bg-opacity-20 border-2 ${op.color.replace('text-', 'bg-').replace('-500', '-100')} ${op.color} border-current`
                    : darkMode
                      ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className={`text-lg font-bold ${operation === op.value ? op.color : ''}`}>
                  {op.symbol}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Operation preview */}
        <div className={`text-center p-3 rounded-lg border-2 border-dashed ${
          darkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300 bg-gray-50'
        }`}>
          <div className={`text-sm font-mono ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <span className="text-blue-500">Input A</span>
            <span className={`mx-2 font-bold ${currentOperation.color}`}>
              {currentOperation.symbol}
            </span>
            <span className="text-blue-500">Input B</span>
            <span className="mx-2">=</span>
            <span className="text-green-500">Result</span>
          </div>
        </div>

        {/* Status */}
        <div className={`text-xs p-2 rounded ${
          darkMode ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-50 text-indigo-600'
        }`}>
          <div className="flex items-center space-x-2">
            <Calculator size={12} />
            <span>Ready to calculate: {currentOperation.label}</span>
          </div>
        </div>
      </div>
    </BaseNode>
  );
};

export default CalculatorNode;
