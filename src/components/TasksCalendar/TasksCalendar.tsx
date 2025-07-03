import {FC, useState, useMemo, useCallback} from 'react';
import {useTaskStore} from '../../stores/storeContext';
import {useBreakpoint} from '../../hooks/useBreakpoints';
import {MobileTasks} from '../TasksCalendar/MobileTasks/MobileTasks';
import {TaskItem} from '../../types/types';
import styles from './TasksCalendar.module.css';

const TasksCalendar: FC = () => {
    const taskStore = useTaskStore();
    const breakpoint = useBreakpoint();

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const formatDate = useCallback((date: Date): string => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }, []);

    const formatDisplayDate = useCallback((date: Date): string => {
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }, []);

    const handlePrevDay = () => {
        setSelectedDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() - 1);
            return newDate;
        });
    };

    const handleNextDay = () => {
        setSelectedDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + 1);
            return newDate;
        });
    };

    const filteredTasks = taskStore.filteredTasks;

    // Группировка под mobile
    const mobileTasks = useMemo(() => {
        if (breakpoint !== 'mobile') return null;

        const currentDateStr = formatDate(selectedDate);
        const tasksForDay = filteredTasks.filter(task => task.date === currentDateStr);

        const grouped: Record<string, TaskItem[]> = {};

        tasksForDay.forEach(task => {
            const hour = task.time.split(':')[0].padStart(2, '0');
            if (!grouped[hour]) grouped[hour] = [];
            grouped[hour].push(task);
        });

        return grouped;
    }, [breakpoint, filteredTasks, selectedDate, formatDate]);

    // Группировка под tablet
    const tabletTasks = useMemo(() => {
        if (breakpoint !== 'tablet') return null;

        const nextDay = new Date(selectedDate);
        nextDay.setDate(selectedDate.getDate() + 1);

        const date1Str = formatDate(selectedDate);
        const date2Str = formatDate(nextDay);

        const tasksDay1 = filteredTasks.filter(task => task.date === date1Str);
        const tasksDay2 = filteredTasks.filter(task => task.date === date2Str);

        const groupByHour = (tasks: TaskItem[]) => {
            const grouped: Record<string, TaskItem[]> = {};
            tasks.forEach(task => {
                const hour = task.time.split(':')[0].padStart(2, '0');
                if (!grouped[hour]) grouped[hour] = [];
                grouped[hour].push(task);
            });
            return grouped;
        };

        const groupedDay1 = groupByHour(tasksDay1);
        const groupedDay2 = groupByHour(tasksDay2);

        const allHours = Array.from(
            new Set([
                ...Object.keys(groupedDay1),
                ...Object.keys(groupedDay2)
            ])
        ).sort();

        return {
            day1: groupedDay1,
            day2: groupedDay2,
            hours: allHours,
            nextDay
        };
    }, [breakpoint, filteredTasks, selectedDate, formatDate]);

    // Рендер под mobile
    const renderMobileView = () => {
        if (!mobileTasks) return null;

        const hours = Object.keys(mobileTasks).sort();
        const currentDate = formatDisplayDate(selectedDate);

        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <button onClick={handlePrevDay} className={styles.navButton}>←</button>
                    <div className={styles.dateDisplay}>{currentDate}</div>
                    <button onClick={handleNextDay} className={styles.navButton}>→</button>
                </div>

                <div className={styles.tasksContainer}>
                    {hours.length > 0 ? (
                        hours.map(hour => (
                            <div key={hour} className={styles.hourBlock}>
                                <div className={styles.hourHeader}>{hour}:00</div>
                                {mobileTasks[hour].map(task => (
                                    <MobileTasks key={task.id} task={task} />
                                ))}
                            </div>
                        ))
                    ) : (
                        <div className={styles.noTasks}>Нет задач на выбранный день</div>
                    )}
                </div>
            </div>
        );
    };

    // Рендер под tablet
    const renderTableView = () => {
        if (!tabletTasks) return null;

        const {day1, day2, hours, nextDay} = tabletTasks;
        const currentDate = formatDisplayDate(selectedDate);
        const nextDate = formatDisplayDate(nextDay);

        return (
            <div className={styles.tabletLayout}>
                <div className={styles.tabletHeader}>
                    <button onClick={handlePrevDay} className={styles.navButton}>←</button>
                    <div className={styles.tabletDates}>
                        <div className={styles.tabletDateColumn}>{currentDate}</div>
                        <div className={styles.tabletDateColumn}>{nextDate}</div>
                    </div>
                    <button onClick={handleNextDay} className={styles.navButton}>→</button>
                </div>

                <div className={styles.tabletTasksContainer}>
                    {hours.map(hour => (
                        <div key={`hour-${hour}`} className={styles.tabletHourBlock}>
                            <div className={styles.tabletHourHeader}>{hour}:00</div>

                            <div className={styles.tabletDayColumns}>
                                <div className={styles.tabletDayColumn}>
                                    {day1[hour]?.map(task => (
                                        <MobileTasks key={`d1-${task.id}`} task={task} />
                                    ))}
                                </div>

                                <div className={styles.tabletDayColumn}>
                                    {day2[hour]?.map(task => (
                                        <MobileTasks key={`d2-${task.id}`} task={task} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <>
            {breakpoint === 'mobile' && renderMobileView()}
            {breakpoint === 'tablet' && renderTableView()}
        </>
    );
};

export default TasksCalendar;
