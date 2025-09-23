import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import MainInterface from './components/MainInterface';
import CardScreen from './components/sections/CardScreen';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<MainInterface />} />
            <Route path="/card/:username" element={<CardScreen />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
