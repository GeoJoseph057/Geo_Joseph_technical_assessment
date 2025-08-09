import React, { useState } from 'react';
import { Play, Square, Loader2, CheckCircle, AlertCircle, Save, Download } from 'lucide-react';
import { useStore } from './store';

export const SubmitButton = ({ darkMode = true }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, running, success, error
  const { nodes, edges } = useStore();

  const handleSubmit = async () => {
    if (isRunning) {
      // Stop execution
      setIsRunning(false);
      setStatus('idle');
      return;
    }

    // Start execution
    setIsRunning(true);
    setStatus('running');

    try {
      // Send nodes and edges to backend
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
      // Show success status
      setStatus('success');
      // Display comprehensive results
      displayExecutionResults(result);
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Error submitting pipeline:', error);
      setStatus('error');
      // Show error alert
      alert(`Error submitting pipeline: ${error.message}\n\nPlease make sure the backend server is running on http://localhost:8001`);
      // Reset status after a delay
      setTimeout(() => setStatus('idle'), 3000);
    } finally {
      setIsRunning(false);
    }
  };

  const displayExecutionResults = (result) => {
    const dagStatus = result.is_dag ? 'Yes ✅' : 'No ❌';
    let message = `🚀 Pipeline Execution Complete!\n\n`;
    message += `📊 Pipeline Statistics:\n`;
    message += `   • Nodes: ${result.num_nodes}\n`;
    message += `   • Edges: ${result.num_edges}\n`;
    message += `   • Valid DAG: ${dagStatus}\n`;
    message += `   • Total Execution Time: ${result.total_execution_time?.toFixed(2)}s\n`;
    message += `   • Status: ${result.status}\n\n`;
    if (result.execution_results && result.execution_results.length > 0) {
      message += `🔄 Node Execution Results:\n`;
      result.execution_results.forEach((nodeResult, index) => {
        const statusIcon = nodeResult.status === 'success' ? '✅' : '❌';
        message += `\n${index + 1}. ${nodeResult.node_type} (${nodeResult.node_id}):\n`;
        message += `   Status: ${nodeResult.status} ${statusIcon}\n`;
        message += `   Time: ${nodeResult.execution_time.toFixed(3)}s\n`;
        if (nodeResult.status === 'success' && nodeResult.output) {
          // Show key output information
          if (nodeResult.output.type) {
            message += `   Output Type: ${nodeResult.output.type}\n`;
          }
          if (nodeResult.output.response) {
            // LLM response - show truncated
            const response = nodeResult.output.response.length > 100
              ? nodeResult.output.response.substring(0, 100) + '...'
              : nodeResult.output.response;
            message += `   Response: "${response}"\n`;
          } else if (nodeResult.output.processed) {
            // Text processing result
            message += `   Processed Text: "${nodeResult.output.processed}"\n`;
          } else if (nodeResult.output.data) {
            // Output node result
            message += `   Format: ${nodeResult.output.format}\n`;
            message += `   Size: ${nodeResult.output.size} characters\n`;
          } else if (nodeResult.output.value) {
            // Input node result
            message += `   Value: "${nodeResult.output.value}"\n`;
          }
        } else if (nodeResult.error) {
          message += `   Error: ${nodeResult.error}\n`;
        }
      });
      // Show final output if available
      const outputNodes = result.execution_results.filter(r =>
        r.node_type.toLowerCase().includes('output') && r.status === 'success'
      );
      if (outputNodes.length > 0) {
        message += `\n📋 Final Outputs:\n`;
        outputNodes.forEach((outputNode, index) => {
          if (outputNode.output && outputNode.output.data) {
            const preview = outputNode.output.data.length > 200
              ? outputNode.output.data.substring(0, 200) + '...'
              : outputNode.output.data;
            message += `\n${index + 1}. ${outputNode.output.name} (${outputNode.output.format}):\n`;
            message += `${preview}\n`;
          }
        });
      }
    }
    if (!result.is_dag) {
      message += `\n⚠️  Warning: Your pipeline contains cycles and cannot be executed safely.`;
    }
    // Show results in alert (for now - could be replaced with a modal)
    alert(message);
    // Also log to console for debugging
    console.log('Pipeline Execution Results:', result);
  };

  const handleSave = () => {
    console.log('Save pipeline');
  };

  const handleExport = () => {
    console.log('Export pipeline');
  };

  const getButtonContent = () => {
    switch (status) {
      case 'running':
        return (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Running...</span>
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle size={16} />
            <span>Success!</span>
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle size={16} />
            <span>Error</span>
          </>
        );
      default:
        return (
          <>
            {isRunning ? <Square size={16} /> : <Play size={16} />}
            <span>{isRunning ? 'Stop' : 'Run Pipeline'}</span>
          </>
        );
    }
  };

  const getButtonStyles = () => {
    const baseStyles = "flex items-center space-x-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95";
    
    switch (status) {
      case 'running':
        return `${baseStyles} bg-gradient-to-r from-yellow-500 to-orange-500 text-white`;
      case 'success':
        return `${baseStyles} bg-gradient-to-r from-green-500 to-green-600 text-white`;
      case 'error':
        return `${baseStyles} bg-gradient-to-r from-red-500 to-red-600 text-white`;
      default:
        return `${baseStyles} bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white`;
    }
  };

  return (
    <div className="flex items-center justify-between p-4">
      {/* Left side actions */}
      <div className="flex items-center space-x-3">
        <button
          onClick={handleSave}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            darkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
          }`}
        >
          <Save size={14} />
          <span className="text-sm">Save</span>
        </button>
        
        <button
          onClick={handleExport}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            darkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
          }`}
        >
          <Download size={14} />
          <span className="text-sm">Export</span>
        </button>
      </div>

      {/* Main run button */}
      <button
        onClick={handleSubmit}
        disabled={status === 'running'}
        className={getButtonStyles()}
      >
        {getButtonContent()}
      </button>

      {/* Status indicator */}
      <div className="flex items-center space-x-2 min-w-[120px]">
        {status !== 'idle' && (
          <div className={`text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {status === 'running' && 'Executing pipeline...'}
            {status === 'success' && 'Pipeline completed'}
            {status === 'error' && 'Execution failed'}
          </div>
        )}
      </div>
    </div>
  );
};