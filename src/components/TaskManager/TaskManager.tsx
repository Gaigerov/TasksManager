import React from 'react';
import { observer } from 'mobx-react-lite';
import TasksList from '../TasksList/TasksList';
import TasksTable from '../TasksTable/TasksTable';
import styles from './TaskManager.module.css';
import { useBreakpoint } from '../../hooks/useBreakpoints';

const TaskManager: React.FC = observer(() => {
    const breakpoint = useBreakpoint();
    
    return (
        <div className={styles.taskManager}>
            {breakpoint === 'desktop' ? <TasksTable /> : <TasksList />}
        </div>
    );
});

export default TaskManager;