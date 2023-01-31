import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '../auth/pages/LoginPage';
import { CalendarPage } from '../calendar/pages/CalendarPage';

export const AppRouter = () => {
    const appStatus = 'authenticated'; // 'not-authenticated';

  return (
    <Routes>
        {
            (appStatus === 'not-authenticated') 
            ? <Route path='/auth/*' element={ <LoginPage /> } />
            : <Route path='/*' element={ <CalendarPage /> } />
        }
        
        <Route path='/*' element={ <Navigate to="auth/loginxs" /> } />

    </Routes>
  )
}
