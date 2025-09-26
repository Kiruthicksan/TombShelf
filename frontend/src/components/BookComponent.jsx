import { useEffect, useMemo } from "react";
import { useBookStore } from "../store/useBookStore";
import { getImageUrl } from "../utils/image";
import { useNavigate } from "react-router-dom";
import BookCard from "./BookCard";

const BookComponent = () => {
  // book store
  const books = useBookStore((state) => state.books);
  const fetchBooks = useBookStore((state) => state.fetchBooks);

  const navigate = useNavigate();

  const recentBooks = books
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  const comics = useMemo(
    () =>  books.filter((comicBook) => comicBook.category === "comics"), [books]
  )
  const mangas = useMemo(
    () => books.filter((mangasBook) => mangasBook.category === "manga"), [books]
  
  )

  const action = useMemo(() => {
  return books.filter((book) => {
    if (Array.isArray(book.genre)) {
     
      const genres = book.genre.flatMap((g) =>
        g.split(",").map((x) => x.trim().toLowerCase())
      );
      return genres.includes("action");
    }
    return false;
  });
}, [books]);



  console.log(action)
 

  useEffect(() => {
    fetchBooks();
  }, []);

  // create a array for storing categories

  return (
    <section className="px-6 py-10  md:px-16">
      <BookCard
        title="New This Week"
        books={recentBooks}
        navigate={navigate}
        getImageUrl={getImageUrl}
      />
      <BookCard
        title="Comic Universe"
        books={comics}
        navigate={navigate}
        getImageUrl={getImageUrl}
      />

       <BookCard
        title="Manga World"
        books={mangas}
        navigate={navigate}
        getImageUrl={getImageUrl}
      />

        <BookCard
        title="Action Novels"
        books={action}
        navigate={navigate}
        getImageUrl={getImageUrl}
      />

     
    </section>
  );
};

export default BookComponent;
