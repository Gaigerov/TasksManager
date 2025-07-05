import React, {
    ChangeEvent,
    useEffect,
    useRef,
} from 'react';
import styles from './TextAria.module.css';

interface TextAreaProps {
    id: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: boolean;
    onClear?: () => void;
    maxLength?: number;
}

const TextArea: React.FC<TextAreaProps> = ({
    value,
    onChange,
    placeholder = '',
    error = false,
    onClear,
    maxLength = 200
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height =
                Math.min(textareaRef.current.scrollHeight, 200) + 'px';
        }
    }, [value]);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        if (newValue.length <= maxLength) {
            onChange(newValue);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.textareaContainer}>
                <textarea
                    ref={textareaRef}
                    className={`${styles.textarea} ${error ? styles.error : ''}`}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    rows={1}
                    maxLength={maxLength}
                />
                {value && onClear && (
                    <button
                        type="button"
                        className={styles.clearButton}
                        onClick={onClear}
                    >
                        &times;
                    </button>
                )}
            </div>
        </div>
    );
};

export default TextArea;
