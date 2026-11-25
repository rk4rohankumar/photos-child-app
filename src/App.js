import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";

import Loader from "./components/Loader";
import ErrorState from "./components/ErrorState";
import EmptyState from "./components/EmptyState";
import Pagination from "./components/Pagination";
import PhotoCard from "./components/PhotoCard";
import Lightbox from "./components/Lightbox";
import useDebouncedValue from "./hooks/useDebouncedValue";

const API = "https://api.unsplash.com";
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
  const openerRef = useRef(null);

  const debouncedQuery = useDebouncedValue(searchTerm, 400);

  const fetchPhotos = useCallback(
    async (query, pageNum, signal) => {
      if (keyMissing) return;
      setLoading(true);
      setError(null);
      const trimmed = (query || "").trim();
      const url = trimmed ? `${API}/search/photos` : `${API}/photos`;
      const params = trimmed
        ? { query: trimmed, page: pageNum, per_page: PER_PAGE }
        : { page: pageNum, per_page: PER_PAGE };
      try {
        const response = await axios.get(url, {
          params,
          signal,
          headers: {
            Authorization: `Client-ID ${accessKey}`,
            "Accept-Version": "v1",
          },
        });
        if (trimmed) {
          setPhotos(response.data.results || []);
          setTotalPages(response.data.total_pages || 1);
        } else {
          setPhotos(response.data || []);
          // Unsplash /photos has no total; cap at 10 pages for Prev/Next UX.
          setTotalPages(10);
        }
      } catch (err) {
        if (axios.isCancel(err)) return;
        const status = err?.response?.status;
        if (status === 401) {
          setError({
            title: "Unauthorized (401)",
            message: "Your Unsplash access key was rejected.",
            hint: "Set REACT_APP_UNSPLASH_ACCESS_KEY in .env and restart the dev server.",
          });
        } else if (status === 403) {
          setError({
            title: "Rate limit reached (403)",
            message: "The Unsplash API rate limit for this key has been exhausted.",
            hint: "Demo keys allow 50 requests per hour. Wait a bit and try again.",
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
        if (!signal?.aborted) setLoading(false);
      }
    },
    [accessKey, keyMissing]
  );

  // Reset to page 1 whenever the debounced query changes.
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  useEffect(() => {
    const controller = new AbortController();
    fetchPhotos(debouncedQuery, page, controller.signal);
    return () => controller.abort();
  }, [debouncedQuery, page, fetchPhotos]);

  const onSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPhotos(searchTerm, 1);
  };

  const openLightbox = useCallback((photo, opener) => {
    openerRef.current = opener || null;
    setSelected(photo);
  }, []);

  const closeLightbox = useCallback(() => setSelected(null), []);

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
      <section aria-labelledby="photos-heading" className="max-w-6xl mx-auto p-4">
        <p className="text-xs font-medium uppercase tracking-widest text-[color:var(--mfe-accent,#047857)]">Photos remote</p>
        <h1 id="photos-heading" className="mt-1 mb-6 text-2xl font-semibold text-[color:var(--mfe-ink,#0f172a)]">
          Stunning Photos
        </h1>
        <ErrorState
          title="Unsplash access key is missing"
          message="The REACT_APP_UNSPLASH_ACCESS_KEY environment variable is not set."
          hint="Copy .env.example to .env, set REACT_APP_UNSPLASH_ACCESS_KEY, and restart the dev server."
        />
      </section>
    );
  }

  return (
    <section aria-labelledby="photos-heading" className="max-w-6xl mx-auto p-4">
      <p className="text-xs font-medium uppercase tracking-widest text-[color:var(--mfe-accent,#047857)]">Photos remote</p>
      <h1 id="photos-heading" className="mt-1 mb-6 text-2xl font-semibold text-[color:var(--mfe-ink,#0f172a)]">
        Stunning Photos
      </h1>

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
          className="p-2 border border-gray-400 rounded-md w-64 text-[color:var(--mfe-ink,#0f172a)] focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoComplete="off"
        />
        <button
          type="submit"
          className="bg-[var(--mfe-accent,#047857)] text-white px-4 py-2 rounded-md hover:bg-[var(--mfe-accent-ink,#065f46)] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
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
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 list-none p-0 m-0">
            {photos.map((photo) => (
              <li key={photo.id}>
                <PhotoCard photo={photo} onOpen={openLightbox} />
              </li>
            ))}
          </ul>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </>
      )}

      <Lightbox
        photo={selected}
        opener={openerRef.current}
        onClose={closeLightbox}
      />
    </section>
  );
};

export default PhotosPage;
