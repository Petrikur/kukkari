import React from "react";
import { useState, useEffect, useContext, useCallback } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import "./calendar.css";
import { isToday } from "date-fns";
import { isSameDay } from "date-fns";

import { CustomToolbar } from "../Ui/CustomToolbar";
import ReservationForm from "../components/Reservations/ReservationForm";
import EventInfo from "../components/Reservations/EventInfo";
import HeadingInfo from "../components/Reservations/HeadingInfo";
const Reservations = ({ socket }) => {
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
    culture: "fi",
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
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [description, setDescription] = useState("");

  // Get reservations
  const getReservations = async () => {
    setIsLoading(true);
    try {
      const responseData = await axios(
        `${import.meta.env.VITE_SERVER_URL}` + "/reservations",
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
    socket.on("newReservation", (newReservation) => {
      setLoadedReservations((prevRes) => [...prevRes, newReservation]);
    });

    socket.on("deleteReservation", ({ id }) => {
      setLoadedReservations((prevRes) =>
        prevRes.filter((res) => res._id !== id)
      );
    });

    return () => {
      socket.off(`newReservation`);
      socket.off("deleteReservation");
    };
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
        title: "Varattu / " + date.creatorName,
        creator: date.creator,
        start: startDate,
        end: endDate,
        allDay: true,
        name: date.creatorName,
        description: date.description,
      });
    });
    setEvents(events);
  };

  // Make new reservation
  const submitReservation = async (event) => {
    event.preventDefault();

    // make this check because we are defaulting current date to selected date when opening calendar
    const selectedStartDate = selectedDate[0].startDate;
    const selectedEndDate = selectedDate[0].endDate;

    const isSameDayReserved = disabledDates.some((date) =>
    isSameDay(date, selectedStartDate)
  );

  if (isSameDayReserved) {
    toast.warn("Joku on jo varannut tämän päivän");
    return;
  }
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
        `${import.meta.env.VITE_SERVER_URL}` + "/reservations",
        {
          startDate: selectedDate[0].startDate,
          endDate: selectedDate[0].endDate,
          creatorName: auth.name,
          userId: auth.userId,
          description: description,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
        }
      );
      setDescription("");
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
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}` + `/reservations/${_id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setEvents(events.filter((e) => e._id !== _id));
      setLoadedReservations(loadedReservations.filter((e) => e._id !== _id));
      toast.success("Varaus poistettu");
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
    setSelectedEvent(event);
    setShowInfoModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  // style event
  
 const eventStyleGetter = (event, start, end, isSelected) => {
  const backgroundColor ="red";
  const hoverStyle = {
    backgroundColor: "orange",
    cursor: "pointer",
  };
  const style = {
    backgroundColor,
    opacity: 0.8,
    color: "white",
    display: "block",
    fontSize: "16px",
    padding: "12px",
    border: "1px dotted black",
    borderRadius: "5px"
  };

  return {
    style: isSelected  && selectedEvent  ? { ...style, ...hoverStyle } : style,
  };
};

// Calendar view type
const views = {
  month: true,
};

const confirmDelete = () => {
  setShowInfoModal(false);
  setShowConfirmModal(true);
};

const handleCancelInfo = () => {
  setSelectedEvent(null)
  setShowInfoModal(false)

}

  return (
    <div className="flex items-center justify-center pt-28 flex-col py-2 px-4 ">
      {/* delete confimation modal */}
      <Modal
        show={showConfirmModal}
        onClose={cancelDeleteHandler}
        header="Vahvista"
        onCancel={() => {
          cancelDeleteHandler(false);
        }}
        selectedEvent={selectedEvent}
        onDelete={() => handleDeleteEvent(selectedEvent._id)}
        type="reservation"
      >
        <p>Oletko varma että haluat poistaa varauksen?</p>
      </Modal>

      {/* reservation info modal */}
      <Modal
        show={showInfoModal}
        onClose={cancelDeleteHandler}
        header="Varauksen tiedot"
        onDelete={confirmDelete}
        onCancel={ handleCancelInfo}
        selectedEvent={selectedEvent}
        type={"reservation"}
      >
        { selectedEvent && <EventInfo selectedEvent={selectedEvent} />}
      </Modal>

      {isLoading && <LoadingSpinner asOverlay />}
      <div className="text-white mb-20 lg:px-52">
        <HeadingInfo />
      </div>
      {!showDatePicker && (
        <button
          className="my-4 px-4 py-2 text-lg font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
          onClick={openCalendar}
        >
          Tee varaus
        </button>
      )}

      {/* Reservation calendar  */}
      {showDatePicker && (
        <ReservationForm
          setSelectedDate={setSelectedDate}
          selectedDate={selectedDate}
          submitReservation={submitReservation}
          setShowDatePicker={setShowDatePicker}
          description={description}
          setDescription={setDescription}
          disabledDates={disabledDates}
        />
      )}

      {/* Big calendar  */}
      <div className=" calendar mx-auto w-full lg:w-3/4 xl:w-2/4 mb-20">
        <Calendar
          events={events}
          localizer={localizer}
          style={{ height: 600 }}
          onSelectEvent={handleEventClick}
          eventPropGetter={eventStyleGetter}
          views={views}
          components={{
            toolbar: CustomToolbar,
          }}
        />
      </div>
      <ToastContainer />
    </div>
  );
};
export default Reservations;
