import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "@/utils/image";

const CartPage = () => {
  const {
    cart,
    fetchCart,
    removeFromCart,
    clearCart,
    updateCartItemQuantity,
    loading,
  } = useCartStore();

  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated, fetchCart]);

  // Handle quantity updates
  const handleQuantityChange = async (bookId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await updateCartItemQuantity(bookId, newQuantity);
    } catch (error) {
      toast.error(error.message || "Failed to update quantity");
    }
  };

  const handleRemove = async (bookId, bookTitle) => {
    try {
      await removeFromCart(bookId);
      toast.success(`"${bookTitle}" removed from cart`);
    } catch (error) {
      toast.error(error.message || "Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    if (cart.items.length === 0) return;
    
    try {
      await clearCart();
      toast.success("Cart cleared successfully");
    } catch (error) {
      toast.error(error.message || "Failed to clear cart");
    }
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    navigate("/checkout");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Authentication check
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to view your cart</p>
          <Button 
            onClick={() => navigate("/login")}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  // Empty cart state
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🛒</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some books to get started</p>
          <Button 
            onClick={() => navigate("/")}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            Continue Shopping
          </Button>
        </Card>
      </div>
    );
  }

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-8 space-y-4">
            {cart.items.map((item) => (
              <Card key={item.bookId._id} className="p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Book Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={getImageUrl(item.bookId.image)}
                      alt={item.bookId.title}
                      className="w-24 h-32 sm:w-28 sm:h-36 object-cover rounded-lg shadow-md"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/112x144/EEE/CCC?text=No+Image";
                      }}
                    />
                  </div>

                  {/* Book Details */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1">
                      <h2 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
                        {item.bookId.title}
                      </h2>
                      <p className="text-gray-600 text-sm mb-2">by {item.bookId.author}</p>
                      <p className="text-lg font-bold text-green-600 mb-4">
                        ₹{item.price}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 font-medium">Quantity:</span>
                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                            onClick={() => handleQuantityChange(item.bookId._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                            onClick={() => handleQuantityChange(item.bookId._id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleRemove(item.bookId._id, item.bookId.title)}
                      >
                        Remove
                      </Button>
                    </div>

                    {/* Item Total */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Item Total:</span>
                        <span className="font-semibold text-gray-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items ({totalItems})</span>
                  <span className="text-gray-900">₹{cart.totalAmount}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-green-600">₹{cart.totalAmount}</span>
                </div>
              </div>

              <Button 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mb-3 py-3 text-base font-semibold"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>

              <Button
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={handleClearCart}
              >
                Clear Cart
              </Button>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <span>🔒</span>
                  <span>Secure checkout</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;