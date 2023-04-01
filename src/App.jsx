import { useState } from "react";
import "./App.css";
import Navbar from "./components/NavBar/Navbar";
import Mobilemenu from "./components/NavBar/Mobilemenu";

import { BrowserRouter as Router, Routes } from "react-router-dom";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="app bg-black">
      <Router>
        <Mobilemenu toggle={toggle} isOpen={isOpen} />
        <Navbar toggle={toggle} />
        <Routes></Routes>
      </Router>
    </div>
  );
}

export default App;
