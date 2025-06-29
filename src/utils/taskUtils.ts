import {TaskItem} from '../types/types';
import {VALID_MODE, ValidMode} from '../config/constant';

export const createNewTask = (task: Omit<TaskItem, 'id'>): TaskItem => ({
    ...task,
    id: Date.now().toString(),
});

export const getModalPath = (
    mode: ValidMode,
    task?: TaskItem
): string | null => {
    if (mode === VALID_MODE.VIEW && task) {
        return `/${VALID_MODE.VIEW}?id=${task.id}`;
    }
    if (mode === VALID_MODE.EDIT && task) {
        return `/${VALID_MODE.EDIT}?id=${task.id}`;
    }
    if (mode === VALID_MODE.FILTER) {
        return `/${VALID_MODE.FILTER}`;
    }
    if (mode === VALID_MODE.CREATE) {
        return `/${VALID_MODE.CREATE}`;
    }
    return null;
};
