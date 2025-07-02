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

    const parseDDMMYYYY = (dateString: string) => {
        const [day, month, year] = dateString.split('.');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    };

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
                    const taskDate = parseDDMMYYYY(task.date);
                    const isPastDue = taskDate < currentDate;
                    return (
                        <TaskRow
                            key={task.id}
                            task={task}
                            isPastDue={isPastDue}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default TasksTable;
