const compression = require('compression');

// Enhanced compression middleware
const compressionMiddleware = compression({
  // Only compress responses that are larger than this threshold
  threshold: 1024,
  
  // Compression level (1-9, 6 is default)
  level: 6,
  
  // Memory level (1-9, 8 is default)
  memLevel: 8,
  
  // Filter function to determine what to compress
  filter: (req, res) => {
    // Don't compress if the request includes a cache-control: no-transform directive
    if (req.headers['cache-control'] && req.headers['cache-control'].includes('no-transform')) {
      return false;
    }
    
    // Compress JSON responses
    if (res.getHeader('Content-Type') && res.getHeader('Content-Type').includes('application/json')) {
      return true;
    }
    
    // Use compression's default filter for other content types
    return compression.filter(req, res);
  }
});

module.exports = compressionMiddleware;