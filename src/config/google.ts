// 添加调试日志
console.log('Environment variables:', {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  redirectUri: import.meta.env.VITE_APP_URL
})

export const GOOGLE_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
  redirectUri: `${import.meta.env.VITE_APP_URL}/oauth/callback`,
  scopes: [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ],
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo'
}

// 添加配置检查
if (!GOOGLE_CONFIG.clientId) {
  console.warn('Google Client ID is not configured. OAuth features will not work.')
}

console.log('Google OAuth Config:', {
  clientId: GOOGLE_CONFIG.clientId?.substring(0, 10) + '...',  // 只显示部分 ID
  redirectUri: GOOGLE_CONFIG.redirectUri
}) 