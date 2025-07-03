import {useState, useEffect} from 'react';
import {createHashRouter, RouterProvider} from 'react-router-dom';
import './index.css';
import {TaskStoreProvider, useTaskStore} from './stores/storeContext';
import {NotificationProvider} from './components/Notification/NotificationContext';
import {AppLifecycleProvider} from './components/AppLifeCycleContext/AppLifeCycleContext';
import {AuthPage} from './components/AuthPage/AuthPage';
import {MainPage} from './components/MainPage/MainPage';
import Cookies from 'js-cookie';
import TasksManager from './components/TasksManager/TasksManager';
import TasksCalendar from './components/TasksCalendar/TasksCalendar';
// import TasksBoard from './components/TaskBoard/TaskBoard';

const AppRouter = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const taskStore = useTaskStore();

    useEffect(() => {
        const authToken = Cookies.get('authToken');
        const user = Cookies.get('user');

        if (authToken && user) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }

        setIsCheckingAuth(false);
    }, []);

    const handleAuthSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        taskStore.clearAllData();
        Cookies.remove('authToken');
        Cookies.remove('user');
        setIsAuthenticated(false);
    };

    if (isCheckingAuth) {
        return <div className="auth-checking">Проверка авторизации...</div>;
    }

    const router = createHashRouter([
        {
            path: "/*",
            element: isAuthenticated ? (
                <MainPage onLogout={handleLogout} />
            ) : (
                <AuthPage onAuthSuccess={handleAuthSuccess} />
            ),
            children: [
                {index: true, element: <TasksManager />},
                { path: "calendar", element: <TasksCalendar /> },
                // { path: "board", element: <TasksBoard /> },
            ]
        },
    ]);

    return <RouterProvider router={router} />;
};

function App() {
    return (
        <AppLifecycleProvider>
            <NotificationProvider>
                <TaskStoreProvider>
                    <div className="App">
                        <AppRouter />
                    </div>
                </TaskStoreProvider>
            </NotificationProvider>
        </AppLifecycleProvider>
    );
}

export default App;
