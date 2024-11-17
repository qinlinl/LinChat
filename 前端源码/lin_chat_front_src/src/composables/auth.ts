const TokenKey = 'token'
const UserIdKey = 'userId' // 修改变量名以避免混淆
const AvatarKey = 'avatar'
const NameKey = 'username'
const EmailKey = 'email'
// 获取token和userid
export function getUserInfo() {
  const token = sessionStorage.getItem(TokenKey)
  const userId = sessionStorage.getItem(UserIdKey)
  const avatar = sessionStorage.getItem(AvatarKey) // 修改为 UserIdKey
  const username = sessionStorage.getItem(NameKey)
  const email = sessionStorage.getItem(EmailKey)
  return { token, userId, avatar, username, email } // 返回对象
}

// 设置token和userid
export function setUserInfo(
  token: string,
  userId: string,
  avatar: string,
  username: string,
  email: string,
) {
  sessionStorage.setItem(TokenKey, token) // 使用 sessionStorage
  sessionStorage.setItem(UserIdKey, userId) // 使用 sessionStorage
  sessionStorage.setItem(AvatarKey, avatar)
  sessionStorage.setItem(NameKey, username)
  sessionStorage.setItem(EmailKey, email)
}

// 清除token和userid
export function removeUserInfo() {
  sessionStorage.removeItem(TokenKey)
  sessionStorage.removeItem(UserIdKey) // 修改为 UserIdKey
  sessionStorage.removeItem(AvatarKey)
  sessionStorage.removeItem(NameKey)
  sessionStorage.removeItem(EmailKey)
}
