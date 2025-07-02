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
  const [orderStatus, setOrderStatus] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}api/products/${id}`);
        setProduct(res.data);
        setSelectedImage(res.data.image[0]); // Changed to image[0]
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
        {/* Product images section */}
        <div>
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full h-[350px] object-cover rounded-xl shadow-md"
          />

          <div className="flex gap-2 mt-4">
            {product.image.map((img, idx) => ( // Changed to product.image
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

          {/* Status messages and form (remain exactly the same) */}
          {/* ... */}
        </div>
      </div>
    </>
  );
};

export default ProductDetails;