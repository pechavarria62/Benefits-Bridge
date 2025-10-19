// import { useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import ZipCode from './pages/ZipCode'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ZipCode />} />
        {/* <Route path="/results" element={<Results />} />0 */}
      </Routes>
    </Router>
  )
}

export default App
