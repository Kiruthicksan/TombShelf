import { useEffect, useMemo } from "react";
import { useBookStore } from "../store/useBookStore";
import { getImageUrl } from "../utils/image";
import { useNavigate } from "react-router-dom";
import BookCard from "./BookCard";

 const filterBooksByGenre = (books,genre) => {
    return useMemo(() => {
      if (!genre) return books

      return books.filter((book) => {
        if (!book.genre) return false

       const genresLower = book.genre.map((g) => g.trim().toLowerCase())
       return genresLower.includes(genre.toLowerCase())
      })
    }, [books,genre])
  }

const BookComponent = () => {
  // -----------------------------book store------------------------
  const books = useBookStore((state) => state.books);
 
  const navigate = useNavigate();

  //  ---------------------------- books fetching logics ----------------------

  const recentBooks = useMemo(
    () =>
      [...books]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8),
    [books]
  );

  const comics = useMemo(
    () => books.filter((comicBook) => comicBook.category === "comics"),
    [books]
  );

  const mangas = useMemo(
    () => books.filter((mangasBook) => mangasBook.category === "manga"),
    [books]
  );

   const action = filterBooksByGenre(books, "action")
   const romance = filterBooksByGenre(books, "romance")
 

  

 

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

        <BookCard
        title="Romance Novels"
        books={romance}
        navigate={navigate}
        getImageUrl={getImageUrl}
      />
    </section>
  );
};

export default BookComponent;
