import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import 'tailwindcss/tailwind.css';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <motion.div
        className="w-16 h-16 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity }}
      ></motion.div>
      <p className="text-lg font-semibold text-gray-700 mt-4">Loading images...</p>
    </div>
  );
};

const PhotosPage = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async (query = "") => {
    setLoading(true);
    const url = query
      ? `https://api.unsplash.com/search/photos?query=${query}&client_id=${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}`
      : `https://api.unsplash.com/photos?client_id=${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}`;
    try {
      const response = await axios.get(url);
      setPhotos(query ? response.data.results : response.data);
    } catch (error) {
      console.error("Failed to fetch photos:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">📸 Stunning Photos</h1>

      {/* Search Input */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search photos..."
          className="p-2 border border-gray-300 rounded-md w-64 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={() => fetchPhotos(searchTerm)}
        >
          Search
        </button>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            className="rounded-lg overflow-hidden shadow-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={photo.urls.regular}
              alt={photo.alt_description}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <p className="text-sm text-gray-600">📷 {photo.user.name}</p>
              <a
                href={photo.links.html}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-sm hover:underline mt-2 block"
              >
                View on Unsplash
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PhotosPage;
