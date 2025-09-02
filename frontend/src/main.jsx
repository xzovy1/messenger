import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './App.jsx'
import Signup from './Signup.jsx'
import Login from './Login.jsx'
import AuthLayout from './AuthLayout.jsx'
import HomeLayout from './HomeLayout.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route index path='log-in' element={<Login />} />
          <Route path='sign-up' element={<Signup />} />
        </Route>
        <Route element={<HomeLayout />} path='/'>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
