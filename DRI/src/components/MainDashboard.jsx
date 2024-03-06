import React, { useState } from "react";
import { MdLiveTv } from "react-icons/md";
import Date from "./Date";
import { SlCalender } from "react-icons/sl";
import PaginatedComponent from "./PaginatedComponent";
const MainDashboard = ({
  historyDate,
  setHistoryDate,
  mainData,
  setMainData,
}) => {
  const [date, setDate] = useState(false);


  const getNonLINCount = ()=>{
    const countNonLinearWallViolations = mainData?.reduce((count, item) => {
      if (item.voilation_type === "Non_linear_wall") {
          count++;
      }
      return count;
  }, 0); 
  return countNonLinearWallViolations
  }

  const getMissingCleats = ()=>{
    const countNonLinearWallViolations = mainData?.reduce((count, item) => {
      if (item.voilation_type === "Missing_cleats") {
          count++;
      }
      return count;
  }, 0); 
  return countNonLinearWallViolations
  }

  return (
    <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      {/*  Site header */}

      <main className="w-full">
        <div className="px-4 sm:px-6 lg:px-8  w-full  mx-auto flex-col justify-start gap-3">
          <div className=" gap-6 items-center flex   justify-center  mb-4">
            <div className=" border px-3 py-1.5 rounded-md bg-white shadow-sm w-[200px]">
              <div className="text-sm text-gray-700 font-semibold italic text-center pb-1 mt-1">
                Missing Violations
              </div>
              <div className="h-[1px] w-full bg-gray-600 " />
              <div className="text-sm text-gray-700  italic text-center pb-1 mt-1">
                {mainData?.length}
              </div>
            </div>
            <div className=" border px-3 py-1.5 rounded-md bg-white shadow-sm w-[200px]">
              <div className="text-sm text-gray-700 font-semibold italic text-center pb-1 mt-1">
                Missing Cleats
              </div>
              <div className="h-[1px] w-full bg-gray-600 " />
              <div className="text-sm text-gray-700  italic text-center pb-1 mt-1">
                {getMissingCleats()}
              </div>
            </div>
            <div className=" border px-3 py-1.5 rounded-md bg-white shadow-sm w-[200px]">
              <div className="text-sm text-gray-700 font-semibold italic text-center pb-1 mt-1">
                 Non_linear_wall
              </div>
              <div className="h-[1px] w-full bg-gray-600 " />
              <div className="text-sm text-gray-700  italic text-center pb-1 mt-1">
              {getNonLINCount()}
              </div>{" "}
            </div>
            {historyDate ? (
              <div
                className="flex items-center bg-green-500 shadow-md rounded-md px-5 py-1 hover:scale-105 transition-all ease-in-out duration-200 cursor-pointer group animate-pulse"
                onClick={() => setHistoryDate(null)}
              >
                <div>
                  {" "}
                  <MdLiveTv className="m-2 text-white group-hover:scale-105 transition-all ease-in-out duration-200" />
                </div>
                <div className="text-white fot-semibold italic ">Live View</div>
              </div>
            ) : (
              <div
                className="flex items-center bg-blue-500 shadow-md rounded-md px-5 py-1 hover:scale-105 transition-all ease-in-out duration-200 cursor-pointer group"
                onClick={() => setDate(true)}
              >
                <div>
                  {" "}
                  <SlCalender className="m-2 text-white group-hover:scale-105 transition-all ease-in-out duration-200" />
                </div>
                <div className="text-white fot-semibold italic ">
                  Select Date
                </div>
              </div>
            )}
          </div>
          <div className="w-full border bg-white shadow-sm rounded-md  ">
            <div className="flex justify-evenly py-1.5 text-sm text-gray-700 font-semibold bg-gray-100 text-center">
              <div className="flex-[0.05] ">
                <div>
                  <h1>Sl No.</h1>
                </div>
              </div>
              <div className="flex-[0.3] ">
                <div>
                  <h1>Violation image</h1>
                </div>
              </div>
              <div className="flex-[0.1] ">
                <div>
                  <h1>Violation Details</h1>
                </div>
              </div>
              <div className="flex-[0.1] ">
                <div>
                  <h1>Department</h1>
                </div>
              </div>
              <div className="flex-[0.1] ">
                <div>
                  <h1>Violation type</h1>
                </div>
              </div>
              <div className="flex-[0.1] ">
                <div>
                  <h1>Detected Time</h1>
                </div>
              </div>
            </div>
            <div className=" bg-white border   outline-none  rounded-md ">
              <div>
                <div className="h-[70vh] overflow-scroll">
                  <PaginatedComponent itemsPerPage={30} mainData={mainData} />,
                </div>
              </div>
            </div>
          </div>
        </div>
        <Date open={date} setOpen={setDate} setHistoryDate={setHistoryDate} />
      </main>
    </div>
  );
};

export default MainDashboard;
