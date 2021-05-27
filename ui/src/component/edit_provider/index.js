import React, { useRef, useState, useLayoutEffect, forceUpdate } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";

import "./style.css";
import config from "../../config";
import Loading from "../loading";

function EditProviderComponent(props) {
  let { provider } = useParams();
  const [params, setParams] = useState([]);
  const [showLoading, setLoading] = useState(false);

  const handleChange = (e) => {
    let id = e.currentTarget.id;
    let value = e.currentTarget.value;
    let newparams = [];
    params.map((item, i) => {
      if (item[0] === id) {
        newparams.push([item[0], value]);
      } else {
        newparams.push(item);
      }
    });
    setParams(newparams);
  };
  const handleUpdate = (e) => {
    setLoading(true);
    const response = fetch(config.api + "update", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        provider: provider,
        params: params,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  useLayoutEffect(() => {
    const response = fetch(config.api + "provider", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        provider: provider,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setParams(data.params);
      });
  }, []);
  return (
    <>
      {showLoading ? <Loading /> : ""}
      <div className="provider">
        {params.map((item, i) => {
          return (
            <div>
              {item[0]}:{" "}
              <input
                type="text"
                value={item[1]}
                name={item[0]}
                id={item[0]}
                key={item[0]}
                onChange={handleChange}
                className="inputProvider"
              />
            </div>
          );
        })}
        <input
          type="button"
          name="submit"
          value="edit"
          onClick={handleUpdate}
          className="buttonProvider"
        />
      </div>
    </>
  );
}
export default EditProviderComponent;
