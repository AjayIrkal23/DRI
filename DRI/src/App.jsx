import { useEffect, useRef, useState } from "react";

import "./index.css";
import toast, { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import axios from "axios";
import MainDashboard from "./components/MainDashboard";

import Login from "./components/Login";
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(false);
  const [mainData, setMainData] = useState([]);
  const [historyDate, setHistoryDate] = useState(null);

  console.log(historyDate);

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest function.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  const getLiveData = async () => {
    await axios.get("http://localhost:8000/getData").then((resp) => {
      setMainData(resp?.data);
      toast.dismiss();
      toast.success("Data Fetching Successfull");
    });
  };

  useInterval(async () => {
    // Your custom logic here

    if (historyDate == null) {
      getLiveData();
    }
  }, 10000);

  const getDateData = async () => {
    console.log("hellooooo");
    if (historyDate != null) {
      await axios
        .post("http://localhost:8000/getHistoryData", { period: historyDate })
        .then((resp) => {
          setMainData(resp?.data);
          toast.dismiss();
          toast.success("Data Fetching Successfull");
        });
    }
  };

  useEffect(() => {
    getDateData();
    getLiveData();
  }, [historyDate]);

  return (
    <>
      <Toaster />
      <>
      
          <>
            {" "}
            {!user ? (
              <Login setUser={setUser} />
            ) : (
              <div className="bg-[whitesmoke]">
                {" "}
                <div className="flex h-screen overflow-hidden">
                  {/* Sidebar */}

                  {/* Content area */}
                  <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                    {/*  Site header */}
                    <Header
                      sidebarOpen={sidebarOpen}
                      setSidebarOpen={setSidebarOpen}
                    />

                    <main>
                      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full  mx-auto">
                        {/* Welcome banner */}

                        <main>
                          <MainDashboard
                            mainData={mainData}
                            historyDate={historyDate}
                            setHistoryDate={setHistoryDate}
                          />
                        </main>
                      </div>
                    </main>
                  </div>
                </div>
              </div>
            )}
          </>
      
      </>
    </>
  );
}

export default App;
