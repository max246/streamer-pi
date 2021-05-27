import React, { useRef, useState, useLayoutEffect, forceUpdate } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import "./style.css";
import Loading from "../../../loading";

import config from "../../../../config";

function BroadcastInstagramComponent(props) {
  const [started, setStarted] = useState(false);
  const [created, setCreated] = useState(false);
  const [streamKey, setKey] = useState("");
  const [streamServer, setServer] = useState("");
  const [showLoading, setLoading] = useState(false);

  const handleClick = (e) => {
    setLoading(true);
    let id = e.currentTarget.id;
    const response = fetch(config.api + "action_instagram", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        console.log(data);
        if (data.status) {
          if (data.next == "start") {
            setCreated(true);
            setStarted(false);
          } else if (data.next == "end") {
            setCreated(false);
            setStarted(true);
            setKey(data.stream_key);
            setServer(data.stream_server);
          } else if (data.next == "create") {
            setCreated(false);
            setStarted(false);
          }
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useLayoutEffect(() => {
    const response = fetch(config.api + "status_instagram", {
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          if (data.stream) {
            setCreated(false);
            setStarted(true);
            setKey(data.stream_key);
            setServer(data.stream_server);
          }
        }
      });
  }, []);

  return (
    <>
      {showLoading ? <Loading /> : ""}

      <div>
        {started ? (
          <div>
            <h2>Use the following to populate the provider info</h2>
            Stream key:{" "}
            <input type="text" value={streamKey} className="inputBroadcast" />
            <br />
            Stream server:{" "}
            <input
              type="text"
              value={streamServer}
              className="inputBroadcast"
            />
            <br />
            <input
              type="button"
              onClick={handleClick}
              id="stop"
              value="Stop broadcast"
            />
          </div>
        ) : (
          [
            created ? (
              <input
                type="button"
                onClick={handleClick}
                id="start"
                value="Start broadcast"
              />
            ) : (
              <input
                type="button"
                onClick={handleClick}
                id="create"
                value="Create broadcast"
              />
            ),
          ]
        )}
      </div>
    </>
  );
}
export default BroadcastInstagramComponent;
