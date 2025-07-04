import React, {useState, useCallback} from 'react';
import styles from './TaskFilterModalBody.module.css';
import DatePicker from '../DatePicker/DatePicker';
import {TASK_STATUS, TASK_STATUSES} from '../../config/constant';
import {observer} from 'mobx-react-lite';


interface TaskFilterModalBodyProps {
    onStatusChange: (status: string) => void;
    onDateChange: (date: string) => void;
    selectedStatus: string;
    selectedDate: string;
    onClearAll: () => void;
}

const TaskFilterModalBody: React.FC<TaskFilterModalBodyProps> = ({
    onStatusChange,
    onDateChange,
    selectedStatus,
    selectedDate,
    onClearAll
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => setIsDropdownOpen(prev => !prev);
    const handleStatusClick = (status: string) => {
        onStatusChange(status);
        setIsDropdownOpen(false);
    };

    const parseDate = useCallback((dateStr: string): Date | null => {
        if (!dateStr) return null;
        const [day, month, year] = dateStr.split('.').map(Number);
        return new Date(year, month - 1, day);
    }, []);

    const handleDateChange = (date: Date | null) => {
        if (date) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            onDateChange(`${day}.${month}.${year}`);
        } else {
            onDateChange('');
        }
    };

    return (
        <div className={styles.modalBody}>
            <div className={styles.formGroup}>
                <label className={styles.label}>Status</label>
                <div className={styles.customFilterSelector}>
                    <div
                        className={`${styles.selectedStatus} ${selectedStatus ? styles.selected : ''}`}
                        onClick={toggleDropdown}
                    >
                        {selectedStatus || 'All statuses'}
                    </div>
                    {selectedStatus && (
                        <button
                            type="button"
                            className={styles.clearAllButton}
                            onClick={onClearAll}
                        >
                            &times;
                        </button>
                    )}
                    {isDropdownOpen && (
                        <div className={styles.statusesFilter}>
                            {TASK_STATUSES.filter(status => status !== TASK_STATUS.EMPTY).map(status => (
                                <div
                                    key={status}
                                    className={styles.customStatus}
                                    onClick={() => handleStatusClick(status)}
                                >
                                    {status}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Date</label>
                <DatePicker
                    value={parseDate(selectedDate)}
                    onChange={handleDateChange}
                    format="dd.MM.yyyy"
                    placeholder="DD.MM.YYYY"
                    inputClassName={styles.input}
                    showIcon={true}
                />
            </div>
        </div>
    );
};

export default observer(TaskFilterModalBody);
