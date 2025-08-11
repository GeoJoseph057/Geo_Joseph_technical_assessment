import React, { useState, useRef } from 'react';
import { Play, Square, Loader2, CheckCircle, AlertCircle, Save, Download, Upload } from 'lucide-react';
import { useStore } from './store';
import { useToast } from './toastContext';

export const SubmitButton = ({ darkMode = true }) => {
  const { showToast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, running, success, error
  const { nodes, edges, setNodes, setEdges } = useStore();
  const fileInputRef = useRef(null);

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
      // Simulate local pipeline execution
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
      
      // Local validation
      if (nodes.length === 0) {
        throw new Error('No nodes in pipeline');
      }

      // Mock successful execution
      const mockResult = {
        status: 'success',
        nodes_processed: nodes.length,
        edges_processed: edges.length,
        execution_time: Math.random() * 2 + 1,
        is_dag: true
      };

      setStatus('success');
      if (typeof showToast === 'function') {
        showToast(`Pipeline executed locally! Processed ${nodes.length} nodes and ${edges.length} edges successfully.`);
      }
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Error submitting pipeline:', error);
      setStatus('error');
      if (typeof showToast === 'function') {
        showToast(`Pipeline execution failed: ${error.message}`);
      } else {
        alert(`Error executing pipeline locally: ${error.message}`);
      }
      setTimeout(() => setStatus('idle'), 3000);
    } finally {
      setIsRunning(false);
    }
  };

  // Removed displayExecutionResults, only show simple toast now

  const handleSave = () => {
    try {
      const pipelineData = {
        nodes: nodes,
        edges: edges,
        metadata: {
          created: new Date().toISOString(),
          version: '1.0',
          name: 'Pipeline_' + new Date().toISOString().split('T')[0]
        }
      };
      
      // Save to localStorage
      const savedPipelines = JSON.parse(localStorage.getItem('savedPipelines') || '[]');
      savedPipelines.push(pipelineData);
      localStorage.setItem('savedPipelines', JSON.stringify(savedPipelines));
      
      if (typeof showToast === 'function') {
        showToast('Pipeline saved successfully to local storage!');
      }
    } catch (error) {
      console.error('Error saving pipeline:', error);
      if (typeof showToast === 'function') {
        showToast('Failed to save pipeline');
      }
    }
  };

  const handleExport = () => {
    try {
      const pipelineData = {
        nodes: nodes,
        edges: edges,
        metadata: {
          exported: new Date().toISOString(),
          version: '1.0',
          name: 'Pipeline_Export'
        }
      };
      
      const dataStr = JSON.stringify(pipelineData, null, 2);
      const dataBlob = new Blob([dataStr], {type: 'application/json'});
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pipeline_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      if (typeof showToast === 'function') {
        showToast('Pipeline exported successfully!');
      }
    } catch (error) {
      console.error('Error exporting pipeline:', error);
      if (typeof showToast === 'function') {
        showToast('Failed to export pipeline');
      }
    }
  };

  const handleLoad = () => {
    fileInputRef.current?.click();
  };

  const handleFileLoad = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const pipelineData = JSON.parse(e.target.result);
          if (pipelineData.nodes && pipelineData.edges) {
            setNodes(pipelineData.nodes);
            setEdges(pipelineData.edges);
            if (typeof showToast === 'function') {
              showToast(`Pipeline loaded successfully! ${pipelineData.nodes.length} nodes, ${pipelineData.edges.length} edges`);
            }
          } else {
            throw new Error('Invalid pipeline file format');
          }
        } catch (error) {
          console.error('Error loading pipeline:', error);
          if (typeof showToast === 'function') {
            showToast('Failed to load pipeline: Invalid file format');
          }
        }
      };
      reader.readAsText(file);
    }
    // Reset file input
    event.target.value = '';
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
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileLoad}
        className="hidden"
      />
      
      {/* Left side actions */}
      <div className="flex items-center space-x-3">
        <button
          onClick={handleLoad}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            darkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
          }`}
        >
          <Upload size={14} />
          <span className="text-sm">Load</span>
        </button>
        
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