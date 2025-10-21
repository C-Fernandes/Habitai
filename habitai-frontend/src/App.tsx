
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { WelcomePage } from './pages/WelcomePage'
import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './auth/ProtectedRoute'

function App() {


  return (
    <BrowserRouter>
      <Toaster />
      <AuthProvider>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path='/' element={<WelcomePage />} />
            </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
