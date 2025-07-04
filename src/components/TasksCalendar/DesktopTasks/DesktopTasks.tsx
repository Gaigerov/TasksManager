import {FC} from 'react';
import styles from './DesktopTasks.module.css';
import {TaskItem} from '../../../types/types';
import {STATUS_COLOR, TASK_STATUS} from '../../../config/constant';
import {useTaskStore} from '../../../stores/storeContext';

interface Props {
    task: TaskItem;
    onView: (task: TaskItem) => void;
}

export const DesktopTasks: FC<Props> = ({task, onView}) => {
    const taskStore = useTaskStore();
    const isPastDue = taskStore.isTaskPastDue(task);
    const handleClick = () => {
        onView(task);
    };

    const getStatusColor = () => {
        if (isPastDue && (
            task.status === TASK_STATUS.TO_DO ||
            task.status === TASK_STATUS.INPROGRESS
        )) {
            return STATUS_COLOR.PAST_DUE;
        }

        switch (task.status) {
            case TASK_STATUS.DONE:
                return STATUS_COLOR.DONE;
            case TASK_STATUS.INPROGRESS:
                return STATUS_COLOR.INPROGRESS;
            case TASK_STATUS.TO_DO:
            default:
                return STATUS_COLOR.TO_DO;
        }
    };

    return (
        <div
            className={styles.taskContainer}
            onClick={handleClick}
            style={{backgroundColor: getStatusColor()}}
        >
            <div className={styles.taskContent}>
                <div className={styles.header}>
                    <p className={styles.title}>{task.title}</p>
                </div>
                {task.description && (
                    <p className={styles.description}>{task.description}</p>
                )}
                <p className={styles.time} style={{color: isPastDue ? 'var(--danger)' : 'var(--white)'}}>
                    {task.time}
                </p>
            </div>
        </div>
    );
};
