export const corsMiddleware = (handler) => {
    return async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allowed methods
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allowed headers
  
      // Handle preflight requests
      if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
      }
  
      return handler(req, res);
    };
  };