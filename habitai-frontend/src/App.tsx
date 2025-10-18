
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { WelcomePage } from './pages/WelcomePage'
import { Toaster } from 'sonner'

function App() {


  return (  
    <BrowserRouter>   <Toaster />
      <Routes>
        <Route path='/' element={<WelcomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
