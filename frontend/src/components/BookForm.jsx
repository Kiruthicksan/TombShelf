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
import { X } from "lucide-react";


const PastelBadge = ({ genre, onRemove }) => {
  const colors = [
    "bg-red-200 text-red-800",
    "bg-blue-200 text-blue-800",
    "bg-green-200 text-green-800",
    "bg-yellow-200 text-yellow-800",
    "bg-purple-200 text-purple-800",
    "bg-pink-200 text-pink-800",
  ];

  const colorIndex =
    genre.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  const colorClass = colors[colorIndex];

  return (
    <span
      className={`inline-flex items-center text-sm font-medium px-3 py-1 rounded-full mr-2 mb-2 ${colorClass}`}
    >
      {genre}
      <button
        type="button"
        onClick={() => onRemove(genre)}
        className="ml-2 -mr-1 h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-opacity-80 transition"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
};

const BookForm = ({
  open,
  onOpenChange,
  onSubmit,
  book,

  mode,
}) => {
  const genres = [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Romance",
    "Fantasy",
    "Supernatural",
    "Horror",
    "Mystery / Thriller",
    "Science Fiction",
    "Sports",
    "Shounen",
    "Shoujo",
    "Seinen",
    "Slice of Life",
    "Dark Fantasy",
    "SuperHero",
  ];
  const createBook = useBookStore((state) => state.createBook);
  const updateBook = useBookStore((state) => state.updateBook);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    category: "",
    genre: [],
    price: "",
    orginalPrice: "",
    status: "",
    image: "",
   
    totalVolumes: "",
    language: "",
    ageRating: "",
  });
  const [errors, setErrors] = useState({});
  const [genreSuggestion, setGenreSuggestion] = useState([]);
  const [genreInput, setGenreInput] = useState("");



  useEffect(() => {
    if (book && mode === "edit") {
      setFormData({
        title: book.title,
        author: book.author,
        description: book.description,
        category: book.category,
        genre: book.genre || [],
        price: book.price,
        orginalPrice: book.orginalPrice,
        status: book.status,
        image: book.image,
       
        totalVolumes: book.totalVolumes,
        language: book.language,
        ageRating: book.ageRating,
      });
    } else {
      setFormData({
        title: "",
        author: "",
        description: "",
        category: "",
        genre: [],
        price: "",
        orginalPrice: "",
        status: "",
        image: "",
        
        totalVolumes: "",
        language: "",
        ageRating: "",
      });
    }
  }, [book, mode, open]);

  const validateForm = () => {
    const errors = {};
    // if (!formData.title.trim()) errors.title = "Title is required";
    // if (!formData.author.trim()) errors.author = "Author is required";
    // if (
    //   !formData.price ||
    //   isNaN(formData.price) ||
    //   parseFloat(formData.price) <= 0
    // )
    //   errors.price = "Price must be a positive number";
    // if (!formData.category) errors.category = "Category is required";

    // if (!formData.genre || formData.genre.length === 0)
    //   errors.genre = "At least one Genre is required";
    // if (!formData.status) errors.status = "Status is required";
    // if (!formData.image) errors.image = "Image is required";
    // if (!formData.description.trim())
    //   errors.description = "Description is required";
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
        genre: [],
        price: "",
        status: "",
        image: "",
      });
      setErrors({});
    } catch (error) {
      console.error(error);
    }
  };

  // --- Genre Tag Input Handlers ---

  const handleGenreInputChange = (value) => {
    setGenreInput(value);

    if (!value) {
      setGenreSuggestion([]);
      return;
    }

    const filtered = genres.filter(
      (g) =>
        g.toLowerCase().includes(value.toLowerCase()) &&
        !formData.genre.includes(g)
    );
    setGenreSuggestion(filtered);
  };

  const addGenre = (genre) => {
    // Only add if the genre is not already in the array
    if (!formData.genre.includes(genre)) {
      setFormData((prev) => ({
        ...prev,
        genre: [...prev.genre, genre],
      }));
      // Clear genre error if one exists after adding a tag
      setErrors((prev) => ({ ...prev, genre: undefined }));
    }
    setGenreInput("");
    setGenreSuggestion([]);
  };

  const removeGenre = (genreToRemove) => {
    setFormData((prev) => ({
      ...prev,
      genre: prev.genre.filter((g) => g !== genreToRemove),
    }));
    // Re-evaluate suggestions in case the removed genre should now appear
    handleGenreInputChange(genreInput);
  };
  // --------------------------------

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto flex flex-col">
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

            <div className="space-y-2 relative">
              <Label>OrginalPrice (₹) </Label>
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
                <SelectTrigger className= "w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manga">Manga</SelectItem>
                  <SelectItem value="comics">Comics</SelectItem>
                </SelectContent>
              </Select>

              {errors.category && (
                <p className="text-red-500 text-sm">{errors.category}</p>
              )}
            </div>

            <div className="space-y-2 relative">
              <Label>Genre *</Label>

              {/* Tag Display Area */}
              <div className="flex flex-wrap items-center min-h-[40px] border border-input rounded-md p-2 bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all">
                {/* Selected Tags */}
                {formData.genre.map((g) => (
                  <PastelBadge key={g} genre={g} onRemove={removeGenre} />
                ))}

                {/* Input for typing/filtering */}
                <Input
                  id="genre-input"
                  placeholder={
                    formData.genre.length === 0 ? "Type to filter genres" : ""
                  }
                  value={genreInput}
                  onChange={(e) => handleGenreInputChange(e.target.value)}
                  className="flex-1 min-w-[100px] border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                />
              </div>

              {/* Autosuggestion List */}
              {genreSuggestion.length > 0 && (
                <ul className="absolute z-50 bg-white border w-full max-h-40 overflow-auto mt-1 rounded shadow-lg">
                  {genreSuggestion.map((g) => (
                    <li
                      key={g}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => addGenre(g)}
                    >
                      {g}
                    </li>
                  ))}
                </ul>
              )}

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
                <SelectTrigger className= "w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
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
export default BookForm;
