import React, { useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../components/context/authContext";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../Ui/LoadingSpinner";
import backgroundImage from "../assets/bgg.jpg";
import { toast } from "react-toastify";

const Signup = () => {
  const auth = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleVerifyPasswordChange = (e) => {
    setVerifyPassword(e.target.value);
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    if (password !== verifyPassword) {
      setError("Salasanat eivät täsmää");
      return;
    }

    try {
      setIsLoading(true);
      const responseData = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}` + "/users/signup",
        {
          name: name,
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
      toast.success("Rekisteröinti onnistui");
      if (responseData.data.token) {
        navigate("/");
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      const error = err.response.data.message;
      setError(error);
      console.log(err.response.data.message);
      console.log(err);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <div className=" absolute left-0 right-0 top-20 md:top-52 bg-gray-900 mx-auto max-w-lg flex items-center justify-center flex-col border-white border shadow-lg rounded-lg py-10 z-40 px-2">
        <h1 className="text-2xl text-white font-bold text-center">
          Rekisteröidy
        </h1>
        <form
          onSubmit={handleSignup}
          className="w-full max-w-md rounded px-6 pt-6 pb-8 mb-4 my-10 py-2 sm:py-4"
        >
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Nimi
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Nimi"
              value={name}
              onChange={handleNameChange}
              required
            />
          </div>
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
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Salasana
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Salasana"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="verifyPassword"
            >
              Vahvista salasana
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
              id="verifyPassword"
              type="password"
              placeholder="Vahvista salasana"
              value={verifyPassword}
              onChange={handleVerifyPasswordChange}
              required
            />
          </div>

          <div className="text-red-600 mb-5">{error}</div>

          <div className="flex flex-col sm:flex-row items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-2 sm:mb-0"
              type="submit"
              disabled={!name || !email || !password || !verifyPassword}
            >
              Rekisteröidy
            </button>
            <Link
              to="/login"
              className="inline-block align-baseline font-bold text-sm text-blue-300 hover:text-blue-500"
            >
              Kirjaudu sisään
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
