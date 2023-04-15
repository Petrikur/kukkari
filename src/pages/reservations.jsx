import React from "react";
import { useState, useEffect, useContext } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import axios from "axios";
import { fi } from "react-date-range/dist/locale";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../Ui/LoadingSpinner";
import { AuthContext } from "../components/context/authContext";
import eachDayOfInterval from "date-fns/eachDayOfInterval/index";

const Reservations = () => {
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigate = useNavigate();
  const [disabledDates, setDisabledDates] = useState([]);

  const [loadedReservations, setLoadedReservations] = useState([]);

  const [selectedDate, setSelectedDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [events, setEvents] = useState([]);

  const getReservations = async () => {
    setIsLoading(true);
    try {
      const responseData = await axios(
        "http://localhost:5000/api/reservations",
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      setLoadedReservations(responseData.data.reservations);
      setIsLoading(false);

      navigate("/reservations");
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getReservations();
  }, []);

  useEffect(() => {
    handleDisabledDates();

    convertDisabledDatesToEvents();
  }, [loadedReservations]);

  const handleDisabledDates = () => {
    let disabled = [];
    for (let dateObj of loadedReservations) {
      const startDate = new Date(dateObj.startDate);
      const endDate = new Date(dateObj.endDate);
      const datesToAdd = eachDayOfInterval({ start: startDate, end: endDate });
      disabled = [...disabled, ...datesToAdd];
    }
    setDisabledDates(disabled);
  };

  const handleButtonClick = () => {
    setShowDatePicker(true);
  };

  const submitReservation = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/reservations/",
        {
          startDate: selectedDate[0].startDate,
          endDate: selectedDate[0].endDate,
          creatorName: auth.name,
          userId: auth.userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
        }
      );
      toast.success("Varaus tehty");
      setIsLoading(false);
      setLoadedReservations([...loadedReservations, response.data.reservation]);
      navigate("/reservations");
      setShowDatePicker(false);
    } catch (err) {
      console.log(err);
      setShowDatePicker(false);
      const errorMessage = err.response.data.message;
      toast.warn(errorMessage);
      setIsLoading(false);
      console.log(errorMessage);
    }
  };

  const convertDisabledDatesToEvents = () => {
    const events = [];
    loadedReservations.forEach((date) => {
      console.log("daadada: ", date);
      events.push({
        title: auth.name,
        start: date.startDate,
        end: date.endDate,
        backgroundColor: "red",
        borderColor: "red",
      });
    });
    setEvents(events);
  };

  return (
    <div className="flex items-center justify-center pt-28 flex-col py-2 px-4 ">
    
      {isLoading && <LoadingSpinner asOverlay />}
      <div className="text-white">
        <h1>Varaukset</h1>
        <div className="">
          Voit tehdä varauksia painamalla tee varaus täällä. Alla olevassa
          kalenterissa näät jo varatut ajat. Jos perut varamaamasi ajan, muista
          poistaa varauksesi{" "}
        </div>
      </div>
      <button
        className="my-4 px-4 py-2 text-lg font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
        onClick={handleButtonClick}
      >
        Tee varaus
      </button>
      {showDatePicker && (
        <React.Fragment>
          {" "}
          <DateRange
            disabledDates={disabledDates}
            locale={fi}
            editableDateInputs={true}
            onChange={(item) => setSelectedDate([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={selectedDate}
          />
          <div className="flex items-end justify-center">
            <button
              className="my-4 px-4 py-2 text-lg font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
              onClick={submitReservation}
            >
              Varaa
            </button>
          </div>
        </React.Fragment>
      )}
    
      <ToastContainer />
    </div>
  );
};

export default Reservations;
