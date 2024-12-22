export const hashPassword = async (password: string): Promise<string> => {
  // 使用一个简单但一致的哈希方法
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

// 添加密码验证方法
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const inputHash = await hashPassword(password);
  return inputHash === hashedPassword;
}