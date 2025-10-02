// pages/AdminOrdersPage.jsx
import { useEffect } from "react";
import { useOrderStore } from "@/store/useOrderStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/utils/image";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const AdminOrdersPage = () => {
  const { orders, fetchAllOrders, updateOrderStatus, loading } = useOrderStore();

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  if (loading)
    return (
      <p className="text-center mt-20 text-gray-500 text-lg font-medium">
        Loading orders...
      </p>
    );

  if (!orders || orders.length === 0)
    return (
      <p className="text-center mt-20 text-gray-500 text-lg font-medium">
        No orders found.
      </p>
    );

  return (
    <div className="space-y-10 px-10 py-5 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">Manage Orders</h1>
          <p className="text-gray-600 text-sm">
            View all orders and update their status
          </p>
        </div>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>
            Admin dashboard to monitor and update all orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-full bg-white rounded-lg">
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Update Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id} className="hover:bg-gray-100">
                    <TableCell className="font-medium">{order._id}</TableCell>
                    <TableCell>
                      {order.user?.userName || "N/A"} <br />
                      <span className="text-gray-500 text-sm">{order.user?.email}</span>
                    </TableCell>
                    <TableCell>₹{order.totalAmount}</TableCell>
                    <TableCell>
                      <Badge
                        className={`capitalize ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 flex-wrap">
                        {order.items.map((item) => (
                          <img
                            key={item._id}
                            src={getImageUrl( item.bookId?.image) || ""}
                            alt={item.bookId?.title || "Book"}
                            className="w-12 h-16 object-cover rounded shadow-sm"
                            title={`${item.bookId?.title || ""} x${item.quantity}`}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order._id, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrdersPage;
