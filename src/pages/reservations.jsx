import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; 
import "react-date-range/dist/theme/default.css"; 
import { addDays } from "date-fns";
import { useEffect, useState } from "react";
import {fi} from 'react-date-range/dist/locale';
import {format} from "date-fns"
import React from "react";

const Reservations = (props) => {

  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  useEffect(() => {
    console.log(`${format(date[0].startDate, "dd/MM/yy")} ${format(date[0].endDate, "dd/MM/yy")}`)
  },[date])

  const dateHandler = () => {

  }
  return (
    <>
      {" "}
      <div className="py-20 flex items-center justify-center">
        <h1 className="text-2xl font-bold">Varaukset </h1>
        <div>
          <DateRangePicker
            onChange={(item) => setDate([item.selection])}
            // showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={1}
            ranges={date}
            direction="horizontal"
            locale={fi}
          />
        </div>
      </div>
    </>
  );
};

export default Reservations;
