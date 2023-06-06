import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../components/context/authContext";
import LoadingSpinner from "../Ui/LoadingSpinner";
import { FaCalendarAlt, FaCog } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaBell } from "react-icons/fa";

const AccountPage = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const auth = useContext(AuthContext);
  const [emailNotifications, setEmailNotifications] = useState(false);

  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/reservations`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        const userReservations = response.data.reservations.filter(
          (reservation) => reservation.creator === auth.userId
        );
        setReservations(userReservations);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [auth.token, auth.userId]);

  const formatDate = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startDateString = start.toLocaleDateString("en-GB");
    const endDateString = end.toLocaleDateString("en-GB");

    if (startDateString === endDateString) {
      return startDateString;
    } else {
      return `${startDateString} - ${endDateString}`;
    }
  };

  const handleToggleNotifications = () => {
    console.log("test");
  };

  return (
    <div className="container mx-auto p-4 mt-36 text-white">
      <h2 className="text-2xl font-bold mb-4">
        <FaCog className="inline mr-2" />
        Minun tili - {auth.name}
      </h2>
      <hr className="mb-4" />
      {isLoading ? (
        <div className="text-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div>
        {/* Settings */}
          <h3 className="text-xl font-bold mt-6 mb-2">
            <RiLockPasswordLine className="inline mr-2" />
            Asetukset
          </h3>
          <Link to="/forgotpassword">
            <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Vaihda salasana
            </button>
          </Link>
          <hr className="mt-8 mb-2" />

          {/* Users resrevations list  */}
          <h3 className="text-xl font-bold mt-8 mb-6">
            <FaCalendarAlt className="inline mr-2" />
            Omat varaukset:
          </h3>
          {reservations.length === 0 ? (
            <p>Ei varauksia.</p>
          ) : (
            <ul className="pl-6 list-none">
              {reservations.map((reservation) => (
                <li
                  key={reservation.id}
                  className="mb-4 border p-2 rounded max-w-sm"
                >
                  <div className="flex items-center">
                    <div className="w-[20px]">
                      <FaCalendarAlt className="h-full" />
                    </div>
                    <div className="font-bold ml-2 max-w-md">
                      {reservation.description}
                    </div>
                  </div>
                  <div className="text-gray-400 ml-6">
                    {formatDate(reservation.startDate, reservation.endDate)}
                  </div>
                </li>
              ))}
            </ul>
          )}
          <hr className="mt-8 mb-2" />
          {/* Notification settings  */}
          <div className="flex gap-2 mt-8">
            <FaBell />
            <h3 className="text-xl font-bold mb-2">Ilmoitusasetukset:</h3>
          </div>

          <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
            <input
              type="checkbox"
              name="toggle"
              id="toggle"
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
            />
            <label
              htmlFor="toggle"
              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
            ></label>
          </div>
          <label htmlFor="toggle" className="text-xs text-gray-700">
            Toggle me.
          </label>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
