import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

ReactDOM.render(
  <Router basename="/web-honey-bunny">
    <DndProvider backend={HTML5Backend}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="main" element={<App />} />
      </Routes>
    </DndProvider>
  </Router>,
  document.getElementById('root')
);
