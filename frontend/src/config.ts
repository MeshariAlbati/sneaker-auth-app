const config = {
  apiUrl: import.meta.env.PROD 
    ? 'https://legitkicks.onrender.com/api'  // Your actual Render URL
    : 'http://localhost:8000',  // Development: API on localhost:8000
};

export default config;
