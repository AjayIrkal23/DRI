import { Modal } from "@mui/material";
import React, { useContext, useState } from "react";

// Import utilities
import Datepicker from "./Datepicker";
const Date = ({ open, setOpen, setHistoryDate }) => {
  const [dateValue, setDateValue] = useState(null);

  const handleClose = () => {
    setOpen(false);
  };

  const setValue = () => {
    setHistoryDate(dateValue);
  };
  return (
    <>
      {" "}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="absolute  bg-white outline-none top-[25%] left-[50%] -translate-x-[50%] flex">
          <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
            <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="font-semibold text-slate-800 dark:text-slate-100">
                Please Select Date
              </h2>
              <div className="my-4 flex flex-col gap-4 w-full justify-center">
                <div>
                  <Datepicker setDateValue={setDateValue} />
                </div>{" "}
              </div>
              <button
                className="bg-blue-500 px-6 py-1.5 rounded-md flex justify-center w-full text-white mt-6"
                onClick={() => {
                  setValue();
                  setOpen(false);
                }}
              >
                {" "}
                Submit{" "}
              </button>
            </header>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Date;
