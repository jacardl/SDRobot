export default {
  nav: {
    dashboard: 'Dashboard',
    chat: 'Chat with JJ',
    integrations: 'Integrations',
    leads: 'Leads',
    outbound: 'Outbound',
    inbox: 'Inbox',
    campaigns: 'Campaigns',
    pendingApproval: 'Pending Approval',
    mailboxes: 'Mailboxes',
    analytics: 'Analytics'
  },
  toolbar: {
    help: 'Help Center',
    settings: 'Settings',
    language: 'Language',
    greeting: 'Hey there 👋',
    askMe: 'Ask me anything!',
    monthlyTarget: 'Monthly Target',
    emailsInQueue: 'Emails In Queue'
  },
  dashboard: {
    emailsPending: 'Emails Pending Approval',
    analytics: 'Analytics',
    past30Days: 'Past 30 Days',
    past7Days: 'Past 7 Days',
    past90Days: 'Past 90 Days',
    responses: 'Responses',
    leadsEnrolled: 'Leads Enrolled in Workflow',
    emailsSent: 'Emails Sent',
    mailboxHealth: 'Mailbox Health',
    healthScore: 'Health Score',
    emailCapacity: 'Total Email Capacity Per Day',
    capacityHint: 'Consider adding more mailboxes, or wait for the health of your existing mailboxes to improve to increase limits.',
    capacityDescription: 'This is the current total sending capacity of all linked mailboxes.',
    dayStreak: '{days} Day Streak',
    streakHint: 'Approve emails every day to boost your streak!',
    responseRate: 'Lead Response Rate',
    responseRateUhOh: 'Uh Oh!',
    responseRateGood: 'Very Good'
  },
  account: {
    profile: 'Profile',
    settings: 'Account Settings',
    logout: 'Logout'
  },
  auth: {
    signIn: 'Sign in to your account',
    signUp: 'Create a new account',
    or: 'Or',
    createAccount: 'create a new account',
    emailAddress: 'Email address',
    password: 'Password',
    signingIn: 'Signing in...',
    signInButton: 'Sign in',
    signUpButton: 'Sign up',
    invalidCredentials: 'Invalid email or password',
    emailExists: 'Email already exists',
    creatingAccount: 'Creating account...',
    signupFailed: 'Failed to create account',
    alreadyHaveAccount: 'Already have an account?'
  },
  oauth: {
    connecting: 'Connecting your Gmail account...',
    invalidState: 'Invalid authentication state',
    noCode: 'No authorization code received',
    success: 'Successfully connected',
    error: 'Failed to connect account'
  },
  chat: {
    placeholder: 'Type your message...',
    send: 'Send',
    networkError: 'Network error. Please check your connection and try again.',
    typing: 'AI is typing...',
    retry: 'Retry',
    stop: 'Stop'
  },
  leads: {
    search: 'Search leads...',
    noResults: 'No leads found',
    status: {
      new: 'New',
      contacted: 'Contacted',
      engaged: 'Engaged',
      qualified: 'Qualified',
      nurturing: 'Nurturing',
      negotiating: 'Negotiating',
      closed: 'Closed',
      active: 'Active',
      inactive: 'Inactive'
    },
    actions: {
      selectAll: 'Select all',
      export: 'Export',
      delete: 'Delete',
      edit: 'Edit'
    },
    fields: {
      name: 'Name',
      stage: 'Workflow Stage',
      company: 'Company',
      engaged: 'Engaged',
      lastContact: 'Last Contact',
      position: 'Position'
    },
    pagination: {
      showing: 'Showing {start} to {end} of {total} results',
      previous: 'Previous',
      next: 'Next'
    },
    workflow: {
      title: 'Workflow Stage',
      stages: {
        new: 'New',
        contacted: 'Contacted',
        engaged: 'Engaged',
        qualified: 'Qualified',
        nurturing: 'Nurturing',
        negotiating: 'Negotiating',
        closed: 'Closed'
      }
    },
    table: {
      email: 'Email',
      position: 'Position'
    }
  },
  leadDetail: {
    tabs: {
      overview: 'Overview',
      activity: 'Activity',
      emails: 'Emails',
      notes: 'Notes'
    },
    fields: {
      company: 'Company',
      position: 'Position',
      email: 'Email',
      phone: 'Phone',
      location: 'Location',
      source: 'Source',
      status: 'Status',
      assignedTo: 'Assigned To',
      lastContact: 'Last Contact',
      tags: 'Tags'
    },
    actions: {
      edit: 'Edit',
      delete: 'Delete',
      addNote: 'Add Note',
      sendEmail: 'Send Email'
    }
  },
  integrations: {
    title: 'Integrations',
    description: 'Import data to and export data from Artisan.',
    configuration: {
      title: 'Configuration',
      syncFrequency: 'Sync Frequency',
      leadStatusMapping: 'Lead Status Mapping',
      frequencies: {
        realtime: 'Real-time',
        hourly: 'Every hour',
        daily: 'Every day',
        weekly: 'Every week'
      },
      statuses: {
        newLead: 'New Lead',
        contacted: 'Contacted',
        qualified: 'Qualified'
      },
      options: {
        new: 'New',
        open: 'Open',
        inProgress: 'In Progress',
        qualified: 'Qualified'
      }
    },
    actions: {
      cancel: 'Cancel',
      save: 'Save',
      close: 'Close panel'
    }
  },
  inbox: {
    title: 'Inbox',
    description: 'Conversations from all of your connected email accounts.',
    search: 'Search by name, company or email...',
    status: {
      engaged: 'Engaged',
      sent: 'Sent',
      pending: 'Pending'
    },
    noContact: {
      title: 'No contact selected',
      description: 'Select a contact to view conversation history'
    },
    actions: {
      refresh: 'Refresh',
      reply: 'Reply',
      cancel: 'Cancel',
      send: 'Send Reply'
    },
    placeholders: {
      reply: 'Type your reply...'
    },
    labels: {
      via: 'Via',
      sequence: 'Sequence'
    }
  },
  mailboxes: {
    title: 'Mailbox Connected',
    description: 'JJ will dynamically rotate between your mailboxes, maximizing deliverability.',
    capacity: {
      title: 'Daily Email Capacity',
      description: 'The number of emails that can be sent from this mailbox per day'
    },
    health: {
      title: 'Mailbox Health',
      description: 'Overall health score based on deliverability and engagement metrics'
    },
    status: {
      title: 'Status',
      healthy: 'Healthy',
      warning: 'Warning',
      urgent: 'Urgent Issues'
    },
    actions: {
      add: 'Add Email Address',
      disconnect: 'Disconnect',
      retry: 'Retry',
      useMailbox: 'Use This Mailbox'
    },
    loading: 'Loading mailboxes...',
    noMailboxes: {
      title: 'No mailboxes',
      description: 'Get started by connecting your first mailbox.'
    },
    error: 'Failed to load mailboxes'
  }
} 