import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { useBookStore } from "@/store/useBookStore";

const BookFrom = ({
  open,
  onOpenChange,
  onSubmit,
  book,
  categories,
  status,
}) => {

  const createBook = useBookStore(state => state.createBook)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    category: "",
    genre: "",
    price: "",
    status: "",
    image: "",
  });

  const handleChange = (feild, value) => {
    setFormData((prev) => ({ ...prev, [feild]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createBook({...formData, price : parseFloat(formData.price)})
      onOpenChange(false)
       setFormData({
      title: "",
      author: "",
      description: "",
      category: "",
      genre: "",
      price: "",
      status: "",
      image: "",
    });
    } catch (error) {
      console.error(error);
      
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
          <DialogDescription>
            Enter the Details for the new book to ad to your Inventory
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                id="title"
                placeholder="Enter Book Title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Author *</Label>
              <Input
                id="author"
                placeholder="Enter Author Name"
                value={formData.author}
                onChange={(e) => handleChange("author", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="₹ 1"
              />
            </div>

            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() +
                        category.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Genre *</Label>
              <Select
                value={formData.genre}
                onValueChange={(value) => handleChange("genre", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fiction">Fiction</SelectItem>
                  <SelectItem value="Science Fiction">
                    Science Fiction
                  </SelectItem>
                  <SelectItem value="Mystery">Mystery</SelectItem>
                  <SelectItem value="Romance">Romance</SelectItem>
                  <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                   <SelectItem value="SuperHero">SuperHero</SelectItem>
                  <SelectItem value="Biography">Biography</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                  <SelectItem value="Self-Help">Self-Help</SelectItem>
                  <SelectItem value="Children">Children</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {status.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Image *</Label>
              <Input
                type="file"
                id="image"
                onChange={(e) => handleChange("image", e.target.files[0])}
              />
            </div>
          </div>
          <div className="space-y-2 ">
            <Label>Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter Book Description.."
              rows={3}
              className="resize-none"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type ="submit">
              Add Book
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default BookFrom;
