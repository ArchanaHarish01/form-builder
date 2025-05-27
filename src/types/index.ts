export type ComponentTypeKey = 'text' | 'email' | 'select' | 'checkbox' | 'date' | 'number' | 'phone' | 'textarea';

export type ComponentProps = {
    label: string;
    placeholder?: string;
    required?: boolean;
    maxLength?: number;
    min?: number;
    max?: number;
    options?: string[];
    rows?: number;
};

export type FormComponent = {
    id: string;
    type: ComponentTypeKey;
    props: ComponentProps;
};

export type ComponentType = {
    id: ComponentTypeKey;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    defaultProps: ComponentProps;
};
