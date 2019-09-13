import React from 'react';
import './App.css';

import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
import NavBar from './components/NavBar/NavBar';
import Auth from './pages/Auth';

function App() {
  return (
    <div className="App">
      <Router>
        <>
          <NavBar />
          <main className="App__main">
            <Switch>
              <Redirect from="/" to="/login" exact />
              <Route path="/login" component={Auth} /> 
              <Route path="/videos" component={null} /> 
            </Switch>
          </main>
        </>
      </Router>
    </div>
  );
}

export default App;
