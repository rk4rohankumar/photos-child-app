import { useEffect, useRef } from "react";

const Lightbox = ({ photo, onClose }) => {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!photo) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [photo, onClose]);

  if (!photo) return null;

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const title = photo.alt_description || "Unsplash photo";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onBackdrop}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
    >
      <div className="relative max-w-5xl w-full max-h-full overflow-auto bg-white rounded-lg shadow-xl">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close lightbox"
          className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-800 rounded-full w-9 h-9 flex items-center justify-center shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span aria-hidden="true">X</span>
        </button>
        <img
          src={photo.urls.full}
          srcSet={`${photo.urls.regular} 1080w, ${photo.urls.full} 2000w`}
          sizes="100vw"
          alt={title}
          decoding="async"
          className="w-full h-auto max-h-[75vh] object-contain bg-black"
        />
        <div className="p-4">
          <p className="text-sm text-gray-700">
            Photo by <strong>{photo.user.name}</strong>
            {photo.user.links?.html && (
              <>
                {" "}
                (
                <a
                  href={photo.user.links.html}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  profile
                </a>
                )
              </>
            )}
          </p>
          <div className="mt-2 flex gap-4 text-sm">
            <a
              href={photo.links.html}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View on Unsplash
            </a>
            {photo.links.download && (
              <a
                href={photo.links.download}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Download
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
