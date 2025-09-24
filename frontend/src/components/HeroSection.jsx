import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBookStore } from "../store/useBookStore";
import { getImageUrl } from "../utils/image";

const HeroSection = () => {
  const fetchBooks = useBookStore((state) => state.fetchBooks);
  const books = useBookStore((state) => state.books);

  const [upcomingBooks, setUpcomingBooks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchUpcoming = async () => {
      await fetchBooks({ status: "upcoming" }); // fetch books into store
      const upcoming = useBookStore.getState().books.filter(
        (book) => book.status === "upcoming"
      );
      setUpcomingBooks(upcoming);
    };
    fetchUpcoming();
  }, []);

  // Auto-slide
  useEffect(() => {
    if (upcomingBooks.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % upcomingBooks.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [upcomingBooks]);

  const upComingBook = upcomingBooks[currentIndex] || null;

  return (
    <section className="relative min-h-[500px] grid grid-cols-1 md:grid-cols-2 items-center py-12 px-6 md:px-16 bg-gradient-to-r from-[#1A1A2E] via-[#16213E] to-[#0F3460] text-white overflow-hidden">
      {/* Decorative gradient circles */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#E74C3C]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#3498DB]/20 rounded-full blur-2xl"></div>

      {/* Left Content */}
      <AnimatePresence mode="wait">
        {upComingBook && (
          <motion.div
            key={upComingBook._id}
            className="relative z-10"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-xl md:text-2xl font-semibold mb-2 text-[#F5F6FA]">
              Upcoming Release
            </h2>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3 drop-shadow-lg text-[#E74C3C]">
              {upComingBook.title}
            </h1>
            <p className="text-sm md:text-base text-gray-300 mb-1">
              {upComingBook.author}
            </p>
            <p className="text-sm md:text-base text-gray-200 mb-2">
              ⭐ 4.8/5 from 200 early readers
            </p>
            <p className="text-sm md:text-base text-gray-200 mb-6">
              📅 Releasing Sept 30, 2025
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button className="px-6 py-3 rounded-full bg-[#E74C3C] hover:bg-[#c0392b] font-semibold shadow-lg transition-transform transform hover:scale-105 w-full sm:w-auto">
                🛒 Add to Cart
              </button>
              <button className="px-6 py-3 rounded-full border border-gray-300 text-white hover:bg-white hover:text-[#16213E] font-semibold shadow-lg transition-transform transform hover:scale-105 w-full sm:w-auto">
                📖 Read All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Book Image */}
      <div className="flex justify-center md:justify-end relative z-10 mt-8 md:mt-0">
        {upComingBook && (
          <motion.img
            key={upComingBook._id}
            src={getImageUrl(upComingBook.image)}
            alt={upComingBook.title}
            className="w-[180px] sm:w-[200px] md:w-[220px] h-[240px] sm:h-[260px] md:h-[280px] rounded-xl shadow-2xl object-cover transform hover:scale-105 transition-transform duration-500"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
        {upcomingBooks.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? "bg-[#E74C3C]" : "bg-gray-500/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
