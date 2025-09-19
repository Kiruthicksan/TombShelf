"use client";
import { motion } from "framer-motion";
import InTheSilence from "../../assets/InTheSilence.png";
import BookComponent from "../../components/BookComponent";

const Home = () => {
  return (
    <main>
      <section
        className="relative min-h-[450px] grid grid-cols-1 md:grid-cols-2 items-center 
                   py-12 px-6 md:px-16 bg-gradient-to-r from-[#1A1A2E] via-[#16213E] to-[#0F3460] 
                   text-white overflow-hidden"
      >
        {/* Decorative gradient circle effect */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#E74C3C]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#3498DB]/20 rounded-full blur-2xl"></div>

        {/* Left Content */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h2 className="text-2xl font-bold mb-3 text-[#F5F6FA]">Upcoming Release</h2>
          <h1 className="text-4xl md:text-5xl text-[#E74C3C] font-extrabold tracking-wide leading-tight mb-4 drop-shadow-lg">
            In The Silence You Left Behind
          </h1>
          <p className="text-sm text-gray-300 mb-2">By Subitha Manda</p>
          <p className="text-md font-medium mb-2">⭐ 4.8/5 from 200 early readers</p>
          <p className="text-sm md:text-base text-gray-200 mb-6">
            📅 Releasing Sept 30, 2025
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="px-6 py-3 rounded-full bg-[#E74C3C] hover:bg-[#c0392b] font-semibold shadow-lg transition-transform transform hover:scale-105">
              🛒 Add to Cart
            </button>
            <button className="px-6 py-3 rounded-full border border-gray-300 text-white hover:bg-white hover:text-[#16213E] font-semibold shadow-lg transition-transform transform hover:scale-105">
              📖 Read All
            </button>
          </div>
        </motion.div>

        {/* Right Book Image */}
        <motion.div
          className="flex justify-center relative z-10 mt-6 md:mt-0"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        >
          <img
            src={InTheSilence}
            alt="Book Cover"
            className="w-[220px] h-[280px] rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-500"
          />
        </motion.div>
      </section>

      <section>
        <BookComponent />
        <BookComponent />
        <BookComponent />
      </section>
    </main>
  );
};

export default Home;
