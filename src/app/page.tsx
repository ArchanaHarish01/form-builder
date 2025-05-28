"use client";

import {
  Settings
} from 'lucide-react';
import React, { ChangeEvent, useRef, useState } from 'react';
import ComponentPalette from '../components/ComponentPalette';
import FormCanvas from '../components/FormCanvas';
import PropertiesPanel from '../components/PropertiesPanel';
import Toolbar from '../components/Toolbar';
import { COMPONENT_TYPES } from '../constants';
import { ComponentProps, ComponentTypeKey, FormComponent } from '../types';
import { Toggle } from '../components/Toggle';

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
          <h3 className="font-semibold text-blue-600">{componentType.name}</h3>
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
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 dark:text-white">
      <Toggle />
      <ComponentPalette
        COMPONENT_TYPES={COMPONENT_TYPES}
        handleDragStart={handleDragStart}
      />
      {/* Main Form Builder Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <Toolbar
          isPreviewMode={isPreviewMode}
          setIsPreviewMode={setIsPreviewMode}
          clearForm={clearForm}
          fileInputRef={fileInputRef}
          importForm={importForm}
          exportForm={exportForm}
        />

        {/* Form Canvas */}
        <div className="flex-1 p-6 overflow-auto">
          <FormCanvas
            isPreviewMode={isPreviewMode}
            formComponents={formComponents}
            renderFormComponent={renderFormComponent}
            selectedComponent={selectedComponent}
            setSelectedComponent={setSelectedComponent}
            moveComponent={moveComponent}
            duplicateComponent={duplicateComponent}
            deleteComponent={deleteComponent}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
          />
        </div>
      </div>

      {/* Properties Panel */}
      {!isPreviewMode && <PropertiesPanel renderPropertiesPanel={renderPropertiesPanel} />}

    </div>
  );

};

export default FormBuilder;