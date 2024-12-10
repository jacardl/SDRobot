import axios from 'axios'
import { GMAIL_CONFIG } from '@/config/gmail'

interface EmailOptions {
  to: string
  subject: string
  body: string
  from?: string
}

interface GoogleUserInfo {
  email: string
  name: string
  picture: string
}

export class MailboxService {
  private accessToken: string | null = null
  private email: string | null = null

  constructor() {
    // 从本地存储恢复凭证
    this.accessToken = localStorage.getItem('gmail_access_token')
    this.email = localStorage.getItem('gmail_email')
  }

  // 获取授权URL
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: GMAIL_CONFIG.clientId,
      redirect_uri: GMAIL_CONFIG.redirectUri,
      response_type: 'code',
      scope: GMAIL_CONFIG.scope,
      access_type: 'offline',
      prompt: 'consent'
    })

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  // 处理OAuth回调
  async handleCallback(code: string): Promise<void> {
    try {
      // 交换授权码获取访问令牌
      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: GMAIL_CONFIG.clientId,
        client_secret: GMAIL_CONFIG.clientSecret,
        redirect_uri: GMAIL_CONFIG.redirectUri,
        grant_type: 'authorization_code'
      })

      this.accessToken = tokenResponse.data.access_token

      // 获取用户邮箱信息
      const userInfo = await this.getUserInfo()
      this.email = userInfo.email

      // ���存凭证
      if (this.accessToken && this.email && tokenResponse.data.refresh_token) {
        localStorage.setItem('gmail_access_token', this.accessToken)
        localStorage.setItem('gmail_email', this.email)
        localStorage.setItem('gmail_refresh_token', tokenResponse.data.refresh_token)
      }
    } catch (error) {
      console.error('Failed to handle OAuth callback:', error)
      throw error
    }
  }

  // 获取用户信息
  private async getUserInfo(): Promise<GoogleUserInfo> {
    if (!this.accessToken) throw new Error('Not authenticated')

    const response = await axios.get<GoogleUserInfo>('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    })

    return response.data
  }

  // 发送邮件
  async sendEmail(options: EmailOptions): Promise<void> {
    if (!this.accessToken) throw new Error('Not authenticated')

    const message = [
      `From: ${options.from || this.email}`,
      `To: ${options.to}`,
      `Subject: ${options.subject}`,
      '',
      options.body
    ].join('\n')

    // 使用 TextEncoder 替代 Buffer
    const encoder = new TextEncoder()
    const data = encoder.encode(message)
    const encodedMessage = btoa(String.fromCharCode(...new Uint8Array(data)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    try {
      await axios.post(
        `https://www.googleapis.com/gmail/v1/users/me/messages/send`,
        { raw: encodedMessage },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )
    } catch (error) {
      console.error('Failed to send email:', error)
      throw error
    }
  }

  // 检查是否已认证
  isAuthenticated(): boolean {
    return !!this.accessToken && !!this.email
  }

  // 获取当前邮箱
  getCurrentEmail(): string | null {
    return this.email
  }

  // 断开连接
  disconnect(): void {
    this.accessToken = null
    this.email = null
    localStorage.removeItem('gmail_access_token')
    localStorage.removeItem('gmail_email')
    localStorage.removeItem('gmail_refresh_token')
  }
}

export const mailboxService = new MailboxService() 