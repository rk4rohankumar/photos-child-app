const Pagination = ({ page, totalPages, onPrev, onNext }) => {
  if (totalPages <= 1) return null;
  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-4 my-8"
    >
      <button
        type="button"
        onClick={onPrev}
        disabled={page <= 1}
        className="px-4 py-2 rounded-md bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Prev
      </button>
      <span className="text-sm text-gray-700" aria-live="polite">
        Page <strong>{page}</strong> of <strong>{totalPages}</strong>
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={page >= totalPages}
        className="px-4 py-2 rounded-md bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;
