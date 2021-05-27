import React, { useRef, useState, useLayoutEffect, forceUpdate } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";

import "./style.css";
function LoadingComponent(props) {
  return <div className="loading">Loading....</div>;
}
export default LoadingComponent;
