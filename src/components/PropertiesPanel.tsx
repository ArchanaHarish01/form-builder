import React from "react";
import { Settings } from "lucide-react";

export function PropertiesPanel({ selectedComponent, renderPropertiesPanel }: any) {
  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Properties</h2>
      {selectedComponent ? renderPropertiesPanel() : (
        <div className="text-center text-gray-500 py-8">
          <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Select a component to edit its properties</p>
        </div>
      )}
    </div>
  );
}