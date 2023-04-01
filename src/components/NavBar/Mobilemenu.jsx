
import React, { useContext } from "react";
import { Link } from "react-router-dom";

const mobilemenu = ({ isOpen, toggle }) => {
  const mobilemenuLinks = [
    { to: "/", label: "Etusivu" },
    { to: "galleria", label: "Galleria" },
    { to: "rakennukset", label: "Rakennukset" },
    { to: "varausvuorot", label: "Varausvuorot" },
    { to: "yllapito", label: "Ylläpito" },
  ];

  return (
    <>
      <div
        className={`fixed z-50 w-full h-full items-center bg-gray-800 top-0 left-0 transition duration-300 ease-in-out opacity-0 ${
          isOpen ? "opacity-100 top-0 hidden" : "top-full"
        }"${isOpen ? "" : "hidden"}`}
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
            <div className="px-9 items-center flex justify-center ">
              <Link to= "/auth" className="px-4 py-2 my-4 font-bold text-white bg-green-600 rounded-md hover:bg-green-700">
                Kirjaudu
              </Link>
            </div>
          </div>
        )}
        {/* <button
          className="w-full px-4 py-2 font-bold text-white bg-red-600 rounded-md hover:bg-red-700"
          // onClick={auth.logout}
        >
          Kirjaudu ulos
        </button> */}
      </div>
    </>
  );
};

export default mobilemenu;