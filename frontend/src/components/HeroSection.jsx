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
import { Check, Loader2, ShoppingCart, Star, ArrowRight } from "lucide-react";

const HeroSection = () => {
  const { books } = useBookStore();
  const { addToCart, isInCart, isLoading: cartLoading, getItemQuantity } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  
  const [recentBooks, setRecentBooks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const recent = [...books]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
    setRecentBooks(recent);
  }, [books]);

  useEffect(() => {
    if (recentBooks.length === 0 || isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % recentBooks.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [recentBooks, isPaused]);

  const currentBook = recentBooks[currentIndex] || null;

  const bookInCart = currentBook ? isInCart(currentBook._id) : false;
  const cartQuantity = currentBook ? getItemQuantity(currentBook._id) : 0;

  const handleAddToCart = async () => {
    if (!currentBook) return;
    
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(currentBook._id, 1);
      toast.success("Book added to cart!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const goToBook = () => {
    if (currentBook) navigate(`/books/${currentBook._id}`);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % recentBooks.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + recentBooks.length) % recentBooks.length);
  };

  if (!currentBook) {
    return (
      <section className="relative h-[500px] flex items-center justify-center bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading featured books...</p>
        </div>
      </section>
    );
  }

  const genres = Array.isArray(currentBook.genre) 
    ? currentBook.genre[0]?.includes(",")
      ? currentBook.genre[0].split(",").map(g => g.trim()).slice(0, 2) // Reduced to 2 genres
      : currentBook.genre.slice(0, 2)
    : [];

  return (
    <section 
      className="relative h-[500px] grid grid-cols-1 lg:grid-cols-2 items-center py-4 px-4 sm:px-6 lg:px-16 
                 bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 
                 border-b border-amber-200 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-amber-200/40 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-200/20 rounded-full blur-2xl"></div>
      </div>

      {/* Left Content - Fixed height container */}
      <div className="relative z-10 px-4 lg:px-0 h-full flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBook._id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl w-full"
          >
            {/* New Arrival Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-xs font-bold mb-4 shadow-lg"
            >
              <Star className="w-3 h-3 fill-current" />
              NEW ARRIVAL
            </motion.div>

            {/* Book Title with fixed lines */}
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2 min-h-[3.5em]">
              {currentBook.title}
            </h1>

            {/* Author */}
            <p className="text-lg text-gray-700 mb-4 font-medium line-clamp-1">
              by {currentBook.author}
            </p>

            {/* Description Preview - Fixed height */}
            {currentBook.description && (
              <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed h-12">
                {currentBook.description}
              </p>
            )}

            {/* Genre Tags - Limited to 2 */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {genres.map((genre) => (
                  <Badge 
                    key={genre} 
                    variant="secondary" 
                    className="bg-white/80 text-gray-700 border border-amber-200 backdrop-blur-sm text-xs"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            )}

            {/* Price and Rating - Compact */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  ${currentBook.price}
                </span>
                <span className="text-xs text-gray-500 line-through">
                  ${(currentBook.price * 1.2).toFixed(2)}
                </span>
              </div>
              
              {currentBook.rating && (
                <div className="flex items-center gap-1 bg-white/80 px-2 py-1 rounded-full border border-amber-200 text-xs">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-gray-700">
                    {currentBook.rating}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons - Smaller size */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 
                         text-white shadow-lg hover:shadow-xl transition-all duration-200 
                         px-6 py-2 h-auto text-sm font-semibold"
                onClick={handleAddToCart}
                disabled={addingToCart || cartLoading || bookInCart}
              >
                {addingToCart ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : bookInCart ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    In Cart ({cartQuantity})
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="border border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-white 
                         px-6 py-2 h-auto text-sm font-semibold transition-all duration-200"
                onClick={goToBook}
              >
                View Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right Book Image - Fixed size */}
      <div className="relative z-10 flex justify-center lg:justify-end items-center h-full">
        <div className="relative group">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20
                     w-8 h-8 bg-white/80 hover:bg-white rounded-full shadow-lg
                     flex items-center justify-center transition-all duration-200
                     opacity-0 group-hover:opacity-100 backdrop-blur-sm border border-gray-200 text-sm"
          >
            ←
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20
                     w-8 h-8 bg-white/80 hover:bg-white rounded-full shadow-lg
                     flex items-center justify-center transition-all duration-200
                     opacity-0 group-hover:opacity-100 backdrop-blur-sm border border-gray-200 text-sm"
          >
            →
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentBook._id}
              initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.95, rotateY: -10 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src={getImageUrl(currentBook.image)}
                alt={currentBook.title}
                className="w-56 sm:w-64 lg:w-72 h-[360px] object-cover rounded-xl 
                         shadow-2xl cursor-pointer transform group-hover:scale-105 
                         transition-transform duration-500 border-4 border-white"
                onClick={goToBook}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/300x400/EEE/CCC?text=Book+Cover";
                }}
              />
              
              {/* Floating discount badge */}
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-600 
                            text-white px-2 py-1 rounded-full shadow-lg font-bold text-xs">
                20% OFF
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Dots Indicator */}
      {recentBooks.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {recentBooks.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? "bg-orange-500 scale-125" 
                  : "bg-gray-400 hover:bg-gray-500"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full 
                    text-xs font-medium text-gray-700 border border-gray-200">
        {currentIndex + 1} / {recentBooks.length}
      </div>
    </section>
  );
};

export default HeroSection;