


import os
import multiprocessing
import time
from setproctitle import setproctitle


import psycopg2
from psycopg2 import sql

from DRI_TEST import STARTAPP

def CREATETABLEFORDIR(conn):
    ret = 0
    cursor = conn.cursor()

    try:
        create_table_query = sql.SQL("""
    CREATE TABLE IF NOT EXISTS Detection_info (
    video_source VARCHAR(1000),
    video_name VARCHAR(1000),
    time_stamp VARCHAR(1000),
    image_name VARCHAR(1000),
    voilation_type VARCHAR(1000)
    );
    """
        )

        cursor.execute(create_table_query)
        conn.commit()
        print("\n[INFO] Detection_info table created.")
        ret = 1

    except psycopg2.Error as e:
        if e.pgcode == '42P07':  # Check if table already exists
            print("\n[INFO] Detection_info table already exists.")
            ret = 1
        else:
            print(f"PostgreSQL error: {e}")
            ret = 0

            # Log the error
            error_message = f"PostgreSQL error: {e}\n"

    finally:
        cursor.close()

    return ret

try:
    connection = psycopg2.connect(
        user="docketrun",
        password="docketrun",
        host="localhost",
        port="5432",
        database="docketrundb"
    )

    CREATETABLEFORDIR(connection)

except psycopg2.Error as e:
    print(f"Unable to connect to the database. Error: {e}")
finally:
    if connection:
        connection.close()



# setproctitle.setproctitle("DOCKETRUN-DRI-SYSTEM")


def get_current_dir_and_goto_parent_dir():
    return os.path.dirname(os.getcwd())


def parent_directory():
    relative_parent = os.path.join(os.getcwd(), "..")
    return os.path.abspath(relative_parent)

input_name = 'rtsp://192.168.1.33:8571/ds-test'
#'rtsp://192.168.1.33:8562/ds-test'
frame_image_folderpath = get_current_dir_and_goto_parent_dir() + "/images"

process_info = {
    "DRI": {"target": STARTAPP, "args": (input_name,)},
}

running_processes = {}

for process_name, info in process_info.items():
    process = multiprocessing.Process(target=info["target"], args=info["args"], name=process_name)
    process.start()
    running_processes[process_name] = process

while True:
    for process_name, process in running_processes.items():
        if not process.is_alive():
            print(f"Process {process_name} is not alive. Restarting...")
            try:
                process.terminate()
                process.join()
                new_process_info = process_info[process_name]
                new_process = multiprocessing.Process(target=new_process_info["target"], args=new_process_info["args"], name=process_name)
                new_process.start()
                running_processes[process_name] = new_process
            except Exception as error:
                print('ERROR ===', error)

    time.sleep(10)

