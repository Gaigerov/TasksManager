import React, {forwardRef} from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: 'standard' | 'filled' | 'outlined' | 'headerInput';
    inputSize?: 'small' | 'medium' | 'large';
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    onEndIconClick?: () => void;
    fullWidth?: boolean;
    className?: string;
    inputClassName?: string;
    error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
    variant = 'standard',
    inputSize = 'medium',
    startIcon,
    endIcon,
    onEndIconClick,
    fullWidth = false,
    className = '',
    inputClassName = '',
    error = false,
    ...props
}, ref) => {
    return (
        <div className={`${styles.inputContainer} ${fullWidth ? styles.fullWidth : ''} ${className}`}>
            {startIcon && <div className={styles.startIcon}>{startIcon}</div>}
            <input
                ref={ref}
                className={`${styles.input} ${styles[variant]} ${styles[inputSize]} ${inputClassName} ${error ? styles.inputError : ''}`}
                {...props}
            />
            {endIcon && (
                <div
                    className={styles.endIcon}
                    onClick={onEndIconClick}
                    style={{cursor: onEndIconClick ? 'pointer' : 'default'}}
                >
                    {endIcon}
                </div>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
