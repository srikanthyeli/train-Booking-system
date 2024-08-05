import React, { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Login from "../Login/Login";
import Header from "../Header/Header";
import "./Dashboard.css";
import TrainAvalilability from "../TrainAvailabilty";

const Dashboard = () => {
  const [trainName, setTrainName] = useState("");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [seatCapacity, setSeatCapacity] = useState(0);
  const [arrivalTimeAtSource, setArrivalTimeAtSource] = useState("");
  const [arrivalTimeAtDestination, setArrivalTimeAtDestination] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const submitForm = async (event) => {
    event.preventDefault();

    const jwtToken = Cookies.get("jwt_token");

    if (
      !trainName ||
      !source ||
      !destination ||
      !seatCapacity ||
      !arrivalTimeAtSource ||
      !arrivalTimeAtDestination
    ) {
      setErrorMessage("All fields are required");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3002/trains/create",
        {
          TrainName: trainName,
          Source: source,
          Destination: destination,
          SeatCapacity: seatCapacity,
          ArrivalTimeAtSource: arrivalTimeAtSource,
          ArrivalTimeAtDestination: arrivalTimeAtDestination,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Train added successfully");
      } else {
        setErrorMessage(response.data.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  const renderEndPointField = () => (
    <>
      <label className="input-label" htmlFor="destination">
        DESTINATION
      </label>
      <input
        type="text"
        id="destination"
        className="username-input-field"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
    </>
  );

  const renderStartField = () => (
    <>
      <label className="input-label" htmlFor="start">
        STARTING POINT
      </label>
      <input
        type="text"
        id="start"
        className="username-input-field"
        value={source}
        onChange={(e) => setSource(e.target.value)}
      />
    </>
  );

  const renderTrainNameField = () => (
    <>
      <label className="input-label" htmlFor="trainname">
        TRAIN NAME
      </label>
      <input
        type="text"
        id="trainname"
        className="username-input-field"
        value={trainName}
        onChange={(e) => setTrainName(e.target.value)}
      />
    </>
  );

  const renderSeatCapacityField = () => (
    <>
      <label className="input-label" htmlFor="seat">
        SEAT CAPACITY
      </label>
      <input
        type="number"
        id="seat"
        className="username-input-field"
        value={seatCapacity}
        onChange={(e) => setSeatCapacity(e.target.value)}
      />
    </>
  );

  const renderArriavalTimeAtSourceField = () => (
    <>
      <label className="input-label" htmlFor="arrival-source">
        ARRIVAL TIME AT SOURCE
      </label>
      <input
        type="text"
        id="arrival-source"
        className="username-input-field"
        value={arrivalTimeAtSource}
        onChange={(e) => setArrivalTimeAtSource(e.target.value)}
      />
    </>
  );

  const renderArriavalTimeAtDestinationField = () => (
    <>
      <label className="input-label" htmlFor="arrival-destination">
        ARRIVAL TIME AT DESTINATION
      </label>
      <input
        type="text"
        id="arrival-destination"
        className="username-input-field"
        value={arrivalTimeAtDestination}
        onChange={(e) => setArrivalTimeAtDestination(e.target.value)}
      />
    </>
  );

  const jwtToken = Cookies.get("jwt_token");
  if (jwtToken === undefined) {
    return <Login />;
  }

  return (
    <div className="home-container">
      <Header />
      <div className="train-container">
        <form className="form-container" onSubmit={submitForm}>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="input-container">{renderTrainNameField()}</div>
          <div className="input-container">{renderStartField()}</div>
          <div className="input-container">{renderEndPointField()}</div>
          <div className="input-container">{renderSeatCapacityField()}</div>
          <div className="input-container">{renderArriavalTimeAtSourceField()}</div>
          <div className="input-container">{renderArriavalTimeAtDestinationField()}</div>
          <button type="submit" className="login-button">
            Add train
          </button>
        </form>
        <TrainAvalilability/>
      </div>
      
    </div>
  );
};

export default Dashboard;
