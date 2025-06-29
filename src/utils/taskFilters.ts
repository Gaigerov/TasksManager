import {TaskItem} from '../types/types';

export const filterTasks = (
    tasks: TaskItem[],
    searchQuery: string,
    statusFilter: string,
    dateFilter: string
): TaskItem[] => {
    const query = searchQuery.toLowerCase().trim();

    return tasks.filter(task => {
        const matchesSearch = query
            ? task.title.toLowerCase().includes(query) ||
            (task.description?.toLowerCase().includes(query) ?? false)
            : true;

        const matchesStatus = statusFilter
            ? task.status === statusFilter
            : true;

        const matchesDate = dateFilter
            ? task.date === dateFilter
            : true;

        return matchesSearch && matchesStatus && matchesDate;
    });
};
