
import { useEffect } from "react";
import { useBookStore } from "../store/useBookStore";
import { getImageUrl } from "../utils/image";

const BookComponent = () => {
  // book store
  const books = useBookStore((state) => state.books);
  const fetchBooks = useBookStore((state) => state.fetchBooks)

  useEffect(() => {
    fetchBooks()
  }, [])

  // create a array for storing categories

  const categories = [...new Set(books.map((book) => book.category))];

  const categoriesHeadings = {manga : "Manga World", comics : "Comics Universe"}
  return (
    <section className="px-6 py-5  md:px-16">
      {categories.map((category) => (
        <div key={category} className="mb-2">
          <h1 className="text-2xl font-extrabold text-gray-800 mb-2 font-[Oswald] tracking-wider text-shadow-lg text-shadow-gray-400">
            {categoriesHeadings[category]}
          </h1>

          <div className="flex gap-6 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-300">
            {books
              .filter((book) => book.category === category)
              .map((book) => (
                <div
                  key={book._id}
                  className="relative w-[200px] h-[280px] rounded-lg overflow-hidden shadow-lg group transition-opacity duration-300 hover:opacity-90"
                >
                  <img src= {getImageUrl(book.image)} alt= {book.title} loading="lazy" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-black/40 px-3 py-3">
                    <div className="transition-transform duration-300 group-hover:-translate-y-2">
                      <p className="text-white font-extrabold text-sm tracking-wide">{book.title}</p>
                      <p className="text-gray-200 font-semibold text-xs">{book.author}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default BookComponent;
