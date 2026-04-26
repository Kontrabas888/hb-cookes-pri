import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import LabelMaker from './LabelMaker';
import NavBar from './NavBar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

ReactDOM.render(
  <Router basename={process.env.PUBLIC_URL}>
    <DndProvider backend={HTML5Backend}>
      <NavBar />

      <Routes>
        <Route path="/" element={<App />} />
        <Route path="main" element={<App />} />
        <Route path="labels" element={<LabelMaker />} />
      </Routes>
    </DndProvider>
  </Router>,
  document.getElementById('root')
);
