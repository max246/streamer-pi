import React, { useRef, useState, useLayoutEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import config from "../../config";

function ListProviderComponent(props) {
  const [providers, setProviders] = useState([]);
  const [active, setActive] = useState("");

  const handleActivate = (e) => {
    let id = e.currentTarget.id;
    const response = fetch(config.api + "activate", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        provider: id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        window.location.reload(false);
      });
  };

  useLayoutEffect(() => {
    const response = fetch(config.api + "providers", {
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.providers);
        setActive(data.active);
        setProviders(data.providers);
        //setUpdated(true);
      });
  }, []);
  return (
    <div>
      <table className="tableIntros">
        <tr className="tableIntroHeader">
          <td>Name</td>
          <td>Active</td>
          <td>Manage</td>
        </tr>
        {providers.map((item, i) => {
          return (
            <tr>
              <td>{item}</td>
              <td>{active === item ? "ON" : "OFF"}</td>
              <td>
                <Link to={"/provider/update/" + item}>Edit</Link>{" "}
                {active === item ? (
                  ""
                ) : (
                  <a href="#" onClick={handleActivate} id={item}>
                    Activate
                  </a>
                )}
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
}
export default ListProviderComponent;
