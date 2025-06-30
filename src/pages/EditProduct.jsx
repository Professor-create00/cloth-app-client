import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const EditProduct = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    material:"",
    price: "",
    size: "",
    category: "",
    image: [],
  });
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        setForm({
          name: res.data.name,
          material:res.data.material,
          price: res.data.price,
          size: res.data.size || "",
          category: res.data.category,
          image: [],
        });
      } catch (error) {
        console.error("Error loading product", error);
      }
    };
    fetchProduct();
  }, [id]);

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
    const data = new FormData();
    data.append("name", form.name);
    data.append("material",form.material)
    data.append("price", form.price);
    data.append("size", form.size);
    data.append("category", form.category);
    for (let i = 0; i < form.image.length; i++) {
      data.append("image", form.image[i]);
    }

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/products/${id}`, data);
      setSuccess(true);
      setTimeout(() => navigate("/admin"), 1500);
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

        {success && (
          <div className="mb-4 p-3 text-green-800 bg-green-100 border border-green-300 rounded">
            Product updated successfully!
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
          />

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Update Product
          </button>
        </form>
      </div>
    </>
  );
};

export default EditProduct;
  