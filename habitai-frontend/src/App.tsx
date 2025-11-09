import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { WelcomePage } from './pages/WelcomePage/index.tsx'
import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { UserPage } from './pages/UserPage/index.tsx'
import { PropertyDetailsPage } from "./pages/PropertyDetailsPage/PropertyDetailsPage.tsx";
import { PropertyCreatePage } from './pages/PropertyCreatePage/index.tsx'

function App() {
    return (
        <BrowserRouter>
            <Toaster />
            <AuthProvider>
                <Routes>
                <Route path='/' element={<WelcomePage />} />
                <Route path='/properties/:id' element={<PropertyDetailsPage />} />
                <Route element={<ProtectedRoute />}>
                    <Route path='/me' element={<UserPage />} />
                    <Route path='/register' element={<PropertyCreatePage />}/>
                </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
