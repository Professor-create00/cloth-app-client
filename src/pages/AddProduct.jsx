import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    size: "",
    category: "",
    material: "",
    images: [], // Changed from 'image' to 'images' for clarity
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      // Convert FileList to array and store all selected files
      setForm({ ...form, [name]: Array.from(files) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    // Validation
    if (form.images.length === 0) {
      setError("Please select at least one image");
      setLoading(false);
      return;
    }
    if (!form.name || !form.price || !form.category) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("name", form.name);
    data.append("price", form.price);
    data.append("size", form.size);
    data.append("category", form.category);
    data.append("material", form.material);
    
    // Append all images with the same field name
    form.images.forEach((image) => {
      data.append("images", image); // Note: same field name 'images'
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}api/products`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess(true);
      setForm({
        name: "",
        price: "",
        size: "",
        category: "",
        material: "",
        images: [],
      });
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setTimeout(() => navigate("/admin"), 1500);
    } catch (err) {
      console.error("Error adding product:", err);
      setError(
        err.response?.data?.message || 
        "Failed to add product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
        
        {loading && (
          <div className="mb-4 p-3 text-blue-800 bg-blue-100 border border-blue-300 rounded">
            Adding product...
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 text-green-800 bg-green-100 border border-green-300 rounded">
            Product added successfully!
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 text-red-800 bg-red-100 border border-red-300 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ... other form fields remain the same ... */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Product Images (Multiple allowed)
            </label>
            <input
              type="file"
              name="images"
              multiple
              onChange={handleChange}
              className="w-full"
              required
              ref={fileInputRef}
              accept="image/*"
            />
            {form.images.length > 0 && (
              <p className="mt-1 text-sm text-gray-500">
                {form.images.length} image(s) selected
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddProduct;