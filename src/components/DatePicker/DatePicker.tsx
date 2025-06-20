/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    useState,
    useRef,
    useEffect,
    forwardRef,
    useCallback
} from 'react';
import ReactDOM from 'react-dom';
import Calendar from '../Calendar/Calendar';
import styles from './DatePicker.module.css';

import chevronDown from '../../images/ChevronDown.svg';

interface DatePickerProps {
    id?: string;
    value?: Date | null;
    onChange?: (date: Date | null) => void;
    placeholder?: string;
    className?: string;
    inputClassName?: string;
    calendarClassName?: string;
    minDate?: Date;
    maxDate?: Date;
    weekStart?: 0 | 1;
    locale?: string;
    format?: string;
    showIcon?: boolean;
    icon?: React.ReactNode;
}

const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
    (
        {
            id,
            value = null,
            onChange,
            placeholder = 'Select date',
            className = '',
            inputClassName = '',
            calendarClassName = '',
            minDate,
            maxDate,
            weekStart = 1,
            locale = 'ru-RU',
            format = 'dd.MM.yyyy',
            showIcon = true,
            icon = '📅',
            ...props
        },
        ref
    ) => {
        const [isOpen, setIsOpen] = useState(false);
        const [inputValue, setInputValue] = useState('');
        const [isFocused, setIsFocused] = useState(false);
        const [position, setPosition] = useState({top: 0, left: 0, width: 0});
        const datePickerRef = useRef<HTMLDivElement>(null);
        const calendarRef = useRef<HTMLDivElement>(null);

        const formatDate = useCallback((date: Date | null): string => {
            if (!date) return '';
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return format
                .replace('dd', day)
                .replace('MM', month)
                .replace('yyyy', year.toString());
        }, [format]);

        // Синхронизация значения из props
        useEffect(() => {
            if (!isFocused) {
                setInputValue(formatDate(value));
            }
        }, [value, isFocused, formatDate]);

        const handleDateChange = (date: Date | null) => {
            onChange?.(date);
            setIsOpen(false);
            setInputValue(formatDate(date));
        };

        // Парсинг ручного ввода даты
        const parseInputDate = useCallback((value: string): Date | null => {
            if (!value.trim()) return null;

            // Поддержка разных разделителей
            const parts = value.split(/[./-]/).map(p => p.trim());
            if (parts.length !== 3) return null;

            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10);
            let year = parseInt(parts[2], 10);

            if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

            // Коррекция двухзначного года
            if (year < 100) year += 2000;

            // Проверка валидности даты
            if (
                day < 1 || day > 31 ||
                month < 1 || month > 12 ||
                year < 1000 || year > 9999
            ) return null;

            const dateObj = new Date(year, month - 1, day);
            if (
                dateObj.getDate() !== day ||
                dateObj.getMonth() !== month - 1 ||
                dateObj.getFullYear() !== year
            ) return null;

            return dateObj;
        }, []);

        // Обработчики ручного ввода
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(e.target.value);
        };

        const handleBlur = () => {
            const date = parseInputDate(inputValue);
            if (date) {
                const formatted = formatDate(date);
                setInputValue(formatted);
                onChange?.(date);
            } else {
                if (inputValue.trim() === '') {
                    onChange?.(null);
                } else {
                    // Восстановление предыдущего значения
                    setInputValue(formatDate(value));
                }
            }
            setIsFocused(false);
        };

        const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                (e.target as HTMLInputElement).blur();
            }
        };

        const handleFocus = () => {
            setIsFocused(true);
            setIsOpen(true);
        };

        // Позиционирование календаря
        const calculatePosition = useCallback(() => {
            if (datePickerRef.current) {
                const rect = datePickerRef.current.getBoundingClientRect();
                return {
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width
                };
            }
            return {top: 0, left: 0, width: 0};
        }, []);

        useEffect(() => {
            if (isOpen) {
                setPosition(calculatePosition());

                const handleClickOutside = (event: MouseEvent) => {
                    if (
                        datePickerRef.current &&
                        !datePickerRef.current.contains(event.target as Node) &&
                        calendarRef.current &&
                        !calendarRef.current.contains(event.target as Node)
                    ) {
                        setIsOpen(false);
                    }
                };

                const handleScrollOrResize = () => {
                    setPosition(calculatePosition());
                };

                document.addEventListener('mousedown', handleClickOutside);
                window.addEventListener('scroll', handleScrollOrResize, true);
                window.addEventListener('resize', handleScrollOrResize);

                return () => {
                    document.removeEventListener('mousedown', handleClickOutside);
                    window.removeEventListener('scroll', handleScrollOrResize, true);
                    window.removeEventListener('resize', handleScrollOrResize);
                };
            }
        }, [isOpen, calculatePosition]);

        return (
            <div
                className={`${styles.datePicker} ${className}`}
                ref={datePickerRef}
            >
                <div className={styles.inputContainer}>
                    <input
                        id={id}
                        type="text"
                        value={inputValue}
                        placeholder={placeholder}
                        className={`${styles.input} ${inputClassName}`}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onKeyPress={handleKeyPress}
                        {...props}
                    />
                    {showIcon && (
                        <button
                            className={styles.iconButton}
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Open calendar"
                        >
                            {icon}
                        </button>
                    )}
                </div>

                {isOpen && ReactDOM.createPortal(
                    <div
                        ref={calendarRef}
                        className={styles.calendarContainer}
                        style={{
                            position: 'absolute',
                            top: `${position.top + 8}px`,
                            left: `${position.left}px`,
                            width: `${position.width}px`,
                            zIndex: 10000
                        }}
                    >
                        <Calendar
                            selectedDate={value}
                            onDateChange={handleDateChange}
                            className={`${styles.calendar} ${calendarClassName}`}
                            minDate={minDate}
                            maxDate={maxDate}
                            weekStart={weekStart}
                            locale={locale}
                        />
                    </div>,
                    document.body
                )}
            </div>
        );
    }
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;
