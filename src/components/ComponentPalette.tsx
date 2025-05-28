"use client";

type ComponentType = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  name: string;
};

type ComponentPaletteProps = {
  COMPONENT_TYPES: Record<string, ComponentType>;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, typeKey: string) => void;
};

const ComponentPalette: React.FC<ComponentPaletteProps> = ({ COMPONENT_TYPES, handleDragStart }) => {
  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-300 p-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Components</h2>
      <div className="space-y-2">
        {Object.entries(COMPONENT_TYPES).map(([typeKey, component]) => (
          <div
            key={typeKey}
            draggable
            onDragStart={(e) => handleDragStart(e, typeKey)}
            className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-900 border border-dashed border-gray-300 rounded-lg cursor-move hover:border-blue-300 hover:bg-blue-50 dark:hover:border-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
          >
            <component.icon className="w-5 h-5 text-gray-600 dark:text-white" />
            <span className="text-sm font-medium text-gray-700 dark:text-white">{component.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComponentPalette;
