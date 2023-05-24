import React from "react";
import { MdToday, MdPerson } from "react-icons/md";

const EventInfo = ({ selectedEvent }) => {
  const startDate = new Date(selectedEvent.start);
  const endDate = new Date(selectedEvent.end);
  const isSingleDayEvent = startDate.getTime() === endDate.getTime();

  const formatDate = (date) => {
    return `${date.getDate()} ${date.toLocaleString("default", { month: "long" })}`;
  };

  const formatFullDate = (date) => {
    return `${date.getDate()} ${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
  };

  const formattedStartDate = formatFullDate(startDate);
  const formattedEndDate = isSingleDayEvent ? formatDate(startDate) : formatDate(new Date(endDate.getTime() - 86400000)); // Subtract 1 day from end date
  const showYear = startDate.getFullYear() !== endDate.getFullYear();
  const showMonth = startDate.getMonth() !== endDate.getMonth();

  return (
    <div className="flex flex-col">
      <div className="text-xl text-white ">Varaaja</div>
      <div className="mt-4 p-4 bg-gray-800 rounded-lg  border-gray-600 items-center flex border-2 mb-2">
        <MdPerson size={24} color="white" className="mr-2" />
        <div className="text-lg text-gray-200">{selectedEvent.name}</div>
      </div>
      <div className="text-xl text-white">Lisätiedot</div>
      <div className="mt-4 p-4 bg-gray-800  rounded-lg border-2  border-gray-600">
        <div className="flex items-center mb-4 text-gray-200">
          <MdToday size={24} color="white" className="mr-2" />
          {isSingleDayEvent ? (
            formattedStartDate
          ) : (
            <div className="">
              {startDate.getDate()} {showMonth && startDate.toLocaleString("default", { month: "long" })} - {formattedEndDate} {showYear && startDate.getFullYear()}
            </div>
          )}
        </div>
        <div className="text-gray-300">{selectedEvent.description}</div>
      </div>
    </div>
   
  );
};

export default EventInfo;
