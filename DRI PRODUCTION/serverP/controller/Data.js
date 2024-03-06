import sql from "mssql";
import pg from "pg";

// Destructuring the required classes from the pg module
const { Pool, Client } = pg;

export const Start = async (req, res) => {
  try {
    const pool = new Pool({
      user: "docketrun",
      password: "docketrun",
      host: "localhost",
      port: 5432,
      database: "docketrundb",
    });
    console.log("Connection Successful !");

    // Check the current status before updating
    const currentStatusResult = await pool.query(
      `
      SELECT status
      FROM detection_status
      WHERE detection_id = 1;
    `
    );

    const currentStatus = currentStatusResult.rows[0]?.status;

    if (currentStatus !== undefined) {
      // Toggle the status (0 -> 1, 1 -> 0)
      const newStatus = currentStatus === 0 ? 1 : 0;

      // Update the detection_status
      await pool.query(
        `
        UPDATE detection_status
        SET status = $1
        WHERE detection_id = 1
        RETURNING status;
      `,
        [newStatus]
      );

      console.log("Success");

      // Send the updated status as JSON response
      res.status(200).json({ status: newStatus });
    } else {
      console.log("Failed to retrieve current status");
      res.status(500).json({ error: "Failed to retrieve current status" });
    }

    // Release the pool when done with queries
    pool.end();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json(error);
  }
};

export const getData = async (req, res) => {
  let pool; // Declare the pool variable outside the try-catch block

  try {
    const pool = new Pool({
      user: "docketrun",
      password: "docketrun",
      host: "localhost",
      port: 5432,
      database: "docketrundb",
    });
    console.log("Connection Successful !");

    // Get the current date
    const currentDate = new Date();

    // Extract date portion in 'YYYY-MM-DD' format
    const currentDateFormatted = currentDate.toISOString().split("T")[0];

    // Modify the query to filter by today's date
    const result = await pool.query(
      `
      SELECT * 
      FROM detection_info 
      WHERE DATE(time_stamp) = $1;
    `,
      [currentDateFormatted]
    );

    // Send the result as JSON response
    res.status(200).json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed", err: err });
  } finally {
    // Release the pool when done with queries
    if (pool) {
      await pool.end();
    }
  }
};

export const getHistoryData = async (req, res) => {
  let pool; // Declare the pool variable outside the try-catch block

  try {
    const pool = new Pool({
      user: "docketrun",
      password: "docketrun",
      host: "localhost",
      port: 5432,
      database: "docketrundb",
    });
    console.log("Connection Successful !");

    // Extract start and stop dates from request body
    const start = req.body.start;
    const stop = req.body.stop;

    // Modify the query to filter by start and stop dates
    const result = await pool.query(
      `
      SELECT * 
      FROM detection_info 
      WHERE time_stamp BETWEEN $1 AND $2;
    `,
      [start, stop]
    );

    // Send the result as JSON response
    console.log(result.rows);
    res.status(200).json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed", err: err });
  } finally {
    // Release the pool when done with queries
    if (pool) {
      await pool.end();
    }
  }
};
