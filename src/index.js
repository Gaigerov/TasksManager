import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import {TaskStoreProvider} from './stores/storeContext';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <TaskStoreProvider>
            <App />
        </TaskStoreProvider>
    </React.StrictMode>
);
