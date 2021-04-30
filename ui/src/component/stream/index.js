import Websocket from "react-websocket";
import React, { useRef, useState } from "react";
import "./style.css";
import { Link } from "react-router-dom";
import config from "../../config";

function StreamingComponent(props) {
  const wsRef = useRef();
  const [status, setStatus] = useState("");
  const [output, setOutput] = useState([]);
  const handleClose = () => {
    setStatus("Socket closed, probably not running");
  };
  const handleOpen = () => {
    setStatus("Socket open, streamer running");
  };
  const handleData = (data) => {
    let newoutput = [];
    newoutput.push(data);
    output.map((item) => {
      newoutput.push(item);
    });
    setOutput(newoutput);
  };
  const handleError = () => {
    setStatus("Socket error, probably not running");
  };

  const handleStart = () => {
    const response = fetch(config.api + "start", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        provider: "",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        window.location.reload(false);
      });
  };
  const handleStop = () => {
    const response = fetch(config.api + "stop", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        provider: "",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        window.location.reload(false);
      });
  };
  return (
    <div>
      <div>
        {" "}
        <a href="/#" onClick={handleStart} className="navigationLink">
          Start Stream
        </a>{" "}
        <a href="/#" onClick={handleStop} className="navigationLink">
          Stop Stream
        </a>
      </div>
      <div className="outputWS">{status}</div>
      <div className="outputFFMPEG">
        {output.map((item) => {
          return (
            <>
              {item}
              <br />
            </>
          );
        })}
      </div>
      <Websocket
        url={"ws://" + window.location.host + ":8000"}
        ref={wsRef}
        onOpen={handleOpen}
        onClose={handleClose}
        onError={handleError}
        reconnect={true}
        onMessage={handleData.bind(this)}
      />
    </div>
  );
}
export default StreamingComponent;
