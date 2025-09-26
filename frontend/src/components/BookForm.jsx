import { useEffect, useState } from "react";

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
  mode,
}) => {
  const createBook = useBookStore((state) => state.createBook);
  const updateBook = useBookStore((state) => state.updateBook);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    category: "",
    genre: "",
    price: "",
    orginalPrice: "",
    status: "",
    image: "",
  });
  const [errors, setErrors] = useState({});

  // render based on mode

  useEffect(() => {
    if (book && mode === "edit") {
      setFormData({
        title: book.title,
        author: book.author,
        description: book.description,
        category: book.category,
        genre: book.genre,
        price: book.price,
        orginalPrice: book.orginalPrice,
        status: book.status,
        image: book.image,
      });
    } else {
      setFormData({
        title: "",
        author: "",
        description: "",
        category: "",
        genre: "",
        price: "",
        orginalPrice: "",
        status: "",
        image: "",
      });
    }
  }, [book, mode, open]);

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.author.trim()) errors.author = "Author is required";
    if (
      !formData.price ||
      isNaN(formData.price) ||
      parseFloat(formData.price) <= 0
    )
      errors.price = "Price must be a positive number";
    if (!formData.category) errors.category = "Category is required";
    if (!formData.genre) errors.genre = "Genre is required";
    if (!formData.status) errors.status = "Status is required";
    if (!formData.image) errors.image = "Image is required";
    if (!formData.description.trim())
      errors.description = "Description is required";
    return errors;
  };

  const handleChange = (feild, value) => {
    setFormData((prev) => ({ ...prev, [feild]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validatiionErrors = validateForm();
    if (Object.keys(validatiionErrors).length > 0) {
      setErrors(validatiionErrors);
      return;
    }
    try {
      if (mode === "edit" && book) {
        await updateBook(book._id, {
          ...formData,
          price: parseFloat(formData.price),
        });
      } else {
        await createBook({ ...formData, price: parseFloat(formData.price) });
      }

      onOpenChange(false);
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
      setErrors({});
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Book" : "Edit Book"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "  Enter the Details for the new book to ad to your Inventory"
              : "Update the book information below"}
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
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Author *</Label>
              <Input
                id="author"
                placeholder="Enter Author Name"
                value={formData.author}
                onChange={(e) => handleChange("author", e.target.value)}
              />
              {errors.author && (
                <p className="text-red-500 text-sm">{errors.author}</p>
              )}
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
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>OrginalPrice (₹) *</Label>
              <Input
                id="orginalPrice"
                type="number"
                min="0"
                value={formData.orginalPrice}
                onChange={(e) => handleChange("orginalPrice", e.target.value)}
                placeholder="₹ 1"
              />
              {errors.orginalPrice && (
                <p className="text-red-500 text-sm">{errors.orginalPrice}</p>
              )}
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

              {errors.category && (
                <p className="text-red-500 text-sm">{errors.category}</p>
              )}
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

                  <SelectItem value="SuperHero">SuperHero</SelectItem>
                  <SelectItem value="Shonen Manga">Shonen Manga</SelectItem>
                </SelectContent>
              </Select>
              {errors.genre && (
                <p className="text-red-500 text-sm">{errors.genre}</p>
              )}
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
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Image *</Label>
              <Input
                type="file"
                id="image"
                onChange={(e) => handleChange("image", e.target.files[0])}
              />
              {errors.image && (
                <p className="text-red-500 text-sm">{errors.image}</p>
              )}
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
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {mode === "add" ? "Add Book" : "Update Book"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default BookFrom;
