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
  const [device, setDevice] = useState("");
  const [pass, setPass] = useState("");

  const handleChange = (e) => {
    let value = e.currentTarget.value;
    setPass(value);
  };

  const handleDevice = (e) => {
    let value = e.currentTarget.value;
    console.log(value);
    setDevice(value);
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
        setPass(settings["pass"]);
      });
  }, []);
  return (
    <div>
      <div>
        Devices:{" "}
        <select name="devices" onChange={handleDevice}>
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
