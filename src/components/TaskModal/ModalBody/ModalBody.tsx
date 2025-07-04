import React, {ChangeEvent, useCallback} from 'react';
import styles from './ModalBody.module.css';
import {TaskItem} from '../../../types/types';
import DatePicker from '../../DatePicker/DatePicker';
import {TaskValidationErrors} from '../../../utils/taskValidation';
import {observer} from 'mobx-react-lite';

interface ModalBodyProps {
    task: TaskItem;
    onChange: (field: keyof TaskItem, value: string) => void;
    errors: TaskValidationErrors;
}

const ModalBody: React.FC<ModalBodyProps> = ({
    task = {
        id: '',
        title: '',
        description: '',
        time: '',
        date: '',
        status: 'To Do'
    },
    onChange,
    errors
}) => {
    const titleError = errors.title.length > 0 ? errors.title[0] : undefined;
    const descriptionError = errors.description.length > 0 ? errors.description[0] : undefined;
    const dateError = errors.date.length > 0 ? errors.date[0] : undefined;
    const timeError = errors.time.length > 0 ? errors.time[0] : undefined;

    const handleInputChange = (field: keyof TaskItem) =>
        (e: ChangeEvent<HTMLInputElement>) => {
            onChange(field, e.target.value);
        };

    const handleClearTitle = () => onChange('title', '');
    const handleClearDescription = () => onChange('description', '');

    const parseDate = useCallback((dateStr: string): Date | null => {
        if (!dateStr) return null;
        const [day, month, year] = dateStr.split('.').map(Number);
        const date = new Date(year, month - 1, day);
        return isNaN(date.getTime()) ? null : date;
    }, []);

    const handleDateChange = (date: Date | null) => {
        if (date) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            onChange('date', `${day}.${month}.${year}`);
        } else {
            onChange('date', '');
        }
    };

    return (
        <div className={styles.modalBody}>
            <div className={styles.formGroup}>
                <label htmlFor="title" className={styles.label}>
                    Title
                    {titleError && <span className={styles.requiredStar}> *</span>}
                </label>
                <div className={styles.inputContainer}>
                    <input
                        id="title"
                        type="text"
                        className={`${styles.input} ${titleError ? styles.inputError : ''}`}
                        value={task.title}
                        onChange={handleInputChange('title')}
                        placeholder="Введите заголовок задачи"
                        required
                    />
                    {task.title && (
                        <button
                            type="button"
                            className={styles.clearButton}
                            onClick={handleClearTitle}
                        >
                            &times;
                        </button>
                    )}
                </div>
                {titleError && <div className={styles.errorText}>{titleError}</div>}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>
                    Description
                    {descriptionError && <span className={styles.requiredStar}> *</span>}
                </label>
                <div className={styles.inputContainer}>
                    <input
                        id="description"
                        type="text"
                        className={`${styles.input} ${descriptionError ? styles.inputError : ''}`}
                        value={task.description}
                        onChange={handleInputChange('description')}
                        placeholder="Введите описание задачи"
                    />
                    {task.description && (
                        <button
                            type="button"
                            className={styles.clearButton}
                            onClick={handleClearDescription}
                        >
                            &times;
                        </button>
                    )}
                </div>
                {descriptionError && <div className={styles.errorText}>{descriptionError}</div>}
            </div>

            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="time" className={styles.label}>
                        Time
                        {timeError && <span className={styles.requiredStar}> *</span>}
                    </label>
                    <input
                        id="time"
                        type="time"
                        className={`${styles.input} ${styles.timeInput} ${timeError ? styles.inputError : ''}`}
                        value={task.time}
                        onChange={handleInputChange('time')}
                    />
                    {timeError && <div className={styles.errorText}>{timeError}</div>}
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="date" className={styles.label}>
                        Date
                        {dateError && <span className={styles.requiredStar}> *</span>}
                    </label>
                    <DatePicker
                        value={parseDate(task.date)}
                        onChange={handleDateChange}
                        format="dd.MM.yyyy"
                        placeholder="ДД.ММ.ГГГГ"
                        inputClassName={`${styles.input} ${dateError ? styles.inputError : ''}`}
                        showIcon={true}
                    />
                    {dateError && <div className={styles.errorText}>{dateError}</div>}
                </div>
            </div>
        </div>
    );
};

export default observer(ModalBody);
