import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import axios from 'axios'
import { GOOGLE_CONFIG } from '@/config/google'

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

export interface Mailbox {
  email: string;
  capacity: number;
  enabled: boolean;
  status: 'Urgent Issues' | 'Warning' | 'Healthy';
  health: number;
  statusChecks: {
    spf: boolean;
    dmarc: boolean;
    dkim: boolean;
    rdns: boolean;
    aRecord: boolean;
    mxRecord: boolean;
  };
  provider?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface GmailMailbox extends Mailbox {
  provider: 'gmail';
  accessToken: string;
  refreshToken: string;
}

const mailboxes: Mailbox[] = [
  {
    email: 'jaspar@Skyline.com',
    capacity: 75,
    enabled: true,
    status: 'Urgent Issues',
    health: 60,
    statusChecks: {
      spf: false,
      dmarc: false,
      dkim: true,
      rdns: true,
      aRecord: true,
      mxRecord: true
    }
  },
  {
    email: 'jasparcarjack@Skyline.com',
    capacity: 70,
    enabled: true,
    status: 'Warning',
    health: 75,
    statusChecks: {
      spf: true,
      dmarc: false,
      dkim: true,
      rdns: true,
      aRecord: true,
      mxRecord: true
    }
  },
  {
    email: 'jasparcj@Skyline.com',
    capacity: 75,
    enabled: true,
    status: 'Healthy',
    health: 90,
    statusChecks: {
      spf: true,
      dmarc: true,
      dkim: true,
      rdns: true,
      aRecord: true,
      mxRecord: true
    }
  }
]

// 添加发送邮件的接口
interface GmailSendOptions {
  to: string;
  subject: string;
  content: string;
  from?: string;
  threadId?: string;
}

interface GmailAuthResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export class MailboxService {
  private readonly CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
  private readonly REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI
  private accessToken: string | null = null
  private email: string | null = null

  constructor() {
    this.accessToken = localStorage.getItem('gmail_access_token')
    this.email = localStorage.getItem('gmail_email')
  }

  // 获取 Gmail 授权 URL
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.CLIENT_ID,
      redirect_uri: this.REDIRECT_URI,
      response_type: 'code',
      scope: [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ].join(' '),
      access_type: 'offline',
      prompt: 'consent'
    })

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  // 获取 Gmail 授权链接
  getGmailAuthUrl(): string {
    // 生成并保存状态
    const state = crypto.randomUUID()
    localStorage.setItem('gmail_auth_state', state)
    
    const params = new URLSearchParams({
      client_id: GOOGLE_CONFIG.clientId,
      redirect_uri: GOOGLE_CONFIG.redirectUri,
      response_type: 'code',
      scope: GOOGLE_CONFIG.scopes.join(' '),
      access_type: 'offline',
      prompt: 'consent',
      include_granted_scopes: 'true',
      state,
    })

    return `${GOOGLE_CONFIG.authUrl}?${params.toString()}`
  }

  // 处理 Gmail 授权回调
  async handleGmailCallback(code: string) {
    try {
      // 交换授权码获取令牌
      const tokenResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/gmail/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
      
      if (!tokenResponse.ok) throw new Error('Failed to get token')
      const tokens = await tokenResponse.json()

      // 获取用户信息
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` }
      })
      
      if (!userResponse.ok) throw new Error('Failed to get user info')
      const userInfo = await userResponse.json()

      // 返回邮箱信息
      return {
        email: userInfo.email,
        provider: 'gmail',
        capacity: 100,
        enabled: true,
        status: 'Healthy' as const,
        health: 100,
        statusChecks: {
          spf: true,
          dmarc: true,
          dkim: true,
          rdns: true,
          aRecord: true,
          mxRecord: true
        },
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token
      }
    } catch (error) {
      console.error('Gmail auth error:', error)
      throw error
    }
  }

  // 获取 Gmail 邮件列表
  async getGmailMessages(mailbox: any) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/gmail/messages`, {
        headers: {
          'Authorization': `Bearer ${mailbox.accessToken}`
        }
      })
      
      if (!response.ok) throw new Error('Failed to fetch messages')
      
      const data = await response.json()
      return data.messages
    } catch (error) {
      console.error('Error fetching Gmail messages:', error)
      return []
    }
  }

  // 发送邮件
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/gmail/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: JSON.stringify(options)
      })
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

  getMailboxes() {
    return mailboxes
  }
  
  addMailbox(mailbox: Mailbox | GmailMailbox) {
    mailboxes.push(mailbox as Mailbox)
  }
  
  removeMailbox(email: string) {
    const index = mailboxes.findIndex(m => m.email === email)
    if (index !== -1) {
      mailboxes.splice(index, 1)
    }
  }
  
  updateMailbox(email: string, updates: Partial<Mailbox>) {
    const mailbox = mailboxes.find(m => m.email === email)
    if (mailbox) {
      Object.assign(mailbox, updates)
    }
  }

  // 同步 Gmail 邮件
  async syncGmailMessages(mailbox: any) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/gmail/sync`, {
        headers: {
          Authorization: `Bearer ${mailbox.accessToken}`
        }
      })
      
      if (!response.ok) throw new Error('Failed to sync messages')
      
      return await response.json()
    } catch (error) {
      console.error('Gmail sync error:', error)
      throw error
    }
  }

  // 发送 Gmail 邮件
  async sendGmailMessage(mailbox: GmailMailbox, options: GmailSendOptions) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/gmail/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mailbox.accessToken}`
        },
        body: JSON.stringify({
          to: options.to,
          subject: options.subject,
          content: options.content,
          from: options.from || mailbox.email,
          threadId: options.threadId
        })
      })

      if (!response.ok) throw new Error('Failed to send email')
      return await response.json()
    } catch (error) {
      console.error('Send Gmail error:', error)
      throw error
    }
  }

  // 获取 Gmail 邮件详情
  async getGmailMessageDetail(mailbox: GmailMailbox, messageId: string) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/gmail/messages/${messageId}`,
        {
          headers: {
            'Authorization': `Bearer ${mailbox.accessToken}`
          }
        }
      )

      if (!response.ok) throw new Error('Failed to fetch message detail')
      return await response.json()
    } catch (error) {
      console.error('Get Gmail message error:', error)
      throw error
    }
  }

  // 标记邮件已读
  async markGmailMessageRead(mailbox: GmailMailbox, messageId: string) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/gmail/messages/${messageId}/read`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${mailbox.accessToken}`
          }
        }
      )

      if (!response.ok) throw new Error('Failed to mark message as read')
      return await response.json()
    } catch (error) {
      console.error('Mark Gmail message read error:', error)
      throw error
    }
  }

  // 获取邮件会话
  async getGmailThread(mailbox: GmailMailbox, threadId: string) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/gmail/threads/${threadId}`,
        {
          headers: {
            'Authorization': `Bearer ${mailbox.accessToken}`
          }
        }
      )

      if (!response.ok) throw new Error('Failed to fetch thread')
      return await response.json()
    } catch (error) {
      console.error('Get Gmail thread error:', error)
      throw error
    }
  }

  private saveTokens(email: string, tokens: GmailAuthResponse) {
    localStorage.setItem(`gmail_token_${email}`, JSON.stringify({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + tokens.expires_in * 1000
    }))
  }

  private async refreshTokenIfNeeded(mailbox: GmailMailbox) {
    const tokenData = JSON.parse(localStorage.getItem(`gmail_token_${mailbox.email}`) || '{}')
    if (Date.now() >= tokenData.expiresAt) {
      // 刷新令牌
      const newTokens = await this.refreshAccessToken(mailbox.refreshToken)
      this.saveTokens(mailbox.email, newTokens)
      return newTokens.access_token
    }
    return mailbox.accessToken
  }

  private async refreshAccessToken(refreshToken: string): Promise<GmailAuthResponse> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/gmail/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken })
    })

    if (!response.ok) throw new Error('Failed to refresh token')
    return response.json()
  }
}

export const mailboxService = new MailboxService() 