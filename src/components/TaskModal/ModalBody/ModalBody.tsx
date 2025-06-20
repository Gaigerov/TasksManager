import React, {ChangeEvent} from 'react';
import styles from './ModalBody.module.css';
import {TaskItem} from '../../../types/types';
import DateInput from '../../DateInput/DateInput';

interface ModalBodyProps {
    task: TaskItem;
    onChange: (field: keyof TaskItem, value: string) => void;
    errors: string[]; 
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
    errors // Получаем ошибки из родителя
}) => {
    // Фильтруем ошибки для каждого поля
    const titleError = errors.find(e => e.includes('Название'));
    const dateError = errors.find(e => e.includes('дату') || e.includes('Дату'));
    const timeError = errors.find(e => e.includes('время') || e.includes('Время'));

    const handleInputChange = (field: keyof TaskItem) =>
        (e: ChangeEvent<HTMLInputElement>) => {
            onChange(field, e.target.value);
        };

    // Валидация при изменении даты через DateInput
    const handleDateChange = (value: string) => {
        onChange('date', value);
    };

    return (
        <div className={styles.modalBody}>
            {/* Область для отображения общих ошибок */}
            {errors.length > 0 && !(titleError || dateError || timeError) && (
                <div className={styles.errorContainer}>
                    {errors.map((error, index) => (
                        <div key={index} className={styles.error}>{error}</div>
                    ))}
                </div>
            )}

            <div className={styles.formGroup}>
                <label htmlFor="title" className={styles.label}>
                    Заголовок
                    {titleError && <span className={styles.requiredStar}> *</span>}
                </label>
                <input
                    id="title"
                    type="text"
                    className={`${styles.input} ${titleError ? styles.inputError : ''}`}
                    value={task.title}
                    onChange={handleInputChange('title')}
                    placeholder="Введите заголовок задачи"
                    required
                />
                {titleError && <div className={styles.errorText}>{titleError}</div>}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>Описание</label>
                <input
                    id="description"
                    type="text"
                    className={styles.input}
                    value={task.description}
                    onChange={handleInputChange('description')}
                    placeholder="Введите описание задачи"
                />
            </div>

            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="date" className={styles.label}>
                        Дата
                        {dateError && <span className={styles.requiredStar}> *</span>}
                    </label>
                    <DateInput
                        value={task.date}
                        onChange={handleDateChange}
                        hasError={!!dateError}
                    />
                    {dateError && <div className={styles.errorText}>{dateError}</div>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="time" className={styles.label}>
                        Время
                        {timeError && <span className={styles.requiredStar}> *</span>}
                    </label>
                    <input
                        id="time"
                        type="time"
                        className={`${styles.input} ${timeError ? styles.inputError : ''}`}
                        value={task.time}
                        onChange={handleInputChange('time')}
                    />
                    {timeError && <div className={styles.errorText}>{timeError}</div>}
                </div>
            </div>
        </div>
    );
};

export default ModalBody;
