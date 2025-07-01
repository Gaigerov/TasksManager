import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useTaskStore } from '../../stores/storeContext';
import { useNotification } from '../Notification/NotificationContext';
import { Loader } from '../Loader/Loader';
import styles from './AuthPage.module.css';

interface AuthPageProps {
    onAuthSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
    const taskStore = useTaskStore();
    const showNotification = useNotification();
    const [user, setUser] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser(e.target.value);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user.trim()) {
            setError('Введите ваше имя');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('https://simple-storage.vigdorov.ru/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    login: user.trim()
                })
            });

            const responseText = await response.text();

            if (!response.ok) {
                let errorText = response.statusText;
                try {
                    const errorData = JSON.parse(responseText);
                    errorText = errorData.message || errorText;
                } catch {
                    errorText = responseText || errorText;
                }
                throw new Error(`Ошибка авторизации: ${response.status} - ${errorText}`);
            }

            let token: string;
            try {
                const data = JSON.parse(responseText);
                token = data.token || data;
            } catch {
                token = responseText;
            }
            token = token.replace(/^"(.*)"$/, '$1');

            if (!token) {
                throw new Error('Токен не получен от сервера');
            }

            // Сохраняем токен и пользователя в куки
            Cookies.set('authToken', token, {
                expires: 3,
                sameSite: 'Lax',
                secure: process.env.NODE_ENV === 'production'
            });

            Cookies.set('user', user.trim(), {
                expires: 3,
                sameSite: 'Lax',
                secure: process.env.NODE_ENV === 'production'
            });

            // Ключевое изменение: очищаем данные предыдущего пользователя
            taskStore.clearAllData();
            
            // Инициализируем задачи для нового пользователя
            await taskStore.initializeTasks(user.trim());

            onAuthSuccess();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
            setError(errorMessage);
            showNotification(`Ошибка авторизации: ${errorMessage}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>Введите ваше имя</h2>
                <form className={styles.modalForm} onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={user}
                        onChange={handleInputChange}
                        placeholder="Имя"
                        className={styles.modalFormInput}
                        required
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className={styles.modalFormButton}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Загрузка...' : 'Войти'}
                    </button>
                </form>
                {error && <p className={styles.modalError}>{error}</p>}
            </div>
            <Loader open={isLoading} />
        </div>
    );
};
