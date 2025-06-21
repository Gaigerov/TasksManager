/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    useState,
    useRef,
    useEffect,
    forwardRef,
    useCallback
} from 'react';
import ReactDOM from 'react-dom'; // Добавлен импорт для портала
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

        useEffect(() => {
            setInputValue(formatDate(value));
        }, [value, formatDate]);

        const handleDateChange = (date: Date | null) => {
            onChange?.(date);
            setIsOpen(false);
        };

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
