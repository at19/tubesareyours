import React, {useState} from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import NavBar from './components/NavBar/NavBar';
import Auth from './pages/Auth/Auth';

import AuthContext from './contexts/auth-context';
import Videos from './pages/Videos/Videos';

function App() {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  const login = (userId, token, tokenExpiration) => {
    setUserId(userId);
    setToken(token);
  }
  
  const logout = () => {
    setUserId(null);
    setToken(null);
  }

  return (
    <div className="App">
      <Router>
        <>
          <AuthContext.Provider value={{userId, token, login, logout}}>
            <NavBar />
            <main className="App__main">
              <Switch>
                {!token && <Redirect from="/" to="/login" exact />}
                {token && <Redirect from="/login" to="/videos" exact />}
                {!token && <Route path="/login" component={Auth} />}
                <Route path="/videos" component={Videos} />
              </Switch>
            </main>
          </AuthContext.Provider>
        </>
      </Router>
    </div>
  );
}

export default App;
