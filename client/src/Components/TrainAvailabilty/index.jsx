import React, { useState } from "react";
import Cookies from "js-cookie";
import Login from "../Login/Login";
import axios from "axios";

const TrainAvalilability = () => {

  const [source, setSource] = useState('');
  const [destination, setdestination] = useState('');
  const [seatavailability, setSeatAvailable] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const submitFrom = async (event) => {
    event.preventDfault();
    const jwtToken = Cookies.get("jwt_token");
    if (!source || !destination) {
      setErrorMessage("All fields are required");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3002/trains/availability/",
        {
          Source: source,
          Destination: destination,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      console.log(response.status)
      if (response.status === 200) {
        alert("Train added successfully");
        setSeatAvailable(true);
      } else {
        setErrorMessage(response.data.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  const renderSourceField = () => (
    <>
      <label className="input-label" htmlFor="arrival-destination">
        SOURCE NAME
      </label>
      <input
        type="text"
        id="arrival-destination"
        className="username-input-field"
        value={source}
        onChange={(e) => setSource(e.target.value)}
      />
    </>
  );
  const renderDestinationField = () => (
    <>
      <label className="input-label" htmlFor="arrival-destination">
        DESTINATION NAME
      </label>
      <input
        type="text"
        id="arrival-destination"
        className="username-input-field"
        value={destination}
        onChange={(e) => setdestination(e.target.value)}
      />
    </>
  );
  const jwtToken = Cookies.get("jwt_token");
  if (jwtToken === undefined) {
    return <Login />;
  }

  return (
    <div classsName="app-container">
      <form className="form-container" onSubmit={submitFrom}>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="input-container">{renderSourceField()}</div>
        <div className="input-container">{renderDestinationField()}</div>
        <button type="submit" className="login-button">
          Check Availability
        </button>
        {seatavailability? <p class="sucess">seats Available</p>:<p></p>}
      </form>
    </div>
  );
};

export default TrainAvalilability;
