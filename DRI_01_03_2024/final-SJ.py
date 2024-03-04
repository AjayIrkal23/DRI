from ultralytics import YOLO
import tkinter
import customtkinter
import tkinter.messagebox as messagebox
import numpy as np
import time
import os
import cv2
from PIL import Image
from datetime import datetime
from datetime import datetime, timedelta
import threading  # Import threading module for multi-threading
import psycopg2


# ------------------------------Create folder to store detected images-------------------------------
os.makedirs('Missing-Cleats', exist_ok=True)
os.makedirs('Non-linear-walls', exist_ok=True)
folder_path_missing_cleats = 'Missing-Cleats'
folder_path_non_linear_walls = 'Non-linear-walls'

#------------------------------------------------------------------------------------------------------

#--------------------------------- Start time to check DB after every 10 secs --------------------------
start_time = datetime.now()

#-------------Variables-------------------------
frame_no=0
wrong_count=0
input_name='C:\\Users\\pavan\\Documents\\DRI\\DRI_01_03_2024\\83.mp4'
video_type_given='mp4'

screen_width = 1920  # Example screen width
screen_height = 1080

# Hyper parameters to be adjusted according to environment in the video 
# 1)canny threshold
canny_lower_threshold=30
canny_upper_threshold=80
# 2)Coordinates foe reference line
y_coordinate1=580
y_coordinate2=774

#-------------------------------------------------``

# --------------------------------------Setup YOLO trained model--------------------------------------
model = YOLO('C:\\Users\\pavan\\Documents\\DRI\\DRI_01_03_2024\\weights\\best.pt')
results = model.predict(input_name, stream=True)


video = cv2.VideoCapture(input_name)
fps = video.get(cv2.CAP_PROP_FPS)
#----------------------------------------------------------------------------------------------------------


#------------------------- Establish a connection to the PostgreSQL server ----------------------------------
conn = psycopg2.connect(
    user="postgres",
    password="hello123",
    host="localhost",
    port="5432",
    database="postgres"
    )
# Create a cursor object using the cursor() method
cursor = conn.cursor()


# ------------------------Define reference lines for non linear walls----------------------------------------------------
reference_lines = []

# Example: ((x1, y1), (x2, y2))
reference_lines.append(((1575, y_coordinate1), (1600, y_coordinate1)))  # First reference line
reference_lines.append(((1575, y_coordinate2), (1600, y_coordinate2)))  # Second reference line
#-------------------------------------------------------------------------------------------------------------------------

# ---------------------- Function to check if edge touches any of the reference lines ---------------------------
def edge_touches_reference(edges, reference_lines):
    for ref_line in reference_lines:
        # Create a mask image from the reference line
        mask = np.zeros_like(edges)
        cv2.line(mask, ref_line[0], ref_line[1], 255, 2)

        # Use bitwise_and to find the intersection
        intersection = cv2.bitwise_and(edges, mask)
        contours, _ = cv2.findContours(intersection, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if len(contours) > 0:
            return True
    return False
#----------------------------------------------------------------------------------------------------------------------  



#------------------------- Final Detection Loop ---------------------------------------------
for result in results:

# ----------------------Fetch STATUS from from DB every 10 after every secs -------------
    current_time = datetime.now()
    if (current_time - start_time).total_seconds() >= 10:
        STATUS = cursor.execute("SELECT STATUS FROM detection_status")
        row = cursor.fetchall()
# Fetch first row of OFF_STATUS value from database
        status_value = row[0][0]
        print(STATUS)
        print("---------------------------------------------")
        print(row)
        print(status_value)
        

        if status_value == 1:
            print("before")
            time.sleep(10)
            print("before")
            continue
        if status_value == 0:
            pass
            print("passed")

        start_time = current_time 
    print("ENTERED FOR LOOP")
    frame_no += 1
    ret, frame = video.read()  # Read frame from video
    
# ~~~~~~~~~~~~~~~~~~~~~~Non Linear walls code~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    # Convert frame to grayscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    # Apply Canny edge detection
    edges = cv2.Canny(gray, canny_lower_threshold, canny_upper_threshold)
    # Convert edges to a color image
    edges_color = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)

    for line in reference_lines:
        cv2.line(frame, line[0], line[1], (0, 255, 0), 2)

    # Check if edge touches any of the reference lines
    if edge_touches_reference(edges, reference_lines):
       # If detected save image with name as current time stamp
       # create file name
        cv2.rectangle(frame, (0, 0), (screen_width, screen_height), (0, 0, 255), 8)
        datetime_str = str(datetime.now())
        modified_datetime_str = datetime_str.replace(" ", "_").replace("-", "_").replace(":", "_")  
        save_image_name_intermediate = f'{modified_datetime_str }{frame_no}_non-linear_walls.png'
        frame_filename = os.path.join(folder_path_non_linear_walls, save_image_name_intermediate)
        # Store on disk
        cv2.imwrite(frame_filename, frame)
        print("Screenshot captured in frame ",frame_no)

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    
    if len(result.boxes.cls) !=0:
        aa=result.boxes.xyxy[0][0].item()
        bb=result.boxes.xyxy[0][1].item()
        cc=result.boxes.xyxy[0][2].item()
        dd=result.boxes.xyxy[0][3].item()
        print(aa,bb,cc,dd)
        cls_label = result.boxes.cls[0].item()  # Extract class label

        # Draw bounding box on frame
        # Draw label on frame
    
        if result.boxes.cls[0].item()==0 and len(result.boxes.cls)!=0:
            cv2.rectangle(frame, (0, 0), (screen_width, screen_height), (0, 0, 255), 8)
            cv2.rectangle(frame, (int(aa), int(bb)), (int(cc), int(dd)), (0, 0, 255), 4)
            cv2.putText(frame, f"{'Unaligned Cleat'}", (int(aa), int(bb) - 10), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 4)
        if result.boxes.cls[0].item()==1 and len(result.boxes.cls)!=0:
            cv2.rectangle(frame, (int(aa), int(bb)), (int(cc), int(dd)), (0, 255, 0), 4)
            cv2.putText(frame, f"{'Aligned'}", (int(aa), int(bb) - 10), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 4)
            
    cv2.imshow('frame',frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
    boxes = result.boxes
    if len(boxes.cls) == 1 and boxes.cls[0].item() == 0:
        wrong_count += 1
    if wrong_count == 2 or wrong_count == 9:
        print("Deviation detected - Image stored ", frame_no, frame_no / fps)
        minutes, seconds = divmod(frame_no / fps, 60)
        print(f"{int(minutes)} minutes and {seconds:.3f} seconds")

        # Convert image format and save image
        pixel_array = np.uint8(result.orig_img)
        rgb_image = cv2.cvtColor(pixel_array, cv2.COLOR_BGR2RGB)
        image = Image.fromarray(rgb_image)
        datetime_str = str(datetime.now())
        # modified_datetime_str = datetime_str.replace(" ", "_")
        modified_datetime_str = datetime_str.replace(" ", "_").replace("-", "_").replace(":", "_")

        save_image_name = f'{modified_datetime_str}_missing_cleats.png'
        frame_filename = os.path.join(folder_path_missing_cleats, save_image_name)
        image.save(frame_filename)
        wrong_count += 1

        # Store information in the database
        cursor.execute("INSERT INTO Detection_info (video_source, video_name, time_stamp, image_name) VALUES (%s, %s, %s, %s)",
                       (video_type_given, input_name, modified_datetime_str, save_image_name)a)
        conn.commit()
    

    if len(boxes.cls) == 1 and boxes.cls[0].item() == 1:
        wrong_count = 0
    if len(boxes.cls) == 2:
        wrong_count = 0


    ''' 
     Store information in the database
        cursor.execute("INSERT INTO Detection_info (video_source, video_name, time_stamp, image_name) VALUES (%s, %s, %s, %s)",
                       (video_type_given, input_name, modified_datetime_str, save_image_name))
        conn.commit()'''
    

cursor.close()
conn.close()


# Enable the Finish button after YOLO processing is complete
video.release()
cv2.destroyAllWindows()

