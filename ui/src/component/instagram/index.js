import React, { useRef, useState, useLayoutEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import LoginInstagram from "../../component/instagram/section/login";
import BroadcastInstagram from "../../component/instagram/section/broadcast";

//import config from "../../config";

function ListProviderComponent(props) {
  const [success, setSuccess] = useState(false);

  const handleSuccess = () => {
    setSuccess(true);
  };

  useLayoutEffect(() => {}, []);

  return (
    <div>
      {success ? (
        <BroadcastInstagram />
      ) : (
        <LoginInstagram cb={handleSuccess}></LoginInstagram>
      )}
    </div>
  );
}
export default ListProviderComponent;
