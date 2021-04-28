import "./header.css";
import Wrapper from "./wrapper";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function HeaderComponent(props) {
  return (
    <Wrapper>
      <div id="title" className="title">
        Streamer configurator
      </div>
      <div id="navigator">
        <Link to="/#" className="navigationLink">
          Home
        </Link>{" "}
        <Link to="/providers" className="navigationLink">
          Providers
        </Link>
      </div>
    </Wrapper>
  );
}
export default HeaderComponent;
