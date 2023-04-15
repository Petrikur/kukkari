import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const Mobilemenu = ({ isOpen, toggle }) => {
  const auth = useContext(AuthContext);
  let mobilemenuLinks;

  if (auth.isLoggedIn) {
    mobilemenuLinks = [
      { to: "/", label: "Etusivu" },
      { to: "gallery", label: "Galleria" },
      { to: "buildings", label: "Rakennukset" },
      { to: "reservations", label: "Varausvuorot" },
      { to: "maintenance", label: "Ylläpito" }
    ];
  } else {
    mobilemenuLinks = [{ to: "/", label: "Etusivu" }, { to: "auth", label: "Kirjaudu" }];
   
  }
  return (
    <>
      <div
        className={`fixed w-full h-full items-center z-50 bg-gray-800 top-0 left-0 transition duration-300 ease-in-out opacity-0 ${
          isOpen ? "" : "hidden"
        } ${isOpen ? "opacity-100 top-0 " : "top-full"}"`}
      >
        {isOpen && (
          <div className="p-4 w-full my-20 items-center justify-center ">
            <ul className="space-y-2 flex  flex-col items-center ">
              {mobilemenuLinks.map((link) => (
                <li key={link.to}>
                  <a
                    href={`${link.to}`}
                    className="block  px-4 py-2 text-white rounded-md hover:bg-gray-700"
                    onClick={toggle}
                  >
                    {link.label}
                    <div className="my-2"></div>
                  </a>
                </li>
              ))}
            </ul>
            {auth.isLoggedIn && <div className="px-9 items-center flex justify-center ">
              <Link
                className="px-4 py-2 my-4 font-bold text-white  bg-red-600 rounded-md hover:bg-red-700"
                onClick={auth.logout}
              >
                Kirjaudu ulos
              </Link>
            </div> }
           
          </div>
        )}
      </div>
    </>
  );
};

export default Mobilemenu;
