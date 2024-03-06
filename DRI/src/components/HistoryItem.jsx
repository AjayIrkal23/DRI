import React, { useCallback, useState } from "react";
import ImageViewer from 'react-simple-image-viewer';

const HistoryItem = ({ currentItems, i }) => {
  const baseUrl = import.meta.env.BASE_URL; // Retrieve the base URL
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);


  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  const images = currentItems.map((item)=> item.voilation_type == "Non_linear_wall" ? `./Non-linear-walls/${item?.image_name}` : `./Missing-Cleats/${item?.image_name}`)

  console.log(images,"ab")

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
      {item?.voilation_type == "Non_linear_wall" ?  <div className="flex-[0.3] "  onClick={ () => openImageViewer(i) }>
        <div>
          <img src={`./Non-linear-walls/${item?.image_name}`} />
        </div>
      </div> :  <div className="flex-[0.3] ">
        <div>
          <img src={`./Missing-Cleats/${item?.image_name}`} />
        </div>
      </div>}
      {isViewerOpen && (
        <ImageViewer
          src={ images }
          currentIndex={ currentImage }
          disableScroll={ false }
          closeOnClickOutside={ true }
          onClose={ closeImageViewer }
        />
      )}
    

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
        <h1>{new Date(item?.time_stamp).toLocaleString()}</h1>
        </div>
      </div>
    </div>
  ));
};

export default HistoryItem;
