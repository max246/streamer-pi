import React, { useRef, useState, useLayoutEffect, forceUpdate } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";

import config from "../../config";

function EditProviderComponent(props) {
  const [devices, setDevices] = useState([]);
  const [audio, setAudio] = useState([]);
  const [device, setDevice] = useState("");
  const [deviceAudio, setDeviceAudio] = useState("");
  const [pass, setPass] = useState("");

  const handleChange = (e) => {
    let value = e.currentTarget.value;
    setPass(value);
  };

  const handleDevice = (e) => {
    let value = e.currentTarget.value;
    let id = e.currentTarget.id;
    if (id == "audio") setDeviceAudio(value);
    else setDevice(value);
  };
  const handleUpdate = (e) => {
    const response = fetch(config.api + "update_settings", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        device: device,
        pass: pass,
        audio: audio,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        window.location.reload(false);
      });
  };
  useLayoutEffect(() => {
    const response = fetch(config.api + "list_device", {
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setDevices(data.devices);
      });

    const response3 = fetch(config.api + "list_audio", {
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAudio(data.audio);
      });
    const response2 = fetch(config.api + "settings", {
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let settings = data.settings;
        setDevice(settings["device"]);
        setDeviceAudio(settings["audio"]);
        setPass(settings["pass"]);
      });
  }, []);
  return (
    <div>
      <div>
        Devices:{" "}
        <select name="devices" onChange={handleDevice} id="device">
          {devices.map((item, i) => {
            return (
              <option value={item} selected={device == item ? "selecte" : ""}>
                {item}
              </option>
            );
          })}
        </select>
      </div>
      <div>
        Audio:{" "}
        <select name="audio" onChange={handleDevice} id="audio">
          {audio.map((item, i) => {
            return (
              <option
                value={item}
                selected={deviceAudio == item ? "selecte" : ""}
              >
                {item}
              </option>
            );
          })}
        </select>
      </div>
      <div>
        Password:{" "}
        <input
          type="text"
          value={pass}
          name="password"
          onChange={handleChange}
        />
      </div>
      <input type="button" name="submit" value="edit" onClick={handleUpdate} />
    </div>
  );
}
export default EditProviderComponent;
