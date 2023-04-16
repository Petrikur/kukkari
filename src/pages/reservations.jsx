import React from "react";
import { useState, useEffect, useContext, useCallback } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../Ui/LoadingSpinner";
import { AuthContext } from "../components/context/authContext";
import eachDayOfInterval from "date-fns/eachDayOfInterval/index";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import fi from "date-fns/locale/fi";
import Modal from "../Ui/Modal";
import { addDays } from "date-fns";
import "./calendar.css";
import { isToday } from "date-fns";
import { isSameDay } from "date-fns";

const Reservations = () => {
  const locales = {
    fi,
  };

  // Create localizer for big calendar
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }),
    getDay,
    locales: { fi: fi },
  });

  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigate = useNavigate();
  const [disabledDates, setDisabledDates] = useState([]);
  const [loadedReservations, setLoadedReservations] = useState([]);
  const [events, setEvents] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [selectedDate, setSelectedDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  // Get reservations
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
  // Get reservations
  useEffect(() => {
    getReservations();
  }, []);

  useEffect(() => {
    handleDisabledDates();
    convertDisabledDatesToEvents();
  }, [loadedReservations]);

  // Convert loadedReservations to disabled dates in calendar component
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

  // Open reservation calendar when button click
  const openCalendar = () => {
    setShowDatePicker(true);
  };
  //  Convert disabled dates to larget calendar events
  const convertDisabledDatesToEvents = () => {
    const events = [];

    loadedReservations.forEach((date) => {
      let startDate;
      let endDate;

      // If reservation is only 1 day, just create date normally, othwerwise add 1 day to endDate
      if (date.startDate === date.endDate) {
        startDate = new Date(date.startDate);
        endDate = new Date(date.endDate);
      } else {
        startDate = new Date(date.startDate);
        endDate = new Date(date.endDate);
        endDate.setDate(endDate.getDate() + 1);
      }
      events.push({
        _id: date._id,
        title: "Varattu / " + auth.name,
        start: startDate,
        end: endDate,
        allDay: true,
      });
    });
    setEvents(events);
  };

  // Make new reservation
  const submitReservation = async (event) => {
    event.preventDefault();

    // make this check because we are defaulting current date to selected date when opening calendar
    if (
      isToday(selectedDate[0].startDate) &&
      disabledDates.some((date) => isSameDay(date, selectedDate[0].startDate))
    ) {
      toast.warn("Et voi varata tänään!");
      return;
    }
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
      setTimeout(() => {
        setLoadedReservations([
          ...loadedReservations,
          response.data.reservation,
        ]);
        toast.success("Varaus tehty");
      }, 500);
    } catch (err) {
      const errorMessage = err.response.data.message;
      toast.warn(errorMessage);

      console.log(errorMessage);
    } finally {
      setShowDatePicker(false);
      navigate("/reservations");
      setIsLoading(false);
      setSelectedDate([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        },
      ]);
    }
  };

  // Delete events
  const handleDeleteEvent = async (_id) => {
    try {
      setIsLoading(true);
      await axios.delete(`http://localhost:5000/api/reservations/${_id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setEvents(events.filter((e) => e._id !== _id));
      setLoadedReservations(loadedReservations.filter((e) => e._id !== _id));
      toast.success("Event deleted!");
      navigate("/reservations");
    } catch (err) {
      const errorMessage = err.response.data.message;
      toast.error(errorMessage);
    } finally {
      setShowConfirmModal(false);
      setIsLoading(false);
    }
  };

  const handleEventClick = (event) => {
    setShowConfirmModal(true);
    setSelectedEvent(event);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  // style event
  const eventStyleGetter = (event, start, end, isSelected) => {
    const backgroundColor = isSelected ? "blue" : "red";
    const hoverStyle = {
      backgroundColor: "orange",
      cursor: "pointer",
    };
    const style = {
      backgroundColor,
      borderRadius: "0px",
      opacity: 0.8,
      color: "white",
      border: "0px",
      display: "block",
      fontSize: "14px",
      padding: "8px",
    };

    return {
      style: isSelected ? { ...style, ...hoverStyle } : style,
    };
  };

  return (
    <div className="flex items-center justify-center pt-28 flex-col py-2 px-4 ">
      <Modal
        show={showConfirmModal}
        onClose={cancelDeleteHandler}
        header="Oletko varma?"
        footer={
          <React.Fragment>
            <div className="flex ">
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                onClick={cancelDeleteHandler}
              >
                Peruuta
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 ml-2"
                onClick={() => {
                  handleDeleteEvent(selectedEvent._id);
                }}
              >
                Poista
              </button>
            </div>
          </React.Fragment>
        }
      >
        <p>Oletko varma että haluat poistaa varauksen?</p>
      </Modal>
      {isLoading && <LoadingSpinner asOverlay />}
      <div className="text-white mb-20 lg:px-52">
        <h1 className="text-4xl mb-5 ">Varaukset</h1>
        <div className="text-md">
          Voit tehdä varauksia painamalla tee varaus täällä. Alla olevassa
          kalenterissa näät jo varatut ajat. Jos perut varamaamasi ajan, muista
          poistaa varauksesi. Voit poistaa oman varauksesi klikkaamalla isosta
          kalenterista varausta ja poistaa sen.
        </div>
        <div className="my-2">
          Voit varata kerralla ajan joko yhdelle päivälle tai useammalle
          päivälle. Useammalle päivälle varatessa klikkaa alkupäivämäärää ja sen
          jälkeen loppupäivämäärää ja sitten varaa.
        </div>
      </div>
      {!showDatePicker && (
        <button
          className="my-4 px-4 py-2 text-lg font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
          onClick={openCalendar}
        >
          Tee varaus
        </button>
      )}
      {showDatePicker && (
        <React.Fragment>
          {" "}
          <DateRange
            disabledDates={disabledDates}
            locale={fi}
            onChange={(item) => setSelectedDate([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={selectedDate}
          />
          <div className="flex items-end justify-center gap-2">
            <button
              className="my-4 px-4 py-2 text-lg font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              onClick={() => {
                setShowDatePicker(false);
              }}
            >
              Peruuta
            </button>
            <button
              className="my-4 px-4 py-2 text-lg font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
              onClick={submitReservation}
            >
              Varaa
            </button>
          </div>
        </React.Fragment>
      )}
      <div className="mx-auto w-full lg:w-3/4 xl:w-3/4 mb-20">
        <Calendar
          events={events}
          localizer={localizer}
          style={{ height: 600 }}
          onSelectEvent={handleEventClick}
          eventPropGetter={eventStyleGetter}
          toolbar={{
            left: "",
            center: "",
            right: "prev,next",
          }}
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default Reservations;
