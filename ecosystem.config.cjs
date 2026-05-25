module.exports = {
  apps: [
    {
      name: "frontend-interview-bot",
      script: "dist/bot.js",
      cwd: "/var/www/frontend-interview-bot",
      env: {
        NODE_ENV: "production"
      },
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000
    }
  ]
};
