module.exports = {
  apps: [
    {
      name: "frontend-interview-bot",
      script: "dist/server.js",
      cwd: "/var/www/frontend-interview-bot/hhtg",
      env: {
        NODE_ENV: "production",
        PORT: "3000"
      },
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000
    }
  ]
};
