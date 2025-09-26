import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { getImageUrl } from "@/utils/image";

const CartDialog = ({ cart, cartCount, isOpen, setIsOpen }) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[480px] max-w-full p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800">
        {/* Header */}
        <DialogHeader className="flex justify-between items-center mb-4">
          <DialogTitle className="text-xl font-bold">Your Cart ({cartCount} items)</DialogTitle>
        
        </DialogHeader>

        <DialogDescription className="text-sm text-muted-foreground mb-4">
          Review your selected items and proceed to checkout.
        </DialogDescription>

        {/* Cart Items */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {cart?.items?.length ? (
            cart.items.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm"
              >
                {/* Book Image */}
                <img
                  src={getImageUrl(item.bookId.image)}
                  alt={item.bookId.title}
                  className="w-14 h-18 object-cover rounded"
                />

                {/* Book Details */}
                <div className="flex-1 px-3">
                  <p className="font-semibold text-sm">{item.bookId.title}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>

                {/* Price */}
                <div className="text-right font-semibold text-sm">
                  ₹ {item.price * item.quantity}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-8 text-gray-500">Your cart is empty</p>
          )}
        </div>

        {/* Footer */}
      
      </DialogContent>
    </Dialog>
  );
};

export default CartDialog;
