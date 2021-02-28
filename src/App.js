import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router} from "react-router-dom";
import { Helmet} from "react-helmet";

import Home from "./components/home.component";

function App() {
  return (<Router>
    <Helmet>
      <title>Trade size calculator</title>
      <meta name="description" content = "Your best trade size calculator"/>
    </Helmet>
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
