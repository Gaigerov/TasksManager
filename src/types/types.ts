import {TaskStatus} from '../config/constant';

export interface TaskItem {
    id: string;
    title: string;
    description: string;
    time: string;
    date: string; 
    status: TaskStatus;
}
