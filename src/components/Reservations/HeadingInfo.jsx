import React from "react";

const HeadingInfo = () => {
  return (
    <>
      <h1 className="text-4xl mb-5 ">Varaukset</h1>
      <div className="text-md">
        Voit tehdä varauksia tällä sivulla painamalla "tee varaus". Alla olevassa
        kalenterissa näät varatut ajat. Jos perut varamaamasi ajan, muista
        poistaa varauksesi. Voit poistaa oman varauksesi klikkaamalla isosta
        kalenterista varausta ja poistaa sen.
      </div>
      <div className="my-2">
        Voit varata kerralla ajan joko yhdelle päivälle tai useammalle päivälle.
        Useammalle päivälle varatessa klikkaa alkupäivämäärää ja sen jälkeen
        loppupäivämäärää ja sitten varaa.
      </div>
    </>
  );
};

export default HeadingInfo;
