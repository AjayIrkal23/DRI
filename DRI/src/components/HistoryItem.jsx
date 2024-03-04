import React from "react";

const HistoryItem = ({ currentItems, i }) => {
  const baseUrl = import.meta.env.BASE_URL; // Retrieve the base URL
  return currentItems.map((item, i) => (
    <div
      className="flex justify-evenly border-b border-black/40 py-1.5 text-sm text-gray-700 text-center "
      key={i}
    >
      <div className="flex-[0.05] ">
        <div>
          <h1>{i}</h1>
        </div>
      </div>
      <div className="flex-[0.3] ">
        <div>
          <img src={`./Missing-Cleats/${item?.image_name}`} />
        </div>
      </div>
      <div className="flex-[0.1] ">
        <div>
          <h1>{item?.video_source}</h1>
        </div>
      </div>
      <div className="flex-[0.1] ">
        <div>
          <h1>DRI</h1>
        </div>
      </div>
      <div className="flex-[0.1] ">
        <div>
        <h1>{item?.voilation_type}</h1>
        </div>
      </div>
      <div className="flex-[0.1] ">
        <div>
          <h1>{Date(item?.time_stamp)}</h1>
        </div>
      </div>
    </div>
  ));
};

export default HistoryItem;
