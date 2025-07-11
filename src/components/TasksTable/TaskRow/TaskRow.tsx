import React, {useRef, useState, useEffect, useCallback} from 'react';
import styles from './TaskRow.module.css';
import deleteIcon from '../../../images/delete.svg';
import editIcon from '../../../images/edit.svg';
import cloneIcon from '../../../images/clone.svg';
import {useTaskStore} from '../../../stores/storeContext';
import {TASK_STATUS_COLORS, TaskStatus, VALID_MODE} from '../../../config/constant';
import Cookies from 'js-cookie';
import {observer} from 'mobx-react-lite';
import PopupRemover from '../../PopupRemover/PopupRemover';

interface TaskRowProps {
    task: {
        id: string;
        status: TaskStatus;
        title: string;
        description: string;
        date: string;
        time: string;
    };
}

const TaskRow: React.FC<TaskRowProps> = ({
    task,
}) => {
    const taskStore = useTaskStore();
    const user = Cookies.get('user') || '';
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const statusButtonRef = useRef<HTMLButtonElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const rowClassName = `${styles.row} ${isStatusOpen ? styles.statusPopupOpen : ''}`;
    const isPastDue = taskStore.isTaskPastDue(task);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const deleteContainerRef = useRef<HTMLDivElement>(null);

    const openEditModal = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        taskStore.openModal(VALID_MODE.EDIT, task);
    };

    const openViewModal = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        taskStore.openModal(VALID_MODE.VIEW, task);
    };

    const handleDelete = useCallback(() => {
        taskStore.deleteTask(task.id, user);
        setIsDeletePopupOpen(false);
    }, [task.id, user, taskStore]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current &&
                !popupRef.current.contains(event.target as Node)) {
                setIsStatusOpen(false);
            }
            if (isDeletePopupOpen &&
                deleteContainerRef.current &&
                !deleteContainerRef.current.contains(event.target as Node)) {
                setIsDeletePopupOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isStatusOpen, isDeletePopupOpen]);

    return (
        <div className={rowClassName} onClick={openViewModal}>
            <div className={`${styles.column} ${styles.statusColumn}`} style={{width: '110px'}}>
                <div className={styles.statusContainer}>
                    <button
                        ref={statusButtonRef}
                        className={styles.statusButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsStatusOpen(!isStatusOpen);
                        }}
                        style={{
                            backgroundColor: TASK_STATUS_COLORS[task.status],
                            color: 'var(--white)'
                        }}
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
            </div>

            <div className={styles.column} style={{width: '200px'}} title={task.title}>
                <div className={styles.textContainer}>
                    {task.title}
                </div>
            </div>

            <div className={styles.column} style={{flex: 1}} title={task.description}>
                <div className={styles.textContainer}>
                    {task.description}
                </div>
            </div>

            <div className={`${styles.timedate} ${isPastDue ? styles.pastDue : ''}`} style={{width: '120px'}}>
                <div>{task.time}</div>
                <div>{task.date}</div>
            </div>

            <div className={styles.column} style={{width: '140px'}}>
                <div className={styles.actions}>
                    <div
                        className={styles.iconWrapper}
                        onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(e);
                        }}
                    >
                        <img src={editIcon} alt="Edit" className={styles.icon} />
                    </div>
                    <div
                        className={styles.iconWrapper}
                        onClick={(e) => {
                            e.stopPropagation();
                            taskStore.cloneTask(task.id, user);
                        }}
                    >
                        <img src={cloneIcon} alt="Clone" className={styles.icon} />
                    </div>
                    <div
                        ref={deleteContainerRef}
                        className={styles.deleteContainer}
                    >
                        <div
                            className={styles.iconWrapper}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsDeletePopupOpen(!isDeletePopupOpen);
                            }}
                        >
                            <img src={deleteIcon} alt="Delete" className={styles.icon} />
                        </div>
                        {isDeletePopupOpen && (
                            <PopupRemover
                                onRemove={handleDelete}
                                onCancel={() => setIsDeletePopupOpen(false)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default observer(TaskRow);
