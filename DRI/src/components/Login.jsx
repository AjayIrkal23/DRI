import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import toast from "react-hot-toast";

import { useState } from "react";

export default function Login({ setUser }) {
  const [email, setEmail] = useState(null);

  const [password, setPassword] = useState(null);

  const handleSubmit = async () => {
    if (email == "admin" && password == "admin123") {
      setUser(true);
      toast.dismiss();
      toast.success("Login Successful");
    } else {
      toast.dismiss();
      toast.error("Wrong Username Or Password");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[95vh] py-2 overflow-y-hidden bg-gray-100  ">
        <div className="flex flex-col items-center justify-center flex-1 w-full p-2 text-center md:px-20">
          <div className="flex flex-col w-full bg-white rounded-sm shadow-xl md:max-w-4xl md:flex-row ">
            <div className="p-5 rounded-tl-sm rounded-bl-sm md:w-3/5">
              <div className="text-lg font-bold tracking-wide text-left">
                <h1 className="text-[#f15d5e] tracking-wide text-xl font-extrabold">
                  DOCKETRUN
                </h1>
                <div className="inline-block w-32 mb-2 border border-black "></div>
              </div>
              <div className="py-10 ">
                <div className="flex flex-col justify-center items-center"></div>
                <div className="inline-flex items-center gap-3 px-6 pt-2 font-semibold my-2 transition-all duration-300 ease-in-out  rounded-sm    hover:text-[black] "></div>

                <div className="flex flex-col items-center ">
                  <div className="flex items-center w-64 p-2 mb-4 bg-gray-100">
                    <FaUser className="m-2 text-gray-500" />
                    <input
                      type="email"
                      id="email"
                      onChange={(e) => setEmail(e.target.value)}
                      name="email"
                      label="Email Address"
                      autoComplete="email"
                      placeholder="User Name"
                      required
                      className="flex-1 bg-transparent outline-none"
                    />
                  </div>
                  <div className="flex items-center w-64 p-2 bg-gray-100">
                    <MdLockOutline className="m-2 text-gray-500" />
                    <input
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      name="password"
                      label="Password"
                      placeholder="Password"
                      id="password"
                      autoComplete="new-password"
                      required
                      className="flex-1 bg-transparent outline-none"
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="inline-block px-12 py-2 font-semibold my-2 transition-all duration-300 ease-in-out border-2 rounded-sm border-[#006ce6]  hover:border-black hover:text-[black] "
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
            <div className="md:w-2/5 hidden px-12 text-white bg-[#f15d5e] rounded-tr-sm rounded-br-sm py-36  md:inline-block ">
              <h2 className="mb-2 text-3xl font-bold ">Hello, Welcome Back!</h2>
              <div className="inline-block w-10 mb-2 border-2 border-white"></div>
              <p className="mb-8">
                Fill up the Username And Password to Login to Dashboard.{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
