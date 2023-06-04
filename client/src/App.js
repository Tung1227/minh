import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import { useEffect, useState } from 'react';
import Verify from './components/verify/verify';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const setAuth = (Boolean) => {
    setIsAuthenticated(Boolean)
  }

  const isAuth = async () => {
    const respone = await fetch("http://localhost:5000/auth/is-verify/", {
      method: 'GET',
      headers: {token: localStorage.token}
    })

    const parseRes = await respone.json()

    parseRes === true ? setAuth(true): setAuth(false)
  }
  useEffect(() =>{
    isAuth()
  })

  return (
    <div className="App">
      <Router>
        <div className='container'>
          <Routes>
            <Route exact path='/' element={!isAuthenticated ? <Navigate to="/login" /> : <Navigate to="/dashboard" /> } />
            <Route exact path='/login' element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" /> } />
            <Route exact path='/register' element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
            <Route exact path='/dashboard' element={!isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            <Route exact path='/verify/:userId/:token' element={ <Verify/> } />
          </Routes>
        </div>
      </Router>
      {/* <Link to="/login">Login</Link>
      <Link to="/register">Register</Link> */}
    </div>
  );
}

export default App;
