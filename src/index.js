import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import {TaskStoreProvider} from './stores/storeContext';

const root = createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <TaskStoreProvider>
            <App />
        </TaskStoreProvider>
    </React.StrictMode>
);
