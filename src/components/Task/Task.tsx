import {useState, useRef, useEffect} from 'react';
import styles from './Task.module.css';
import {TaskItem, TaskStatus} from '../../types/types';
import deleteIcon from '../../images/delete.svg';
import editIcon from '../../images/edit.svg';
import cloneIcon from '../../images/clone.svg';
import {observer} from 'mobx-react-lite';
import {useTaskStore} from '../../stores/storeContext'; // Используем кастомный хук

interface TaskProps {
    task: TaskItem;
}

const Task = observer(({task}: TaskProps) => {
    const {id, title, description, time, date, status} = task;
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const statusButtonRef = useRef<HTMLButtonElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const taskStore = useTaskStore();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node) &&
                statusButtonRef.current && !statusButtonRef.current.contains(event.target as Node)) {
                setIsStatusOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleStatusChange = (newStatus: TaskStatus) => {
        setIsStatusOpen(false);
        taskStore.changeTaskStatus(id, newStatus);
    };

    const statusColors = {
        'To Do': '#4a5568',
        'In Progress': '#3182ce',
        'Done': '#38a169'
    };

    return (
        <div className={styles.card}>
            <div className={styles.contentWrapper}>
                <div className={styles.textContent}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.description}>{description}</p>
                </div>

                <div className={styles.actions}>
                    <div className={styles.iconWrapper} onClick={() => taskStore.openModal(task)}>
                        <img
                            src={editIcon}
                            alt="Edit"
                            className={styles.icon}
                        />
                    </div>
                    <div className={styles.iconWrapper} onClick={() => taskStore.cloneTask(id)}>
                        <img
                            src={cloneIcon}
                            alt="Clone"
                            className={styles.icon}
                        />
                    </div>
                    <div className={styles.iconWrapper} onClick={() => taskStore.deleteTask(id)}>
                        <img
                            src={deleteIcon}
                            alt="Delete"
                            className={styles.icon}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.footer}>
                <div className={styles.statusContainer}>
                    <button
                        ref={statusButtonRef}
                        className={styles.statusButton}
                        onClick={() => setIsStatusOpen(!isStatusOpen)}
                        style={{backgroundColor: statusColors[status], color: 'white'}}
                    >
                        {status}
                    </button>

                    {isStatusOpen && (
                        <div ref={popupRef} className={styles.statusPopup}>
                            {(['To Do', 'In Progress', 'Done'] as TaskStatus[]).map((s) => (
                                <button
                                    key={s}
                                    className={styles.statusOption}
                                    onClick={() => handleStatusChange(s)}
                                    style={{
                                        backgroundColor: status === s ? statusColors[s] : '',
                                        fontWeight: status === s ? 'bold' : 'normal',
                                        color: status === s ? 'white' : 'inherit'
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.datetime}>
                    <span className={styles.time}>{time}</span>
                    <span className={styles.date}>{date}</span>
                </div>
            </div>
        </div>
    );
});

export default Task;
