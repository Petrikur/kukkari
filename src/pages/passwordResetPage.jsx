import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../Ui/LoadingSpinner";

const ResetPassword = () => {
  const { id, token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const [requestSend,setRequestSend] = useState(false);
  const [isLoading,setIsLoading] = useState(false)
  const [passwordChanged, setPasswordChanged] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setValidationError("Salasanat eivät täsmää!");
      return;
    }
    try {
      
      const response = await axios.post(
        `http://localhost:5000/api/users/${id}/${token}`,
        {
          password,
        }
      );
      if (response.status === 200) {
        setPasswordChanged(true);
      }
      
    } catch (error) {
      console.error(error);
      toast.warn(error.response.data.message)
    }finally{
      setRequestSend(true)
      setIsLoading(false)
    }
  };

  return (
    <div className="flex justify-center items-center h-screen text-white">
    {isLoading && <LoadingSpinner/>}
      {requestSend && passwordChanged  ? (
        <div className="text-3xl p-5 border border-white rounded text-white">
          Salasana vaihdettu, voit nyt kirjautua sisään.
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md border border-white p-8 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-medium mb-6">Vaihda salasana</h2>
          <div className="mb-4 mt-16">
            <label htmlFor="password" className="block font-medium mb-2">
              Uusi salasana:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirm-password"
              className="block font-medium mb-2"
            >
              Vahvista salasana:
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
            {validationError && (
              <p className="text-red-500 text-sm mt-2">{validationError}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
           Vahvista
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
