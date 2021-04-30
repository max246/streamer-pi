import React, { useRef, useState, useLayoutEffect, forceUpdate } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";

import config from "../../../../config";

function LoginInstagramComponent(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [twofact, setTwoFact] = useState(false);
  const [code, setCode] = useState("");

  const handleChange = (e) => {
    let id = e.currentTarget.id;
    let value = e.currentTarget.value;
    if (id == "user") setUsername(value);
    else if (id == "password") setPassword(value);
    else if (id == "code") setCode(value);
  };
  const handleUpdate = (e) => {
    const response = fetch(config.api + "login_instagram", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: username,
        pass: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          alert("all good");
          props.cb();
        } else {
          if (data.two_factor) {
            alert("now enter the code from sms");
            setTwoFact(true);
          } else {
            alert("not good login");
          }
        }
        console.log(data);
      });
  };

  const handleUpdateTwo = (e) => {
    const response = fetch(config.api + "login_instagram_code", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: code,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          alert("all good");
          props.cb();
        } else {
          alert("opsss wrong code");
        }
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
          props.cb();
        }
      });
  }, []);

  return (
    <div>
      {twofact ? (
        <div>
          Two Fact Code:{" "}
          <input type="text" value={code} id="code" onChange={handleChange} />
          <input
            type="button"
            name="submit"
            value="Login"
            onClick={handleUpdateTwo}
          />
        </div>
      ) : (
        <div>
          Username:{" "}
          <input
            type="text"
            value={username}
            id="user"
            onChange={handleChange}
          />
          Password{" "}
          <input
            type="password"
            value={username}
            id="password"
            onChange={handleChange}
          />
          <input
            type="button"
            name="submit"
            value="Login"
            onClick={handleUpdate}
          />
        </div>
      )}
    </div>
  );
}
export default LoginInstagramComponent;
