import {TaskItem} from '../types/types';

// Валидация даты в формате DD.MM.YYYY
export const isValidDate = (date: string, minDate?: Date): boolean => {
    if (!date) return true; // Разрешаем пустую дату

    // Проверка формата с помощью регулярного выражения
    const regex = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!regex.test(date)) return false;

    // Разбор даты на компоненты
    const [day, month, year] = date.split('.').map(Number);

    // Проверка корректности числовых значений
    if (day < 1 || day > 31) return false;
    if (month < 1 || month > 12) return false;
    if (year < 1900 || year > 2100) return false;

    // Проверка с помощью Date объекта
    const dateObj = new Date(year, month - 1, day);
    const isValid = (
        dateObj.getDate() === day &&
        dateObj.getMonth() === month - 1 &&
        dateObj.getFullYear() === year
    );

    // Проверка минимальной даты
    if (isValid && minDate) {
        // Создаем minDate без времени для корректного сравнения
        const minDateWithoutTime = new Date(minDate);
        minDateWithoutTime.setHours(0, 0, 0, 0);

        return dateObj >= minDateWithoutTime;
    }

    return isValid;
};

// Валидация времени в формате HH:MM
export const isValidTime = (time: string): boolean => {
    if (!time) return true; // Разрешаем пустое время

    // Проверка формата
    const regex = /^\d{2}:\d{2}$/;
    if (!regex.test(time)) return false;

    // Разбор времени на компоненты
    const [hours, minutes] = time.split(':').map(Number);

    // Проверка диапазонов
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
};

// Тип для ошибок валидации
export type TaskValidationErrors = {
    title: string[];
    description: string[];
    date: string[];
    time: string[];
};

// Основная функция валидации задачи (исправленная)
export const validateTask = (task: TaskItem): TaskValidationErrors => {
    const errors: TaskValidationErrors = {
        title: [],
        description: [],
        date: [],
        time: [],
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Валидация названия
    if (!task.title.trim()) {
        errors.title.push('Название задачи обязательно');
    }

    // Валидация описания
    if (!task.description.trim()) {
        errors.description.push('Описание задачи обязательно');
    }

    // Валидация даты
    if (!task.date.trim()) {
        errors.date.push('Наличие даты обязательно');
    } else {
        if (!isValidDate(task.date, today)) {
            if (!/^\d{2}\.\d{2}\.\d{4}$/.test(task.date)) {
                errors.date.push('Пожалуйста, введите корректную дату в формате DD.MM.YYYY');
            } else {
                const [day, month, year] = task.date.split('.').map(Number);
                const dateObj = new Date(year, month - 1, day);
                if (dateObj < today) {
                    errors.date.push('Дата не может быть раньше сегодняшнего дня');
                } else {
                    errors.date.push('Пожалуйста, введите корректную дату');
                }
            }
        }
    }

    // Валидация времени
    if (!task.time.trim()) {
        errors.time.push('Наличие времени обязательно');
    } else if (!isValidTime(task.time)) {
        errors.time.push('Пожалуйста, введите корректное время в формате HH:MM');
    }

    return errors;
};
