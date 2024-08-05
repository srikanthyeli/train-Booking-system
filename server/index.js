const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const mysql = require("mysql");
const cors = require("cors");
const util = require("util");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "irtcdb",
});

const query = util.promisify(db.query).bind(db);

app.listen(3002, () => {
  console.log("Server is running on port 3002");
});

app.post("/register", async (req, res) => {
  const { Email, UserName, Password } = req.body;

  try {
    // Check if user already exists
    const selectQuery = "SELECT * FROM USER WHERE userName = ?";
    const users = await query(selectQuery, [UserName]);

    if (users.length > 0) {
      return res.status(400).send("User already exists");
    }

    // Validate password length
    if (Password.length <= 5) {
      return res.status(400).send("Password is too short");
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(Password, 10);

    const insertQuery =
      "INSERT INTO USER (email, userName, password) VALUES (?, ?, ?)";
    const DbResponse = await query(insertQuery, [
      Email,
      UserName,
      hashPassword,
    ]);

    res.status(200).send("User created successfully");

    console.log(DbResponse);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.post("/login", async (req, res) => {
  const { UserName, Password } = req.body;

  try {
    // Check if user exists
    const selectQuery = "SELECT * FROM USER WHERE userName = ?";
    const users = await query(selectQuery, [UserName]);
    const dbUser = users[0];

    if (!dbUser) {
      return res.status(400).send("Invalid user");
    }

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(Password, dbUser.password);

    if (isPasswordMatch) {
      const payload = { userName: UserName };
      const jwtToken = jwt.sign(payload, "My_Secrete_Token");
      res.send({ jwtToken });
    } else {
      res.status(400).send("Invalid password");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, "My_Secrete_Token", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post("/trains/create", authenticateToken, async (req, res) => {
  const {
    TrainName,
    Source,
    Destination,
    SeatCapacity,
    ArrivalTimeAtSource,
    ArrivalTimeAtDestination,
  } = req.body;

  try {
    const selectQuery = "SELECT * FROM TRAINS WHERE trainName= ?;";
    const trains = await query(selectQuery, [TrainName]);

    if (trains.length > 0) {
      return res.status(400).send("Train already exists");
    }

    const insertQuery =
      "INSERT INTO TRAINS (trainName, source, destination, seatCapacity, arrivalTimeAtSource, arrivalTimeAtDestination) VALUES (?, ?, ?, ?, ?, ?)";
    const DbResponse=await query(insertQuery, [
      TrainName,
      Source,
      Destination,
      SeatCapacity,
      ArrivalTimeAtSource,
      ArrivalTimeAtDestination,
    ]);

    res.status(200).send("Train created successfully")
    console.log(DbResponse)
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.get("/trains/availability/", authenticateToken, async (req, res) => {
  const { Source, Destination } = req.body;
  try {
    const selectQuery =
      "SELECT id as train_id,trainName,seatCapacity FROM trains where source=? and destination=?;";
    const response = await query(selectQuery, [Source, Destination]);
    res.status(200).send("seats avialable");
    console.log(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.post("/trains/:train_id/book/", authenticateToken, async (req, res) => {
  const { train_id } = req.params;
  const { userId, noOfSeats } = req.body;

  try {
    const selectQuery = "SELECT seatCapacity FROM TRAINS WHERE id = ?";
    const trains = await query(selectQuery, [train_id]);
    if (trains.length === 0) {
      return res.status(404).json({ message: "Train not found" });
    }
    console.log(res.status(200))

    const train = trains[0];

    const seatQuery = "SELECT COUNT(*) as bookedSeats FROM TRAINBOOKINGS WHERE trainId = ?";
    const bookings = await query(seatQuery, [train_id]);
    const bookedSeats = bookings[0].bookedSeats;
    if (bookedSeats + noOfSeats > train.seatCapacity) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    const insertBookingQuery =
      "INSERT INTO TRAINBOOKINGS (trainId, userId, noOfSeats) VALUES (?, ?, ?)";
    const bookingResult = await query(insertBookingQuery, [
      train_id,
      userId,
      noOfSeats,
    ]);

    const booking_id = bookingResult.id;

    const seatNumbers = [];
    for (let i = 1; i <= noOfSeats; i++) {
      seatNumbers.push(bookedSeats + i);
    }

    res.status(200).json({
      message: "Seat booked successfully",
      booking_id,
      seat_numbers: seatNumbers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/booking/:booking_id', authenticateToken, (req, res) => {
  const bookingId = req.params.booking_id;

  const query = `
    SELECT
      b.bookingId,
      b.trainId,
      t.trainName,
      b.userId,
      b.noOfSeats,
      
      t.arrivalTimeAtSource,
      t.arrivalTimeAtDestination
    FROM
      trainbookings b
    JOIN
      trains t ON b.trainId = t.id
    WHERE
      b.bookingId = ?;
  `;

  db.query(query, [bookingId], (err, results) => {
    if (err) {
      console.error('Error fetching booking details:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(results[0]);
  });
});












