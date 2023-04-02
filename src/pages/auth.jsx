import React, { useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Auth = () => {
  
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleEmailChange = (e) => {
    console.log(e.target.value)
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    console.log(e.target.value)
    setPassword(e.target.value);
  };

 
  const handleSubmit = (e) => {
    
    e.preventDefault();
    // handle login logic
  };
  return (
    <div className="mx-auto max-w-lg p-8 bg-white shadow-lg rounded-lg py-52 my-24 z-50 ">
      <form onSubmit={handleSubmit} className="bg-white rounded px-8 pt-6 pb-8 mb-4 ">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <p className="text-red-500 text-xs italic mt-2">Please choose a password.</p>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign In
          </button>
          <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
            Forgot Password?
          </a>
        </div>
      </form>
    </div>
  );
};

export default Auth;
