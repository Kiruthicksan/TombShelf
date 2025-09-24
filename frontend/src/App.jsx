import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Home";
import Register from "./pages/Register";
import LoginPage from "./pages/LoginPage";
import { useAuthStore } from "./store/store";
import { useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoutes";
import Unauthorized from "./pages/Unauthorized";
import ManageBooks from "./pages/ManageBooks";


const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

const App = () => {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    const getUser = async () => {
      const user = await fetchUser()
      console.log(`FetchedUser:` , user)

    }
    getUser();
  }, [fetchUser]);



  return (
   
    <BrowserRouter>
      <Routes>
        {/* Pubic routes || pages */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />

        {/* Protected Routes || pages */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route  path="/manage-books" element = {
          <ProtectedRoute allowedRoles={["admin"]}>
            <MainLayout>
              <ManageBooks />
            </MainLayout>
          </ProtectedRoute>
        }/>

        {/* Pages without navbar */}
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/unauthorized" element = {<Unauthorized />} />
      </Routes>
    </BrowserRouter>
   
  );
};
export default App;
