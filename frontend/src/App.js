import React, { useState } from 'react';
import { ToastProvider } from './toastContext';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { Settings, Menu, X, Zap } from 'lucide-react';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <ToastProvider>
      <div className={`min-h-screen transition-colors duration-200 ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        {/* Header */}
        <header className={`h-16 border-b flex items-center justify-between px-6 ${
          darkMode 
            ? 'bg-gray-800 border-gray-700 text-white' 
            : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center space-x-2">
              <img 
                src="/Logo1.png" 
                alt="Pipeline Builder Logo" 
                className="w-12 h-12" 
              />
              <h1 className="text-xl font-bold">Pipeline Builder</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${
              darkMode ? 'bg-green-900/30 text-green-300 border border-green-700' : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Local Mode</span>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              {darkMode ? '🌙' : '☀️'}
            </button>
            <button
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings size={20} />
            </button>
          </div>
        </header>

        <div className="flex h-[calc(100vh-4rem)]">
          {/* Sidebar */}
          <div className={`transition-all duration-300 ${
            sidebarOpen ? 'w-80' : 'w-0'
          } overflow-hidden`}>
            <PipelineToolbar darkMode={darkMode} />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1">
              <PipelineUI darkMode={darkMode} />
            </div>
            <div className={`border-t p-4 ${
              darkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <SubmitButton darkMode={darkMode} />
            </div>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}

export default App;