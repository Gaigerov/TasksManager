import React from 'react';
import Header from '../Header/Header';
import TaskManager from '../TaskManager/TaskManager';
import Footer from '../Footer/Footer';
import styles from './MainPage.module.css';
import {useTaskStore} from '../../stores/storeContext';
import TaskModal from '../TaskModal/TaskModal';

const MainPage: React.FC = () => {
    const taskStore = useTaskStore();

    return (
        <div className={styles.mainContainer}>
            <Header onOpenModal={() => taskStore.openModal()} />
            <main className={styles.content}>
                <TaskManager />
            </main>
            <Footer />
            <TaskModal />
        </div>
    );
};

export default MainPage;
