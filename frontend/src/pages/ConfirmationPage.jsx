// pages/ConfirmationPage.jsx
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrderStore } from "@/store/useOrderStore";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getImageUrl } from "@/utils/image";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const ConfirmationPage = () => {
  const { id } = useParams(); // orderId from route
  const navigate = useNavigate();
  const { currentOrder, fetchOrderById, loading, error } = useOrderStore();

  useEffect(() => {
    if (id) fetchOrderById(id);
  }, [id, fetchOrderById]);

  if (loading) return <p className="text-center mt-10">Loading your order...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!currentOrder) return <p className="text-center mt-10">Order not found.</p>;

  const { shippingAddress, items, totalAmount } = currentOrder;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
      <div className="text-center mb-8">
        <Check className="mx-auto w-12 h-12 text-green-500" />
        <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
        <p className="text-muted-foreground">
          Thank you for your purchase. Your order ID is{" "}
          <strong>{currentOrder._id}</strong>
        </p>
      </div>

      <div className="max-w-5xl w-full space-y-6">
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-3">Shipping Address</h2>
            <p>{shippingAddress.street}</p>
            <p>
              {shippingAddress.city}, {shippingAddress.state} -{" "}
              {shippingAddress.pinCode}
            </p>
            <p>{shippingAddress.country}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-3">Order Summary</h2>
            <Separator className="mb-3" />
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item._id} className="flex items-center gap-4">
                  <img
                    src={getImageUrl(item.bookId.image)}
                    alt={item.bookId.title}
                    className="w-16 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.bookId.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity} × ₹{item.price}
                    </p>
                  </div>
                  <p className="font-semibold">₹{item.quantity * item.price}</p>
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-6">
          <Button size="lg" onClick={() => navigate("/")}>
            Back to Home
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="ml-4"
            onClick={() => navigate("/library")}
          >
            View My Orders
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
