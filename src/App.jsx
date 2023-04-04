import { useState, useCallback ,useEffect} from "react";
import React from "react";
import "./App.css";
import Navbar from "./components/NavBar/Navbar";
import Mobilemenu from "./components/NavBar/Mobilemenu";
import LandingPage from "./pages/landingPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/auth";
import { AuthContext } from "./components/context/authContext";
import NotesPage from "./pages/NotesPage";

let logoutTimer;

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token,setToken] = useState(false);
  const [userId,setUserId] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  

  const toggle = () => {
    setIsOpen(!isOpen);
  };

 // Login 
  const login = useCallback((uid,token, expirationDate) => {
    setToken(token)
    setUserId(uid)
    
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  // Logout 
  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  
  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  // auto login
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  // set routes based on if user is logged in or not 
  let routes;
  if (token) {
    routes = (
      <React.Fragment>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/maintenance" element={<NotesPage />}></Route>
      </React.Fragment>
    );
  } else {
    routes = (
      <React.Fragment>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/auth" element={<Auth />}></Route>
     
      </React.Fragment>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        login: login,
        logout: logout,
        token: token,
        userId: userId,
      }}
    >
      <div className="app">
        <Router>
          <Mobilemenu toggle={toggle} isOpen={isOpen} />
          <Navbar toggle={toggle} />
          <Routes>{routes}</Routes>
        </Router>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
