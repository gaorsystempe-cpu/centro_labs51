import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface PasswordFieldProps {
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    placeholder?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ value, onChange, required = false, placeholder = "********" }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="relative mt-1">
            <input
                type={isVisible ? 'text' : 'password'}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                placeholder={placeholder}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pr-10"
                style={{ padding: '0.5rem 0.75rem', borderWidth: '1px' }}
            />
            <button
                type="button"
                onClick={() => setIsVisible(!isVisible)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            >
                {isVisible ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
        </div>
    );
};

export default PasswordField;