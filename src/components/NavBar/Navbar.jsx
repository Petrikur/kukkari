import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

export function HumbleiconsBars(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 6h16M4 12h16M4 18h16"
      ></path>
    </svg>
  );
}

const Navbar = ({ toggle }) => {
  const handleLogout = () => {
    auth.logout()
    navigate("/auth")

  }
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <nav className="shadow-lg fixed top-0 left-0 w-full bg-gradient-to-r from-black to-cool-gray-800 z-999">
      <div className="container mx-auto px-6 md:px-0 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <button
            type="button"
            className="block md:hidden border border-gray-800 p-2 rounded-md text-white focus:outline-none focus:shadow-outline"
            onClick={toggle}
          >
            <HumbleiconsBars />
          </button>
        </div>
        <div className="hidden md:block">
          <ul className="inline-flex">
            <li>
              <Link to="/">Etusivu</Link>
            </li>
            {auth.isLoggedIn && (
              <>
                {" "}
                <li>
                  <Link to="/gallery">Galleria</Link>
                </li>
                <li>
                  <Link to="/buildings">Rakennukset</Link>
                </li>
                <li>
                  <Link to="/reservations">Varausvuorot</Link>
                </li>
                <li>
                  <Link to="/maintenance">Ylläpito</Link>
                </li>{" "}
              </>
            )}
          </ul>
        </div> 
        <div className="hidden md:flex space-x-2">
        <Link className="inline-block bg-gray-800 text-white py-2 px-4 rounded-md transition-colors duration-300 hover:bg-gray-900" to="/forgotpassword">Unohdin salasanan</Link>
          {!auth.isLoggedIn && (
            <Link
              to="/auth"
              className="inline-block bg-gray-800 text-white py-2 px-4 rounded-md transition-colors duration-300 hover:bg-gray-900"
            >
            
              Kirjaudu
            </Link>
          )}
          {auth.isLoggedIn && (
            <button
              type="button"
              className="inline-block bg-gray-800 text-white py-2 px-4 rounded-md transition-colors duration-300 hover:bg-gray-900"
              onClick={handleLogout}
            >
              Kirjaudu Ulos
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
