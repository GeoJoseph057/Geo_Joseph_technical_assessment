import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = useCallback((message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 6000);
  }, []);

  const hideToast = useCallback(() => setToast({ visible: false, message: '' }), []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.visible && (
        <div className="fixed top-6 right-6 z-[9999] max-w-sm w-full shadow-lg rounded-lg p-4 border transition-all duration-300 bg-gray-900 border-green-700 text-green-200" style={{ pointerEvents: 'auto' }}>
          <div className="flex items-start justify-between">
            <div className="pr-4 whitespace-pre-line text-sm">{toast.message}</div>
            <button onClick={hideToast} className="ml-2 text-lg font-bold focus:outline-none">×</button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
