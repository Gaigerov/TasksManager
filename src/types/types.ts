export interface TaskItem {
    id: string;
    title: string;
    description: string;
    time: string;
    date: string; 
    status: TaskStatus;
}

export type TaskStatus = 'To Do' | 'In Progress' | 'Done';
