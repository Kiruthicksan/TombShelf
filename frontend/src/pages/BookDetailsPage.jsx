import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useBookStore } from "@/store/useBookStore";
import { useCartStore } from "@/store/useCartStore";
import { getImageUrl } from "@/utils/image";

import { ShoppingBasket, ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BookDetailsPage = () => {
  const { id } = useParams();
  const book = useBookStore((state) => state.book);
  const fetchBook = useBookStore((state) => state.fetchBook);
  const isLoading = useBookStore((state) => state.isLoading);
  const error = useBookStore((state) => state.error);
 const navigate = useNavigate()
  useEffect(() => {
    if (id) {
      fetchBook(id);
    }
  }, [id, fetchBook]);

 

  if (isLoading) return <p className="text-center">Loading book...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!book && !isLoading && !error) {
    return <p className="text-center text-gray-500">Book not found.</p>;
  }
  console.log(book.genre);
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
                onClick = {() => navigate('/order-page')}
              >
                <ShoppingBasket className="w-5 h-5 mr-2" />
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BookDetailsPage;
