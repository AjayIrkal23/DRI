import axios from "axios"
import toast from "react-hot-toast";
import React, { useContext, useState } from "react";

function Header({ sidebarOpen, setSidebarOpen }) {
  const [status,setStatus] = useState(1)


const changeStatus = async() =>{
  await axios.get("http://localhost:8000/start").then((res)=>{
    if(res.data.status == 1){
      toast.dismiss()
      setStatus(1)
toast.error("Application Stopped")
    }
    else{
      toast.dismiss()
      setStatus(0)
      toast.success("Application Started")
    }
  })
}

  return (
    <header className="sticky top-0 bg-white  border-b border-slate-200 dark:border-slate-100 shadow-md z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 -mb-px">
          <div className="flex gap-2 items-center">
            <img src="/logo.png" alt="" className="h-14 w-16 " />
            <div>
              <h1 className="text-[#f15d5e] tracking-wide text-xl font-extrabold">
                DOCKETRUN
              </h1>
            </div>
          </div>
          {/* Header: Left side */}
          <div className="flex">
            {/* Hamburger button */}
            <button
              className="text-slate-500 hover:text-slate-600 lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(!sidebarOpen);
              }}
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="4" y="5" width="16" height="2" />
                <rect x="4" y="11" width="16" height="2" />
                <rect x="4" y="17" width="16" height="2" />
              </svg>
            </button>
          </div>

          {/* Header: Right side */}
          <div className="flex gap-5">
            <h1 className={`font-semibold text-white ${status == 1 ? "bg-red-500" : "bg-green-500"} px-6 py-1.5 rounded-md shadow-md hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer`} onClick={()=>changeStatus()}>
              {status == 1 ? "Start" : "Stop"}
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
