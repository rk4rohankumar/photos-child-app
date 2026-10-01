import { useEffect, useRef } from "react";
import ExternalLink from "./ExternalLink";
import { onImageError, photoAlt, withUtm } from "../lib/photo";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const Lightbox = ({ photo, opener, onClose }) => {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!photo) return;
    const returnTo = opener || document.activeElement;

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const nodes = dialogRef.current.querySelectorAll(FOCUSABLE);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      const inside = dialogRef.current.contains(active);
      if (e.shiftKey && (active === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      if (returnTo && typeof returnTo.focus === "function") returnTo.focus();
    };
  }, [photo, opener]);

  if (!photo) return null;

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const alt = photoAlt(photo);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      onClick={onBackdrop}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
    >
      <div className="relative max-w-5xl w-full max-h-full overflow-auto bg-white rounded-lg shadow-xl">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close lightbox"
          className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full w-9 h-9 flex items-center justify-center shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <img
          src={photo.urls.regular}
          alt={alt}
          width={photo.width}
          height={photo.height}
          decoding="async"
          onError={onImageError}
          className="w-full h-auto max-h-[75vh] object-contain bg-black"
        />
        <div className="p-4 text-sm">
          <h2 id="lightbox-title" className="sr-only">
            {alt}
          </h2>
          <p className="text-gray-700">
            Photo by{" "}
            {photo.user?.links?.html ? (
              <ExternalLink
                href={withUtm(photo.user.links.html)}
                className="font-medium text-gray-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
              >
                {photo.user.name}
              </ExternalLink>
            ) : (
              <strong>{photo.user?.name}</strong>
            )}
          </p>
          <div className="mt-2 flex gap-4">
            <ExternalLink
              href={withUtm(photo.links.html)}
              className="text-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
            >
              View on Unsplash
            </ExternalLink>
            {photo.links.download && (
              <ExternalLink
                href={photo.links.download}
                className="text-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
              >
                Download
              </ExternalLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
