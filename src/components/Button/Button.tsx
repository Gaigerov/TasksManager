import React, {ElementType, forwardRef} from 'react';
import styles from './Button.module.css';

// Типы для вариантов кнопки
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'link' | 'header' | 'card';
type ButtonSize = 'small' | 'medium' | 'large';

// Пропсы компонента
interface ButtonProps {
    children: React.ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
    fullWidth?: boolean;
    disabled?: boolean;
    as?: ElementType;
    onClick?: () => void;
}

const Button = forwardRef<HTMLElement, ButtonProps>((
    {
        children,
        variant = 'primary',
        size = 'medium',
        className = '',
        fullWidth = false,
        disabled = false,
        as: Component = 'button',
        ...props
    },
    ref
) => {
    // Формируем классы на основе пропсов
    const variantClass = styles[variant] || '';
    const sizeClass = styles[size] || '';
    const fullWidthClass = fullWidth ? styles.fullWidth : '';
    const disabledClass = disabled ? styles.disabled : '';

    const buttonClasses = [
        styles.button,
        variantClass,
        sizeClass,
        fullWidthClass,
        disabledClass,
        className
    ].filter(Boolean).join(' ').trim();

    // Если компонент - это button, добавляем disabled атрибут
    const isButton = Component === 'button';
    const buttonProps = isButton ? {disabled} : {};

    return (
        <Component
            className={buttonClasses}
            ref={ref}
            {...buttonProps}
            {...props}
        >
            {children}
        </Component>
    );
});

Button.displayName = 'Button';

export default Button;
