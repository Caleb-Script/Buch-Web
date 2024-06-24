import React, { InputHTMLAttributes } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

type InputFieldValidationComponentProps = InputHTMLAttributes<any> & {
    htmlforlabel: string;
    label: string;
    rest: UseFormRegisterReturn<string>;
    error?: string | undefined;
};

export const InputFieldValidationComponent: React.FC<
    InputFieldValidationComponentProps
> = (props: InputFieldValidationComponentProps) => {
    const { htmlforlabel, label, error, rest } = props;
    return (
        <div className="form-floating mb-3">
            <input {...props} {...rest} />
            <label htmlFor={htmlforlabel}>{label}</label>
            <p className='bg-danger text-sm'>{error}</p>
        </div>
    );
};
