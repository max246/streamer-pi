import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Header from "./component/header";
import Home from "./page/home";
import Provider from "./page/provider";

import config from "./config";

import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Header logged={true}></Header>
          <Switch>
            <Route exact path="/">
              <Home></Home>
            </Route>

            <Route exact path="/provider/update/:provider">
              <Provider do="edit"></Provider>
            </Route>
            <Route exact path="/providers">
              <Provider do="list"></Provider>
            </Route>
          </Switch>
        </Router>
      </header>
    </div>
  );
}

export default App;
