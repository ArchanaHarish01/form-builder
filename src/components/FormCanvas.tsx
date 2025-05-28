"use client";
import { Copy, FileText, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { FormComponent } from '../types';

type FormCanvasProps = {
  isPreviewMode: boolean;
  formComponents: FormComponent[];
  renderFormComponent: (component: FormComponent, isPreview?: boolean) => React.ReactNode;
  selectedComponent: FormComponent | null;
  setSelectedComponent: (component: FormComponent) => void;
  moveComponent: (index: number, direction: 'up' | 'down') => void;
  duplicateComponent: (component: FormComponent) => void;
  deleteComponent: (id: string) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

const FormCanvas: React.FC<FormCanvasProps> = ({
  isPreviewMode,
  formComponents,
  renderFormComponent,
  selectedComponent,
  setSelectedComponent,
  moveComponent,
  duplicateComponent,
  deleteComponent,
  handleDragOver,
  handleDrop,
}) => {
  // Optional: Manage drag over styling state
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    handleDrop(e);
  };

  if (isPreviewMode) {
    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Form Preview</h2>
        {formComponents.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No form components to preview</p>
          </div>
        ) : (
          <form onSubmit={(e) => e.preventDefault()}>
            {formComponents.map((component) => renderFormComponent(component, true))}
            <button
              type="submit"
              className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900 transition-colors duration-200 font-medium"
            >
              Submit Form
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={handleDragOver}
      onDrop={onDrop}
      className={`max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 min-h-96 ${isDraggingOver ? 'border-4 border-blue-500 dark:border-blue-400' : ''}`}
    >
      {formComponents.length === 0 ? (
        <div className="text-center text-gray-400 dark:text-gray-500 py-16">
          <Plus className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">Drag components here to build your form</p>
          <p className="text-sm">Start by dragging a component from the left panel</p>
        </div>
      ) : (
        formComponents.map((component, index) => (
          <div
            key={component.id}
            className={`group relative mb-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 ${selectedComponent?.id === component.id ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
              }`}
            onClick={() => setSelectedComponent(component)}
          >
            <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white dark:bg-gray-900 shadow-lg rounded p-1">
              <button
                aria-label="Move component up"
                onClick={(e) => {
                  e.stopPropagation();
                  moveComponent(index, 'up');
                }}
                disabled={index === 0}
                className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 disabled:opacity-50"
              >
                ↑
              </button>
              <button
                aria-label="Move component down"
                onClick={(e) => {
                  e.stopPropagation();
                  moveComponent(index, 'down');
                }}
                disabled={index === formComponents.length - 1}
                className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 disabled:opacity-50"
              >
                ↓
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateComponent(component);
                }}
                className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteComponent(component.id);
                }}
                className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            {renderFormComponent(component)}
          </div>
        ))
      )}
    </div>
  );
};

export default FormCanvas;
