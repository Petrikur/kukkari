import React, { useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../components/context/authContext";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../Ui/LoadingSpinner";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
   
    try {
      setIsLoading(true);
      const responseData = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      auth.login(responseData.data.userId, responseData.data.token);
      setIsLoading(false);
      if (responseData.data.token) {
        navigate("/");
      }
     
    } catch (err) {
      setIsLoading(false)
      console.log(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  if (isLoading) {
    return (
      <div className="">
        <LoadingSpinner />
      </div>
    );
  }

 
  return (
    <div className="mx-auto max-w-lg p-8 bg-white shadow-lg rounded-lg py-52 my-24 z-50 ">
      <form
        onSubmit={handleLogin}
        className="bg-white rounded px-8 pt-6 pb-8 mb-4 "
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
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
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Salasana"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <p className="text-red-500 text-xs italic mt-2">
            Please choose a password.
          </p>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Kirjaudu
          </button>
          <a
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            href="#"
          >
            Unohdin salasanan
          </a>
        </div>
      </form>
    </div>
  );
};

export default Auth;
