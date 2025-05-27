import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Plus, FileText, Copy, Trash2 } from "lucide-react";

export function FormCanvas({
  isPreviewMode,
  formComponents,
  renderFormComponent,
  selectedComponent,
  setSelectedComponent,
  moveComponent,
  duplicateComponent,
  deleteComponent,
  handleFormDataChange,
  formData
}: any) {
  const { setNodeRef } = useDroppable({ id: "canvas-drop" });

  if (isPreviewMode) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Form Preview</h2>
        {formComponents.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No form components to preview</p>
          </div>
        ) : (
          <form onSubmit={e => e.preventDefault()}>
            {formComponents.map((component: any) => renderFormComponent(component, true))}
            <button
              type="submit"
              className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
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
      ref={setNodeRef}
      id="canvas-drop"
      className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 min-h-96"
    >
      {formComponents.length === 0 ? (
        <div className="text-center text-gray-400 py-16">
          <Plus className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">Drag components here to build your form</p>
          <p className="text-sm">Start by dragging a component from the left panel</p>
        </div>
      ) : (
        formComponents.map((component: any, index: number) => (
          <div
            key={component.id}
            className={`group relative mb-4 p-2 rounded-lg hover:bg-gray-50 ${
              selectedComponent?.id === component.id ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => setSelectedComponent(component)}
          >
            <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white shadow-lg rounded p-1">
              <button
                onClick={e => {
                  e.stopPropagation();
                  moveComponent(index, "up");
                }}
                disabled={index === 0}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                ↑
              </button>
              <button
                onClick={e => {
                  e.stopPropagation();
                  moveComponent(index, "down");
                }}
                disabled={index === formComponents.length - 1}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                ↓
              </button>
              <button
                onClick={e => {
                  e.stopPropagation();
                  duplicateComponent(component);
                }}
                className="p-1 text-gray-400 hover:text-blue-600"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={e => {
                  e.stopPropagation();
                  deleteComponent(component.id);
                }}
                className="p-1 text-gray-400 hover:text-red-600"
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
}