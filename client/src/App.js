import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, Redirect } from "react-router-dom"

import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import { useEffect, useState } from 'react';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const setAuth = (Boolean) => {
    setIsAuthenticated(Boolean)
  }
  
  return (
    <div className="App">
      Hello welcome to webnhatro
      <Router>
        <div className='container'>
          <Routes>
            <Route exact path='/login' element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" /> } />
            <Route exact path='/register' element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
            <Route exact path='/dashboard' element={!isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          </Routes>
        </div>
        <NavLink
          to="/login"
        >Login </NavLink>
        <NavLink
          to="/register"
        >Register</NavLink>
      </Router>
      {/* <Link to="/login">Login</Link>
      <Link to="/register">Register</Link> */}
    </div>
  );
}

export default App;
