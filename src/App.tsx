import {createHashRouter, RouterProvider} from 'react-router-dom';
import MainPage from './components/MainPage/MainPage';
import './index.css';
import {TaskStoreProvider} from './stores/storeContext';
import {NotificationProvider} from './components/Notification/NotificationContext';

/* eslint-disable no-console */
console.warn = () => { };

const router = createHashRouter([
    {
        path: "/*",
        element: <MainPage />,
    },
]);

function App() {
    return (
        <NotificationProvider>
            <TaskStoreProvider>
                <div className="App">
                    <RouterProvider router={router} />
                </div>
            </TaskStoreProvider>
        </NotificationProvider>
    );
}

export default App;
