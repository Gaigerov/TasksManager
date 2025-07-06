import React, {useMemo} from 'react';
import {DragDropContext, Droppable, Draggable, DropResult} from '@hello-pangea/dnd';
import {observer} from 'mobx-react-lite';
import {useTaskStore} from '../../stores/storeContext';
import Cookies from 'js-cookie';
import styles from './KanbanBoard.module.css';
import {TASK_STATUS, TASK_STATUS_COLORS, TaskStatus} from '../../config/constant';
import {TaskItem} from '../../types/types';
import KanbanTasks from './KanbanTasks/KanbanTasks';

const KanbanBoard: React.FC = observer(() => {
    const taskStore = useTaskStore();
    const user = Cookies.get('user') || '';

    const columns = useMemo(() => {
        return [
            {
                id: TASK_STATUS.TO_DO,
                title: TASK_STATUS.TO_DO,
                color: TASK_STATUS_COLORS[TASK_STATUS.TO_DO],
                lightColor: 'var(--secondary-light)'
            },
            {
                id: TASK_STATUS.INPROGRESS,
                title: TASK_STATUS.INPROGRESS,
                color: TASK_STATUS_COLORS[TASK_STATUS.INPROGRESS],
                lightColor: 'var(--primary-light)'
            },
            {
                id: TASK_STATUS.DONE,
                title: TASK_STATUS.DONE,
                color: TASK_STATUS_COLORS[TASK_STATUS.DONE],
                lightColor: 'var(--success-light)'
            }
        ];
    }, []);

    const tasksByStatus = useMemo(() => {
        const grouped: Record<TaskStatus, TaskItem[]> = {
            [TASK_STATUS.TO_DO]: [],
            [TASK_STATUS.INPROGRESS]: [],
            [TASK_STATUS.DONE]: []
        };

        taskStore.tasks.forEach(task => {
            if (task.status === TASK_STATUS.TO_DO ||
                task.status === TASK_STATUS.INPROGRESS ||
                task.status === TASK_STATUS.DONE) {
                grouped[task.status].push(task);
            }
        });

        (Object.keys(grouped) as TaskStatus[]).forEach(status => {
            grouped[status].sort((a, b) => {
                try {
                    const parseDateTime = (task: TaskItem) => {
                        const [day, month, year] = task.date.split('.').map(Number);
                        const [hours, minutes] = task.time.split(':').map(Number);
                        return new Date(year, month - 1, day, hours, minutes).getTime();
                    };
                    return parseDateTime(a) - parseDateTime(b);
                } catch {
                    return 0;
                }
            });
        });

        return grouped;
    }, [taskStore.tasks]);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const {source, destination, draggableId} = result;

        if (source.droppableId !== destination.droppableId) {
            taskStore.changeTaskStatus(
                draggableId,
                destination.droppableId as TaskStatus,
                user
            );
        }
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className={styles.container}>
                {columns.map(column => {
                    const tasks = tasksByStatus[column.id] || [];
                    return (
                        <div
                            key={column.id}
                            className={styles.column}
                            style={{
                                backgroundColor: column.lightColor,
                                borderTop: `4px solid ${column.color}`
                            }}
                        >
                            <h2
                                className={styles.columnHeader}
                                style={{
                                    backgroundColor: column.color,
                                    borderRadius: 16,
                                    textAlign: 'center',
                                    color: 'white'
                                }}
                            >
                                {column.title} ({tasks.length})
                            </h2>
                            <Droppable
                                droppableId={column.id}
                                key={column.id}
                            >
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`${styles.droppableArea} ${snapshot.isDraggingOver ? styles.droppableAreaDraggingOver : ''
                                            }`}
                                    >
                                        {tasks.map((task, index) => (
                                            <Draggable
                                                key={task.id}
                                                draggableId={task.id}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`${styles.taskContainer} ${snapshot.isDragging ? styles.taskContainerDragging : ''
                                                            }`}
                                                    >
                                                        <KanbanTasks
                                                            task={task}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    );
                })}
            </div>
        </DragDropContext>
    );
});

export default KanbanBoard;
