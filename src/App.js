import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./components/home.component";

function App() {
  return (<Router>
    <div className="App">
      <div className="outer">
        <div className="inner">
            <Home/>
        </div>
      </div>
    </div></Router>
  );
}

export default App;
