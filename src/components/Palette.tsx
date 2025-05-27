import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { COMPONENT_TYPES } from "../constants";

export function Palette() {
    return (
        <div className="space-y-2">
            {Object.entries(COMPONENT_TYPES).map(([typeKey, component]) => (
                <PaletteItem key={typeKey} typeKey={typeKey} component={component} />
            ))}
        </div>
    );
}

function PaletteItem({ typeKey, component }: any) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: typeKey,
        data: { from: "palette" }
    });

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className={`flex items-center space-x-3 p-3 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-move hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 ${isDragging ? "opacity-50" : ""}`}
            tabIndex={0}
            role="button"
            aria-label={`Drag ${component.name}`}
        >
            <component.icon className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{component.name}</span>
        </div>
    );
}