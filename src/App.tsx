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
import { useEffect, useState } from 'react'
import { useAppDispatch } from './store/Store'
import { fetchUserType } from './store/AuthSlice'
import { Layout } from './components/layout'
import { useTheme } from 'next-themes'

enum UserTypes {
  developer = "developer",
  client = "client"
}

function App() {
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const user_type = useSelector((state: any) => state.auth.userType);
  const userDetails = useSelector((state: any) => state.auth.userDetails);
  const { theme } = useTheme();

  useEffect(() => {
    if (theme) {
      document.documentElement.className = theme;
    }
  }, [theme]);
  
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchUserType());
    }
  }, [isLoggedIn, dispatch])

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
                {user_type === UserTypes.developer && (
                  <>
                    <Route path="/dev" element={
                      <Layout>
                        <DevHome />
                      </Layout>
                    } />
                  </>
                )}
                {user_type === UserTypes.client && (
                  <>
                    <Route path="/client" element={
                      <Layout>
                        <ClientHome />
                      </Layout>
                    } />
                  </>
                )}
              </>
          )
          }

          <Route path="*" element={
            <div className="flex items-center justify-center h-screen">
              <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
            </div>
          } />
        </Routes>
      </ThemeProvider>
    </>
  )
}

export default App
