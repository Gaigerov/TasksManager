import React from 'react';
import styles from './Footer.module.css';
import Button from '../Button/Button';
import listCheckIcon from '../../images/list-check-2.svg';
import calendarCheckIcon from '../../images/calendar-todo-line.svg';
import boardCheckIcon from '../../images/web-board.svg'

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.buttonGroup}>
                <Button
                    variant="icon"
                    iconSrc={listCheckIcon}
                    alt="List check icon"
                    className={styles.footerButton}
                    onClick={() => console.log('Icon button clicked')}
                >
                    Tasks
                </Button>
                <Button
                    variant="icon"
                    iconSrc={calendarCheckIcon}
                    alt="Calendar check icon"
                    className={styles.footerButton}
                    onClick={() => console.log('Icon button clicked')}
                >
                    Calendar
                </Button>
                <Button
                    variant="icon"
                    iconSrc={boardCheckIcon}
                    alt="Board check icon"
                    className={styles.footerButton}
                    onClick={() => console.log('Icon button clicked')}
                >
                    Board
                </Button>
            </div>
        </footer>
    );
};

export default Footer;
