import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const HeroVideo = () => {
  const videoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.src = isMobile ? "/videos/mobilevideo.mp4" : "/videos/video1.mp4";
      video.load();

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Autoplay prevented:", error);
        });
      }
    }
  }, [isMobile]);

  return (
    <div className="w-full h-[50vh] sm:h-[60vh] md:h-screen relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`w-full h-full object-cover ${isMobile ? 'object-top' : 'object-center'}`}
        >
          <source src={isMobile ? "/videos/mobilevideo.mp4" : "/videos/video1.mp4"} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

const Section = ({ title, items, link }) => {
  return (
    <div className="mb-12 sm:mb-16 px-3 sm:px-4">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 font-serif mb-3 sm:mb-4">
          {title}
        </h2>
        <Link
          to={link}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 sm:px-6 sm:py-2 rounded-full text-sm font-medium transition-colors duration-300 inline-flex items-center"
        >
          View All <span className="ml-1">→</span>
        </Link>
      </div>
      
      <div className="md:hidden flex overflow-x-auto pb-4 gap-3 sm:gap-4 scrollbar-hide px-2">
        {items.slice(0, 4).map((item, index) => (
          <Link 
            to={`/product/${item._id}`} 
            key={item._id}
            className="flex-none w-[45%] sm:w-[30%] animate-fadeInUp"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group h-full">
              {item.image && item.image.length > 0 ? (
                <div className="relative overflow-hidden rounded-lg aspect-[3/4]">
                  <img
                    src={item.image[0]}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="w-full aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <div className="mt-2 sm:mt-3">
                <h3 className="font-medium text-gray-900 truncate font-sans text-sm sm:text-base">
                  {item.name}
                </h3>
                <p className="text-blue-600 font-semibold mt-1 text-sm sm:text-base">
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

      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.slice(0, 4).map((item, index) => (
          <Link 
            to={`/product/${item._id}`} 
            key={item._id}
            className="animate-fadeInUp"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group h-full">
              {item.image && item.image.length > 0 ? (
                <div className="relative overflow-hidden rounded-lg aspect-[3/4]">
                  <img
                    src={item.image[0]}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="w-full aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <div className="mt-2 sm:mt-3">
                <h3 className="font-medium text-gray-900 truncate font-sans">
                  {item.name}
                </h3>
                <p className="text-blue-600 font-semibold mt-1">
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
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 sm:py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xs sm:text-sm">
          Made with ❤️ and ☕ by Lakhan Sharan
        </p>
      </div>
    </footer>
  );
};

const HomePage = () => {
  const [products, setProducts] = useState({});

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const categories = [
          "Saree",
          "Salwar Kurti",
          "Nighty",
          "Pickle",
          "Masala",
        ];

        const fetched = {};
        for (const cat of categories) {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}api/products?category=${cat}`);
          fetched[cat] = res.data;
        }
        setProducts(fetched);
      } catch (err) {
        console.error("Error fetching products", err);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="min-h-screen bg-red-50 flex flex-col">
      <Navbar />
      <HeroVideo />
      <div className="max-w-7xl mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4 flex-grow">
        {products["Saree"] && (
          <Section title="Handloom Saree Collection" items={products["Saree"]} link="/sarees" />
        )}
        {products["Salwar Kurti"] && (
          <Section title="Everyday Ethnic Comfort" items={products["Salwar Kurti"]} link="/salwar-kurti" />
        )}
        {products["Nighty"] && (
          <Section title="Dreamy Night Dresses" items={products["Nighty"]} link="/nighty" />
        )}
        {products["Pickle"] && (
          <Section title="Homemade Pickles" items={products["Pickle"]} link="/pickle" />
        )}
        {products["Masala"] && (
          <Section title="Zero Preservative Masalas" items={products["Masala"]} link="/organic-masalas" />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;