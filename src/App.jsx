import { useState } from "react";
import React from "react"
import "./App.css";
import Navbar from "./components/NavBar/Navbar";
import Mobilemenu from "./components/NavBar/Mobilemenu";
import LandingPage from "./pages/landingPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/auth"

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  let routes = (
    <React.Fragment>
      <Route path="/auth" element={<Auth />}></Route>
      <Route path="/" element={<LandingPage />}></Route>
    </React.Fragment>
  );

  return (
    <div className="app">
      <Router>
        <Mobilemenu toggle={toggle} isOpen={isOpen} />
        <Navbar toggle={toggle} />
        <Routes>{routes}</Routes>
      </Router>
    </div>
  );
}

export default App;
