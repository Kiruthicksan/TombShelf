export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getImageUrl = (path) => {
  if (path.startsWith("http")) return path;
  const cleanedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${BASE_URL}/${cleanedPath}`;
};
