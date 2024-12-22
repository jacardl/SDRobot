import { defineStore } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import type { User, LoginCredentials, SignupCredentials } from '@/types/auth'
import { DatabaseService, type DBUser } from '../services/database'
import { hashPassword, verifyPassword } from '../utils/crypto'

// 添加一个生成 UUID 的函数
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const useAuthStore = defineStore('auth', () => {
  const db = new DatabaseService()
  // 从 localStorage 初始化状态
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref<string | null>(localStorage.getItem('token'))
  
  const isAuthenticated = computed(() => !!token.value)

  // 登录
  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('Login attempt:', credentials.email);
      const existingUser = await db.findUserByEmail(credentials.email);
      
      if (!existingUser) {
        console.log('User not found');
        throw new Error('Invalid email or password');
      }
      
      console.log('Found user:', existingUser);
      console.log('Stored hash:', existingUser.password);
      
      // 生成输入密码的哈希
      const inputHash = await hashPassword(credentials.password);
      console.log('Input hash:', inputHash);
      
      // 比较哈希值
      if (inputHash !== existingUser.password) {
        console.log('Password mismatch');
        throw new Error('Invalid email or password');
      }

      // 更新登录时间
      existingUser.lastLoginAt = new Date();
      
      // 创建用户会话数据
      const userData: User = {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        createdAt: existingUser.createdAt,
        lastLoginAt: existingUser.lastLoginAt
      };
      
      // 保存到 store 和 localStorage
      user.value = userData;
      token.value = 'session_token';
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token.value);
      
      console.log('Login successful');
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // 注册
  const signup = async (credentials: SignupCredentials) => {
    try {
      // 确保数据库已初始化
      await db.init()

      // 检查邮箱是否已存在
      const existingUser = await db.findUserByEmail(credentials.email)
      if (existingUser) {
        throw new Error('Email already exists')
      }

      // 创建新用户
      const newUser: DBUser = {
        id: generateUUID(),
        email: credentials.email,
        password: await hashPassword(credentials.password),
        name: credentials.name || credentials.email.split('@')[0],
        createdAt: new Date(),
        lastLoginAt: new Date()
      }

      // 保存到数据库
      await db.addUser(newUser)

      // 自动登录
      return login(credentials)
    } catch (error) {
      console.error('Signup failed:', error)
      throw error
    }
  }

  // 登出
  const logout = () => {
    user.value = null
    token.value = null
    // 清除 localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  // 检查认证状态
  const checkAuth = () => {
    return isAuthenticated.value
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    signup,
    logout,
    checkAuth
  }
}) 