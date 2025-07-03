import {FC} from 'react';
// import { Popover } from '../Popover/Popover';
import {VALID_MODE} from '../../../config/constant';
import {TaskItem} from '../../../types/types';
import {useTaskStore} from '../../../stores/storeContext';
import styles from './MobileTasks.module.css';


interface Props {
    task: TaskItem;
}

export const MobileTasks: FC<Props> = ({task}) => {
    const taskStore = useTaskStore();

    const handleNavigateToView = () => {
        taskStore.openModal(VALID_MODE.VIEW, task);
    };

    const taskDate = new Date(task.date.split('.').reverse().join('-'));
    const currentDate = new Date();
    const isPastDue = taskDate < currentDate && task.status !== 'Done';

    // Проверяем, является ли текущая задача выбранной
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
                    {/* <Popover tableTask={task} /> */}
                    <div className={styles.frameOfTaskDate}>
                        <p
                            className={styles.taskTime}
                            style={{color: isPastDue ? 'red' : 'var(--dark)'}}
                        >
                            {task.time}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
