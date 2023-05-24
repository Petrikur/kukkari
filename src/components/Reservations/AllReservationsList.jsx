import React, { useState, useRef, useEffect } from "react";
import Modal from "../../Ui/Modal";
import EventInfo from "../Reservations/EventInfo";
import "./resList.css";
const AllReservationsList = ({ events, handleDeleteEvent }) => {

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [visibleReservations, setVisibleReservations] = useState(2);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const listRef = useRef(null);

  // Scroll to the bottom when new content is loaded
  useEffect(() => {
    if (listRef.current) {
      const { scrollHeight, clientHeight } = listRef.current;
      const scrollToOptions = {
        top: scrollHeight - clientHeight,
        behavior: "smooth",
      };
      listRef.current.scrollTo(scrollToOptions);
    }
  }, [visibleReservations]);

  const handleItemClick = (event) => {
    setShowInfoModal(true);
    setSelectedEvent(event);
  };

  const sortedEvents = events.sort(
    (a, b) => new Date(b.start) - new Date(a.start)
  );

  const renderEventItems = () => {
    let currentMonth = null;

    const visibleEvents = sortedEvents.slice(0, visibleReservations);

    return visibleEvents.map((event) => {
      const eventStartDate = new Date(event.start);
      const month = eventStartDate.toLocaleString("fi-FI", { month: "long" });

      if (month !== currentMonth) {
        currentMonth = month;
        return (
          <React.Fragment key={`month-${month}`}>
            <li className="text-green-600 font-bold my-2 mb-2">{month}</li>
            {renderEventItem(event)}
          </React.Fragment>
        );
      }

      return renderEventItem(event);
    });
  };

  const renderEventItem = (event) => {
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);
    const isSingleDayEvent = startDate.getTime() === endDate.getTime();

    return (
      <li
        key={event._id}
        onClick={() => handleItemClick(event)}
        className="cursor-pointer hover:bg-blue-200 hover:border-blue-500 border border-blue-300 rounded py-2 pl-2 p-6 my-2"
      >
        <div className="text-white font-semibold">{event.name}</div>
        <div className="text-white text-sm text-center">
          {new Date(event.start).toLocaleString("fi-FI", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          })}{" "}
          {isSingleDayEvent ? null : "- "}
          {isSingleDayEvent
            ? null
            : new Date(event.end - 1).toLocaleString("fi-FI", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
              })}
        </div>
      </li>
    );
  };

  const loadMoreReservations = () => {
    setVisibleReservations((prevCount) => prevCount + 4);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const deleteResevation = () => {
    setShowInfoModal(false);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    setShowConfirmModal(false);
    handleDeleteEvent(selectedEvent._id);
  };

  return (
    <div className="flex flex-col h-screen mb-20 lg:border-r">
      <div className="flex-none p-4">
        <h2 className="text-white font-bold text-xl mb-4">Kaikki varaukset</h2>

        <div className="overflow-y-auto" ref={listRef}>
          <div className="h-3/4 max-h-[calc(100vh-16rem)]">
            {sortedEvents.length === 0 ? null : (
              <ul className="mr-5 flex-grow">{renderEventItems()}</ul>
            )}
          </div>
        </div>
      </div>
      {sortedEvents.length > visibleReservations ? (
        <button
          className="my-4 px-4 py-2 text-lg font-medium text-white bg-green-500 rounded-md hover:bg-green-600 mx-6"
          onClick={loadMoreReservations}
        >
          Lataa lisää
        </button>
      ) : sortedEvents.length > 0 && sortedEvents.length >= 4 ? (
        <div className="text-white text-center">Ei vanhempia varauksia</div>
      ) : null}
      <div className="flex flex-grow flex-col justify-center items-center">
        <Modal
          show={showInfoModal}
          onClose={cancelDeleteHandler}
          header="Varauksen tiedot"
          onCancel={() => {
            setShowInfoModal(false);
          }}
          type={"reservation"}
          selectedEvent={selectedEvent}
          onDelete={deleteResevation}
          modalType={"info"}
        >
          <EventInfo selectedEvent={selectedEvent} />
        </Modal>

        {/* Confirm delete  */}
        <Modal
          show={showConfirmModal === true}
          onClose={cancelDeleteHandler}
          header="Vahvista"
          onCancel={() => {
            setShowConfirmModal(false);
          }}
          selectedEvent={selectedEvent}
          onDelete={confirmDelete}
          type="reservation"
          modalType={"delete"}
        >
          <p className="text-white">
            Oletko varma että haluat poistaa varauksen?
          </p>
        </Modal>
      </div>
    </div>
  );
};

export default AllReservationsList;
