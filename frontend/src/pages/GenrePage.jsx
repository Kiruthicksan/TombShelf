import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Separator } from "@/components/ui/separator";
import { useBookStore } from "@/store/useBookStore";
import { getImageUrl } from "@/utils/image";

import { Filter, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const GenrePage = () => {
  const books = useBookStore((state) => state.books);
  const navigate = useNavigate();

  // ----------- local states --------------------------------

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedAuthor, setSelectedAuthor] = useState("all");
  const [sortBy, setSortBy] = useState("title");

  //  unique genres ---------------

  const genres = useMemo(() => {
    const allGenres = books.flatMap((book) =>
      Array.isArray(book.genre) ? book.genre : [book.genre]
    );
    const uniqueGenres = [...new Set(allGenres)].filter(Boolean);
    return ["all", ...uniqueGenres].sort();
  }, [books]);

  // ------------------- unique authors -----------------------

  const authors = useMemo(() => {
    const uniqueAuthors = [...new Set(books.map((book) => book.author))];
    return ["all", ...uniqueAuthors].sort();
  }, [books]);

  // --------------------  logics to search and  filter ------------------------

  const filteredBooks = useMemo(() => {
    let filtered = books;

    // search filter

    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.genre
            .map((g) => g.toLowerCase())
            .includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGenre !== "all") {
      filtered = filtered.filter((book) => {
        if (Array.isArray(book.genre)) {
          return book.genre.includes(selectedGenre);
        }
        return book.genre === selectedGenre;
      });
    }

    if (selectedAuthor !== "all") {
      filtered = filtered.filter((book) => book.author === selectedAuthor);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return a.author.localeCompare(b.author);
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "oldest":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
    });

    return filtered;
  }, [books, searchTerm, selectedAuthor, selectedGenre, sortBy]);

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedGenre("all")
    setSelectedAuthor("all")
    setSortBy("title")
  }

  const hasActiveFilters = searchTerm || selectedGenre !== "all" || selectedAuthor !== "all"

  return (
    <div className="mb-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-3 font-[Inter] tracking-wide text-center mt-10">
        Explore Books based on your needs
      </h1>

      <div className="max-w-6xl mx-auto px-6 mb-8">
        {/* ----------------Search Bar------------------------------ */}
        <div className="relative mb-6">
          <Search className="absolute top-1/2 -translate-1/2 left-5 h-4 w-4 text-gray-500" />
          <Input
            className="pl-10 pr-10"
            placeholder="Search by author name and title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Genre filter ----------------------------------------- */}

          <div>
            <Label className="text-sm font-medium mb-2 block">Genre</Label>
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Genre" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre === "all" ? "All genres" : genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Author</Label>
            <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select by Author" />
              </SelectTrigger>
              <SelectContent>
                {authors.map((author) => (
                  <SelectItem key={author} value={author}>
                    {author === "all" ? "All" : author}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Sort By</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title A-Z</SelectItem>
                <SelectItem value="author">Author A-Z</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

           <div className="flex items-end">
            <Button
              variant={hasActiveFilters ? "default" : "outline"}
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className="w-full"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
         <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredBooks.length} of {books.length} books
            {selectedGenre !== "all" && ` in ${selectedGenre}`}
          </p>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
              Clear all
            </Button>
          )}
        </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">No books found</div>
            <p className="text-gray-600 text-sm mb-4">
              {hasActiveFilters 
                ? "Try adjusting your filters or search term" 
                : "No books available in the library"
              }
            </p>
             {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline">
                Clear all filters
              </Button>
            )}
          </div>
        ) : (
          filteredBooks.map((book) => (
            <Card
              key={book._id}
              className="w-[200px] h-[400px] flex-shrink-0 overflow-hidden shadow-lg p-0 group hover:opacity-90 transition duration-300 cursor-pointer"
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
          ))
        )}
      </div>
      </div>

     
    </div>
  );
};
export default GenrePage;
