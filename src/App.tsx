import './App.css'
import { Route, Routes } from 'react-router-dom'
import { ClientLogin } from './auth/ClientLogin'
import { ThemeProvider } from './components/theme-provider'
import { Auth } from './auth/Auth'
import { DevRegister } from './auth/DevRegister'
import { ClientRegister } from './auth/ClientRegister'
import { DevLogin } from './auth/DevLogin'
import { useSelector } from 'react-redux'
import { Toaster } from 'sonner'
import { DevHome } from './pages/DevHome'
import { ClientHome } from './pages/ClientHome'

function App() {
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster />
        <Routes>
          {!isLoggedIn ? (
            <>
              <Route path="/client/signup" element={
                <Auth>
                  <ClientRegister />
                </Auth>
              } />
              <Route path="/dev/signup" element={
                <Auth>
                  <DevRegister />
                </Auth>
              } />
              <Route path="/client/signin" element={
                <Auth>
                  <ClientLogin />
                </Auth>
              } />
              <Route path="/dev/signin" element={
                <Auth>
                  <DevLogin />
                </Auth>
              } />
            </>
          ) : (
            <>
              <Route path="/client" element={
                <ClientHome />
              } />
              <Route path="/dev" element={
                <DevHome />
              } />
            </>
          )
          }


          {/* <Route path="*" element={<NotFound />} /> Handles unknown routes */}
        </Routes>
      </ThemeProvider>
    </>
  )
}

export default App
