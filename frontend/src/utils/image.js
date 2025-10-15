export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getImageUrl = (path) => {
  if (!path) return `${BASE_URL}/uploads/default-cover.jpg`;
  
 
  if (path.startsWith('http')) {
    return path;
  }
  

  const cleanedPath = path.replace(/^\//, '');
  
 
  return `${BASE_URL}/${cleanedPath}`;
};