// Neutral SVG shown when an Unsplash CDN image fails to load.
export const PLACEHOLDER_SRC =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" role="img" aria-label="Image unavailable">` +
      `<rect width="400" height="300" fill="#e5e7eb"/>` +
      `<path d="M120 200l50-60 40 45 30-35 40 50H120z" fill="#9ca3af"/>` +
      `<circle cx="150" cy="110" r="18" fill="#9ca3af"/>` +
      `</svg>`
  );

export function photoAlt(photo) {
  return (
    photo.alt_description ||
    photo.description ||
    `Photo by ${photo.user?.name || "an Unsplash photographer"}`
  );
}

// Swap to the placeholder once; clearing srcset stops the browser retrying
// the broken candidates and the nulled handler prevents an error loop.
export function onImageError(event) {
  const img = event.currentTarget;
  img.onerror = null;
  img.removeAttribute("srcset");
  img.removeAttribute("sizes");
  img.src = PLACEHOLDER_SRC;
}

// Unsplash API guidelines ask for UTM parameters on attribution links.
export function withUtm(url) {
  if (!url) return url;
  const joiner = url.includes("?") ? "&" : "?";
  return `${url}${joiner}utm_source=micro_frontend_photos&utm_medium=referral`;
}
