import { ComponentType, ComponentTypeKey } from "../types";
import { AlignLeft, Calendar, CheckSquare, ChevronDown, Hash, Mail, Phone, Type } from "lucide-react";

export const COMPONENT_TYPES: Record<ComponentTypeKey, ComponentType> = {
    text: {
        id: 'text',
        name: 'Text Input',
        icon: Type,
        defaultProps: { label: 'Text Field', placeholder: 'Enter text...' }
    },
    email: {
        id: 'email',
        name: 'Email Input',
        icon: Mail,
        defaultProps: { label: 'Email', placeholder: 'Enter email...' }
    },
    number: {
        id: 'number',
        name: 'Number Input',
        icon: Hash,
        defaultProps: { label: 'Number', placeholder: 'Enter number...' }
    },
    phone: {
        id: 'phone',
        name: 'Phone Input',
        icon: Phone,
        defaultProps: { label: 'Phone', placeholder: 'Enter phone...' }
    },
    date: {
        id: 'date',
        name: 'Date Input',
        icon: Calendar,
        defaultProps: { label: 'Date' }
    },
    select: {
        id: 'select',
        name: 'Select Dropdown',
        icon: ChevronDown,
        defaultProps: { label: 'Select Option', placeholder: 'Choose...', options: ['Option 1', 'Option 2', 'Option 3'] }
    },
    checkbox: {
        id: 'checkbox',
        name: 'Checkbox',
        icon: CheckSquare,
        defaultProps: { label: 'Check this option' }
    },
    textarea: {
        id: 'textarea',
        name: 'Text Area',
        icon: AlignLeft,
        defaultProps: { label: 'Text Area', placeholder: 'Enter text...', rows: 3 }
    }
};