
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });
  const [orderStatus, setOrderStatus] = useState(null); // 'processing', 'success', 'error'

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}api/products/${id}`);
        setProduct(res.data);
        setSelectedImage(res.data.image[0]);
      } catch (err) {
        console.error("Error fetching product details", err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    setOrderStatus('processing');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}api/orders`, {
        ...formData,
        productId: product._id,
        productName: product.name,
      });
      setOrderStatus('success');
      setFormData({ name: "", phone: "", address: "" });
      setTimeout(() => {
        setShowForm(false);
        setOrderStatus(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to place order", err);
      setOrderStatus('error');
    }
  };

  if (!product) return <div className="text-center mt-20">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product images section (unchanged) */}
        <div>
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full h-[350px] object-cover rounded-xl shadow-md"
          />

          <div className="flex gap-2 mt-4">
            {product.image.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-14 h-14 md:w-16 md:h-16 rounded-md overflow-hidden border-2 ${
                  selectedImage === img ? "border-indigo-500" : "border-transparent"
                }`}
              >
                <img
                  src={img}
                  alt={`thumb-${idx}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product details section */}
        <div className="space-y-4">
          {/* Product title and price (unchanged) */}
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 font-serif tracking-tight">
            {product.name}
          </h1>
          <p className="text-lg font-bold text-indigo-600">₹{product.price}</p>

          {product.size && (
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Size:</span> {product.size}
            </p>
          )}

          {product.material && (
            <p className="text-md text-gray-700">
              <span className="font-semibold">Material:</span> {product.material}
            </p>
          )}

          <button
            onClick={() => setShowForm(true)}
            className="w-full md:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-sm text-white font-medium rounded-md transition"
          >
            Buy Now
          </button>

          {/* Status messages */}
          {orderStatus === 'processing' && (
            <div className="p-3 bg-blue-50 text-blue-700 rounded-md">
              Your order is being placed...
            </div>
          )}

          {orderStatus === 'success' && (
            <div className="p-3 bg-green-50 text-green-700 rounded-md">
              Your order has been placed successfully!
            </div>
          )}

          {orderStatus === 'error' && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md">
              Failed to place order. Please try again.
            </div>
          )}

          {showForm && (
            <form onSubmit={handleOrder} className="mt-6 space-y-4">
              {/* Form fields (unchanged) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md"
                  required
                ></textarea>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-sm text-white rounded-md"
                >
                  Confirm Order
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setOrderStatus(null);
                  }}
                  className="flex-1 px-4 py-2 bg-white border text-sm border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetails;