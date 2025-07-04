import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import styles from './Footer.module.css';
import Button from '../Button/Button';
import listCheckIcon from '../../images/list-check-2.svg';
import calendarCheckIcon from '../../images/calendar-todo-line.svg';
import boardCheckIcon from '../../images/web-board.svg';
import {observer} from 'mobx-react-lite';

const Footer: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <footer className={styles.footer}>
            <div className={styles.buttonGroup}>
                <Button
                    variant="icon"
                    iconSrc={listCheckIcon}
                    alt="List check icon"
                    className={`${styles.footerButton} ${location.pathname === '/' ? styles.active : ''
                        }`}
                    onClick={() => navigate('/')}
                >
                    Tasks
                </Button>
                <Button
                    variant="icon"
                    iconSrc={calendarCheckIcon}
                    alt="Calendar check icon"
                    className={`${styles.footerButton} ${location.pathname === '/calendar' ? styles.active : ''
                        }`}
                    onClick={() => navigate('/calendar')}
                >
                    Calendar
                </Button>
                <Button
                    variant="icon"
                    iconSrc={boardCheckIcon}
                    alt="Board check icon"
                    className={`${styles.footerButton} ${location.pathname === '/board' ? styles.active : ''
                        }`}
                    onClick={() => navigate('/board')}
                >
                    Board
                </Button>
            </div>
        </footer>
    );
};

export default observer(Footer);
