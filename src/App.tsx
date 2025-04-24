import './App.css'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
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
import { useEffect } from 'react'
import { useAppDispatch } from './store/Store'
import { fetchUserType } from './store/AuthSlice'
import { useTheme } from 'next-themes'
import Layout from './layout/Layout'
import { Home } from './pages/Home'
import { Services } from './pages/Services'
import { Profile } from './pages/Profile'
import { Project } from './pages/Project/Project'
import CreateProjectPage from './pages/Project/CreateProject'
import { ProjectDetails } from './pages/Project/ProjectDetails'

enum UserTypes {
  developer = "developer",
  client = "client"
}

function App() {
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const user_type = useSelector((state: any) => state.auth.userType);
  const location = useLocation();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (theme) {
      document.documentElement.className = theme;
    }
  }, [theme]);

  useEffect(() => {
    dispatch(fetchUserType());
  }, [isLoggedIn])

  useEffect(() => {
    if (!isLoggedIn || !user_type) return;

    if ((user_type === UserTypes.developer && location.pathname.startsWith('/dev')) || (user_type === UserTypes.client && location.pathname.startsWith('/client'))) {
      return;
    }
    else {
      dispatch(fetchUserType());
    }

  }, [location.pathname, user_type, isLoggedIn, dispatch]);

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster />
        <Routes>
          {!isLoggedIn ? (
            <>
              <Route path="/" element={
                <Home />
              } />
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
              <Route path="/user/:username" element={
                <Layout>
                  <Profile />
                </Layout>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
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
                    
                    <Route path="/dev/services" element={
                      <Layout>
                        <Services />
                      </Layout>
                    } />
                    
                    <Route path="/dev/signin" element={<Navigate to="/dev" replace />} />
                    <Route path="/dev/signup" element={<Navigate to="/dev" replace />} />
                    <Route path="/user/:username" element={
                      <Layout>
                        <Profile />
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
                    
                    <Route path="/client/signin" element={<Navigate to="/client" replace />} />
                    <Route path="/client/signup" element={<Navigate to="/client" replace />} />
                    <Route path="/user/:username" element={
                      <Layout>
                        <Profile />
                      </Layout>
                    } />
                    <Route path="/project" element={
                      <Layout>
                        <Project />
                      </Layout>
                    } />
                    <Route path="/project/create" element={
                      <Layout>
                        <CreateProjectPage />
                      </Layout>
                    } />
                    <Route path="/project/:id" element={
                      <Layout>
                        <ProjectDetails />
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
