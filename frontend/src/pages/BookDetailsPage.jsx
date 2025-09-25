import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useBookStore } from "@/store/useBookStore";
import { getImageUrl } from "@/utils/image";

import { ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const BookDetailsPage = () => {
  const { id } = useParams();
  const book = useBookStore((state) => state.book);
  const fetchBook = useBookStore((state) => state.fetchBook);
  const isLoading = useBookStore((state) => state.isLoading);
  const error = useBookStore((state) => state.error);

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

              <div className="mt-8 space-y-3">
                <Button size="lg" className="w-full">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>

          {/* Right column */}

          <div className="lg:col-span-2 space-y-2">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary">{book.genre}</Badge>
              </div>
              <h1 className="mb-2 text-3xl font-bold">{book.title}</h1>
              <p className="mb-4 text-muted-foreground text-lg">
                by {book.author}
              </p>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-semibold">₹ {book.price}</span>
              </div>
            </div>
            <Separator />

            <div>
              <h3 className="mb-3">About this Book</h3>
              <p className="text-muted-foreground leading-relaxed">
                {book.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BookDetailsPage;
