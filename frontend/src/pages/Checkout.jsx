// pages/CheckoutPage.jsx
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getImageUrl } from "@/utils/image";
import { toast } from "sonner";

const CheckoutPage = () => {
  const { cart, fetchCart, clearCart } = useCartStore();
  const { createOrder, loading: orderLoading } = useOrderStore();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
  });

  const [placingOrder, setPlacingOrder] = useState(false);

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (!cart || cart.items.length === 0) {
    return (
      <p className="text-center mt-20 text-gray-500">
        Your cart is empty. Add some books first!
      </p>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
  // Validate shipping address
  const emptyField = Object.entries(shippingAddress).find(
    ([key, value]) => !value.trim()
  );
  if (emptyField) {
    toast.error(`Please fill ${emptyField[0]} field`);
    return;
  }

  setPlacingOrder(true);
  try {
    const items = cart.items.map((item) => ({
      bookId: item.bookId._id,
      quantity: item.quantity,
    }));

    // Create order
    const order = await createOrder(items, shippingAddress);
    toast.success("Order placed successfully!");

    // Clear cart
    await clearCart();

    // Navigate to confirmation page with order ID
    navigate(`/confirmation/${order._id}`);
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to place order");
  } finally {
    setPlacingOrder(false);
  }
};


  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-3 gap-8">
        {/* Shipping Address Form */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>
          {["street", "city", "state", "pinCode", "country"].map((field) => (
            <div key={field} className="space-y-1">
              <label className="block font-medium text-sm capitalize">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              <Input
                name={field}
                value={shippingAddress[field]}
                onChange={handleChange}
                placeholder={`Enter ${field}`}
              />
            </div>
          ))}

          <Button
            className="mt-4 w-full"
            onClick={handlePlaceOrder}
            disabled={placingOrder || orderLoading}
          >
            {placingOrder ? "Placing Order..." : "Place Order"}
          </Button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {cart.items.map((item) => (
              <Card key={item.bookId._id} className="flex">
                <img
                  src={getImageUrl(item.bookId.image)}
                  alt={item.bookId.title}
                  className="w-24 h-32 object-cover"
                />
                <CardContent className="flex-1 px-4 py-2">
                  <h3 className="font-semibold line-clamp-2">
                    {item.bookId.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.bookId.author}
                  </p>
                  <p className="mt-2 font-medium">
                    ₹{item.bookId.price} x {item.quantity} = ₹
                    {item.bookId.price * item.quantity}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="text-right text-xl font-bold">
            Total: ₹{cart.totalAmount}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
