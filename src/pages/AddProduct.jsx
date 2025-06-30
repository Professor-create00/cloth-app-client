import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const AddProduct = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    size: "",
    category: "",
    material:"", 
    image: [],
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

  const data = new FormData();
  data.append("name", form.name);
  data.append("price", form.price);
  data.append("size", form.size);
  data.append("category", form.category);
  data.append("material",form.material); // newly added
  for (let i = 0; i < form.image.length; i++) {
    data.append("image", form.image[i]);
  }

  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, data);

    setSuccess(true);
    setTimeout(() => navigate("/admin"), 1500); // redirect after 1.5s
  } catch (error) {
    console.error("Error adding product:", error);
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
  type="text"
  name="material"
  value={form.material}
  onChange={handleChange}
  placeholder="Enter material (e.g. Cotton Blend)"
  className="w-full p-2 border rounded"
/>


          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="text"
            name="size"
            placeholder="Size"
            value={form.size}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            <option value="Saree">Saree</option>
            <option value="Salwar Kurti">Salwar Kurti</option>
            <option value="Nighty">Nighty</option>
            <option value="Pickle">Pickle</option>
            <option value="Masala">Organic Masala</option>
          </select>

          <input
            type="file"
            name="image"
            multiple
            onChange={handleChange}
            className="w-full"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Product
          </button>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
