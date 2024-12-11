module.exports = {
  apps: [{
    name: 'sdrobot',
    script: './node_modules/.bin/vite',
    args: 'preview --port 4173',
    env: {
      NODE_ENV: 'production',
      PORT: '4173'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: '4173'
    }
  }]
} 