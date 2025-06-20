export interface TaskItem {
    id: string;
    title: string;
    description: string;
    time: string; // формат HH:mm
    date: string; // формат DD.MM.YYYY
    status: TaskStatus;
}

export type TaskStatus = 'To Do' | 'In Progress' | 'Done';
