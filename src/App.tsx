import './App.css'
import { Route, Routes } from 'react-router-dom'
import { Login } from './auth/Login'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* <Route path="*" element={<NotFound />} /> Handles unknown routes */}
      </Routes>
    </>
  )
}

export default App
