/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    useState,
    useRef,
    useEffect,
    forwardRef
} from 'react';
import Calendar from '../Calendar/Calendar';
import styles from './DatePicker.module.css';

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
        const datePickerRef = useRef<HTMLDivElement>(null);

        // Преобразование даты в строку
        const formatDate = (date: Date | null): string => {
            if (!date) return '';

            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();

            return format
                .replace('dd', day)
                .replace('MM', month)
                .replace('yyyy', year.toString());
        };

        // Обновление поля ввода при изменении значения
        useEffect(() => {
            setInputValue(formatDate(value));
        }, [value]);

        // Обработчик выбора даты
        const handleDateChange = (date: Date | null) => {
            if (onChange) {
                onChange(date);
            }
            setIsOpen(false);
        };

        // Закрытие календаря при клике вне компонента
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (
                    datePickerRef.current &&
                    !datePickerRef.current.contains(event.target as Node)
                ) {
                    setIsOpen(false);
                }
            };

            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, []);

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
                        readOnly
                        placeholder={placeholder}
                        className={`${styles.input} ${inputClassName}`}
                        onFocus={() => setIsOpen(true)}
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

                {isOpen && (
                    <div className={styles.calendarContainer}>
                        <Calendar
                            selectedDate={value}
                            onDateChange={handleDateChange}
                            className={`${styles.calendar} ${calendarClassName}`}
                            minDate={minDate}
                            maxDate={maxDate}
                            weekStart={weekStart}
                            locale={locale}
                        />
                    </div>
                )}
            </div>
        );
    }
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;
