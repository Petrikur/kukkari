 import { MdToday, MdNavigateBefore, MdNavigateNext } from "react-icons/md";
 export function CustomToolbar({ label, onNavigate, onView }) {

    return (
      <div className="flex items-center justify-between mb-4 bg-gray-800 shadow-2xl  !important">
        <div className="flex items-center">
    
          <button className="mr-2" onClick={() => onNavigate("PREV")}>
            <MdNavigateBefore color="white" size={40} /> 
          </button>
          <button className="mr-2" onClick={() => onNavigate("TODAY")}>
            <MdToday color="white" size={25} />
          </button>
          <button onClick={() => onNavigate("NEXT")}>
            <MdNavigateNext color="white" size={40} />
          </button>
          <div className="text-lg text-white font-bold">{label}</div>
        </div>
      </div>
    );
  }