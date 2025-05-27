"use client";

import React, { ChangeEvent, useRef, useState } from 'react';
import {
  Copy,
  Download,
  Eye,
  EyeOff,
  FileText,
  Plus,
  RotateCcw,
  Settings,
  Trash2,
  Upload
} from 'lucide-react';
import { ComponentProps, ComponentTypeKey, FormComponent } from '../types';
import { COMPONENT_TYPES } from '../constants';

// Component types configuration


const FormBuilder: React.FC = () => {
  const [formComponents, setFormComponents] = useState<FormComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<FormComponent | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate unique ID for components
  const generateId = () => `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Handle drag and drop (simplified version without react-beautiful-dnd)
  const handleDragStart = (e: React.DragEvent, componentType: ComponentTypeKey | string) => {
    setDraggedItem(componentType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedItem && COMPONENT_TYPES[draggedItem as ComponentTypeKey]) {
      const componentType = COMPONENT_TYPES[draggedItem as ComponentTypeKey];
      const newComponent: FormComponent = {
        id: generateId(),
        type: draggedItem as ComponentTypeKey,
        props: { ...componentType.defaultProps }
      };
      setFormComponents(prev => [...prev, newComponent]);
    }
    setDraggedItem(null);
  };

  // Update component props
  const updateComponentProps = (componentId: string, newProps: Partial<ComponentProps>) => {
    setFormComponents(prev =>
      prev.map(comp =>
        comp.id === componentId
          ? { ...comp, props: { ...comp.props, ...newProps } }
          : comp
      )
    );
    if (selectedComponent && selectedComponent.id === componentId) {
      setSelectedComponent({ ...selectedComponent, props: { ...selectedComponent.props, ...newProps } });
    }
  };

  // Delete component
  const deleteComponent = (componentId: string) => {
    setFormComponents(prev => prev.filter(comp => comp.id !== componentId));
    if (selectedComponent?.id === componentId) {
      setSelectedComponent(null);
    }
  };

  // Duplicate component
  const duplicateComponent = (component: FormComponent) => {
    const duplicated: FormComponent = {
      ...component,
      id: generateId(),
      props: { ...component.props, label: `${component.props.label} (Copy)` }
    };
    setFormComponents(prev => [...prev, duplicated]);
  };

  // Export form configuration
  const exportForm = () => {
    const config = { components: formComponents };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'form-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import form configuration
  const importForm = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target?.result as string);
          setFormComponents(config.components ?? []);
          setSelectedComponent(null);
        }
        catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  // Clear form
  const clearForm = () => {
    if (window.confirm('Are you sure you want to clear the form?')) {
      setFormComponents([]);
      setSelectedComponent(null);
      setFormData({});
    }
  };

  // Handle form input change in preview mode
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const handleFormDataChange = (componentId: string, value: any) => {
    setFormData(prev => ({ ...prev, [componentId]: value }));
  };

  // Render form component
  const renderFormComponent = (component: FormComponent, isPreview = false) => {
    const { type, props } = component;
    const value = formData[component.id] || '';

    const commonClasses = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";

    switch (type) {
      case 'text':
        return (
          <div key={component.id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {props.label} {props.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              placeholder={props.placeholder}
              maxLength={props.maxLength}
              required={props.required}
              value={value}
              onChange={(e) => isPreview && handleFormDataChange(component.id, e.target.value)}
              className={commonClasses}
            />
          </div>
        );

      case 'email':
        return (
          <div key={component.id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {props.label} {props.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="email"
              placeholder={props.placeholder}
              required={props.required}
              value={value}
              onChange={(e) => isPreview && handleFormDataChange(component.id, e.target.value)}
              className={commonClasses}
            />
          </div>
        );

      case 'select':
        return (
          <div key={component.id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {props.label} {props.required && <span className="text-red-500">*</span>}
            </label>
            <select
              required={props.required}
              value={value}
              onChange={(e) => isPreview && handleFormDataChange(component.id, e.target.value)}
              className={commonClasses}
            >
              <option value="">{props.placeholder}</option>
              {(props.options || []).map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );

      case 'checkbox':
        return (
          <div key={component.id} className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                required={props.required}
                checked={!!value}
                onChange={(e) => isPreview && handleFormDataChange(component.id, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                {props.label} {props.required && <span className="text-red-500">*</span>}
              </span>
            </label>
          </div>
        );

      case 'date':
        return (
          <div key={component.id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {props.label} {props.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="date"
              required={props.required}
              value={value}
              onChange={(e) => isPreview && handleFormDataChange(component.id, e.target.value)}
              className={commonClasses}
            />
          </div>
        );

      case 'number':
        return (
          <div key={component.id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {props.label} {props.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              placeholder={props.placeholder}
              min={props.min}
              max={props.max}
              required={props.required}
              value={value}
              onChange={(e) => isPreview && handleFormDataChange(component.id, e.target.value)}
              className={commonClasses}
            />
          </div>
        );

      case 'phone':
        return (
          <div key={component.id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {props.label} {props.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="tel"
              placeholder={props.placeholder}
              required={props.required}
              value={value}
              onChange={(e) => isPreview && handleFormDataChange(component.id, e.target.value)}
              className={commonClasses}
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={component.id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {props.label} {props.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              placeholder={props.placeholder}
              rows={props.rows || 3}
              required={props.required}
              value={value}
              onChange={(e) => isPreview && handleFormDataChange(component.id, e.target.value)}
              className={commonClasses}
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Render properties panel
  const renderPropertiesPanel = () => {
    if (!selectedComponent) {
      return (
        <div className="text-center text-gray-500 py-8">
          <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Select a component to edit its properties</p>
        </div>
      );
    }

    const { type, props } = selectedComponent;
    const componentType = COMPONENT_TYPES[type];

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b">
          <componentType.icon className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">{componentType.name}</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
          <input
            type="text"
            value={props.label}
            onChange={(e) => updateComponentProps(selectedComponent.id, { label: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {(type === 'text' || type === 'email' || type === 'number' || type === 'phone' || type === 'textarea') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
            <input
              type="text"
              value={props.placeholder || ''}
              onChange={(e) => updateComponentProps(selectedComponent.id, { placeholder: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {type === 'select' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
              <input
                type="text"
                value={props.placeholder || ''}
                onChange={(e) => updateComponentProps(selectedComponent.id, { placeholder: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Options (one per line)</label>
              <textarea
                value={(props.options || []).join('\n')}
                onChange={(e) => updateComponentProps(selectedComponent.id, { options: e.target.value.split('\n').filter(o => o.trim()) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>
          </>
        )}

        {type === 'text' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Length</label>
            <input
              type="number"
              value={props.maxLength || ''}
              onChange={(e) => updateComponentProps(selectedComponent.id, { maxLength: parseInt(e.target.value) || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {type === 'number' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Value</label>
              <input
                type="number"
                value={props.min || ''}
                onChange={(e) => updateComponentProps(selectedComponent.id, { min: parseInt(e.target.value) || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Value</label>
              <input
                type="number"
                value={props.max || ''}
                onChange={(e) => updateComponentProps(selectedComponent.id, { max: parseInt(e.target.value) || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        {type === 'textarea' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rows</label>
            <input
              type="number"
              value={props.rows || 3}
              onChange={(e) => updateComponentProps(selectedComponent.id, { rows: parseInt(e.target.value) || 3 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min={2}
              max={10}
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="required"
            checked={!!props.required}
            onChange={(e) => updateComponentProps(selectedComponent.id, { required: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="required" className="text-sm font-medium text-gray-700">Required field</label>
        </div>
      </div>
    );
  };

  const moveComponent = (index: number, direction: 'up' | 'down') => {
    const newComponents = [...formComponents];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < newComponents.length) {
      [newComponents[index], newComponents[newIndex]] = [newComponents[newIndex], newComponents[index]];
      setFormComponents(newComponents);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Component Palette */}
      <div className="w-64 bg-white border-r border-gray-300 p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Components</h2>
        <div className="space-y-2">
          {Object.entries(COMPONENT_TYPES).map(([typeKey, component]) => (
            <div
              key={typeKey}
              draggable
              onDragStart={(e) => handleDragStart(e, typeKey)}
              className="flex items-center space-x-3 p-3 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-move hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
            >
              <component.icon className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{component.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Form Builder Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-800">Form Builder</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${isPreviewMode
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
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
              className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
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
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </button>

            <button
              onClick={exportForm}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Form Canvas */}
        <div className="flex-1 p-6 overflow-auto">
          {isPreviewMode ? (
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Form Preview</h2>
              {formComponents.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No form components to preview</p>
                </div>
              ) : (
                <div onSubmit={(e) => e.preventDefault()}>
                  {formComponents.map(component => renderFormComponent(component, true))}
                  <button
                    type="submit"
                    className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    Submit Form
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 min-h-96"
            >
              {formComponents.length === 0 ? (
                <div className="text-center text-gray-400 py-16">
                  <Plus className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Drag components here to build your form</p>
                  <p className="text-sm">Start by dragging a component from the left panel</p>
                </div>
              ) : (
                formComponents.map((component, index) => (
                  <div
                    key={component.id}
                    className={`group relative mb-4 p-2 rounded-lg hover:bg-gray-50 ${selectedComponent?.id === component.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                    onClick={() => setSelectedComponent(component)}
                  >
                    <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white shadow-lg rounded p-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveComponent(index, 'up');
                        }}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      >
                        ↑
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveComponent(index, 'down');
                        }}
                        disabled={index === formComponents.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      >
                        ↓
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateComponent(component);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
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
          )}
        </div>
      </div>

      {/* Properties Panel */}
      {!isPreviewMode && (
        <div className="w-80 bg-white border-l border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Properties</h2>
          {renderPropertiesPanel()}
        </div>
      )}
    </div>
  );

};

export default FormBuilder;