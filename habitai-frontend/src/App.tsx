
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { WelcomePage } from './pages/WelcomePage'
import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { UserPage } from './pages/UserPage/UserPage'

function App() {


  return (
    <BrowserRouter>
      <Toaster />
      <AuthProvider>
        <Routes>
          <Route path='/' element={<WelcomePage />} />
          <Route element={<ProtectedRoute />}>
            <Route path='/me' element={<UserPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
