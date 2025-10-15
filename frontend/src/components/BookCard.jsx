import { Separator } from "@radix-ui/react-select";
import { Card, CardContent } from "./ui/card";
import { useRef } from "react";

const BookCard = ({ title, books, navigate, getImageUrl }) => {
  

  

  return (
    <div className="mb-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-3 font-[Inter] tracking-wide">
        {title}
      </h1>

      <div
       
        className="flex gap-6  py-3 cursor-grab active:cursor-grabbing  overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-300"
       
      >
        {books.map((book) => (
          <Card
            key={book._id}
            className="w-[241px] h-[448px] flex-shrink-0 overflow-hidden shadow-lg p-0 group hover:opacity-90 transition duration-300 cursor-pointer"
            onClick={() => navigate(`/books/${book._id}`)}
          >
            <CardContent className="p-0">
              <img
                src={getImageUrl(book.image)}
                alt={book.title}
                loading="lazy"
                className="w-full"
              />
              <Separator className="border border-black" />
              <div className="px-2 py-2">
                <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {book.title}
                </h3>
                <p className="text-sm text-muted-foreground">{book.author}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookCard;
