import {FC, useState, useMemo, useCallback} from 'react';
import {useTaskStore} from '../../stores/storeContext';
import {useBreakpoint} from '../../hooks/useBreakpoints';
import {MobileTasks} from '../TasksCalendar/MobileTasks/MobileTasks';
import {DesktopTasks} from './DesktopTasks/DesktopTasks';
import {TaskItem} from '../../types/types';
import styles from './TasksCalendar.module.css';
import chevronLeft from '../../images/ChevronLeft.svg'
import chevronRight from '../../images/ChevronRight.svg'
import Button from '../Button/Button';

const parseDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('.');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
};

const isToday = (date: Date) => {
    const today = new Date();
    return isSameDay(date, today);
};

const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
};

const getWeekDates = (startDate: Date): {date: Date, day: string}[] => {
    const dates = [];
    const current = new Date(startDate);

    // Найдем понедельник (начало недели)
    const dayOfWeek = current.getDay();
    const diff = current.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(current.setDate(diff));

    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);

        dates.push({
            date,
            day: date.toLocaleDateString('ru-RU', {weekday: 'short'})
        });
    }

    return dates;
};

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

    // Форматирование даты для отображения (dd.mm.yyyy)
    const formatDisplayDate = useCallback((date: Date): string => {
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }, []);

    // Навигация по дням (для mobile/tablet)
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

    // Навигация по неделям (для desktop)
    const handlePrevWeek = () => {
        setSelectedDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() - 7);
            return newDate;
        });
    };

    const handleNextWeek = () => {
        setSelectedDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + 7);
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

    // Данные для desktop-режима
    const desktopData = useMemo(() => {
        if (breakpoint !== 'desktop') return null;
        const weekDates = getWeekDates(selectedDate);
        const weekTasks = filteredTasks.filter(task => {
            const taskDate = parseDate(task.date);
            return weekDates.some(day => isSameDay(day.date, taskDate));
        });

        const groupedByTime: Record<string, TaskItem[]> = {};
        weekTasks.forEach(task => {
            const hour = task.time.split(':')[0].padStart(2, '0');
            if (!groupedByTime[hour]) groupedByTime[hour] = [];
            groupedByTime[hour].push(task);
        });

        const uniqueTimes = Object.keys(groupedByTime).sort();

        return {
            weekDates,
            groupedByTime,
            uniqueTimes
        };
    }, [breakpoint, filteredTasks, selectedDate]);

    const handleViewTask = useCallback((task: TaskItem) => {
        taskStore.openModal('view', task);
    }, [taskStore]);

    // Рендер под mobile
    const renderMobileView = () => {
        if (!mobileTasks) return null;

        const hours = Object.keys(mobileTasks).sort();
        const currentDate = formatDisplayDate(selectedDate);

        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <Button
                        variant="icon"
                        iconSrc={chevronLeft}
                        alt="clickLeft"
                        className={styles.navButton}
                        onClick={handlePrevDay}
                    />
                    <div className={styles.dateDisplay}>{currentDate}</div>
                    <Button
                        variant="icon"
                        iconSrc={chevronRight}
                        alt="clickRight"
                        className={styles.navButton}
                        onClick={handleNextDay}
                    />
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
                    <Button
                        variant="icon"
                        iconSrc={chevronLeft}
                        alt="clickLeft"
                        className={styles.navButton}
                        onClick={handlePrevDay}
                    />
                    <div className={styles.tabletDates}>
                        <div className={styles.tabletDateColumn}>{currentDate}</div>
                        <div className={styles.tabletDateColumn}>{nextDate}</div>
                    </div>
                    <Button
                        variant="icon"
                        iconSrc={chevronRight}
                        alt="clickRight"
                        className={styles.navButton}
                        onClick={handleNextDay}
                    />
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

    // Рендер под desktop
    const renderDesktopView = () => {
        if (!desktopData) return null;

        const {weekDates, groupedByTime, uniqueTimes} = desktopData;

        return (
            <div className={styles.desktopLayout}>
                <div className={styles.desktopHeader}>
                    <Button
                        variant="icon"
                        iconSrc={chevronLeft}
                        alt="previous week"
                        className={styles.navButton}
                        onClick={handlePrevWeek}
                    />
                    <div className={styles.weekDays}>
                        {weekDates.map((day, index) => (
                            <div key={index} className={`${styles.weekDay} ${isToday(day.date) ? styles.today : ''}`}>
                                <span className={styles.weekDate}>{formatDisplayDate(day.date)}</span>
                                <span className={styles.weekDayName}>{day.day}</span>
                            </div>
                        ))}
                    </div>
                    <Button
                        variant="icon"
                        iconSrc={chevronRight}
                        alt="next week"
                        className={styles.navButton}
                        onClick={handleNextWeek}
                    />
                </div>

                <div className={styles.desktopTasksContainer}>
                    {uniqueTimes.map(time => (
                        <div key={`time-${time}`} className={styles.desktopHourBlock}>
                            <div className={styles.desktopHourHeader}>{time}:00</div>

                            <div className={styles.desktopDayColumns}>
                                {weekDates.map((day, dayIndex) => {
                                    const tasksForSlot = groupedByTime[time].filter(task => {
                                        const taskDate = parseDate(task.date);
                                        return isSameDay(taskDate, day.date);
                                    });

                                    return (
                                        <div key={`day-${dayIndex}`} className={styles.dayColumn}>
                                            {tasksForSlot.map(task => (
                                                <DesktopTasks
                                                    key={task.id}
                                                    task={task}
                                                    onView={handleViewTask}
                                                />
                                            ))}
                                        </div>
                                    );
                                })}
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
            {breakpoint === 'desktop' && renderDesktopView()}
        </>
    );
};

export default TasksCalendar;
