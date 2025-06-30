import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
const formatQuery = (slug) => {
  switch (slug.toLowerCase()) {
    case "sarees": return "Saree";
    case "salwar-kurti": return "Salwar Kurti";
    case "nighty": return "Nighty";
    case "pickle": return "Pickle";
    case "organic-masalas": return "Masala";
    default: return slug;
  }
};
const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const queryCategory = formatQuery(category);
        const response = await axios.get(`/api/products?category=${queryCategory}`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching category products", error);
      }
    };
    fetchProducts();
  }, [category]);

  const handleSearch = async () => {
    const queryCategory = formatQuery(category);
    const lowered = query.toLowerCase();
    const priceMatch = lowered.match(/(?:under|below)\s*(\d+)/);
    const maxPrice = priceMatch ? priceMatch[1] : "";
    const name = lowered.replace(/(?:under|below)\s*\d+/, "").trim();

    try {
      const response = await axios.get(`/api/products`, {
        params: {
          category: queryCategory,
          search: name || undefined,
          maxPrice: maxPrice || undefined,
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching filtered products", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFE6E1]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Category Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif tracking-tight">
            {category.replace("-", " ")} Collection
          </h1>
          <div className="w-20 h-1 bg-indigo-600 mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Unified Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search here "
            className="px-4 py-2 border border-gray-300 rounded-md w-full sm:w-[300px]"
          />
          <button
            onClick={handleSearch}
            className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Search
          </button>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No products available in this category.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((item) => (
              <Link
                to={`/product/${item._id}`}
                key={item._id}
                className="group transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="bg-[#F3F7EC] rounded-lg overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 h-full flex flex-col">
                  {item.image && item.image.length > 0 ? (
                    <div className="relative pt-[120%] overflow-hidden m-4">
                      <img
                        src={item.image[0]}
                        alt={item.name}
                        className="absolute rounded-lg top-0 left-0 w-[calc(100%-8px)] h-[calc(100%-8px)] m-1 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="pt-[120%] bg-gray-100 m-2 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}

                  <div className="px-3 pb-3 pt-1 flex-grow flex flex-col">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-indigo-600 font-semibold mt-auto text-sm sm:text-base">
                      ₹{item.price}
                    </p>
                    {item.size && (
                      <p className="text-xs text-gray-500 mt-1">
                        Size: {item.size} 
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default CategoryPage;
