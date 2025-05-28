"use client";
import React from 'react';

interface PropertiesPanelProps {
  renderPropertiesPanel: () => React.ReactNode;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ renderPropertiesPanel }) => {
  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 p-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Properties</h2>
      {renderPropertiesPanel()}
    </div>
  );
};

export default PropertiesPanel;
