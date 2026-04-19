const ErrorState = ({ title = "Something went wrong", message, hint }) => (
  <div
    className="max-w-xl mx-auto my-12 border border-red-200 bg-red-50 text-red-800 rounded-lg p-6"
    role="alert"
  >
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    {message && <p className="text-sm mb-2">{message}</p>}
    {hint && <p className="text-sm opacity-80">{hint}</p>}
  </div>
);

export default ErrorState;
