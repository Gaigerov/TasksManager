import {useState, useRef, useEffect} from 'react';
import styles from './Task.module.css';
import {TaskItem, TaskStatus} from '../../types/types';
import deleteIcon from '../../images/delete.svg';
import editIcon from '../../images/edit.svg';
import cloneIcon from '../../images/clone.svg';
import {observer} from 'mobx-react-lite';
import {useTaskStore} from '../../stores/storeContext';
import {VALID_MODE} from '../../config/constant';

interface TaskProps {
    task: TaskItem;
    isLastTask?: boolean;
}

const Task = observer(({task, isLastTask = false}: TaskProps) => {
    const {id, title, description, time, date, status} = task;
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const statusButtonRef = useRef<HTMLButtonElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const taskStore = useTaskStore();

    const isActive = taskStore.currentTask?.id === id;

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

    const statusColors = {
        'To Do': '#4a5568',
        'In Progress': '#3182ce',
        'Done': '#38a169'
    };

    const openEditModal = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        taskStore.openModal(VALID_MODE.EDIT, task);
    };

    const openViewModal = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        taskStore.openModal(VALID_MODE.VIEW, task);
    };

    return (
        <div
            className={`${styles.card} ${isActive ? styles.active : ''}`}
            onClick={(e) => {
                e.stopPropagation();
                openViewModal(e)
            }}
        >
            <div className={styles.contentWrapper}>
                <div className={styles.textContent}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.description}>{description}</p>
                </div>

                <div className={styles.actions}>
                    <div
                        className={styles.iconWrapper}
                        onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(e);
                        }}
                    >
                        <img
                            src={editIcon}
                            alt="Edit"
                            className={styles.icon}
                        />
                    </div>
                    <div
                        className={styles.iconWrapper}
                        onClick={(e) => {
                            e.stopPropagation();
                            taskStore.cloneTask(id);
                        }}
                    >
                        <img
                            src={cloneIcon}
                            alt="Clone"
                            className={styles.icon}
                        />
                    </div>
                    <div
                        className={styles.iconWrapper}
                        onClick={(e) => {
                            e.stopPropagation();
                            taskStore.deleteTask(id);
                        }}
                    >
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
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsStatusOpen(!isStatusOpen);
                        }}
                        style={{backgroundColor: statusColors[status], color: 'white'}}
                    >
                        {status}
                    </button>

                    {isStatusOpen && (
                        <div
                            ref={popupRef}
                            className={`${styles.statusPopup} ${isLastTask ? styles.statusPopupTop : ''}`}
                            onClick={e => e.stopPropagation()}
                        >
                            {(['To Do', 'In Progress', 'Done'] as TaskStatus[]).map((stat) => (
                                <button
                                    key={stat}
                                    className={styles.statusOption}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsStatusOpen(false);
                                        taskStore.changeTaskStatus(id, stat);
                                    }}
                                    style={{
                                        backgroundColor: status === stat ? statusColors[stat] : '',
                                        fontWeight: status === stat ? 'bold' : 'normal',
                                        color: status === stat ? 'white' : 'inherit'
                                    }}
                                >
                                    {stat}
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
