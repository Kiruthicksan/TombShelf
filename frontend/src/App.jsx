import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home/Home"
import Navbar from "./components/Navbar/Navbar"

import Register from "./pages/Register"
import LoginPage from "./pages/LoginPage"

const MainLayout = ({children}) => {
  return(
    <>
      <Navbar />
      {children}
    </>
  )
}
const App = () => {
  return (
    <BrowserRouter>
   
    <Routes>
      <Route path="/" element = {
        <MainLayout>
           <Home />
        </MainLayout>
       
        } />

          {/* Auth pages without navbar */}
         <Route path="/register" element = {<Register />}></Route>
         <Route path="/login" element = {<LoginPage />}></Route>
    </Routes>

  

   
    </BrowserRouter>
  )
}
export default App