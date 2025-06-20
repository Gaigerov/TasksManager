import {TaskItem} from '../types/types';

// Валидация даты в формате DD.MM.YYYY
export const isValidDate = (date: string): boolean => {
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

    return (
        dateObj.getDate() === day &&
        dateObj.getMonth() === month - 1 &&
        dateObj.getFullYear() === year
    );
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

// Основная функция валидации задачи
export const validateTask = (task: TaskItem): string[] => {
    const errors: string[] = [];

    // Проверка обязательных полей
    if (!task.title.trim()) {
        errors.push('Название задачи обязательно');
    }

    // Валидация даты
    if (task.date && !isValidDate(task.date)) {
        errors.push('Пожалуйста, введите корректную дату в формате DD.MM.YYYY');
    }

    // Валидация времени
    if (task.time && !isValidTime(task.time)) {
        errors.push('Пожалуйста, введите корректное время в формате HH:MM');
    }

    return errors;
};
