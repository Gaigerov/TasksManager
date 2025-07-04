export const VALID_MODE = {
    CREATE: 'create',
    EDIT: 'edit',
    VIEW: 'view',
    REMOVE: 'remove',
    FILTER: 'filter',
};

export type ValidMode = typeof VALID_MODE[keyof typeof VALID_MODE];

export const VALID_MODES = [
    VALID_MODE.CREATE,
    VALID_MODE.EDIT,
    VALID_MODE.VIEW,
    VALID_MODE.REMOVE,
    VALID_MODE.FILTER,
];

export const TASK_STATUS = {
    EMPTY: '',
    TO_DO: 'To Do',
    INPROGRESS: 'In Progress',
    DONE: 'Done',
};

export const TASK_STATUSES = [
    TASK_STATUS.EMPTY,
    TASK_STATUS.TO_DO,
    TASK_STATUS.INPROGRESS,
    TASK_STATUS.DONE,
];

export const APP_LIFECYCLE_STATUS = {
    INITIALIZATION: 'INITIALIZATION',
    READY: 'READY',
    DESTROYING: 'DESTROYING',
    ERROR: 'ERROR',
} as const;

export type AppLifecycleStatus =
    typeof APP_LIFECYCLE_STATUS[keyof typeof APP_LIFECYCLE_STATUS];

export const STATUS_COLOR = {
    TO_DO: 'var(--secondary)',
    TO_DO_LIGHT: 'var(--secondary-light)',
    INPROGRESS: 'var(--primary)',
    DONE: 'var(--success)',
    PAST_DUE: 'var(--danger-light)'
} as const;

export const TASK_STATUS_COLORS = {
    'To Do': STATUS_COLOR.TO_DO,
    'In Progress': STATUS_COLOR.INPROGRESS,
    'Done': STATUS_COLOR.DONE,
} as const;

