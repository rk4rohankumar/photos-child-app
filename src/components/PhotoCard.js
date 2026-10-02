import { motion } from "framer-motion";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import ExternalLink from "./ExternalLink";
import { onImageError, photoAlt, withUtm } from "../lib/photo";

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

  const alt = photoAlt(photo);

  return (
    <Wrapper
      className="rounded-lg overflow-hidden shadow-md bg-white"
      {...motionProps}
    >
      <button
        type="button"
        onClick={(e) => onOpen(photo, e.currentTarget)}
        className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        aria-label={`Open "${alt}" in lightbox`}
      >
        <img
          src={photo.urls.small}
          srcSet={`${photo.urls.small} 400w, ${photo.urls.regular} 1080w`}
          sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 768px) 50vw, 352px"
          alt={alt}
          width={photo.width}
          height={photo.height}
          loading="lazy"
          decoding="async"
          onError={onImageError}
          className="w-full h-64 object-cover bg-gray-100"
        />
      </button>
      <div className="p-4 text-sm">
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
            <span className="font-medium text-gray-900">{photo.user?.name}</span>
          )}
        </p>
        <ExternalLink
          href={withUtm(photo.links.html)}
          className="text-blue-700 hover:underline mt-2 inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
        >
          View on Unsplash
        </ExternalLink>
      </div>
    </Wrapper>
  );
};

export default PhotoCard;
