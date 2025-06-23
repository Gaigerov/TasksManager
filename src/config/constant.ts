export const VALID_MODE = {
    CREATE: 'create',
    EDIT: 'edit',
    VIEW: 'view',
    REMOVE: 'remove',
    FILTER: 'filter',
};

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
};
