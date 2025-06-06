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
import ProjectDetails from './pages/Project/ProjectDetails'
import UpdateProjectPage from './pages/Project/UpdateProject'
import { MilestoneDetails } from './pages/Milestone/MilestoneDetails'

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

    if ((user_type === UserTypes.developer && location.pathname.startsWith('/dashboard')) || (user_type === UserTypes.client && location.pathname.startsWith('/dashboard'))) {
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

              {/* New unified routes with role support */}
              <Route path="/signup" element={
                <Auth>
                  {/* Check URL params to determine which component to render */}
                  {location.search.includes('role=client') ? <ClientRegister /> :
                    location.search.includes('role=developer') ? <DevRegister /> :
                      <Navigate to="/" replace />}
                </Auth>
              } />
              <Route path="/login" element={
                <Auth>
                  {/* Check URL params to determine which component to render */}
                  {location.search.includes('role=client') ? <ClientLogin /> :
                    location.search.includes('role=developer') ? <DevLogin /> :
                      <Navigate to="/" replace />}
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
                  <Route path="/dashboard" element={
                    <Layout>
                      <DevHome />
                    </Layout>
                  } />
                  <Route path="/browse" element={
                    <Layout>
                      <DevHome />
                    </Layout>
                  } />

                  <Route path="/services" element={
                    <Layout>
                      <Services />
                    </Layout>
                  } />

                  <Route path="/settings" element={
                    <Layout>
                      <div className="p-8">
                        <h1 className="text-2xl font-bold">Settings</h1>
                        <p className="text-gray-600 mt-2">Settings page coming soon...</p>
                      </div>
                    </Layout>
                  } />

                  {/* Redirect old and new routes to dashboard
                  <Route path="/dev" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dev/services" element={<Navigate to="/services" replace />} />
                  <Route path="/login" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/signup" element={<Navigate to="/dashboard" replace />} /> */}

                  <Route path="/user/:username" element={
                    <Layout>
                      <Profile />
                    </Layout>
                  } />
                  <Route path="/projects/:id" element={
                    <Layout>
                      <ProjectDetails />
                    </Layout>
                  } />
                  <Route path="/projects/:id/edit" element={
                    <Layout>
                      <UpdateProjectPage />
                    </Layout>
                  } />
                  <Route path="/projects/:id/milestone/:milestoneId" element={
                    <Layout>
                      <MilestoneDetails />
                    </Layout>
                  } />
                </>
              )}
              {user_type === UserTypes.client && (
                <>
                  <Route path="/dashboard" element={
                    <Layout>
                      <ClientHome />
                    </Layout>
                  } />
                  <Route path="/browse" element={
                    <Layout>
                      <DevHome />
                    </Layout>
                  } />

                  <Route path="/settings" element={
                    <Layout>
                      <div className="p-8">
                        <h1 className="text-2xl font-bold">Settings</h1>
                        <p className="text-gray-600 mt-2">Settings page coming soon...</p>
                      </div>
                    </Layout>
                  } />

                  {/* Redirect old routes to dashboard
                  <Route path="/client" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/login" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/signup" element={<Navigate to="/dashboard" replace />} /> */}

                  <Route path="/user/:username" element={
                    <Layout>
                      <Profile />
                    </Layout>
                  } />
                  <Route path="/projects" element={
                    <Layout>
                      <Project />
                    </Layout>
                  } />
                  <Route path="/projects/create" element={
                    <Layout>
                      <CreateProjectPage />
                    </Layout>
                  } />
                  <Route path="/projects/:id" element={
                    <Layout>
                      <ProjectDetails />
                    </Layout>
                  } />
                  <Route path="/projects/:id/edit" element={
                    <Layout>
                      <UpdateProjectPage />
                    </Layout>
                  } />
                  <Route path="/projects/:id/milestone/:milestoneId" element={
                    <Layout>
                      <MilestoneDetails />
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
