import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useBookStore } from "@/store/useBookStore";
import { useCartStore } from "@/store/useCartStore";
import { getImageUrl } from "@/utils/image";

import { ShoppingBasket, ShoppingCart } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useMatch, useNavigate, useParams } from "react-router-dom";

const BookDetailsPage = () => {
  const { id } = useParams();
  const book = useBookStore((state) => state.book);
  const books = useBookStore((state) => state.books);
  const fetchBook = useBookStore((state) => state.fetchBook);
  const isLoading = useBookStore((state) => state.isLoading);
  const error = useBookStore((state) => state.error);
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      fetchBook(id);
    }
  }, [id, fetchBook]);

  const relatedBooks = useMemo(() => {
    if (!book || books.length === 0) return [];

    return books
      .filter((b) => b._id !== book._id)
      .filter((b) => {
        if (book.genre && b.genre) {
          const bookGenres = Array.isArray(book.genre)
            ? book.genre
            : typeof book.genre === "string"
            ? book.genre.split(",").map((g) => g.trim())
            : [];
          const otherBookGenres = Array.isArray(b.genre)
            ? b.genre
            : typeof b.genre === "string"
            ? b.genre.split(",").map((g) => g.trim())
            : [];

          const hasMatchingGenre = bookGenres.some((genre) =>
            otherBookGenres.includes(genre)
          );

          if (hasMatchingGenre) return true;
        }

        if (book.author && b.author && book.author === b.author) {
          return true;
        }

        if (book.category && b.category && book.category === b.category) {
          return true;
        }
        return false;
      })
      .slice(0, 5);
  }, [book, books]);

  if (isLoading) return <p className="text-center">Loading book...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!book && !isLoading && !error) {
    return <p className="text-center text-gray-500">Book not found.</p>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Book image */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="overflow-hidden p-0 ">
                <CardContent className="p-0">
                  <img
                    src={getImageUrl(book.image)}
                    alt={book.title}
                    className="w-full aspect-[3/4]"
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right column */}

          <div className="lg:col-span-2 space-y-2">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <div className="flex flex-wrap gap-2 mb-3">
                  {(Array.isArray(book.genre)
                    ? book.genre[0]?.includes(",")
                      ? book.genre[0].split(",").map((g) => g.trim())
                      : book.genre
                    : []
                  ).map((g) => (
                    <Badge variant="secondary" key={g}>
                      {g}
                    </Badge>
                  ))}
                </div>
              </div>
              <h1 className="mb-2 text-3xl font-bold">{book.title}</h1>
              <p className="mb-4 text-muted-foreground text-lg">
                by {book.author}
              </p>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-semibold">₹ {book.price}</span>
                {book.orginalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ₹ {book.orginalPrice}
                  </span>
                )}
                {book.orginalPrice && (
                  <Badge variant="destructive">
                    Save ₹{(book.orginalPrice - book.price).toFixed(2)}
                  </Badge>
                )}
              </div>
            </div>
            <Separator />

            <div>
              <h3 className="mb-3 text-xl font-semibold">About this Book</h3>
              <p className="text-muted-foreground leading-relaxed text-justify">
                {book.description}
              </p>
            </div>
            <Separator />

            <div className="mt-8 space-x-3 flex">
              <Button size="lg" className="w-1/2">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>

              <Button
                size="lg"
                className="w-1/2 border border-gray-700 hover:bg-gray-300"
                variant="outline"
                onClick={() => navigate("/order-page")}
              >
                <ShoppingBasket className="w-5 h-5 mr-2" />
                Buy Now
              </Button>
            </div>
          </div>
        </div>

        {relatedBooks.length > 0 && (
          <div className="mt-16">
            <Separator />
            <h2 className="text-2xl font-bold my-6 ">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {relatedBooks.map((relatedBook) => (
                <Card
                  key={relatedBook._id}
                  className="w-[200px] h-[400px] flex-shrink-0 overflow-hidden shadow-lg p-0 group hover:opacity-90 transition duration-300 cursor-pointer"
                  onClick={() => navigate(`/books/${relatedBook._id}`)}
                >
                  <CardContent className="p-0">
                    <img
                      src={getImageUrl(relatedBook.image)}
                      alt={relatedBook.title}
                      loading="lazy"
                      className="w-full"
                    />
                    <Separator className="border border-black" />
                    <div className="px-2 py-2">
                      <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        {relatedBook.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {relatedBook.author}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default BookDetailsPage;
