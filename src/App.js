import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Login from './components/login/login'
import Register from './components/register/register'
import Homepage from './components/homepage/homepage'

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/home">
            <Homepage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
