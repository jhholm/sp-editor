
import React from 'react';
import { createRoot } from 'react-dom/client';
import PopUp from '../../src/popup/PopUp';

const container = document.getElementById("root");

if (container) {
    const root = createRoot(container);
    root.render(<><PopUp /></>)
}