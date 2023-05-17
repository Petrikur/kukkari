import React from "react";

const EventInfo = ({ selectedEvent }) => {
  const startDate = new Date(selectedEvent.start);
  const endDate = new Date(selectedEvent.end);
  const isSingleDayEvent = startDate.getTime() === endDate.getTime();

  const formatDate = (date) => {
    return `${date.getDate()} ${date.toLocaleString("default", { month: "short" })}`;
  };

  const formatFullDate = (date) => {
    return `${date.getDate()} ${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;
  };

  const formattedStartDate = formatFullDate(startDate);
  const formattedEndDate = isSingleDayEvent ? formatDate(startDate) : formatDate(new Date(endDate.getTime() - 86400000)); // Subtract 1 day from end date
  const showYear = startDate.getFullYear() !== endDate.getFullYear();
  const showMonth = startDate.getMonth() !== endDate.getMonth();

  return (
    <div className="flex flex-col">
      <div className="text-center font-bold text-2xl">Varaaja</div>
      <div className="text-center font-bold pb-10">{selectedEvent.name}</div>
      <div className="text-center font-bold text-2xl">Lisätiedot</div>
      <div className="text-center font-bold">{selectedEvent.description}</div>
      <div className="text-center font-bold mt-4">
        {isSingleDayEvent ? (
          formattedStartDate
        ) : (
          <>
            {startDate.getDate()} {showMonth && startDate.toLocaleString("default", { month: "short" })} - {formattedEndDate} {showYear && startDate.getFullYear()}
          </>
        )}
      </div>
    </div>
  );
};

export default EventInfo;
