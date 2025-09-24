import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
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

const ManageBooks = () => {

  const books = useBookStore(state => state.books)
  const fetchBooks = useBookStore((state) => state.fetchBooks)

  useEffect(() => {
      fetchBooks()
    }, [])

  const [category,setCategory] = useState("")
 const categories = [...new Set(books.map((book) => book.category))];
  return (
    <div className="space-y-10 px-10 py-5">
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
          <Button>
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
                className="pl-10"
              />
            </div>
            <Select value = {category} onValueChange = {setCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem>Manga</SelectItem>
                <SelectItem>Comics</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default ManageBooks;
