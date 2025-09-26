import { Button } from "@/components/ui/button";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useBookStore } from "@/store/useBookStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BookFrom from "@/components/BookForm";
import DeleteBookDialog from "@/components/DeleteBookDialog";
import { Badge } from "@/components/ui/badge";

const ManageBooks = () => {
  // bookstore
  const books = useBookStore((state) => state.books);

  // local states

  const [isAddDialogueOpen, setIsAddDialogueOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingBook, setEditingBook] = useState(null);
  const [deletingBook, setDeletingBook] = useState(null);

  const categories = [...new Set(books.map((book) => book.category))];
  const status = [...new Set(books.map((book) => book.status))];

  // logic to search books based on search term , category

  const filteredBooks = books.filter((book) => {
    const search = searchTerm.trim().toLowerCase();
    const matchedSearch =
      book.title.toLowerCase().includes(search) ||
      book.author.toLowerCase().includes(search);
    const matchedCategory =
      selectedCategory === "All" ||
      book.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchedSearch && matchedCategory;
  });

  return (
    <div className="space-y-10 px-10 py-5 bg-gray-200">
      {/* Header */}

      <div className="flex justify-between  items-center ">
        <div>
          <h1 className="text-2xl font-bold tracking-wide mb-2">
            Manage Books
          </h1>
          <p className="text-gray-600 text-sm">
            {" "}
            Add, edit, and manage your bookstore inventory
          </p>
        </div>
        <div>
          <Button onClick={() => setIsAddDialogueOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Book
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Book Inventory</CardTitle>
          <CardDescription>
            {" "}
            Search and filter your book collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 ">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2  h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by author or title"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>category</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No Books found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBooks.map((book) => (
                    <TableRow
                      key={book._id}
                      className="hover:bg-gray-200 transition duration-300"
                    >
                      <TableCell>{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>₹ {book.price}</TableCell>
                      <TableCell>
                        {book.category.charAt(0).toUpperCase() +
                          book.category.slice(1)}
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingBook(book)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingBook(book)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <BookFrom
        open={isAddDialogueOpen}
        onOpenChange={setIsAddDialogueOpen}
        categories={categories}
        status={status}
        mode="add"
      />

      <BookFrom
        open={!!editingBook}
        onOpenChange={(open) => !open && setEditingBook(null)}
        categories={categories}
        status={status}
        book={editingBook}
        mode="edit"
      />

      <DeleteBookDialog
        open={!!deletingBook}
        onOpenChange={(open) => !open && setDeletingBook(null)}
        book={deletingBook}
        title="Delete Book"
        description={`Are you sure you want to delete "${deletingBook?.title}"? This action cannot be undone.`}
      />
    </div>
  );
};
export default ManageBooks;
