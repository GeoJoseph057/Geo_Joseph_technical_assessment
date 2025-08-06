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
import { ZoomIn, ZoomOut, Maximize, RotateCcw, AlignJustify } from 'lucide-react';

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

  // Select all nodes function
  const selectAllNodes = useCallback(() => {
    if (nodes.length > 0) {
      const selectChanges = nodes.map((node) => ({
        id: node.id,
        type: 'select',
        selected: true,
      }));
      onNodesChange(selectChanges);
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

  const autoAlign = () => {
    if (!reactFlowInstance || nodes.length === 0) return;

    // Enhanced flow-based layout algorithm
    const nodeMap = new Map(nodes.map(node => [node.id, { ...node, level: -1, processed: false }]));
    
    // Analyze node types and connections
    const getNodeType = (nodeId) => {
      const node = nodes.find(n => n.id === nodeId);
      return node?.type || node?.data?.nodeType || 'unknown';
    };

    // Create adjacency lists
    const outgoing = new Map(); // node -> [targets]
    const incoming = new Map(); // node -> [sources]
    
    nodes.forEach(node => {
      outgoing.set(node.id, []);
      incoming.set(node.id, []);
    });

    edges.forEach(edge => {
      outgoing.get(edge.source)?.push(edge.target);
      incoming.get(edge.target)?.push(edge.source);
    });

    // Find different node categories
    const inputNodes = nodes.filter(node => 
      getNodeType(node.id).includes('Input') || 
      getNodeType(node.id) === 'customInput' ||
      incoming.get(node.id)?.length === 0
    );
    
    const outputNodes = nodes.filter(node => 
      getNodeType(node.id).includes('Output') || 
      getNodeType(node.id) === 'customOutput' ||
      outgoing.get(node.id)?.length === 0
    );

    // Topological sort with level assignment
    const levels = new Map();
    const queue = [...inputNodes];
    let maxLevel = 0;

    // Initialize input nodes at level 0
    inputNodes.forEach(node => {
      nodeMap.get(node.id).level = 0;
      nodeMap.get(node.id).processed = true;
      if (!levels.has(0)) levels.set(0, []);
      levels.get(0).push(node);
    });

    // Process remaining nodes
    while (queue.length > 0) {
      const currentNode = queue.shift();
      const currentLevel = nodeMap.get(currentNode.id).level;
      
      // Process all outgoing connections
      outgoing.get(currentNode.id)?.forEach(targetId => {
        const targetNodeData = nodeMap.get(targetId);
        if (!targetNodeData.processed) {
          const newLevel = currentLevel + 1;
          targetNodeData.level = Math.max(targetNodeData.level, newLevel);
          maxLevel = Math.max(maxLevel, newLevel);
          
          // Check if all incoming nodes are processed
          const allIncomingProcessed = incoming.get(targetId)?.every(sourceId => 
            nodeMap.get(sourceId).processed
          );
          
          if (allIncomingProcessed) {
            targetNodeData.processed = true;
            const targetNode = nodes.find(n => n.id === targetId);
            
            if (!levels.has(newLevel)) levels.set(newLevel, []);
            levels.get(newLevel).push(targetNode);
            queue.push(targetNode);
          }
        }
      });
    }

    // Handle unconnected nodes
    nodes.forEach(node => {
      const nodeData = nodeMap.get(node.id);
      if (!nodeData.processed) {
        const level = maxLevel + 1;
        nodeData.level = level;
        nodeData.processed = true;
        if (!levels.has(level)) levels.set(level, []);
        levels.get(level).push(node);
        maxLevel = level;
      }
    });

    // Smart positioning with flow optimization
    const nodeWidth = 200;
    const nodeHeight = 120;
    const horizontalSpacing = 120; // Increased spacing
    const verticalSpacing = 180;   // Increased vertical spacing
    const baseX = 150;
    const baseY = 100;

    const updatedNodes = [];

    // Position nodes level by level
    for (let level = 0; level <= maxLevel; level++) {
      const levelNodes = levels.get(level) || [];
      if (levelNodes.length === 0) continue;

      // Sort nodes within level for better flow
      levelNodes.sort((a, b) => {
        // Prioritize by node type
        const typeOrder = {
          'customInput': 0, 'input': 0,
          'text': 1, 'calculator': 2, 'llm': 3, 'timer': 4,
          'filter': 5, 'dataFormat': 6, 'notification': 7,
          'customOutput': 8, 'output': 8
        };
        
        const aType = getNodeType(a.id);
        const bType = getNodeType(b.id);
        const aOrder = typeOrder[aType] ?? 5;
        const bOrder = typeOrder[bType] ?? 5;
        
        if (aOrder !== bOrder) return aOrder - bOrder;
        
        // Secondary sort by number of connections
        const aConnections = (incoming.get(a.id)?.length || 0) + (outgoing.get(a.id)?.length || 0);
        const bConnections = (incoming.get(b.id)?.length || 0) + (outgoing.get(b.id)?.length || 0);
        return bConnections - aConnections;
      });

      // Calculate positions for this level
      const levelWidth = levelNodes.length * nodeWidth + (levelNodes.length - 1) * horizontalSpacing;
      let startX = baseX;

      // Center the level if it has fewer nodes
      if (levelNodes.length < 4) {
        startX = baseX + (4 * (nodeWidth + horizontalSpacing) - levelWidth) / 2;
      }

      levelNodes.forEach((node, index) => {
        const x = startX + index * (nodeWidth + horizontalSpacing);
        const y = baseY + level * (nodeHeight + verticalSpacing);

        updatedNodes.push({
          id: node.id,
          type: 'position',
          position: { x, y }
        });
      });
    }

    // Apply the changes with animation
    onNodesChange(updatedNodes);

    // Fit view after alignment with delay for smooth transition
    setTimeout(() => {
      if (reactFlowInstance) {
        reactFlowInstance.fitView({ 
          padding: 0.3,
          duration: 800,
          includeHiddenNodes: false
        });
      }
    }, 150);
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
              title="Zoom In"
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
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <button
              onClick={autoAlign}
              className={`p-2 rounded-lg shadow-lg transition-all hover:scale-105 ${
                darkMode 
                  ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
              title="Auto Align Nodes"
              disabled={nodes.length === 0}
            >
              <AlignJustify size={16} />
            </button>
            <button
              onClick={fitView}
              className={`p-2 rounded-lg shadow-lg transition-all hover:scale-105 ${
                darkMode 
                  ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
              title="Fit View"
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