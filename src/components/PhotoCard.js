import { motion } from "framer-motion";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

const PhotoCard = ({ photo, onOpen }) => {
  const reduced = usePrefersReducedMotion();
  const Wrapper = reduced ? "div" : motion.div;
  const motionProps = reduced
    ? {}
    : {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3 },
      };

  const srcSet = [
    `${photo.urls.small} 400w`,
    `${photo.urls.regular} 1080w`,
    `${photo.urls.full} 2000w`,
  ].join(", ");

  return (
    <Wrapper
      className="rounded-lg overflow-hidden shadow-md bg-white"
      {...motionProps}
    >
      <button
        type="button"
        onClick={() => onOpen(photo)}
        className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={`Open ${photo.alt_description || "photo"} in lightbox`}
      >
        <img
          src={photo.urls.regular}
          srcSet={srcSet}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          alt={photo.alt_description || "Unsplash photo"}
          loading="lazy"
          decoding="async"
          className="w-full h-64 object-cover"
        />
      </button>
      <div className="p-4">
        <p className="text-sm text-gray-600">Photo by {photo.user.name}</p>
        <a
          href={photo.links.html}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-sm hover:underline mt-2 inline-block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          View on Unsplash
        </a>
      </div>
    </Wrapper>
  );
};

export default PhotoCard;
