/**
 * Wrap an async Express handler so rejected promises reach the error middleware
 * (Express 4 does not do this on its own).
 */
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = asyncHandler;
