import {useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {TASK_STATUS_COLORS, TaskStatus, VALID_MODE} from '../../../config/constant';
import {TaskItem} from '../../../types/types';
import {useTaskStore} from '../../../stores/storeContext';
import styles from './MobileTasks.module.css';
import Cookies from 'js-cookie';

interface Props {
    task: TaskItem;
}

export const MobileTasks = observer(({task}: Props) => {
    const taskStore = useTaskStore();
    const isPastDue = taskStore.isTaskPastDue(task);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const statusButtonRef = useRef<HTMLButtonElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const user = Cookies.get('user') || '';

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

    const handleNavigateToView = () => {
        taskStore.openModal(VALID_MODE.VIEW, task);
    };

    const isActive = taskStore.currentTask?.id === task.id;

    return (
        <div
            className={styles.taskContainer}
            onClick={handleNavigateToView}
            style={{
                backgroundColor: isActive ? 'var(--light-grey)' : '',
            }}
        >
            <div className={styles.taskContent}>
                <div className={styles.frameOfHeaderTask}>
                    <div className={styles.textOfTask}>
                        <h3 className={styles.taskName}>{task.title}</h3>
                        <p className={styles.taskDescription}>{task.description}</p>
                    </div>
                </div>
                <div className={styles.frameOfFooterTask}>
                    <div className={styles.statusContainer}>
                        <button
                            ref={statusButtonRef}
                            className={styles.statusButton}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsStatusOpen(!isStatusOpen);
                            }}
                            style={{backgroundColor: TASK_STATUS_COLORS[task.status], color: 'var(--white)'}}
                        >
                            {task.status}
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
                                            taskStore.changeTaskStatus(task.id, stat, user);
                                        }}
                                        style={{
                                            backgroundColor: task.status === stat ? TASK_STATUS_COLORS[stat] : '',
                                            fontWeight: task.status === stat ? 'bold' : 'normal',
                                            color: task.status === stat ? 'var(--white)' : 'inherit'
                                        }}
                                    >
                                        {stat}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className={styles.frameOfTaskDate}>
                        <p
                            className={styles.taskTime}
                            style={{color: isPastDue ? 'var(--danger)' : 'var(--dark)'}}
                        >
                            {task.time}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
});
