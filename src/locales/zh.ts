export default {
  nav: {
    dashboard: '仪表盘',
    chat: '智能助手',
    integrations: '集成',
    leads: '线索',
    outbound: '外联',
    inbox: '收件箱',
    campaigns: '营销活动',
    pendingApproval: '待审批',
    mailboxes: '邮箱',
    analytics: '数据分析'
  },
  toolbar: {
    help: '帮助中心',
    settings: '设置',
    language: '语言',
    greeting: '你好 👋',
    askMe: '随便问！',
    monthlyTarget: '月度目标',
    emailsInQueue: '邮件队列'
  },
  dashboard: {
    emailsPending: '待审批邮件',
    analytics: '数据分析',
    past30Days: '近30天',
    past7Days: '近7天',
    past90Days: '近90天',
    responses: '回复数',
    leadsEnrolled: '工作流线索数',
    emailsSent: '已发送邮件',
    mailboxHealth: '邮箱健康度',
    healthScore: '健康分数',
    emailCapacity: '每日邮件容量',
    capacityHint: '考虑添加更多邮箱，或等待现有邮箱的健康度提升以增加限制。',
    capacityDescription: '这是当前所有关联邮箱的总发送容量。',
    dayStreak: '{days}天连续处理',
    streakHint: '每天处理邮件以提升连续天数！',
    responseRate: '线索响应率',
    responseRateUhOh: '糟糕！',
    responseRateGood: '非常好',
    veryGood: '非常好'
  },
  account: {
    profile: '个人资料',
    settings: '账户设置',
    logout: '退出登录'
  },
  auth: {
    signIn: '登录您的账户',
    signUp: '创建新账户',
    or: '或者',
    createAccount: '创建新账户',
    emailAddress: '邮箱地址',
    password: '密码',
    signingIn: '登录中...',
    signInButton: '登录',
    signUpButton: '注册',
    invalidCredentials: '邮箱或密码错误',
    emailExists: '邮箱已存在',
    creatingAccount: '创建账户中...',
    signupFailed: '创建账户失败',
    alreadyHaveAccount: '已有账户？'
  },
  oauth: {
    connecting: '正在连接您的 Gmail 账户...',
    invalidState: '无效的认证状态',
    noCode: '未收到授权码',
    success: '连接成功',
    error: '账户连接失败'
  },
  chat: {
    placeholder: '输入您的消息...',
    send: '发送',
    networkError: '网络错误，请检查网络连接后重试。',
    typing: 'AI 正在输入...',
    retry: '重试',
    stop: '停止'
  },
  leads: {
    search: '搜索线索...',
    noResults: '未找到线索',
    status: {
      new: '新线索',
      contacted: '已联系',
      engaged: '已回应',
      qualified: '已确认',
      nurturing: '培育中',
      negotiating: '谈判中',
      closed: '已关闭',
      active: '活跃',
      inactive: '不活跃'
    },
    actions: {
      selectAll: '全选',
      export: '导出',
      delete: '删除',
      edit: '编辑',
      add: '添加线索'
    },
    fields: {
      name: '姓名',
      stage: '工作流阶段',
      company: '公司',
      engaged: '互动状态',
      lastContact: '最后联系',
      position: '职位'
    },
    pagination: {
      showing: '显示第 {start} 至 {end} 条，共 {total} 条',
      previous: '上一页',
      next: '下一页'
    },
    workflow: {
      title: '工作流阶段',
      stages: {
        new: '新线索',
        contacted: '已联系',
        engaged: '已回应',
        qualified: '已确认',
        nurturing: '培育中',
        negotiating: '谈判中',
        closed: '已关闭'
      }
    },
    table: {
      email: '邮箱',
      position: '职位'
    }
  },
  leadDetail: {
    tabs: {
      overview: '概览',
      activity: '活动',
      emails: '邮件',
      notes: '笔记'
    },
    fields: {
      company: '公司',
      position: '职位',
      email: '邮箱',
      phone: '电话',
      location: '地点',
      source: '来源',
      status: '状态',
      assignedTo: '负责人',
      lastContact: '最后联系',
      tags: '标签'
    },
    actions: {
      edit: '编辑',
      delete: '删除',
      addNote: '添加笔记',
      sendEmail: '发送邮件'
    }
  },
  integrations: {
    title: '集成',
    description: '导入和导出 Artisan 数据。',
    configuration: {
      title: '配置',
      syncFrequency: '同步频率',
      leadStatusMapping: '线索状态映射',
      frequencies: {
        realtime: '实时',
        hourly: '每小时',
        daily: '每天',
        weekly: '每周'
      },
      statuses: {
        newLead: '新线索',
        contacted: '已联系',
        qualified: '已确认'
      },
      options: {
        new: '新建',
        open: '开放',
        inProgress: '进行中',
        qualified: '已确认'
      }
    },
    actions: {
      cancel: '取消',
      save: '保存',
      close: '关闭面板'
    }
  },
  inbox: {
    title: '收件箱',
    description: '来自所有已连接邮箱账户的对话。',
    search: '按姓名、公司或邮箱搜索...',
    status: {
      engaged: '已互动',
      sent: '已发送',
      pending: '待处理'
    },
    noContact: {
      title: '未选择联系人',
      description: '选择一个联系人以查看对话历史'
    },
    actions: {
      refresh: '刷新',
      reply: '回复',
      cancel: '取消',
      send: '发送回复'
    },
    placeholders: {
      reply: '输入回复内容...'
    },
    labels: {
      via: '通过',
      sequence: '序列'
    }
  },
  mailboxes: {
    title: '已连接邮箱',
    description: 'JJ 将在您的邮箱之间动态轮换，最大化发送效率。',
    capacity: {
      title: '每日邮件容量',
      description: '此邮箱每天可发送的邮件数量'
    },
    health: {
      title: '邮箱健康度',
      description: '基于发送效果和互动指标的整体健康评分'
    },
    status: {
      title: '状态',
      healthy: '健康',
      warning: '警告',
      urgent: '严重问题'
    },
    actions: {
      add: '添加邮箱',
      cancel: '取消',
      login: '登录',
      disconnect: '断开连接',
      retry: '重试',
      useMailbox: '使用此邮箱'
    },
    loading: '正在加载邮箱...',
    noMailboxes: {
      title: '暂无邮箱',
      description: '从连接您的第一个邮箱开始。'
    },
    error: '加载邮箱失败'
  }
} 