// pages/StripeConfirmationPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@/services/api";

import { useCartStore } from "@/store/useCartStore";

const StripeConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const {clearCart} = useCartStore()

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      confirmStripeOrder(sessionId);
    } else {
      toast.error("Invalid confirmation link");
      navigate("/");
    }
  }, [searchParams, navigate]);

  const confirmStripeOrder = async (sessionId) => {
    try {
      console.log("Confirming Stripe order with session ID:", sessionId);
      
      const response = await api.post("/checkout/confirm-order", {
        sessionId: sessionId
      });
      
      console.log("Stripe confirmation response:", response.data);
      
      if (response.data.order && response.data.order._id) {
        await clearCart()
        navigate(`/confirmation/${response.data.order._id}`, { replace: true });
        
      } else {
        throw new Error("No order ID in response");
      }
      
    } catch (error) {
      console.error("Full Stripe confirmation error:", error);
      console.error("Error response:", error.response);
      
      setError(error.response?.data?.error || error.message);
      toast.error("Failed to confirm order. Please contact support.");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md w-full mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-red-600">❌</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Confirmation Failed</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate("/orders")}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              View Orders
            </Button>
            <Button 
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full"
            >
              Continue Shopping
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="p-8 text-center max-w-md w-full mx-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Confirming Your Order</h2>
        <p className="text-gray-600">Please wait while we process your payment...</p>
      </Card>
    </div>
  );
};

export default StripeConfirmationPage;