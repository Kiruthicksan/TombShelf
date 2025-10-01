// components/CartIcon.jsx
import { useAuthStore } from "@/store/store";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const CartIcon = () => {
  const { isAuthenticated } = useAuthStore();
  const { cart, fetchCart } = useCartStore();

  // Count total items (sum of quantities)
  const itemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  if (!isAuthenticated) return null;

  return (
    <Link to="/cart" className="relative">
      <ShoppingCart className="h-6 w-6 hover:text-yellow-600 transition-colors" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-medium">
          {itemCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
