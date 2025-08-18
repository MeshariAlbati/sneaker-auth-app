const config = {
  apiUrl: import.meta.env.PROD 
    ? '/api'  // Production: API served from same domain
    : 'http://localhost:8000',  // Development: API on localhost:8000
};

export default config;
