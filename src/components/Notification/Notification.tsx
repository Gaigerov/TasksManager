import React, {useState, useEffect, useRef} from 'react';
import styles from './Notification.module.css';
import checkCircle from '../../images/сheckСircle.svg';
import alertCircle from '../../images/alertCircle.svg';
import helpCircle from '../../images/helpCircle.svg';
import messageCircle from '../../images/messageCircle.svg';
import xCircle from '../../images/xCircle.svg';

type Props = {
    message: string;
    type: string;
    onClose: () => void;
}

export const Notification: React.FC<Props> = ({ message, type, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const closingRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        timeoutRef.current = setTimeout(() => {
            startClosing();
        }, 7000);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (closingRef.current) clearTimeout(closingRef.current);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const startClosing = () => {
        if (isClosing) return;
        
        setIsClosing(true);
        
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        closingRef.current = setTimeout(() => {
            onClose();
        }, 1500);
    };

    const handleClick = () => {
        startClosing();
    };

    const getBackgroundColor = (type: string) => {
        switch (type) {
            case 'error': return 'rgb(255, 150, 160)';
            case 'warning': return 'rgb(255, 227, 142)';
            case 'success': return 'rgb(51, 228, 146)';
            case 'info': return 'rgb(171, 241, 255)';
            default: return 'rgb(179, 189, 199)';
        }
    };

    const getTitleNotification = (type: string) => {
        switch (type) {
            case 'error': return 'Error';
            case 'warning': return 'Warning';
            case 'success': return 'Success';
            case 'info': return 'Info';
            default: return 'Notification';
        }
    };

    const getIconNotification = (type: string) => {
        switch (type) {
            case 'error': return xCircle;
            case 'warning': return alertCircle;
            case 'success': return checkCircle;
            case 'info': return helpCircle;
            default: return messageCircle;
        }
    };

    const backgroundColor = getBackgroundColor(type);
    const titleNotification = getTitleNotification(type);
    const iconNotification = getIconNotification(type);

    return (
        <div
            className={`${styles.notification} ${isClosing ? styles.fadeOut : ''}`}
            style={{backgroundColor}}
            onClick={handleClick}
        >
            <img className={styles.notification__icon} src={iconNotification} alt="Notification icon" />
            <div className={styles.message}>
                <span className={styles.message__title}>{titleNotification}</span>
                <span className={styles.message__notification}>{message}</span>
            </div>
        </div>
    );
};
