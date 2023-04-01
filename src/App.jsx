import { useState } from "react";
import "./App.css";
import Navbar from "./components/NavBar/Navbar";

import {
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

function App() {

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="App">
       <Router>
          
          <Navbar toggle={toggle}  />
          <Routes></Routes>
        </Router>
    </div>
  );
}

export default App;
