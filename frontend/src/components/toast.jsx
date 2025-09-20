import { useEffect } from "react";

const toast = ({ message, type = "success", onclose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onclose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onclose]);
  return (
    <div
      className={`fixed top-5 right-5 px-4py-3 rounded-lg shadow-lg text-white ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      } transition-transform transform animate-slide-in`}
    >
      {message}
    </div>
  );
};
export default toast;
