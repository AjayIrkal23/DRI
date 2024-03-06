from ultralytics import YOLO
import numpy as np
import os
import cv2
from PIL import Image
from datetime import datetime
import psycopg2
# import ctypes

# Set the application name in the taskbar


# Create folders to store detected images
os.makedirs('Missing-Cleats', exist_ok=True)
os.makedirs('Non-linear-walls', exist_ok=True)
folder_path_missing_cleats = 'Missing-Cleats'
folder_path_non_linear_walls = 'Non-linear-walls'

def CHECKRTSPWORKINGORNOT(url):
    cam = cv2.VideoCapture(url)
    if cam.isOpened() == True:
        while(cam.isOpened()):
            ret,frame = cam.read()
            if ret:
                return True
            else:
                break
        cam.release()
        #cv2.destroyAllWindows()        
    else:
        return False 

# Variables

input_name = 'rtsp://192.168.1.33:8562/ds-test'
video_type_given = input_name


# Setup YOLO trained model
model = YOLO('weights/best.pt')

if CHECKRTSPWORKINGORNOT(input_name):
    print("rtsp is  working")
else:
    print("rtsp is not working ------1")

# # Connect to PostgreSQL database
conn = psycopg2.connect(
    dbname="docketrundb",
    user="docketrun",
    password="docketrun",
    host="localhost",
    port="5432",
    sslmode="disable"
)
cursor = conn.cursor()

# # Function to create table if not exists
def create(cursor, conn):
    tablecreatequery = """
    CREATE TABLE IF NOT EXISTS Detection_info (
    video_source VARCHAR(1000),
    video_name VARCHAR(1000),
    time_stamp VARCHAR(1000),
    image_name VARCHAR(1000),
    voilation_type VARCHAR(1000)
    );
    """
    cursor.execute(tablecreatequery)
    conn.commit()

# Video capture
# video = cv2.VideoCapture(input_name)
# if not video.isOpened():
def STARTAPP(input_name):
    frame_no = 0
    wrong_count = 0
    screen_width =1920
    screen_height = 1080
    canny_lower_threshold = 30
    canny_upper_threshold = 80
    y_coordinate1 = 583
    y_coordinate2 = 770
    cam = cv2.VideoCapture(input_name)
    if cam.isOpened() == True:
        while(cam.isOpened()):
            results = model.predict(input_name, stream=True)
            fps = cam.get(cv2.CAP_PROP_FPS)

            create(cursor, conn)

            # Define reference lines for non-linear walls
            reference_lines = []
            reference_lines.append(((1575, y_coordinate1), (1600, y_coordinate1)))  # First reference line
            reference_lines.append(((1575, y_coordinate2), (1600, y_coordinate2)))  # Second reference line

            # Function to check if edge touches any of the reference lines
            def edge_touches_reference(edges, reference_lines):
                for ref_line in reference_lines:
                    mask = np.zeros_like(edges)
                    cv2.line(mask, ref_line[0], ref_line[1], 255, 2)
                    intersection = cv2.bitwise_and(edges, mask)
                    contours, _ = cv2.findContours(intersection, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                    if len(contours) > 0:
                        return True
                return False

            # Final Detection Loop
            for result in results:
                frame_no += 1
                ret, frame = cam.read()
                frame_without_box=frame


                # Non-linear walls code
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                edges = cv2.Canny(gray, canny_lower_threshold, canny_upper_threshold)
                edges_color = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)

                for line in reference_lines:
                    cv2.line(frame, line[0], line[1], (0, 255, 0), 2)

                if edge_touches_reference(edges, reference_lines):
                    cv2.rectangle(frame, (0, 0), (screen_width, screen_height), (0, 0, 255), 8)
                    datetime_str = str(datetime.now())
                    modified_datetime_str = datetime_str.replace(" ", "-")
                    save_image_name_intermediate = f'Image_{modified_datetime_str }{frame_no}_Non-Linear_walls.png'
                    frame_filename = os.path.join(folder_path_non_linear_walls, save_image_name_intermediate)
                    pixel_array = np.uint8(result.orig_img)
                    rgb_image = cv2.cvtColor(pixel_array, cv2.COLOR_BGR2RGB)
                    image = Image.fromarray(rgb_image)
                    #cv2.imwrite(frame_filename, frame_without_box)
                    image.save(frame_filename)
                    cursor.execute("INSERT INTO Detection_info (video_source, video_name, time_stamp, image_name,voilation_type) VALUES (%s, %s, %s, %s,%s)",
                                (video_type_given, input_name, modified_datetime_str, save_image_name_intermediate,'Non_linear_wall'))
                    conn.commit()
                    print("Screenshot captured in frame ", frame_no)

                # Object detection
                if len(result.boxes.cls) != 0:
                    aa = result.boxes.xyxy[0][0].item()
                    bb = result.boxes.xyxy[0][1].item()
                    cc = result.boxes.xyxy[0][2].item()
                    dd = result.boxes.xyxy[0][3].item()

                    if result.boxes.cls[0].item() == 0 and len(result.boxes.cls) != 0:
                        cv2.rectangle(frame, (0, 0), (screen_width, screen_height), (0, 0, 255), 8)
                        cv2.rectangle(frame, (int(aa), int(bb)), (int(cc), int(dd)), (0, 0, 255), 4)
                        cv2.putText(frame, f"{'Unaligned Cleat'}", (int(aa), int(bb) - 10), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 4)
                    if result.boxes.cls[0].item() == 1 and len(result.boxes.cls) != 0:
                        cv2.rectangle(frame, (int(aa), int(bb)), (int(cc), int(dd)), (0, 255, 0), 4)
                        cv2.putText(frame, f"{'Aligned'}", (int(aa), int(bb) - 10), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 4)

                cv2.imshow('DOCKETRUN-APPLICATION', frame)
                cv2.setWindowTitle('DOCKETRUN-APPLICATION', 'DOCKETRUN-APPLICATION')
                # ctypes.windll.kernel32.SetConsoleTitleW("Your Desired Application Name")

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
                    modified_datetime_str = datetime_str.replace(" ", "-")
                    save_image_name = f'Image_{modified_datetime_str}_Missing_Cleats.png'
                    frame_filename = os.path.join(folder_path_missing_cleats, save_image_name)
                    image.save(frame_filename)
                    wrong_count += 1

                    # Store information in the database
                    cursor.execute("INSERT INTO Detection_info (video_source, video_name, time_stamp, image_name,voilation_type) VALUES (%s, %s, %s, %s,%s)",
                                (video_type_given, input_name, modified_datetime_str, save_image_name,'Missing_cleats'))
                    conn.commit()

                if len(boxes.cls) == 1 and boxes.cls[0].item() == 1:
                    wrong_count = 0
                if len(boxes.cls) == 2:
                    wrong_count = 0

    else:
        print("------------------------------------------video is not opened---------------------")

# Close database connection
    cursor.close()
    conn.close()

    # Release video capture and destroy windows
    cam.release()
    cv2.destroyAllWindows()

# STARTAPP(input_name)
