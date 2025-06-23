import React from 'react';
import {observer} from 'mobx-react-lite';
import TasksList from '../TasksList/TasksList';
import styles from './TaskManager.module.css';

const TaskManager: React.FC = observer(() => {

    return (
        <div className={styles.taskManager}>
            <TasksList />
        </div>
    );
});

export default TaskManager;
