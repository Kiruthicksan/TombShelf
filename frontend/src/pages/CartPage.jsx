import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/store";
import { Card, CardContent } from "@/components/ui/card";
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
    addToCart,
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

  if (!isAuthenticated) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Please login to view your cart.
      </p>
    );
  }

  if (loading) {
    return <p className="text-center mt-10">Loading cart...</p>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Your cart is empty.
      </p>
    );
  }

  const handleIncrement = async (bookId, quantity) => {
    try {
      await updateCartItemQuantity(bookId, quantity + 1);
    } catch (error) {
      toast.error(error.message || "Failed to update quantity");
    }
  };

  const handleDecrement = async (bookId, quantity) => {
    if (quantity <= 1) return; // prevent going below 1
    try {
      await updateCartItemQuantity(bookId, quantity - 1);
    } catch (error) {
      toast.error(error.message || "Failed to update quantity");
    }
  };

  const handleRemove = async (bookId) => {
    try {
      await removeFromCart(bookId);
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error(error.message || "Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success("Cart cleared");
    } catch (error) {
      toast.error(error.message || "Failed to clear cart");
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-8 space-y-4">
          {cart.items.map((item) => (
            <Card key={item.bookId._id} className="p-4 flex flex-col md:flex-row gap-4 items-center">
              <img
                src={getImageUrl(item.bookId.image) }
                alt={item.bookId.title}
                className="w-32 h-40 object-cover"
              />
              <CardContent className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-semibold text-lg">{item.bookId.title}</h2>
                  <p className="text-sm text-muted-foreground">{item.bookId.author}</p>
                  <p className="mt-1 font-medium">₹ {item.price}</p>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleDecrement(item.bookId._id, item.quantity)}
                  >
                    -
                  </Button>
                  <span className="px-2">{item.quantity}</span>
                  <Button
                    size="sm"
                    onClick={() => handleIncrement(item.bookId._id, item.quantity)}
                  >
                    +
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemove(item.bookId._id)}
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="md:col-span-4 space-y-4">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>₹ {cart.totalAmount}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Items:</span>
              <span>{cart.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <Separator className="my-2" />
            <Button className="w-full mb-2" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleClearCart}
            >
              Clear Cart
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
