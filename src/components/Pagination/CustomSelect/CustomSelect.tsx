import {useState, useEffect, useRef, FC} from 'react';
import chevronDown from "../../../images/ChevronDown.svg";
import styles from './CustomSelect.module.css';

interface CustomSelectProps {
    options: number[];
    value: number;
    onChange: (value: number) => void;
}

export const CustomSelect: FC<CustomSelectProps> = ({options, value, onChange}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const handleOptionClick = (option: number) => {
        onChange(option);
        setIsOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={styles.customSelect} ref={selectRef}>
            <div
                className={styles.trigger}
                onClick={() => setIsOpen(!isOpen)}
            >
                {value}
                <img
                    src={chevronDown}
                    alt="chevronDown"
                    className={`${styles.chevron} ${isOpen ? styles.rotate : ''}`}
                />
            </div>
            {isOpen && (
                <ul className={styles.options}>
                    {options.map((option) => (
                        <li
                            key={option}
                            className={`${styles.option} ${value === option ? styles.selected : ''}`}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
