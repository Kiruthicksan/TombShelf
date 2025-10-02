// pages/OrdersPage.jsx
import { useEffect } from "react";
import { useOrderStore } from "@/store/useOrderStore";
import { getImageUrl } from "@/utils/image";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
  const { orders, fetchOrders, loading } = useOrderStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return <p className="text-center mt-20">Loading orders...</p>;
  }

  if (!orders || orders.length === 0) {
    return (
      <p className="text-center mt-20 text-gray-500">
        You have no orders yet.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">My Orders</h1>

        <div className="grid gap-6">
          {orders.map((order) => (
            <Card
              key={order._id}
              className="cursor-pointer hover:opacity-90 transition"
              onClick={() => navigate(`/orders/${order._id}`)}
            >
              <CardContent className="flex flex-col md:flex-row md:items-center gap-4 p-4">
                {/* Order Info */}
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">
                    Order ID: {order._id}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Status:{" "}
                    <span
                      className={`font-medium ${
                        order.status === "pending"
                          ? "text-yellow-600"
                          : order.status === "processing"
                          ? "text-blue-600"
                          : order.status === "shipped"
                          ? "text-purple-600"
                          : order.status === "delivered"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total Amount: ₹{order.totalAmount.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Ordered On:{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Order Items */}
                <div className="flex gap-2 flex-wrap">
                  {order.items.map((item) => (
                    <img
                      key={item.bookId._id}
                      src={getImageUrl(item?.bookId?.image)}
                      alt={item.bookId.title}
                      className="w-16 h-20 object-cover rounded"
                      title={`${item.bookId.title} x${item.quantity}`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
