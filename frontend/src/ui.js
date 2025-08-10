
import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  MiniMap,
  MarkerType
} from 'reactflow';
import { useStore } from './store';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import CalculatorNode from './nodes/calculatorNode';
import { TimerNode } from './nodes/timerNode';
import { FilterNode } from './nodes/filterNode';
import { DataFormatNode } from './nodes/dataFormatNode';
import { NotificationNode } from './nodes/notificationNode';
import { ZoomIn, ZoomOut, Maximize, RotateCcw, ChevronRight, ChevronLeft, Play, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import 'reactflow/dist/style.css';

// Toast notification component
const Toast = ({ message, onClose, darkMode }) => (
  <div className={`fixed top-6 right-6 z-[9999] max-w-sm w-full shadow-lg rounded-lg p-4 border transition-all duration-300
    ${darkMode ? 'bg-gray-900 border-green-700 text-green-200' : 'bg-white border-green-400 text-green-800'}`}
    style={{ pointerEvents: 'auto' }}
  >
    <div className="flex items-start justify-between">
      <div className="pr-4 whitespace-pre-line text-sm">
        {message}
      </div>
      <button onClick={onClose} className="ml-2 text-lg font-bold focus:outline-none">×</button>
    </div>
  </div>
);

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
  // Toast notification state
  const [toast, setToast] = useState({ visible: false, message: '' });
  const showToast = (msg) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: '' }), 6000);
  };
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [showResultsPanel, setShowResultsPanel] = useState(false);
  const [executionResults, setExecutionResults] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  
  // Use individual selectors to avoid re-renders
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const getNodeID = useStore((state) => state.getNodeID);
  const addNode = useStore((state) => state.addNode);
  const onNodesChange = useStore((state) => state.onNodesChange);
  const onEdgesChange = useStore((state) => state.onEdgesChange);
  const onConnect = useStore((state) => state.onConnect);

  // Auto-open results panel only the first time an input/output node appears
  const [autoOpenedPanel, setAutoOpenedPanel] = useState(false);
  useEffect(() => {
    const hasInputOutput = nodes.some(node => 
      node.type === 'customInput' || node.type === 'customOutput'
    );
    if (hasInputOutput && !autoOpenedPanel) {
      setShowResultsPanel(true);
      setAutoOpenedPanel(true);
    }
    // User can always toggle the panel manually
  }, [nodes, autoOpenedPanel]);

  const executePipeline = async () => {
    setIsExecuting(true);
    setShowResultsPanel(true);
    setExecutionResults(null);

    try {
      const response = await fetch('http://localhost:8001/pipelines/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodes: nodes,
          edges: edges
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setExecutionResults(result);
    } catch (error) {
      console.error('Error executing pipeline:', error);
      setExecutionResults({
        error: true,
        message: error.message,
        status: 'error'
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const getInitNodeData = (nodeID, type) => {
    return (
      <div className={`relative w-full h-full ${darkMode ? 'dark' : ''}`}> 
        {/* Toast notification */}
        {toast.visible && (
          <Toast message={toast.message} onClose={() => setToast({ visible: false, message: '' })} darkMode={darkMode} />
        )}
        {/* ...existing code... */}
      </div>
    );
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

  const ResultsPanel = () => (
    <div className={`fixed top-16 right-0 bottom-0 transition-transform duration-300 z-50 ${
      showResultsPanel ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className={`w-96 h-full ${
        darkMode ? 'bg-gray-900 border-l border-gray-700' : 'bg-white border-l border-gray-200'
      } shadow-2xl flex flex-col`}>
        {/* Header */}
        <div className={`p-4 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Pipeline Results
            </h3>
            <button
              onClick={() => setShowResultsPanel(!showResultsPanel)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
              title="Toggle Results Panel"
            >
              {showResultsPanel ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Input/Output Nodes Preview */}
          {nodes.length > 0 && (
            <div className="mb-6">
              <h4 className={`font-medium mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Pipeline Preview
              </h4>
              
              {/* Input Nodes */}
              {nodes.filter(node => node.type === 'customInput').length > 0 && (
                <div className={`mb-4 p-3 rounded-lg ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                }`}>
                  <h5 className={`text-sm font-medium mb-2 text-blue-500`}>
                    Input Nodes ({nodes.filter(node => node.type === 'customInput').length})
                  </h5>
                  {nodes.filter(node => node.type === 'customInput').map(node => (
                    <div key={node.id} className={`mb-2 last:mb-0 p-2 rounded ${
                      darkMode ? 'bg-gray-900' : 'bg-white'
                    }`}>
                      <div className={`text-sm font-medium ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {node.data?.inputName || 'Input'} ({node.data?.inputType || 'Text'})
                      </div>
                      <div className={`text-xs mt-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Value: {node.data?.inputValue || 'No value set'}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Output Nodes */}
              {nodes.filter(node => node.type === 'customOutput').length > 0 && (
                <div className={`p-3 rounded-lg ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                }`}>
                  <h5 className={`text-sm font-medium mb-2 text-green-500`}>
                    Output Nodes ({nodes.filter(node => node.type === 'customOutput').length})
                  </h5>
                  {nodes.filter(node => node.type === 'customOutput').map(node => (
                    <div key={node.id} className={`mb-2 last:mb-0 p-2 rounded ${
                      darkMode ? 'bg-gray-900' : 'bg-white'
                    }`}>
                      <div className={`text-sm font-medium ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {node.data?.outputName || 'Output'} ({node.data?.outputFormat || node.data?.exportFormat || 'JSON'})
                      </div>
                      <div className={`text-xs mt-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {executionResults ? 'See execution results below' : 'Will show result after execution'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {isExecuting ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <Clock className={`w-8 h-8 mx-auto mb-2 animate-spin ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <p className={`text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Executing pipeline...
                </p>
              </div>
            </div>
          ) : executionResults ? (
            <div className="space-y-4">
              {/* Status Header */}
              <div className={`p-3 rounded-lg ${
                executionResults.error 
                  ? darkMode ? 'bg-red-900/30 border border-red-800' : 'bg-red-50 border border-red-200'
                  : executionResults.is_dag === false
                  ? darkMode ? 'bg-yellow-900/30 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200'
                  : darkMode ? 'bg-green-900/30 border border-green-800' : 'bg-green-50 border border-green-200'
              }`}>
                <div className="flex items-center space-x-2">
                  {executionResults.error ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : executionResults.is_dag === false ? (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  <span className={`font-medium ${
                    executionResults.error 
                      ? 'text-red-600'
                      : executionResults.is_dag === false
                      ? 'text-yellow-600'
                      : 'text-green-600'
                  }`}>
                    {executionResults.error 
                      ? 'Execution Error' 
                      : executionResults.is_dag === false
                      ? 'Invalid DAG'
                      : 'Execution Complete'
                    }
                  </span>
                </div>
              </div>

              {/* Pipeline Stats */}
              {!executionResults.error && (
                <div className={`p-3 rounded-lg ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                }`}>
                  <h4 className={`font-medium mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Pipeline Statistics
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className={`flex justify-between ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <span>Nodes:</span>
                      <span>{executionResults.num_nodes}</span>
                    </div>
                    <div className={`flex justify-between ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <span>Edges:</span>
                      <span>{executionResults.num_edges}</span>
                    </div>
                    <div className={`flex justify-between ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <span>Valid DAG:</span>
                      <span>{executionResults.is_dag ? '✅ Yes' : '❌ No'}</span>
                    </div>
                    <div className={`flex justify-between ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <span>Total Time:</span>
                      <span>{executionResults.total_execution_time?.toFixed(2)}s</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Node Results */}
              {executionResults.execution_results && executionResults.execution_results.length > 0 && (
                <div className="space-y-3">
                  <h4 className={`font-medium ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Execution Results
                  </h4>
                  
                  {/* Input/Output Results First */}
                  {executionResults.execution_results
                    .filter(nodeResult => 
                      nodeResult.node_type === 'customInput' || 
                      nodeResult.node_type === 'customOutput' ||
                      nodeResult.node_id.toLowerCase().includes('input') ||
                      nodeResult.node_id.toLowerCase().includes('output')
                    )
                    .map((nodeResult, index) => (
                    <div key={`io-${nodeResult.node_id}`} className={`p-3 rounded-lg border-2 ${
                      nodeResult.node_type === 'customInput' || nodeResult.node_id.toLowerCase().includes('input')
                        ? darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'
                        : darkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {nodeResult.status === 'success' ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span className={`text-sm font-semibold ${
                            nodeResult.node_type === 'customInput' || nodeResult.node_id.toLowerCase().includes('input')
                              ? 'text-blue-600'
                              : 'text-green-600'
                          }`}>
                            {nodeResult.node_type === 'customInput' || nodeResult.node_id.toLowerCase().includes('input') ? '📥 INPUT' : '📤 OUTPUT'}
                          </span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          nodeResult.status === 'success'
                            ? darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'
                            : darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'
                        }`}>
                          {nodeResult.execution_time.toFixed(3)}s
                        </span>
                      </div>
                      
                      {/* Output Preview */}
                      {nodeResult.output && (
                        <div className={`mt-2 p-3 rounded text-sm ${
                          darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'
                        } border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                          {typeof nodeResult.output === 'object' ? (
                            <div>
                              {nodeResult.output.type === 'text' && (
                                <div>
                                  <div className="font-medium text-blue-600 mb-1">Text Value:</div>
                                  <div className="font-mono">{nodeResult.output.value}</div>
                                </div>
                              )}
                              {nodeResult.output.type === 'number' && (
                                <div>
                                  <div className="font-medium text-blue-600 mb-1">Number Value:</div>
                                  <div className="font-mono text-lg">{nodeResult.output.value}</div>
                                </div>
                              )}
                              {nodeResult.output.type === 'output' && (
                                <div>
                                  <div className="font-medium text-green-600 mb-1">Final Output ({nodeResult.output.format}):</div>
                                  <pre className="font-mono text-xs whitespace-pre-wrap overflow-x-auto">
                                    {nodeResult.output.data}
                                  </pre>
                                </div>
                              )}
                              {nodeResult.output.type === 'llm_response' && (
                                <div>
                                  <div className="font-medium text-purple-600 mb-1">🤖 AI Response ({nodeResult.output.provider || 'AI'}):</div>
                                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded border-l-4 border-purple-500 mb-2">
                                    <div className="whitespace-pre-wrap text-sm">{nodeResult.output.response}</div>
                                  </div>
                                  {nodeResult.output.note && (
                                    <div className="text-xs text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 p-1 rounded">
                                      ⚠️ {nodeResult.output.note}
                                    </div>
                                  )}
                                  <div className="text-xs text-gray-500 mt-1">
                                    Model: {nodeResult.output.model} | Tokens: {nodeResult.output.input_tokens || 0}→{nodeResult.output.output_tokens || 0}
                                  </div>
                                </div>
                              )}
                              {!['text', 'number', 'output', 'llm_response'].includes(nodeResult.output.type) && (
                                <pre className="whitespace-pre-wrap overflow-hidden">
                                  {JSON.stringify(nodeResult.output, null, 2)}
                                </pre>
                              )}
                            </div>
                          ) : (
                            <span>{String(nodeResult.output)}</span>
                          )}
                        </div>
                      )}
                      
                      {nodeResult.error && (
                        <div className={`mt-2 p-2 rounded text-xs ${
                          darkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-700'
                        }`}>
                          Error: {nodeResult.error}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Other Node Results */}
                  {executionResults.execution_results
                    .filter(nodeResult => 
                      nodeResult.node_type !== 'customInput' && 
                      nodeResult.node_type !== 'customOutput' &&
                      !nodeResult.node_id.toLowerCase().includes('input') &&
                      !nodeResult.node_id.toLowerCase().includes('output')
                    ).length > 0 && (
                    <details className="mt-4">
                      <summary className={`cursor-pointer text-sm font-medium ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      } hover:text-blue-500`}>
                        Show other node results ({executionResults.execution_results
                          .filter(nodeResult => 
                            nodeResult.node_type !== 'customInput' && 
                            nodeResult.node_type !== 'customOutput' &&
                            !nodeResult.node_id.toLowerCase().includes('input') &&
                            !nodeResult.node_id.toLowerCase().includes('output')
                          ).length})
                      </summary>
                      <div className="mt-3 space-y-2">
                        {executionResults.execution_results
                          .filter(nodeResult => 
                            nodeResult.node_type !== 'customInput' && 
                            nodeResult.node_type !== 'customOutput' &&
                            !nodeResult.node_id.toLowerCase().includes('input') &&
                            !nodeResult.node_id.toLowerCase().includes('output')
                          )
                          .map((nodeResult, index) => (
                          <div key={nodeResult.node_id} className={`p-3 rounded-lg border ${
                            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                          }`}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                {nodeResult.status === 'success' ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-red-500" />
                                )}
                                <span className={`text-sm font-medium ${
                                  darkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {nodeResult.node_type}
                                </span>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded ${
                                nodeResult.status === 'success'
                                  ? darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'
                                  : darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'
                              }`}>
                                {nodeResult.execution_time.toFixed(3)}s
                              </span>
                            </div>
                            
                            {/* Output Preview */}
                            {nodeResult.output && (
                              <div className={`mt-2 p-2 rounded text-xs font-mono ${
                                darkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-700'
                              } border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                {typeof nodeResult.output === 'object' ? (
                                  <pre className="whitespace-pre-wrap overflow-hidden">
                                    {JSON.stringify(nodeResult.output, null, 2).substring(0, 200)}
                                    {JSON.stringify(nodeResult.output, null, 2).length > 200 && '...'}
                                  </pre>
                                ) : (
                                  <span>{String(nodeResult.output).substring(0, 200)}</span>
                                )}
                              </div>
                            )}
                            
                            {nodeResult.error && (
                              <div className={`mt-2 p-2 rounded text-xs ${
                                darkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-700'
                              }`}>
                                Error: {nodeResult.error}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              )}

              {/* Error Message */}
              {executionResults.error && (
                <div className={`p-3 rounded-lg ${
                  darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700'
                }`}>
                  <h4 className="font-medium mb-1">Error Details:</h4>
                  <p className="text-sm">{executionResults.message}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <Play className={`w-8 h-8 mx-auto mb-2 ${
                  darkMode ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Execute a pipeline to see results
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
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
              onClick={executePipeline}
              disabled={isExecuting || nodes.length === 0}
              className={`p-2 rounded-lg shadow-lg transition-all hover:scale-105 ${
                isExecuting || nodes.length === 0
                  ? darkMode 
                    ? 'bg-gray-700 text-gray-500 border border-gray-600 cursor-not-allowed' 
                    : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                  : darkMode 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-500' 
                    : 'bg-blue-500 text-white hover:bg-blue-600 border border-blue-400'
              }`}
              title="Execute Pipeline"
            >
              {isExecuting ? <Clock size={16} className="animate-spin" /> : <Play size={16} />}
            </button>
            <button
              onClick={() => setShowResultsPanel(!showResultsPanel)}
              className={`p-2 rounded-lg shadow-lg transition-all hover:scale-105 ${
                showResultsPanel
                  ? darkMode 
                    ? 'bg-green-600 text-white hover:bg-green-700 border border-green-500' 
                    : 'bg-green-500 text-white hover:bg-green-600 border border-green-400'
                  : darkMode 
                    ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
              title="Toggle Results Panel"
            >
              {showResultsPanel ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
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

      {/* Results Panel */}
      <ResultsPanel />

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