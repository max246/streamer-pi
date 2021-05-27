import React, { useRef, useState, useLayoutEffect, forceUpdate } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import Loading from "../loading";

import config from "../../config";
import "./style.css";

function EditProviderComponent(props) {
  const [devices, setDevices] = useState([]);
  const [audio, setAudio] = useState([]);
  const [device, setDevice] = useState("");
  const [deviceAudio, setDeviceAudio] = useState("");
  const [pass, setPass] = useState("");
  const [stunnel, setStunnel] = useState("");
  const [showLoading, setLoading] = useState(false);

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
    setLoading(true);
    const response = fetch(config.api + "update_settings", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        device: device,
        pass: pass,
        audio: deviceAudio,
        stunnel: stunnel,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        window.location.reload(false);
      })
      .catch(() => {
        setLoading(false);
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
        if (data.status) {
          let settings = data.settings;
          setDevice(settings["device"]);
          setDeviceAudio(settings["audio"]);
          setPass(settings["pass"]);
          setStunnel(settings["stunnel"]);
        }
      });
  }, []);
  return (
    <>
      {showLoading ? <Loading /> : ""}
      <div class="settings">
        <div>
          Devices:{" "}
          <select
            name="devices"
            onChange={handleDevice}
            id="device"
            class="inputSetting"
          >
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
          <select
            name="audio"
            onChange={handleDevice}
            id="audio"
            class="inputSetting"
          >
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
            class="inputSetting"
          />
        </div>
        <div>
          Stunnel host:{" "}
          <input
            type="text"
            value={stunnel}
            name="stunnel"
            onChange={handleChange}
            class="inputSetting"
          />
        </div>
        <input
          type="button"
          name="submit"
          value="edit"
          onClick={handleUpdate}
        />
      </div>
    </>
  );
}
export default EditProviderComponent;
