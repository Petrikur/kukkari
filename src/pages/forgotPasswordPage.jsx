import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [requestSend, setRequestSend] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/forgotpassword",
        { email }
      );
      toast.success(response.data);
    } catch (error) {
      console.error(error);
      toast.warn(error.response.data.message)
    } finally {
      setRequestSend(true);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      {requestSend ? (
        <div className="text-3xl p-5 border border-white rounded text-white">Pyyntö lähetetty, tarkista sähköpostisi!</div>
      ) : (
        <form
          className="w-full max-w-md bg-white p-8 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          {" "}
          <h2 className="text-2xl font-medium mb-6">Salasanan vaihto</h2>
          <label htmlFor="email">Email:</label>
          <input
            className="w-full border rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline my-5"
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
            Vaihda salasana
          </button>
        </form>
      )}

      <ToastContainer />
    </div>
  );
};

export default ForgotPasswordPage;
