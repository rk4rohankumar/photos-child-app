const EmptyState = ({ query }) => (
  <div
    className="text-center py-16 text-gray-600"
    role="status"
    aria-live="polite"
  >
    <p className="text-lg font-medium">No photos found</p>
    {query ? (
      <p className="text-sm mt-2">
        Try a different search term than &quot;{query}&quot;.
      </p>
    ) : (
      <p className="text-sm mt-2">Try searching for something.</p>
    )}
  </div>
);

export default EmptyState;
