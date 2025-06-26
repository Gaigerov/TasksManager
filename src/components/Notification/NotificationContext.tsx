import { createContext, ReactNode, useContext, useState, FC } from 'react';
import { Notification } from './Notification';
import styles from './Notification.module.css';

interface NotificationType {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

type NotificationContextType = (msg: string, type: 'success' | 'error' | 'info' | 'warning') => void;

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

type Props = {
    children: ReactNode; 
}

export const NotificationProvider: FC<Props> = ({ children }) => {
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    
    const showNotification: NotificationContextType = (msg, type) => {
        const newNotification = { id: Date.now(), message: msg, type };
        setNotifications((prev) => [newNotification, ...prev]);
        
        setTimeout(() => {
            handleClose(newNotification.id);
        }, 7000);
    };

    const handleClose = (id: number) => {
        setNotifications((prevNotifications) =>
            prevNotifications.filter(notification => notification.id !== id)
        );
    };

    return (
        <NotificationContext.Provider value={showNotification}>
            {children}
            <div className={styles.notificationList}>
                {notifications.map((notification) => (
                    <Notification
                        key={notification.id}
                        message={notification.message}
                        type={notification.type}
                        onClose={() => handleClose(notification.id)}
                    />
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
