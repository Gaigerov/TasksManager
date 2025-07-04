import {observer} from 'mobx-react-lite';
import {useEffect, useRef, useState} from 'react';
import {TaskStatus} from '../../types/types';
import styles from './TaskViewModalBody.module.css';
import {useTaskStore} from '../../stores/storeContext';
import Cookies from 'js-cookie';
import {TASK_STATUS_COLORS} from '../../config/constant';

interface TaskViewModalBodyProps {
    taskId: string;
    onClose: () => void;
}

const TaskViewModalBody: React.FC<TaskViewModalBodyProps> = observer(({taskId, onClose}) => {
    const taskStore = useTaskStore();
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const statusButtonRef = useRef<HTMLButtonElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const user = Cookies.get('user') || '';

    const task = taskStore.tasks.find(t => t.id === taskId);

    useEffect(() => {
        if (!task) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node) &&
                statusButtonRef.current && !statusButtonRef.current.contains(event.target as Node)) {
                setIsStatusOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [task]);

    if (!task) return null;

    const {id, status, description, time, date} = task;

    return (
        <div className={styles.modalBody}>
            <div>
                <div className={styles.statusContainer}>
                    <button
                        ref={statusButtonRef}
                        className={styles.statusButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsStatusOpen(!isStatusOpen);
                        }}
                        style={{backgroundColor: TASK_STATUS_COLORS[status], color: 'var(--white)'}}
                    >
                        {status}
                    </button>

                    {isStatusOpen && (
                        <div
                            ref={popupRef}
                            className={styles.statusPopup}
                            onClick={e => e.stopPropagation()}
                        >
                            {(['To Do', 'In Progress', 'Done'] as TaskStatus[]).map((stat) => (
                                <button
                                    key={stat}
                                    className={styles.statusOption}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsStatusOpen(false);
                                        taskStore.changeTaskStatus(id, stat, user);
                                    }}
                                    style={{
                                        backgroundColor: status === stat ? TASK_STATUS_COLORS[stat] : '',
                                        fontWeight: status === stat ? 'bold' : 'normal',
                                        color: status === stat ? 'var(--white)' : 'inherit'
                                    }}
                                >
                                    {stat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.descriptionContainer}>
                    <p className={styles.taskDescription}>{description}</p>
                </div>

                <div className={styles.datetimeContainer}>
                    <div className={styles.timeContainer}>
                        <p className={styles.taskTime}>{time}</p>
                    </div>

                    <div className={styles.dateContainer}>
                        <p className={styles.taskDate}>{date}</p>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default TaskViewModalBody;
