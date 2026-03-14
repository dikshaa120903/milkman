import React from 'react';
import './Input.css';

const Input = ({
  label,
  error,
  success,
  icon,
  fullWidth = false,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const inputClasses = [
    'input-field',
    error ? 'input-error' : '',
    success ? 'input-success' : '',
    icon ? 'input-with-icon' : '',
    fullWidth ? 'input-full' : '',
    className
  ].filter(Boolean).join(' ');

  const containerClasses = [
    'input-container',
    containerClassName
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {label && (
        <label className="input-label">
          {label}
          {props.required && <span className="input-required">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          className={inputClasses}
          {...props}
        />
      </div>
      {error && <span className="input-error-text">{error}</span>}
      {success && <span className="input-success-text">{success}</span>}
    </div>
  );
};

export default Input;