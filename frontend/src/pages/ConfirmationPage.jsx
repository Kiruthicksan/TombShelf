// pages/ConfirmationPage.jsx
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrderStore } from "@/store/useOrderStore";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getImageUrl } from "@/utils/image";
import { Check, Package, Truck, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ConfirmationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentOrder, fetchOrderById, loading, error } = useOrderStore();

  useEffect(() => {
    if (id) fetchOrderById(id);
  }, [id, fetchOrderById]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-red-600">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button 
            onClick={() => navigate("/orders")}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            View All Orders
          </Button>
        </Card>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📦</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <Button 
            onClick={() => navigate("/")}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  const { shippingAddress, items, totalAmount, status, createdAt } = currentOrder;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Thank you for your purchase
          </p>
          <p className="text-gray-500">
            Order placed on {formatDate(createdAt)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Card */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-bold text-gray-900">Order Status</h2>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 capitalize">{status}</p>
                  <p className="text-sm text-gray-600">Your order is being processed</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold text-gray-900">{currentOrder._id}</p>
                </div>
              </div>
            </Card>

            {/* Shipping Address Card */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Truck className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">{shippingAddress.street}</p>
                <p className="text-gray-600">
                  {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pinCode}
                </p>
                <p className="text-gray-600">{shippingAddress.country}</p>
                {shippingAddress.phone && (
                  <p className="text-gray-600">Phone: {shippingAddress.phone}</p>
                )}
              </div>
            </Card>

            {/* Order Items Card */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Items</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <img
                      src={getImageUrl(item.bookId.image)}
                      alt={item.bookId.title}
                      className="w-16 h-20 object-cover rounded-lg shadow-sm"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/64x80/EEE/CCC?text=No+Image";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                        {item.bookId.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{item.bookId.author}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Qty: {item.quantity} × ₹{item.price}
                        </span>
                        <span className="font-semibold text-gray-900">
                          ₹{(item.quantity * item.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                  <span className="text-gray-900">₹{totalAmount}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">₹0.00</span>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-green-600">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• You'll receive order confirmation email</li>
                  <li>• We'll notify you when items ship</li>
                  <li>• Estimated delivery: 5-7 business days</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate("/")}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  size="lg"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
                
                <Button 
                  onClick={() => navigate("/orders")}
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  size="lg"
                >
                  View All Orders
                </Button>
              </div>

              {/* Support Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-500 mb-2">Need help with your order?</p>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-indigo-600 hover:text-indigo-700"
                  onClick = {() => toast.info("We will contact you soon")}
                >
                  Contact Support
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Easy Returns</h3>
            <p className="text-sm text-gray-600">30-day return policy</p>
          </div>
          
          <div className="p-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Truck className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Free Shipping</h3>
            <p className="text-sm text-gray-600">On all orders</p>
          </div>
          
          <div className="p-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Quality Guarantee</h3>
            <p className="text-sm text-gray-600">Authentic books only</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;