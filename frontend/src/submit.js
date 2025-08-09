import React, { useState } from 'react';
import { Play, Square, Loader2, CheckCircle, AlertCircle, Save, Download } from 'lucide-react';
import { useStore } from './store';
import { useToast } from './toastContext';

export const SubmitButton = ({ darkMode = true }) => {
  const { showToast } = useToast();
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

      await response.json(); // Ignore detailed result for toast
      setStatus('success');
      if (typeof showToast === 'function') {
        showToast('Pipeline executed successfully!');
      }
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Error submitting pipeline:', error);
      setStatus('error');
      if (typeof showToast === 'function') {
        showToast('Pipeline execution failed.');
      } else {
        alert(`Error submitting pipeline: ${error.message}\n\nPlease make sure the backend server is running on http://localhost:8001`);
      }
      setTimeout(() => setStatus('idle'), 3000);
    } finally {
      setIsRunning(false);
    }
  };

  // Removed displayExecutionResults, only show simple toast now

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