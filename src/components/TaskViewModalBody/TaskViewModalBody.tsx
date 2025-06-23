import React from 'react';
import {TaskItem} from '../../types/types';
import styles from './TaskViewModalBody.module.css';
import Button from '../Button/Button';
import {useTaskStore} from '../../stores/storeContext';
import {VALID_MODE} from '../../config/constant';

interface TaskViewModalBodyProps {
    task: TaskItem;
    onClose: () => void;
}

const TaskViewModalBody: React.FC<TaskViewModalBodyProps> = ({task, onClose}) => {
    const taskStore = useTaskStore();

    const handleEdit = () => {
        taskStore.openModal(VALID_MODE.EDIT, task);
    };

    const handleClone = () => {
        taskStore.cloneTask(task.id);
        onClose();
    };

    const handleDelete = () => {
        taskStore.deleteTask(task.id);
        onClose();
    };

    return (
        <div className={styles.modalBody}>
            <div className={styles.taskInfo}>
                <div className={styles.statusContainer}>
                    <span className={styles.statusLabel}>Статус:</span>
                    <span className={styles.statusValue}>{task.status}</span>
                </div>

                <div className={styles.descriptionContainer}>
                    <h4 className={styles.sectionTitle}>Описание:</h4>
                    <p className={styles.taskDescription}>{task.description}</p>
                </div>

                <div className={styles.datetimeContainer}>
                    <div className={styles.timeContainer}>
                        <p className={styles.taskTime}>{task.time}</p>
                    </div>

                    <div className={styles.dateContainer}>
                        <p className={styles.taskDate}>{task.date}</p>
                    </div>
                </div>
            </div>

            <div className={styles.modalFooter}>
                <Button variant="warning" onClick={handleEdit} className={styles.footerButton}>
                    Edit
                </Button>
                <Button variant="primary" onClick={handleClone} className={styles.footerButton}>
                    Copy
                </Button>
                <Button variant="danger" onClick={handleDelete} className={styles.footerButton}>
                    Del
                </Button>
                <Button variant="secondary" onClick={onClose} className={styles.footerButton}>
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default TaskViewModalBody;
