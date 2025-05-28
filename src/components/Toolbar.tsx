"use client";
import React from 'react';
import { Eye, EyeOff, RotateCcw, Upload, Download } from 'lucide-react';

type ToolbarProps = {
  isPreviewMode: boolean;
  setIsPreviewMode: (value: boolean) => void;
  clearForm: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  importForm: (event: React.ChangeEvent<HTMLInputElement>) => void;
  exportForm: () => void;
};

const Toolbar: React.FC<ToolbarProps> = ({
  isPreviewMode,
  setIsPreviewMode,
  clearForm,
  fileInputRef,
  importForm,
  exportForm,
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Form Builder</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              isPreviewMode
                ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800'
            }`}
          >
            {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{isPreviewMode ? 'Edit Mode' : 'Preview'}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={clearForm}
          className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900 rounded-lg transition-all duration-200"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Clear</span>
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={importForm}
          accept=".json"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
        >
          <Upload className="w-4 h-4" />
          <span>Import</span>
        </button>

        <button
          onClick={exportForm}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900 dark:text-white rounded-lg transition-all duration-200"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
