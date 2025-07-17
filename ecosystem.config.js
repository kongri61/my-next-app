module.exports = {
  apps: [
    {
      name: 'property-map-dev',
      script: 'npm',
      args: 'run dev',
      cwd: 'C:/Users/user/.cursor',
      watch: true,
      ignore_watch: ['node_modules', '.next', 'logs'],
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      autorestart: true,
      max_memory_restart: '1G',
      instances: 1,
      exec_mode: 'fork'
    }
  ]
} 