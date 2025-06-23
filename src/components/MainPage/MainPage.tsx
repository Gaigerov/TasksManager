import React, { useEffect } from 'react';
import Header from '../Header/Header';
import TaskManager from '../TaskManager/TaskManager';
import Footer from '../Footer/Footer';
import styles from './MainPage.module.css';
import { useTaskStore } from '../../stores/storeContext';
import TaskModal from '../TaskModal/TaskModal';
import { useNavigate, useLocation } from 'react-router-dom';
import { VALID_MODE } from '../../config/constant';

const MainPage: React.FC = () => {
    const taskStore = useTaskStore();
    const navigate = useNavigate();
    const location = useLocation();
    
    const params = new URLSearchParams(location.search);
    const taskId = params.get('id');
    const mode = location.pathname.substring(1);

    useEffect(() => {
        taskStore.setNavigate(navigate);
    }, [navigate, taskStore]);

    useEffect(() => {      
        if (mode === VALID_MODE.EDIT && taskId) {
            const task = taskStore.tasks.find(t => t.id === taskId);
            if (task) {
                taskStore.setCurrentTask(task);
            } else {
                console.error(`Task with id ${taskId} not found`);
                navigate('/');
            }
        } else if (mode === VALID_MODE.CREATE) {
            taskStore.setCurrentTask(null);
        }
    }, [mode, taskId, taskStore, navigate]);

    return (
        <div className={styles.mainContainer}>
            <Header onOpenModal={() => taskStore.openModal(VALID_MODE.CREATE)} />
            <main className={styles.content}>
                <TaskManager />
            </main>
            <Footer />
            
            <TaskModal />
        </div>
    );
};

export default MainPage;
