require("dotenv/config");

const {
  DATABASE_URL,
  API_KEY,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_SECRET,
  CACHE_PASS,
  CACHE_URL,
  EMAIL_USER,
  EMAIL_PASS,
} = process.env;

module.exports = {
  App: {
    port: 3000,
    clients: {
      web: "http://localhost:5173",
    },
    database: {
      url: DATABASE_URL,
    },
    auth: {
      access_token_secret: ACCESS_TOKEN_SECRET,
      refresh_token_secret: REFRESH_TOKEN_SECRET,
    },
    cache: {
      url: CACHE_URL,
      pass: CACHE_PASS,
    },
    resources: {
      StormGlass: {
        endpoint: "https://api.stormglass.io",
        apiKey: API_KEY,
        cacheTtl: 3600,
      },
      OpenMeteo: {
        endpoint: "https://marine-api.open-meteo.com",
        cacheTtl: 3600,
      },
    },
    email: {
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    },
    logger: {
      enabled: true,
      level: "info",
    },
  },
};
