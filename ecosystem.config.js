module.exports = {
  apps: [{
    name: 'skyline',
    script: 'npm',
    args: 'run preview',
    cwd: '/home/devbox/project',
    env: {
      NODE_ENV: 'production',
      PORT: '4174'
    }
  }]
} 