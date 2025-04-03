import './App.css'
import { Route, Routes } from 'react-router-dom'
import { ClientLogin } from './auth/ClientLogin'
import { ThemeProvider } from './components/theme-provider'
import { Auth } from './auth/Auth'
import { DevRegister } from './auth/DevRegister'

function App() {

  return (
    <>
      

      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          <Route path="/client" element={
            <Auth>
              <ClientLogin />
            </Auth>
          } />
          <Route path="/dev" element={
            <Auth>
              <DevRegister/>
            </Auth>
          } />

          {/* <Route path="*" element={<NotFound />} /> Handles unknown routes */}
        </Routes>
      </ThemeProvider>
    </>
  )
}

export default App
