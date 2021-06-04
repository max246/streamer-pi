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
  const [wifiDevs, setWifiDevs] = useState([]);
  const [wifidevice, setDeviceWifi] = useState("");

  const [wifis, setWifis] = useState([]);
  const [wifi, setWifi] = useState("");
  const [wifipass, setWifiPass] = useState("");
  const [isHS, setHS] = useState(false);

  const handleChange = (e) => {
    let value = e.currentTarget.value;
    let id = e.currentTarget.id;
    if (id == "password") setPass(value);
    else if (id == "stunnel") setStunnel(value);
    else if (id == "wifipass") setWifiPass(value);
  };

  const handleDevice = (e) => {
    let value = e.currentTarget.value;
    let id = e.currentTarget.id;
    if (id == "audio") setDeviceAudio(value);
    else if (id == "wifidev") setDeviceWifi(value);
    else if (id == "wifi") setWifi(value);
    else setDevice(value);
  };

  const handleHotspot = (e) => {
    setLoading(true);
    const response = fetch(config.api + "enable_hotspot", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isHS: isHS,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) window.location.reload(false);
        else setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleConnect = (e) => {
    setLoading(true);
    const response = fetch(config.api + "connect_wifi", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wifi: wifi,
        pass: wifipass,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) window.location.reload(false);
        else setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
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
        wifidev: wifidevice,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) window.location.reload(false);
        else setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleScan = (e) => {
    const response = fetch(config.api + "scan_wifi", {
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setWifis(data.wifis);
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

    const response4 = fetch(config.api + "list_wifi_hw", {
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setWifiDevs(data.devs);
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
          setDeviceWifi(settings["wifidev"]);
          setHS(settings["is_hotspot"]);
        }
      });
  }, []);
  return (
    <>
      {showLoading ? <Loading /> : ""}
      <div class="settings">
        <div>
          <h1>Settings</h1>
        </div>
        <div>
          Devices:{" "}
          <select
            name="devices"
            onChange={handleDevice}
            id="device"
            class="inputSetting"
          >
            <option value="">-select-</option>
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
            <option value="">-select-</option>
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
            id="password"
            class="inputSetting"
          />
        </div>
        <div>
          Stunnel host:{" "}
          <input
            type="text"
            value={stunnel}
            name="stunnel"
            id="stunnel"
            onChange={handleChange}
            class="inputSetting"
          />
        </div>

        <div>
          Wifi device :{" "}
          <select
            name="wifidev"
            onChange={handleDevice}
            id="wifidev"
            class="inputSetting"
          >
            <option value="">-select-</option>
            {wifiDevs.map((item, i) => {
              return (
                <option
                  value={item}
                  selected={wifidevice == item ? "selecte" : ""}
                >
                  {item}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <input
            type="button"
            name="submit"
            value="Update"
            onClick={handleUpdate}
          />
        </div>

        <div>
          <div>
            <h1>Wifi connection</h1>
          </div>
          {isHS ? (
            <>
              <div>
                Wifi:{" "}
                <input
                  type="button"
                  value="scan"
                  name="scam"
                  onClick={handleScan}
                />{" "}
                <select
                  name="wifi"
                  onChange={handleDevice}
                  id="wifi"
                  class="inputSetting"
                >
                  <option value="">-select-</option>
                  {wifis.map((item, i) => {
                    return (
                      <option
                        value={item[1]}
                        selected={wifi == item ? "selecte" : ""}
                      >
                        {item[1] + " (" + item[0] + ")"}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                Wifi pass:{" "}
                <input
                  type="text"
                  value={wifipass}
                  name="wifipass"
                  id="wifipass"
                  onChange={handleChange}
                  class="inputSetting"
                />
              </div>
              <div>
                Wifi control:{" "}
                <input
                  type="button"
                  value="Connect"
                  name="connect"
                  onClick={handleConnect}
                />
                <br />
                Once pressed, the system will try to connect to the wifi
              </div>
            </>
          ) : (
            <div>
              {" "}
              Wifi control:{" "}
              <input
                type="button"
                value="Enable Hotspot"
                name="hotspot"
                onClick={handleHotspot}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default EditProviderComponent;
