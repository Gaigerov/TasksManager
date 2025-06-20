import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {TaskStoreProvider} from './stores/storeContext';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <TaskStoreProvider>
            <App />
        </TaskStoreProvider>
    </React.StrictMode>
);
