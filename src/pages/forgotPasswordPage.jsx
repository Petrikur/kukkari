import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingSpinner from "../Ui/LoadingSpinner";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [requestSend, setRequestSend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}` + "/users/forgotpassword" ,
        { email }
      );
      toast.success(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setRequestSend(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen text-white ">
      {isLoading && <LoadingSpinner asOverlay />}
      {requestSend && !error && (
        <div className="text-3xl p-5 border border-white rounded text-white">
          Pyyntö lähetetty, tarkista sähköpostisi!
        </div>
      )}

      {requestSend && error && (
        <div className="text-3xl p-5 border border-white rounded text-white">
          Jokin meni pieleen, ole yhteydessä järjelstelmänvalvojaan.
        </div>
      )}
      {!error && !requestSend && (
        <form
          className="w-full max-w-md border  border-white p-8 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-medium mb-16">Salasanan palautus</h2>
          <label className="text-xl  " htmlFor="email">
            Syötä sähköposti
          </label>
          <input
            placeholder="Sähköpostiosoite"
            className="w-full border rounded-lg p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline my-5"
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Lähetä
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
