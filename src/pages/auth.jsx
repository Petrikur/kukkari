import React, { useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../components/context/authContext";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../Ui/LoadingSpinner";
import { ToastContainer, toast } from "react-toastify";
import backgroundImage from "../assets/bgg.jpg";

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
      setIsLoading(false);
      const error = err.response.data.message;
      setTimeout(() => {
        toast.warn(error)
      }, 200);
      console.log(err.response.data.message);
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
    <div style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "100vh",      
    }}>
      <div className=" absolute left-0 right-0 top-52 bg-gray-700 mx-auto max-w-lg flex items-center justify-center flex-col border-white border shadow-lg rounded-lg py-10 z-50 px-2">
        <h1 className="text-2xl text-white font-bold text-center">Kirjaudu sisään</h1>
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded px-8 pt-6 pb-8 mb-4 my-10 py-2 sm:py-4"
        >
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
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
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            {password.length === 0 && (
              <p className="text-red-500 text-xs italic mt-2">
                Choose a password
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-2 sm:mb-0"
              type="submit"
            >
              Sign In
            </button>
            <a
              className="inline-block align-baseline font-bold text-sm text-blue-300 hover:text-blue-500"
              href="#"
            >
              Forgot Password?
            </a>
          </div>
        </form>
        </div>
        <ToastContainer />
      </div>
  );
};

export default Auth;
