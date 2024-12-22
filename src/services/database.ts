export interface DBUser {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface DBMailbox {
  id: string;
  userId: string;  // 关联用户
  email: string;
  provider: 'gmail' | 'outlook' | 'other';
  accessToken?: string;
  refreshToken?: string;
  capacity: number;
  enabled: boolean;
  status: 'Healthy' | 'Warning' | 'Urgent Issues';
  health: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DBLead {
  id: string;
  userId: string;  // 关联用户
  name: string;
  email: string;
  company: string;
  position?: string;
  status: string;
  source: string;
  lastContact?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class DatabaseService {
  private db: IDBDatabase | null = null;
  private initialized = false;
  private readonly DB_NAME = 'skyline_db';
  private readonly DB_VERSION = 1;  // 重置版本号为 1
  
  async init() {
    if (this.initialized) return;
    
    return new Promise<void>((resolve, reject) => {
      console.log('Initializing database...');
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      
      request.onerror = () => {
        console.error('Database error:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        console.log('Database opened successfully');
        this.db = request.result;
        this.initialized = true;
        resolve();
      };
      
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        console.log('Database upgrade needed');
        const db = (event.target as IDBOpenDBRequest).result;

        // 创建用户表
        if (!db.objectStoreNames.contains('users')) {
          console.log('Creating users store');
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('email', 'email', { unique: true });
        }

        // 创建邮箱表
        if (!db.objectStoreNames.contains('mailboxes')) {
          console.log('Creating mailboxes store');
          const mailboxStore = db.createObjectStore('mailboxes', { keyPath: 'id' });
          mailboxStore.createIndex('userId', 'userId', { unique: false });
          mailboxStore.createIndex('email', 'email', { unique: false });
        }

        // 创建线索表
        if (!db.objectStoreNames.contains('leads')) {
          console.log('Creating leads store');
          const leadStore = db.createObjectStore('leads', { keyPath: 'id' });
          leadStore.createIndex('userId', 'userId', { unique: false });
          leadStore.createIndex('email', 'email', { unique: false });
        }
      };
    });
  }

  // 在使用数据库前检查表是否存在
  private checkStore(storeName: string): boolean {
    if (!this.db) return false;
    return this.db.objectStoreNames.contains(storeName);
  }

  // 修改 ensureInitialized 方法
  private async ensureInitialized() {
    if (!this.initialized || !this.db) {
      await this.init();
    }
    // 验证所需的表是否都存在
    const requiredStores = ['users', 'mailboxes', 'leads'];
    const missingStores = requiredStores.filter(store => !this.checkStore(store));
    if (missingStores.length > 0) {
      throw new Error(`Missing required stores: ${missingStores.join(', ')}`);
    }
  }

  // Mailbox 相关方法
  async addMailbox(mailbox: DBMailbox): Promise<void> {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction('mailboxes', 'readwrite');
      const store = transaction.objectStore('mailboxes');
      const request = store.add(mailbox);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getMailboxesByUserId(userId: string): Promise<DBMailbox[]> {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction('mailboxes', 'readonly');
      const store = transaction.objectStore('mailboxes');
      const index = store.index('userId');
      const request = index.getAll(userId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Lead 相关方法
  async addLead(lead: DBLead): Promise<void> {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction('leads', 'readwrite');
      const store = transaction.objectStore('leads');
      const request = store.add(lead);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getLeadsByUserId(userId: string): Promise<DBLead[]> {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction('leads', 'readonly');
      const store = transaction.objectStore('leads');
      const index = store.index('userId');
      const request = index.getAll(userId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 用户相关方法
  async addUser(user: DBUser): Promise<void> {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction('users', 'readwrite');
      const store = transaction.objectStore('users');
      const request = store.add(user);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async findUserByEmail(email: string): Promise<DBUser | null> {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction('users', 'readonly');
      const store = transaction.objectStore('users');
      const index = store.index('email');
      const request = index.get(email);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // Mailbox 更多方法
  async updateMailbox(mailbox: DBMailbox): Promise<void> {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction('mailboxes', 'readwrite');
      const store = transaction.objectStore('mailboxes');
      const request = store.put(mailbox);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteMailbox(id: string): Promise<void> {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction('mailboxes', 'readwrite');
      const store = transaction.objectStore('mailboxes');
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Lead 更多方法
  async updateLead(lead: DBLead): Promise<void> {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction('leads', 'readwrite');
      const store = transaction.objectStore('leads');
      const request = store.put(lead);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteLead(id: string): Promise<void> {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction('leads', 'readwrite');
      const store = transaction.objectStore('leads');
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async findLeadByEmail(email: string): Promise<DBLead | null> {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction('leads', 'readonly');
      const store = transaction.objectStore('leads');
      const index = store.index('email');
      const request = index.get(email);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // ... 其他现有方法保持不变 ...
} 