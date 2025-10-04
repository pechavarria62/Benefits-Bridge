// import { useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import ZipCode from './pages/ZipCode'
import Results from './pages/results'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ZipCode />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  )
}

export default App
