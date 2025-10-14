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
import axios from "axios";
import { api } from "@/services/api";

const CheckoutPage = () => {
  const { cart, fetchCart, clearCart } = useCartStore();
  const { createOrder, loading: orderLoading } = useOrderStore();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    country: "India",
    phone: "",
  });

  const [placingOrder, setPlacingOrder] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Validate form fields
  const validateForm = () => {
    const errors = {};

    if (!shippingAddress.fullName.trim())
      errors.fullName = "Full name is required";
    if (!shippingAddress.street.trim())
      errors.street = "Street address is required";
    if (!shippingAddress.city.trim()) errors.city = "City is required";
    if (!shippingAddress.state.trim()) errors.state = "State is required";
    if (!shippingAddress.pinCode.trim())
      errors.pinCode = "PIN code is required";
    if (!shippingAddress.phone.trim())
      errors.phone = "Phone number is required";

    // PIN code validation (Indian)----------
    if (shippingAddress.pinCode && !/^\d{6}$/.test(shippingAddress.pinCode)) {
      errors.pinCode = "PIN code must be 6 digits";
    }

    // Phone validation----------------------------------------------------
    if (shippingAddress.phone && !/^\d{10}$/.test(shippingAddress.phone)) {
      errors.phone = "Phone must be 10 digits";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

 const handlePlaceOrder = async () => {
  if (!validateForm()) {
    toast.error("Please fix the errors in the form");
    return;
  }

  setPlacingOrder(true);
  try {
    const items = cart.items.map((item) => ({
      bookId: item.bookId._id,
      name: item.bookId.title,
      price: item.price,
      quantity: item.quantity,
    }));

    if (paymentMethod === "cod") {
      // For COD: Create order immediately
      const order = await createOrder(items, shippingAddress);
      toast.success("Order placed successfully!");
      await clearCart();
      navigate(`/confirmation/${order._id}`);
      
    } else if (paymentMethod === "online") {
      // For Online Payment: Redirect to Stripe
      const res = await api.post("/checkout/payment", {
        items,
        shippingAddress,
      });
      console.log(items)
      
      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        throw new Error("Stripe session creation failed");
      }
    }

  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Failed to place order. Please try again."
    );
  } finally {
    setPlacingOrder(false);
  }
};

  // Empty cart state
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🛒</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Add some books to proceed to checkout
          </p>
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
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Address & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address Card */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Shipping Address
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: "fullName",
                    label: "Full Name",
                    placeholder: "Enter your full name",
                    type: "text",
                    colSpan: "md:col-span-2",
                  },
                  {
                    name: "street",
                    label: "Street Address",
                    placeholder: "Enter street address",
                    type: "text",
                    colSpan: "md:col-span-2",
                  },
                  {
                    name: "city",
                    label: "City",
                    placeholder: "Enter city",
                    type: "text",
                  },
                  {
                    name: "state",
                    label: "State",
                    placeholder: "Enter state",
                    type: "text",
                  },
                  {
                    name: "pinCode",
                    label: "PIN Code",
                    placeholder: "Enter PIN code",
                    type: "text",
                  },
                  {
                    name: "phone",
                    label: "Phone Number",
                    placeholder: "Enter phone number",
                    type: "tel",
                  },
                ].map((field) => (
                  <div
                    key={field.name}
                    className={field.colSpan || "col-span-1"}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                    </label>
                    <Input
                      name={field.name}
                      type={field.type}
                      value={shippingAddress[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className={
                        formErrors[field.name]
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }
                    />
                    {formErrors[field.name] && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors[field.name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Payment Method Card */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    id="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-indigo-600"
                  />
                  <label htmlFor="cod" className="flex-1 cursor-pointer">
                    <span className="font-medium">Cash on Delivery</span>
                    <p className="text-sm text-gray-600">
                      Pay when you receive your order
                    </p>
                  </label>
                </div>

                <div className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    id="online"
                    value="online"
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="online" className="flex-1 cursor-pointer">
                    <span className="font-medium">Online Payment</span>
                    <p className="text-sm text-gray-600">
                      Pay securely with cards
                    </p>
                  </label>
                </div>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* Items List */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.bookId._id} className="flex gap-3">
                    <img
                      src={getImageUrl(item.bookId.image)}
                      alt={item.bookId.title}
                      className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/64x80/EEE/CCC?text=No+Image";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                        {item.bookId.title}
                      </h3>
                      <p className="text-xs text-gray-600 mb-1">
                        {item.bookId.author}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </span>
                        <span className="font-medium text-gray-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal ({totalItems} items)
                  </span>
                  <span className="text-gray-900">₹{cart.totalAmount}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">₹0.00</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-600">₹{cart.totalAmount}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-base font-semibold mb-3"
                onClick={handlePlaceOrder}
                disabled={placingOrder || orderLoading}
              >
                {placingOrder ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Placing Order...
                  </div>
                ) : (
                  `Place Order • ₹${cart.totalAmount}`
                )}
              </Button>

              {/* Security & Return Info */}
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <span>🔒</span>
                  <span>Secure checkout</span>
                </div>
                <p className="text-xs text-gray-500">
                  30-day return policy • Free shipping
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
