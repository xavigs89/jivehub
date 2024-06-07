//@ts-nocheck
import { logger } from './utils'

import logic from './logic'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'

import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Feedback from './components/Feedback'
import { useState } from 'react'
import { Context } from './context'
import Confirm from './components/Confirm'
import { errors } from 'com'

const { UnauthorizedError } = errors

function App() {

  const [feedback, setFeedback] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [meetingToEdit, setMeetingToEdit] = useState(null)
  const [stamp, setStamp] = useState(null)


  const navigate = useNavigate()

  const goToLogin = () => navigate('/login')

  const handleLoginClick = () => goToLogin()

  const handleRegisterClick = () => navigate('/register')

  const handleUserLoggedOut = () => goToLogin()

  const handleFeedbackAcceptClick = () => setFeedback(null)

  const handleFeedback = (error, level = 'warn') => {
    if (error instanceof UnauthorizedError) {
      logic.logoutUser()
      level = 'error'
      goToLogin()
    }

    setFeedback({ message: error.message, level })
  }

  const handleUserLoggedIn = () => {
    try {
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }


  const handleConfirm = (message, callback) => setConfirm({ message, callback })

  const handleConfirmAcceptClick = () => {
    confirm.callback(true)

    setConfirm(null)
  }

  const handleConfirmCancelClick = () => {
    confirm.callback(false)

    setConfirm(null)
  }

  logger.debug('App -> render')

  return <>
    <Context.Provider value={{ stamp, setStamp, showFeedback: handleFeedback, showConfirm: handleConfirm, meetingToEdit, setMeetingToEdit }}>
      <Routes>
        <Route path="/login" element={logic.isUserLoggedIn() ? <Navigate to="/" /> : <Login
          onRegisterClick={handleRegisterClick}
          onUserLoggedIn={handleUserLoggedIn} />} />

        <Route path="/register" element={logic.isUserLoggedIn() ? <Navigate to="/" /> : <Register
          onLoginClick={handleLoginClick}
          onUserRegistered={handleLoginClick} />} />

        <Route path="/*" element={logic.isUserLoggedIn() ? <Home
          onUserLoggedOut={handleUserLoggedOut} /> : <Navigate to="/login" />} />

      </Routes>
    </Context.Provider>

    {feedback && <Feedback message={feedback.message} level={feedback.level}
      onAcceptClick={handleFeedbackAcceptClick} />}

    {confirm && <Confirm message={confirm.message} onCancelClick={handleConfirmCancelClick} onAcceptClick={handleConfirmAcceptClick} />}

  </>

}

export default App
