import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import 'tailwindcss/tailwind.css';

import Loader from "./components/Loader";
import ErrorState from "./components/ErrorState";
import EmptyState from "./components/EmptyState";
import Pagination from "./components/Pagination";
import PhotoCard from "./components/PhotoCard";
import Lightbox from "./components/Lightbox";
import useDebouncedValue from "./hooks/useDebouncedValue";

const PER_PAGE = 12;

const PhotosPage = () => {
  const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
  const keyMissing =
    !accessKey || accessKey === "YOUR_KEY_HERE" || accessKey.trim() === "";

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(!keyMissing);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState(null);

  const debouncedQuery = useDebouncedValue(searchTerm, 400);

  const fetchPhotos = useCallback(
    async (query, pageNum) => {
      if (keyMissing) return;
      setLoading(true);
      setError(null);
      const trimmed = (query || "").trim();
      const url = trimmed
        ? `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
            trimmed
          )}&page=${pageNum}&per_page=${PER_PAGE}&client_id=${accessKey}`
        : `https://api.unsplash.com/photos?page=${pageNum}&per_page=${PER_PAGE}&client_id=${accessKey}`;
      try {
        const response = await axios.get(url);
        if (trimmed) {
          setPhotos(response.data.results || []);
          setTotalPages(response.data.total_pages || 1);
        } else {
          setPhotos(response.data || []);
          // Unsplash /photos has no total; cap at 10 pages for Prev/Next UX.
          setTotalPages(10);
        }
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401) {
          setError({
            title: "Unauthorized (401)",
            message: "Your Unsplash access key was rejected.",
            hint: "Set REACT_APP_UNSPLASH_ACCESS_KEY in .env and restart the dev server.",
          });
        } else {
          setError({
            title: "Failed to load photos",
            message: err?.message || "Unknown error",
            hint: "Check your network connection and try again.",
          });
        }
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    },
    [accessKey, keyMissing]
  );

  // Reset to page 1 whenever the debounced query changes.
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  useEffect(() => {
    fetchPhotos(debouncedQuery, page);
  }, [debouncedQuery, page, fetchPhotos]);

  const onSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPhotos(searchTerm, 1);
  };

  const resultsMessage = useMemo(() => {
    if (loading) return "Loading photos...";
    if (error) return "Error loading photos.";
    if (!photos.length) return "No photos to display.";
    return `Showing ${photos.length} photos${
      debouncedQuery ? ` for "${debouncedQuery}"` : ""
    }.`;
  }, [loading, error, photos.length, debouncedQuery]);

  if (keyMissing) {
    return (
      <main className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Stunning Photos</h1>
        <ErrorState
          title="Unsplash access key is missing"
          message="The REACT_APP_UNSPLASH_ACCESS_KEY environment variable is not set."
          hint="Copy .env.example to .env, set REACT_APP_UNSPLASH_ACCESS_KEY, and restart the dev server."
        />
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Stunning Photos</h1>

      <form
        role="search"
        onSubmit={onSubmit}
        className="mb-6 flex justify-center gap-2"
      >
        <label htmlFor="photo-search" className="sr-only">
          Search photos
        </label>
        <input
          id="photo-search"
          type="search"
          placeholder="Search photos..."
          className="p-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoComplete="off"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </form>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {resultsMessage}
      </p>

      {error ? (
        <ErrorState
          title={error.title}
          message={error.message}
          hint={error.hint}
        />
      ) : loading ? (
        <Loader />
      ) : photos.length === 0 ? (
        <EmptyState query={debouncedQuery} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onOpen={setSelected}
              />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </>
      )}

      <Lightbox photo={selected} onClose={() => setSelected(null)} />
    </main>
  );
};

export default PhotosPage;
