import React, { useContext } from "react";
import fi from "date-fns/locale/fi";
import { DateRange } from "react-date-range";
import { AuthContext } from "../context/authContext";
import "./resForm.css";

const ReservationForm = ({
  setSelectedDate,
  selectedDate,
  setShowDatePicker,
  submitReservation,
  disabledDates,
  description,
  setDescription,
  isLoading,
}) => {
  const auth = useContext(AuthContext);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-20">
        <div className="text-white text-2xl text-center py-2 ">
          Päivämäärä
          <div>
            <DateRange
              disabledDates={disabledDates}
              locale={fi}
              onChange={(item) => setSelectedDate([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={selectedDate}
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <div className="text-white text-2xl text-center ">
            Lisätiedot
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="reservationName"
              className="text-white text-center pb-2"
            >
              Varaaja
            </label>
            <input
              type="text"
              id="reservationName"
              className="border rounded-md border-gray-300 p-3 disabled bg-gray-300  w-full "
              value={auth.name}
              readOnly
              // onChange={(e) => setReservationName(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="description"
              className="text-white pb-2 text-center"
            >
              Lisätiedot (Ketä lähdössä, jne)
            </label>
            <textarea
              id="description"
              className=" appearance-none border h-56  rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-4 mb-10">
        <button
          className="px-4 py-2 text-lg font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
          onClick={() => {
            setShowDatePicker(false);
          }}
        >
          Peruuta
        </button>
      { !isLoading && <button
          className="px-4 py-2 text-lg font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
          onClick={submitReservation}
        >
          Varaa
        </button>}
      </div>
    </>
  );
};

export default ReservationForm;
