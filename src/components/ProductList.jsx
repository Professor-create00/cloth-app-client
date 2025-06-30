import { useEffect, useState } from "react";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white shadow-md rounded-lg overflow-hidden"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-bold mb-2">{product.name}</h3>
            <p className="text-gray-700 mb-1">Price: ₹{product.price}</p>
            <p className="text-sm text-gray-500">Size: {product.size}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
