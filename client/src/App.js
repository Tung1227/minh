import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { CookiesProvider } from "react-cookie";
import { ThemeProvider } from "@material-tailwind/react";

import Dashboard from './components/pages/Dashboard';
import Login from './components/pages/Login';
import Signup from './components/pages/Signup';
import { useEffect, useState } from 'react';
import Verify from './components/verify/Verify';
import Listroom from './components/pages/CreatePost';
import Listpost from './components/pages/Listpost';
import RePass from './components/pages/RePass';
import InputMail from './components/pages/InputMail';
import NewPass from './components/pages/NewPass';
import ProductDetail from './components/pages/PostDetail';
import MainPage from './components/pages/admin/MainPage';


function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/createpost' element={<Listroom />} />
          <Route path='/repass' element={<RePass />} />
          <Route path='/newpass' element={<NewPass />} />
          <Route path='/inputmail' element={<InputMail />} />
          <Route path='/detailpost' element={<ProductDetail />} />
          <Route path='/admin' element={<MainPage />} />
        </Routes>
      </Router>
      {/* <Link to="/login">Login</Link>
      <Link to="/Signup">Signup</Link> */}
    </div>
  );
}
export default App;
