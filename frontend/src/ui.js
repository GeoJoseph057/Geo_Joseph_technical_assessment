import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, { 
  Controls, 
  Background, 
  MiniMap,
  MarkerType
} from 'reactflow';
import { useStore } from './store';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { CalculatorNode } from './nodes/calculatorNode';
import { TimerNode } from './nodes/timerNode';
import { FilterNode } from './nodes/filterNode';
import { DataFormatNode } from './nodes/dataFormatNode';
import { NotificationNode } from './nodes/notificationNode';
import { ZoomIn, ZoomOut, Maximize, RotateCcw } from 'lucide-react';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  calculator: CalculatorNode,
  timer: TimerNode,
  filter: FilterNode,
  dataFormat: DataFormatNode,
  notification: NotificationNode,
};

const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: true,
  style: { 
    strokeWidth: 2,
    stroke: '#64748b'
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: '#64748b',
  }
};

export const PipelineUI = ({ darkMode = true }) => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  
  // Use individual selectors to avoid re-renders
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const getNodeID = useStore((state) => state.getNodeID);
  const addNode = useStore((state) => state.addNode);
  const onNodesChange = useStore((state) => state.onNodesChange);
  const onEdgesChange = useStore((state) => state.onEdgesChange);
  const onConnect = useStore((state) => state.onConnect);

  const getInitNodeData = (nodeID, type) => {
    return { 
      id: nodeID, 
      nodeType: `${type}`,
      darkMode 
    };
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData('application/reactflow')) {
        const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        const type = appData?.nodeType;

        if (typeof type === 'undefined' || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance, getNodeID, addNode, darkMode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Select all nodes function - only when no nodes are selected
  const selectAllNodes = useCallback(() => {
    if (nodes.length > 0) {
      // Check if any nodes are currently selected
      const hasSelectedNodes = nodes.some(node => node.selected);      
      // Only select all nodes if none are currently selected
      if (!hasSelectedNodes) {
        const selectChanges = nodes.map((node) => ({
          id: node.id,
          type: 'select',
          selected: true,
        }));
        onNodesChange(selectChanges);
      }
    }
  }, [nodes, onNodesChange]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check for Ctrl+A (or Cmd+A on Mac)
      if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
        event.preventDefault();
        selectAllNodes();
      }
    };

    // Add event listener to the document
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectAllNodes]);

  const fitView = () => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.2 });
    }
  };

  const zoomIn = () => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomIn();
    }
  };

  const zoomOut = () => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomOut();
    }
  };
  return (
    <div className="relative w-full h-full">
      <div 
        ref={reactFlowWrapper} 
        className="w-full h-full"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          proOptions={proOptions}
          defaultEdgeOptions={defaultEdgeOptions}
          snapToGrid={true}
          snapGrid={[gridSize, gridSize]}
          connectionLineType="smoothstep"
          connectionLineStyle={{
            strokeWidth: 2,
            stroke: darkMode ? '#64748b' : '#94a3b8',
          }}
          className={darkMode ? 'dark' : ''}
        >
          <Background 
            color={darkMode ? "#374151" : "#e5e7eb"} 
            gap={gridSize}
            size={1}
            variant="dots"
          />
          
          {/* Custom Controls */}
          <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
            <button
              onClick={zoomIn}
              className={`p-2 rounded-lg shadow-lg transition-all hover:scale-105 ${
                darkMode 
                  ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={zoomOut}
              className={`p-2 rounded-lg shadow-lg transition-all hover:scale-105 ${
                darkMode 
                  ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <ZoomOut size={16} />
            </button>
            <button
              onClick={fitView}
              className={`p-2 rounded-lg shadow-lg transition-all hover:scale-105 ${
                darkMode 
                  ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Maximize size={16} />
            </button>
          </div>

          {/* Mini Map */}
          <MiniMap
            nodeColor={darkMode ? '#374151' : '#f3f4f6'}
            maskColor={darkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)'}
            style={{
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
        </ReactFlow>
      </div>

      {/* Empty State */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={`text-center max-w-md ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <div className="mb-4">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <RotateCcw size={24} />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Start Building Your Pipeline</h3>
            <p className="text-sm">
              Drag nodes from the sidebar to create your data processing pipeline.
              Connect them to define the flow of your data.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};