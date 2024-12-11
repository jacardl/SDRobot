module.exports = {
  apps: [{
    name: 'sdrobot',
    script: 'npm',
    args: 'run preview',
    cwd: '/home/devbox/project',
    env: {
      NODE_ENV: 'production',
      PORT: '4173'
    }
  }]
} 