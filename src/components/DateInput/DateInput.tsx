import React, {ChangeEvent, useState, useEffect} from 'react';
import styles from './DateInput.module.css';

interface DateInputProps {
    value: string;
    onChange: (value: string) => void;
    hasError?: boolean;
}

const DateInput: React.FC<DateInputProps> = ({value, onChange, hasError = false}) => {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        setDisplayValue(value);
    }, [value]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        let input = e.target.value;
        input = input.replace(/\D/g, '');

        if (input.length > 8) input = input.substring(0, 8);
        if (input.length > 4) input = `${input.substring(0, 4)}.${input.substring(4)}`;
        if (input.length > 2) input = `${input.substring(0, 2)}.${input.substring(2)}`;

        setDisplayValue(input);
    };

    const handleBlur = () => {
        onChange(displayValue);
    };

    return (
        <input
            type="text"
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${styles.input} ${hasError ? styles.inputError : ''}`}
            placeholder="ДД.ММ.ГГГГ"
        />
    );
};

export default DateInput;
