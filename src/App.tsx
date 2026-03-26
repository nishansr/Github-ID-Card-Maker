import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import MainInterface from "./components/MainInterface";
import CardScreen from "./components/sections/CardScreen";
import ResultScreen from "./components/sections/ResultScreen";
import CardRenderScreen from "./components/sections/CardRenderScreen";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<MainInterface />} />
            <Route path="/card/:username" element={<CardScreen />} />
            <Route path="/result/:username" element={<ResultScreen />} />
            <Route path="/render/card" element={<CardRenderScreen />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
