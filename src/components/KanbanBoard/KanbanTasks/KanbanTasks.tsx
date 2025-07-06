import styles from './KanbanTasks.module.css';
import {observer} from 'mobx-react-lite';
import {TaskItem} from '../../../types/types';
import {useTaskStore} from '../../../stores/storeContext';

interface TaskProps {
    task: TaskItem;
    isLastTask?: boolean;
}

const KanbanTasks = observer(({task}: TaskProps) => {
    const {id, title, description, time, date} = task;
    const taskStore = useTaskStore();
    const isActive = taskStore.currentTask?.id === id;
    const isPastDue = taskStore.isTaskPastDue(task);

    return (
        <div
            className={`${styles.card} ${isActive ? styles.active : ''}`}
        >
            <div className={styles.contentWrapper}>
                <div className={styles.textContent}>
                    <h3 className={styles.title}>
                        {title}
                    </h3>
                    <p className={styles.description}>
                        {description}
                    </p>
                </div>

            </div>

            <div className={styles.footer}>
                <div className={`${styles.datetime} ${isPastDue ? styles.isPastDue : ''}`}>
                    <span className={styles.time}>{time}</span>
                    <span className={styles.date}>{date}</span>
                </div>
            </div>
        </div>
    );
});

export default KanbanTasks;
