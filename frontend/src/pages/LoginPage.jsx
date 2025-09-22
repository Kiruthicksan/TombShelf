import { useState } from "react";
import { useAuthStore } from "../store/store";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleValidation = () => {
    if (!email.trim()) {
      setErrorMessage("Email is Required");
      return false;
    }

    if (!password) {
      setErrorMessage("Password is Required");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValidation()) return;
    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message|| "Something Went Wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md flex flex-col"
      >
        <h2 className="text-3xl text-gray-800 mb-6 font-bold text-center">
          Welcome Back
        </h2>

        {errorMessage && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {errorMessage}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />

        <div className="w-full relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <span
            className="absolute inset-y-0 right-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <AiOutlineEyeInvisible size={20} />
            ) : (
              <AiOutlineEye size={20} />
            )}
          </span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition ${
            isLoading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isLoading ? "Logging In" : "LogIn"}
        </button>

        <p className="text-sm text-gray-500 mt-4 text-center">
            Already have an account?
            <span className="text-blue-500 cursor-pointer hover:underline pl-1" onClick={() => navigate("/register")}>Register</span>
        </p>
      </form>
    </div>
  );
};
export default LoginPage;
