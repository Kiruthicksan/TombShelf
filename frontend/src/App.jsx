import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home/Home"


import Register from "./pages/Register"
import LoginPage from "./pages/LoginPage"
import { useAuthStore } from "./store/store"
import { useEffect } from "react"
import Navbar from "./components/Navbar/Navbar"
import Profile from "./pages/Profile"



const MainLayout = ({children}) => {
  return(
    <>
      <Navbar />
      {children}
    </>
  )
}

const App = () => {

  const fetchUser = useAuthStore((state => state.fetchUser))
  const isLoading = useAuthStore(state => state.isLoading)
   

  useEffect(() => {
   fetchUser()
  },[])

  

    if (isLoading) return <div>Loading...</div>;
  return (
    <BrowserRouter>
   
    <Routes>
      <Route path="/" element = {
        <MainLayout>
           <Home />
        </MainLayout>
       
        } />
      
      <Route path="/profile" element = {
        <MainLayout>
          <Profile />
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