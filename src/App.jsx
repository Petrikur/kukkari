import { useState, useCallback, useEffect} from "react";
import React from "react";
import Navbar from "./components/NavBar/Navbar";
import Mobilemenu from "./components/NavBar/Mobilemenu";
import LandingPage from "./pages/landingPage";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Auth from "./pages/auth";
import { AuthContext } from "./components/context/authContext";
import NotesPage from "./pages/NotesPage";
import UpdateNote from "./pages/UpdateNote";
import NewNote from "./pages/NewNote";
import Reservations from "./pages/reservations";
import ForgotPasswordPage from "./pages/forgotPasswordPage";
import ResetPassword from "./pages/passwordResetPage";
import NotFound from "./pages/notFound";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [name, setName] = useState("");

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  // Login
  const login = useCallback(async (uid, token, expirationDate) => {
    try {
      setToken(token);
      setUserId(uid);

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

      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/${uid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setName(data.name);
    } catch (err) {
      console.log(err);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem("userData");
    // navigate('/auth');
  }, []);

  let logoutTimer;
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
      const remainingTime =
        new Date(storedData.expiration).getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    }
  }, [login, logout]);

  // set routes based on if user is logged in or not
  let routes;
  if (token) {
    routes = (
      <React.Fragment>
        <Route
          path="/resetpassword/:id/:token"
          exact={true}
          element={<ResetPassword />}
        ></Route>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/maintenance" element={<NotesPage />}></Route>
        <Route path="/maintenance/:noteId" element={<UpdateNote />}></Route>
        <Route path="/maintenance/newnote" element={<NewNote />}></Route>
        <Route path="/reservations" element={<Reservations />}></Route>
        <Route path="/forgotpassword" element={<ForgotPasswordPage />}></Route>
        <Route path="*" element={<NotFound />} />
      </React.Fragment>
    );
  } else {
    routes = (
      <React.Fragment>
        <Route
          path="/resetpassword/:id/:token"
          exact={true}
          element={<ResetPassword />}
        ></Route>
        <Route path="/forgotpassword" element={<ForgotPasswordPage />}></Route>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/auth" element={<Auth />}></Route>
        <Route path="*" element={<NotFound />} />
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
        name: name,
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
