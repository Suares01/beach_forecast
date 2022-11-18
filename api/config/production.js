const { PORT, DATABASE_URL, CACHE_URL, CACHE_PASS } = process.env;

module.exports = {
  App: {
    port: PORT || 8080,
    clients: {
      web: "https://beach-forecast-fawn.vercel.app",
    },
    database: {
      url: DATABASE_URL,
    },
    email: {
      host: "smtp.gmail.com",
      port: 587,
    },
    cache: {
      url: CACHE_URL,
      pass: CACHE_PASS,
    },
  },
};
