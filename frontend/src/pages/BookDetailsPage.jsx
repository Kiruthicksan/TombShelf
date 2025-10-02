// pages/BookDetailsPage.jsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/store";
import { useBookStore } from "@/store/useBookStore";
import { useCartStore } from "@/store/useCartStore";
import { getImageUrl } from "@/utils/image";

import { Check, Loader2, ShoppingBasket, ShoppingCart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const BookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Book store
  const { book, books, fetchBook, isLoading, error } = useBookStore();

  // Cart store
  const { addToCart, isInCart, isLoading: cartLoading, getItemQuantity } =
    useCartStore();

  // Auth store
  const { isAuthenticated } = useAuthStore();

  const [addingToCart, setAddingToCart] = useState(false);

  // Fetch book when page loads
  useEffect(() => {
    if (id) fetchBook(id);
  }, [id, fetchBook]);

  const bookInCart = isInCart(book?._id);
  const cartQuantity = getItemQuantity(book?._id);

  // --- Handlers ---
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
     
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(book._id, 1);
      toast.success("Book added to cart!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to continue");
     
      return;
    }

    if (!bookInCart) {
      setAddingToCart(true);
      try {
        await addToCart(book._id, 1);
        navigate("/checkout");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to add to cart");
      } finally {
        setAddingToCart(false);
      }
    } else {
      navigate("/checkout");
    }
  };

  // --- Related books ---
  const relatedBooks = useMemo(() => {
    if (!book || books.length === 0) return [];

    const normalizeGenres = (g) =>
      Array.isArray(g)
        ? g
        : typeof g === "string"
        ? g.split(",").map((x) => x.trim())
        : [];

    return books
      .filter((b) => b._id !== book._id)
      .filter((b) => {
        const bookGenres = normalizeGenres(book.genre);
        const otherGenres = normalizeGenres(b.genre);

        const hasMatchingGenre = bookGenres.some((g) => otherGenres.includes(g));
        if (hasMatchingGenre) return true;

        if (book.author && b.author && book.author === b.author) return true;
        if (book.category && b.category && book.category === b.category) return true;

        return false;
      })
      .slice(0, 5);
  }, [book, books]);

  // --- UI States ---
  if (isLoading) return <p className="text-center">Loading book...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!book && !isLoading && !error)
    return <p className="text-center text-gray-500">Book not found.</p>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Book image */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="overflow-hidden">
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

          {/* Right Column - Book details */}
          <div className="lg:col-span-2 space-y-2">
            {/* Genres */}
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

            {/* Title & Author */}
            <h1 className="mb-2 text-3xl font-bold">{book.title}</h1>
            <p className="mb-4 text-muted-foreground text-lg">by {book.author}</p>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-semibold">₹ {book.price}</span>
              {book.orginalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    ₹ {book.orginalPrice}
                  </span>
                  <Badge variant="destructive">
                    Save ₹{(book.orginalPrice - book.price).toFixed(2)}
                  </Badge>
                </>
              )}
            </div>
            <Separator />

            {/* Description */}
            <div>
              <h3 className="mb-3 text-xl font-semibold">About this Book</h3>
              <p className="text-muted-foreground leading-relaxed text-justify">
                {book.description}
              </p>
            </div>
            <Separator />

            {/* Buttons */}
            <div className="mt-8 space-x-3 flex">
              <Button
                size="lg"
                className="w-1/2"
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
                className="w-1/2 border border-gray-700 hover:bg-gray-300"
                variant="outline"
                onClick={handleBuyNow}
                disabled={addingToCart || cartLoading}
              >
                <ShoppingBasket className="w-5 h-5 mr-2" />
                Buy Now
              </Button>
            </div>
          </div>
        </div>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <div className="mt-16">
            <Separator />
            <h2 className="text-2xl font-bold my-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {relatedBooks.map((relatedBook) => (
                <Card
                  key={relatedBook._id}
                  className="w-[200px] h-[400px] overflow-hidden shadow-lg group hover:opacity-90 transition duration-300 cursor-pointer"
                  onClick={() => navigate(`/books/${relatedBook._id}`)}
                >
                  <CardContent className="p-0">
                    <img
                      src={getImageUrl(relatedBook.image)}
                      alt={relatedBook.title}
                      loading="lazy"
                      className="w-full"
                    />
                    <Separator />
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
