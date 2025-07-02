
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
        setProducts(res.data);
        setFilteredProducts(res.data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(res.data.map(p => p.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching products", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    
    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query)
      );
    }
    
    setFilteredProducts(result);
  }, [selectedCategory, searchQuery, products]);

const handleDelete = async (id) => {
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
    setProducts((prev) => prev.filter((p) => p._id !== id));
    setDeleteConfirm(null);
  } catch (err) {
    console.error("Failed to delete product", err);
  }
};


  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 ">Admin Dashboard</h1>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Link
                to="/admin/add"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center text-sm md:text-base"
              >
                Add New Product
              </Link>
              <Link
                to="/admin/orders"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-center text-sm md:text-base"
              >
                View Orders
              </Link>
            </div>
          </div>

          {/* Search and Filter Row */}
          <div className="flex flex-col md:flex-row gap-4 w-full">
            {/* Search Bar */}
            <div className="flex-1">
              <label htmlFor="product-search" className="sr-only">Search products</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="product-search"
                  type="text"
                  placeholder="Search by product name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:text-white"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="w-full md:w-64">
              <label htmlFor="category-filter" className="sr-only">Filter by category</label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Mobile View - Card Layout */}
        <div className="md:hidden space-y-4">
          {filteredProducts.length === 0 ? (
            <p className="text-center py-10 text-gray-500">
              {searchQuery || selectedCategory !== "all" 
                ? "No matching products found" 
                : "No products available"}
            </p>
          ) : (
            filteredProducts.map((product) => (
              <div key={product._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex gap-4">
                  {product.image && product.image.length > 0 ? (
                    <img
                      src={product.image[0]}
                      alt={product.name}
                      className="h-20 w-20 object-cover rounded"
                    />
                  ) : (
                    <div className="h-20 w-20 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                      <span className="text-gray-400 dark:text-gray-300 text-xs">No Image</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 dark:text-white">{product.name}</h3>
                    <p className="text-indigo-600 dark:text-indigo-400">₹{product.price}</p>
                    <div className="flex gap-1 text-sm text-gray-600 dark:text-gray-300">
                      {product.size && <span>{product.size}</span>}
                      {product.category && <span>• {product.category}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/admin/edit/${product._id}`)}
                    className="flex-1 bg-yellow-500 text-white py-1.5 rounded hover:bg-yellow-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(product._id)}
                    className="flex-1 bg-red-600 text-white py-1.5 rounded hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="text-left p-3 text-gray-800 dark:text-white">Image</th>
                <th className="text-left p-3 text-gray-800 dark:text-white">Name</th>
                <th className="text-left p-3 text-gray-800 dark:text-white">Price</th>
                <th className="text-left p-3 text-gray-800 dark:text-white">Size</th>
                <th className="text-left p-3 text-gray-800 dark:text-white">Category</th>
                <th className="text-left p-3 text-gray-800 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-500">
                    {searchQuery || selectedCategory !== "all" 
                      ? "No matching products found" 
                      : "No products available"}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="p-3">
                      {product.image && product.image.length > 0 ? (
                        <img
                          src={product.image[0]}
                          alt={product.name}
                          className="h-16 w-16 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400 dark:text-gray-300">No Image</span>
                      )}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-white">{product.name}</td>
                    <td className="p-3 text-gray-800 dark:text-white">₹{product.price}</td>
                    <td className="p-3 text-gray-800 dark:text-white">{product.size}</td>
                    <td className="p-3 text-gray-800 dark:text-white">{product.category}</td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => navigate(`/admin/edit/${product._id}`)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">Confirm Delete</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to delete this product?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-gray-200 dark:bg-gray-600 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;