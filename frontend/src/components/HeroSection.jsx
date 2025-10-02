import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBookStore } from "../store/useBookStore";
import { getImageUrl } from "../utils/image";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/store";
import { toast } from "sonner";
import { Check, Loader2, ShoppingCart } from "lucide-react";

const HeroSection = () => {
  //  --------------------  book store (global state)-----------------------

  const { books, book } = useBookStore();

  // ----------- cart store ----------------------------------------

  const {
    addToCart,
    isInCart,
    isLoading: cartLoading,
    getItemQuantity,
   
  } = useCartStore();

  // ---------------------------  auth Store----------------

  const { isAuthenticated } = useAuthStore();

  //  .....................local states.....................
  const [recentBooks, setRecentBooks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  // --------------------  navigate ----------------------------
  const navigate = useNavigate();

  // ---------------------- get newly added books ----------------------------------

  useEffect(() => {
    const recent = [...books]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
    setRecentBooks(recent);
  }, [books]);

  //  checking the cart available and quantity

  const bookInCart = isInCart(book?._id);
  const cartQuantity = getItemQuantity(book?.id);

  //  Add to cart handler--------------------------------

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    setAddingToCart(true);

    try {
      await addToCart(currentBook._id, 1);
      toast.success("Book Added to cart!");
    } catch (error) {
      toast.error(error.response?.data.message || "Failed to add cart");
    } finally {
      setAddingToCart(false);
    }
  };

  // -----------------------------------------------Auto-slide---------------------------------------

  useEffect(() => {
    if (recentBooks.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % recentBooks.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [recentBooks]);

  const currentBook = recentBooks[currentIndex] || null;

  return (
    <section
      className="relative min-h-[300px] grid grid-cols-1 md:grid-cols-2 items-center py-3 px-6 md:px-16 
  bg-gradient-to-r from-[#FFF7AE] via-[#FFD93D] to-[#FFC300] text-[#1a0b2e] overflow-hidden"
    >
      {/* Comic-style burst effects */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#FF5733]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFB300]/30 rounded-full blur-2xl"></div>
      <div className="absolute top-20 right-1/3 w-64 h-64 bg-[#FFD93D]/25 rounded-full blur-2xl"></div>

      {/* Left Content */}
      <AnimatePresence mode="wait">
        {currentBook && (
          <motion.div
            key={currentBook._id}
            className="relative z-10"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-xl md:text-2xl font-bold mb-1 text-[#FF5733] uppercase tracking-widest">
              Just Arrived
            </h2>

            <h1 className="text-2xl sm:text-3xl md:text-3xl font-extrabold tracking-tight mb-2 drop-shadow-lg text-[#6B1E00]">
              {currentBook.title}
            </h1>

            <p className="text-sm md:text-base text-[#4B2E00] mb-2">
              by {currentBook.author}
            </p>

            {/* Genre tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {(Array.isArray(currentBook.genre)
                ? currentBook.genre[0]?.includes(",")
                  ? currentBook.genre[0].split(",").map((g) => g.trim())
                  : currentBook.genre
                : []
              ).map((g) => (
                <Badge variant="secondary" key={g} className="bg-amber-300">
                  {g}
                </Badge>
              ))}
            </div>

            {/* Price + Rating */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-extrabold text-[#FF6F00] drop-shadow-md">
                ${currentBook.price}
              </span>

              <span className="px-2 py-1 text-xs bg-[#FF5733] text-white rounded-md font-bold">
                New Arrival
              </span>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                variant="destructive"
                size="lg"
                onClick={handleAddToCart}
                disabled={addingToCart || cartLoading || bookInCart}
              >
                {addingToCart ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : bookInCart ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Added to Cart ({cartQuantity})
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="border border-amber-600 hover:border-amber-700 hover:bg-amber-500"
                onClick={() => navigate(`/books/${currentBook._id}`)}
              >
                View Details
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Book Image */}
      <div className="flex justify-center md:justify-end relative z-10 mt-8 md:mt-0">
        {currentBook && (
          <motion.img
            key={currentBook._id}
            src={getImageUrl(currentBook.image)}
            alt={currentBook.title}
            className="w-[220px] sm:w-[250px] md:w-[280px] h-[320px] rounded-lg shadow-2xl object-cover transform hover:scale-105 transition-transform duration-500 border-4 border-[#FFD700]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
        {recentBooks.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? "bg-[red]" : "bg-gray-500/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
