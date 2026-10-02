const ExternalLink = ({ href, className = "", children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
    {children}
    <span className="sr-only"> (opens in a new tab)</span>
  </a>
);

export default ExternalLink;
