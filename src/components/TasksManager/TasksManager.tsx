import React, {useState} from 'react';
import {observer} from 'mobx-react-lite';
import TasksList from '../TasksList/TasksList';
import TasksTable from '../TasksTable/TasksTable';
import styles from './TasksManager.module.css';
import {useBreakpoint} from '../../hooks/useBreakpoints';
import {Pagination} from '../Pagination/Pagination';
import {useTaskStore} from '../../stores/storeContext';

const TasksManager: React.FC = observer(() => {
    const breakpoint = useBreakpoint();
    const taskStore = useTaskStore();
    const {filteredTasks} = taskStore;
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage, setTasksPerPage] = useState(10);
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

    return (
        <div className={styles.tasksManager}>
            {breakpoint === 'desktop' ? <TasksTable tasks={currentTasks} /> : <TasksList />}
            {breakpoint === 'desktop' && <Pagination
                currentPage={currentPage}
                tasksPerPage={tasksPerPage}
                totalTasks={filteredTasks.length}
                onPageChange={setCurrentPage}
                onTasksPerPageChange={setTasksPerPage}
            />
            }
        </div>
    );
});

export default TasksManager;