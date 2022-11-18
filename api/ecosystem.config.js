module.exports = {
  apps: [
    {
      name: "beach_forecast",
      script: "./dist/main.js",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      node_args: "-r dotenv/config",
      instances: 2,
      exec_mode: "cluster",
      wait_ready: true,
    },
  ],
};
