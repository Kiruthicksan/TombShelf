import { useState, useEffect } from "react";
import { useAuthStore } from "../store/store";
import { FaUserCircle } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Profile = () => {

  // -------------------- Auth Store (global) --------------------------------------
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
   const logout = useAuthStore((state) => state.logout);

  // ------------------------------- Local states ------------------------------------
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ userName: "", email: "" });
  const [isLoading, setIsLoading] = useState(false);


  // ---------------------------------- navigate hook-------------------------------

  const navigate = useNavigate();

  // ------------------------------- Logout Logic --------------------------------------

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/')
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  // ----------------------------Sync formData with user---------------------------
  useEffect(() => {
    if (user) setFormData({ userName: user.userName, email: user.email });
  }, [user]);

  // ===========================handle change of input feild------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ------------------------------------cancel button---------------------------------------------
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ userName: user.userName, email: user.email });
  };

  // ---------------------------------actual update logic----------------------------------------
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateUser(formData);
      setIsEditing(false);
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <FaUserCircle className="text-gray-600 text-8xl" />
            <span className="bg-green-500 h-4 w-4 rounded-full border-2 border-white absolute bottom-1 right-1"></span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-1">
            {user?.userName
              ? user.userName.charAt(0).toUpperCase() +
                user.userName.slice(1).toLowerCase()
              : ""}
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Manage Your Personal Details
          </p>
        </div>
        {/* Form */}
        <form className="space-y-5" onSubmit={handleUpdate}>
          <div>
            <label className="block font-medium text-gray-600 text-sm mb-1">
              Username
            </label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              readOnly={!isEditing}
              className="px-4 py-2 w-full border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-600 text-sm mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              readOnly={!isEditing}
              className="px-4 py-2 w-full border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          

          <div className="flex justify-end gap-3">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                
                >
                  Cancel
                </Button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`py-2 px-4 rounded-lg font-semibold text-white transition ${
                    isLoading
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <>
              <Button
                type="button"
                className= "w-1/2"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
               <Button
                type="button"
                className= "w-1/2"
                onClick={handleLogout}
              >
                Logout
              </Button>
              </>
              
            )}
          </div>
        </form>
        <div className="flex gap-3 justify-center items-center mt-6 border-gray-400 border hover:bg-gray-200  py-3 rounded-full text-gray-700 text-md font-bold"
         onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}>
          <IoIosArrowRoundBack size={30} />
          <span>Go Back</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
