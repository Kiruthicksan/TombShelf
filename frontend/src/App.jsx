import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import LoginPage from "./pages/LoginPage";
import { useAuthStore } from "./store/store";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoutes";
import Unauthorized from "./pages/Unauthorized";
import ManageBooks from "./pages/ManageBooks";
import { useBookStore } from "./store/useBookStore";
import BookDetailsPage from "./pages/BookDetailsPage";
import { useCartStore } from "./store/useCartStore";
import GenrePage from "./pages/GenrePage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/Checkout";
import OrdersPage from "./pages/Libraries";
import ConfirmationPage from "./pages/ConfirmationPage";



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
  const fetchBooks = useBookStore((state) => state.fetchBooks);
  const fetchCart = useCartStore((state) => state.fetchCart)

  const{isLoading : userLoading} = useAuthStore((state) => state.isLoading);
  const {isLoading : booksLoading} = useBookStore(state => state.isLoading)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchUser();
        const books = await fetchBooks();
        const cart = await fetchCart()
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [fetchUser, fetchBooks]);

  if (userLoading || booksLoading) return <div>Loading user...</div>;

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

          <Route
          path="/genre"
          element={
            <MainLayout>
              <GenrePage />
            </MainLayout>
          }
        />

      
      

         <Route
          path="/books/:id"
          element={
            <MainLayout>
              <BookDetailsPage />
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

        <Route
          path="/library"
          element={
            <ProtectedRoute>
              <MainLayout>
                <OrdersPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/confirmation/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ConfirmationPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-books"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MainLayout>
                <ManageBooks />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        

        {/* Pages without navbar */}
        <Route path="/cart" element={<CartPage />} />
         <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
     
    </BrowserRouter>
  );
};
export default App;
