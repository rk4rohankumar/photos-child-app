// Async boundary so webpack can negotiate shared singletons (react, react-dom)
// before any module that imports them is evaluated.
import('./bootstrap');
