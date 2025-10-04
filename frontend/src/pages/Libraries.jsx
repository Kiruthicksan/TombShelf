// pages/OrdersPage.jsx
import { useEffect, useCallback } from "react";
import { useOrderStore } from "@/store/useOrderStore";
import { getImageUrl } from "@/utils/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

const STATUS_CONFIG = {
  pending: { label: "Pending", class: "bg-amber-50 text-amber-800 border-amber-200", icon: "⏳" },
  processing: { label: "Processing", class: "bg-blue-50 text-blue-800 border-blue-200", icon: "🔄" },
  shipped: { label: "Shipped", class: "bg-purple-50 text-purple-800 border-purple-200", icon: "🚚" },
  delivered: { label: "Delivered", class: "bg-emerald-50 text-emerald-800 border-emerald-200", icon: "✅" },
  cancelled: { label: "Cancelled", class: "bg-red-50 text-red-800 border-red-200", icon: "❌" }
};

const OrdersPage = () => {
  const { orders, fetchOrders, loading, error } = useOrderStore();
  const navigate = useNavigate();

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }, []);

  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(amount);
  }, []);

  if (loading) return <TableSkeleton />;
  if (error) return <ErrorState error={error} onRetry={fetchOrders} />;
  if (!orders?.length) return <EmptyState />;

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
            <p className="mt-1 text-sm text-gray-500">All your orders in one place</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <p className="text-sm text-gray-500">
              Total: <span className="font-semibold">{orders.length} orders</span>
            </p>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => {
                const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                
                return (
                  <tr 
                    key={order._id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/orders/${order._id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          #{order._id.slice(-8).toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {itemCount} item{itemCount !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`${statusConfig.class} border`}>
                        <span className="mr-1">{statusConfig.icon}</span>
                        {statusConfig.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 4).map((item, index) => (
                          <img
                            key={item.bookId._id}
                            src={getImageUrl(item?.bookId?.image)}
                            alt={item.bookId.title}
                            className="w-8 h-10 object-cover rounded border border-white shadow-sm"
                            title={`${item.bookId.title} x${item.quantity}`}
                          />
                        ))}
                        {order.items.length > 4 && (
                          <div className="w-8 h-10 bg-gray-100 rounded border border-white flex items-center justify-center text-xs font-medium text-gray-600">
                            +{order.items.length - 4}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/orders/${order._id}`);
                        }}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {orders.map((order) => {
            const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
            
            return (
              <div
                key={order._id}
                className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/orders/${order._id}`)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-medium text-gray-900">
                      #{order._id.slice(-8).toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <Badge className={`${statusConfig.class} border`}>
                    {statusConfig.label}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map((item) => (
                      <img
                        key={item.bookId._id}
                        src={getImageUrl(item?.bookId?.image)}
                        alt={item.bookId.title}
                        className="w-8 h-10 object-cover rounded border border-white shadow-sm"
                      />
                    ))}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {itemCount} item{itemCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Skeleton component for table loading state
const TableSkeleton = () => (
  <div className="min-h-screen bg-white py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 mb-4 p-4 border rounded-lg">
            <Skeleton className="h-12 w-12 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-3 w-1/6" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    </div>
  </div>
);


const ErrorState = ({ error, onRetry }) => (
  <div className="min-h-screen bg-white flex items-center justify-center p-8">
    <div className="text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">⚠️</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Orders</h2>
      <p className="text-gray-600 mb-6">{error}</p>
      <Button onClick={onRetry} className="bg-indigo-600 hover:bg-indigo-700">
        Try Again
      </Button>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="min-h-screen bg-white flex items-center justify-center p-8">
    <div className="text-center">
      <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-3">No Orders Yet</h2>
      <p className="text-gray-600 mb-8">When you place your first order, it will appear here.</p>
      <Button onClick={() => window.location.href = '/'} className="bg-indigo-600 hover:bg-indigo-700">
        Start Shopping
      </Button>
    </div>
  </div>
);

export default OrdersPage;