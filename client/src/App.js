import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

import Dashboard from './components/Dashboard';
import Login from './components/pages/Login';
import Signup from './components/pages/Signup';
import { useEffect, useState } from 'react';
import Verify from './components/verify/Verify';
import Listroom from './components/pages/CreatePost';
import Listpost from './components/pages/Listpost';



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const setAuth = (Boolean) => {
    setIsAuthenticated(Boolean)
  }

  return (
    <div className="App">
      <Router>
        <div className='container'>
          <Routes>
            <Route path='' element={<Navigate to="/login" />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/verify' element={<Verify />} />
            <Route path='/createpost' element={<Listroom/>} />
            <Route path='/listpost' element={<Listpost/>} />
          </Routes>
        </div>
      </Router>
      {/* <Link to="/login">Login</Link>
      <Link to="/Signup">Signup</Link> */}
    </div>
  );
}

export default App;
