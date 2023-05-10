import { useState, useCallback, useEffect } from "react";
import React, { Suspense } from "react";
import Navbar from "./components/NavBar/Navbar";
import Mobilemenu from "./components/NavBar/Mobilemenu";
import LandingPage from "./pages/landingPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContext } from "./components/context/authContext";
import NotFound from "./pages/notFound";
import LoadingSpinner from "./Ui/LoadingSpinner";

const NewNote = React.lazy(() => import("./pages/NewNote"));
const UpdateNote = React.lazy(() => import("./pages/UpdateNote"));
const NotesPage = React.lazy(() => import("./pages/NotesPage"));
const Reservations = React.lazy(() => import("./pages/reservations"));
const ForgotPasswordPage = React.lazy(() =>
  import("./pages/forgotPasswordPage")
);
const ResetPassword = React.lazy(() => import("./pages/passwordResetPage"));
const Auth = React.lazy(() => import("./pages/auth"));

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

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/users/${uid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setName(data.name);
    } catch (err) {
      console.log(err);
    }
  }, []);


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
            <Suspense
              fallback={
                <div className="center">
                  <LoadingSpinner />
                </div>
              }
            >
          <Routes>
              {routes}
          </Routes>
            </Suspense>
        </Router>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
