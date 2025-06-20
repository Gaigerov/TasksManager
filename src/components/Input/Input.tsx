import React, { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';
import styles from './Input.module.css';

type BaseInputProps = {
  label?: string;
  variant?: 'default' | 'outline' | 'filled' | 'headerInput' | 'cardInput';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  error?: boolean;
  errorMessage?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  wrapperClassName?: string;
  multiline?: boolean;
  rows?: number;
};

type InputProps = BaseInputProps & 
  (InputHTMLAttributes<HTMLInputElement> | TextareaHTMLAttributes<HTMLTextAreaElement>) & {
    as?: 'input' | 'textarea';
  };

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      label,
      variant = 'default',
      size = 'medium',
      fullWidth = false,
      error = false,
      errorMessage,
      startIcon,
      endIcon,
      className = '',
      wrapperClassName = '',
      multiline = false,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const InputComponent = multiline ? 'textarea' : 'input';
    
    return (
      <div className={`${styles.wrapper} ${fullWidth ? styles.fullWidth : ''} ${wrapperClassName}`}>
        {label && <label className={styles.label}>{label}</label>}
        
        <div className={`${styles.inputContainer} ${error ? styles.error : ''}`}>
          {startIcon && <span className={styles.iconStart}>{startIcon}</span>}
          
          <InputComponent
            ref={ref as React.ForwardedRef<HTMLInputElement & HTMLTextAreaElement>}
            className={`
              ${styles.input}
              ${styles[variant]}
              ${styles[size]}
              ${error ? styles.errorState : ''}
              ${startIcon ? styles.withIconStart : ''}
              ${endIcon ? styles.withIconEnd : ''}
              ${className}
            `}
            rows={multiline ? rows : undefined}
            {...props as InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>}
          />
          
          {endIcon && <span className={styles.iconEnd}>{endIcon}</span>}
        </div>
        
        {error && errorMessage && (
          <p className={styles.errorMessage}>{errorMessage}</p>
        )}
      </div>
    );
  }
);

export default Input;


// // Стандартный инпут
// <Input
//   placeholder="Введите текст"
//   variant="outline"
//   size="large"
//   onChange={(e) => console.log(e.target.value)}
// />

// // Инпут с иконкой (TypeScript автоматически проверит типы)
// <Input
//   placeholder="Поиск..."
//   endIcon={<SearchIcon />}
//   className="custom-class"
//   variant="headerInput"
//   onFocus={() => console.log('Focused')}
// />

// // Многострочный ввод
// <Input
//   label="Описание"
//   multiline
//   rows={4}
//   placeholder="Введите описание..."
//   variant="filled"
// />