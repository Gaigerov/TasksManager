import React from 'react';
import styles from './TasksTable.module.css';
import TaskRow from './TaskRow/TaskRow';
import {TaskItem} from '../../types/types';

interface TasksTableProps {
    tasks: TaskItem[],
}

const TasksTable: React.FC<TasksTableProps> = ({tasks}) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    return (
        <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
                <div className={styles.column} style={{width: '110px'}}>Status</div>
                <div className={styles.column} style={{width: '200px'}}>Title</div>
                <div className={styles.column} style={{width: 'auto', flex: 1}}>Description</div>
                <div className={styles.column} style={{width: '120px'}}>Date</div>
                <div className={styles.column} style={{width: '140px'}}></div>
            </div>

            <div className={styles.tableBody}>
                {tasks.map((task) => {
                    return (
                        <TaskRow
                            key={task.id}
                            task={task}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default TasksTable;
