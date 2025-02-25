import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import ResultScreen from "./components/sections/ResultScreen";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ContactScreen from "./components/sections/ContactScreen";
import AboutScreen from "./components/sections/AboutScreen";
import ErrorScreen from "./components/sections/ErrorScreen";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result/:username" element={<ResultScreen />} />
        <Route path="/contact" element={<ContactScreen />} />
        <Route path="/about" element={<AboutScreen />} />
        <Route path="*" element={<ErrorScreen />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
