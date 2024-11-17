// src/stores/useUserStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
type User = {
  avatar: string
  email: string
  tokens: string
  userId: string
  username: string
}
export const useUserStore = defineStore('user', {
  state: () => ({
    avatar: '',
    email: '',
    username: '',
    tokens: '',
    userId: '',
  }),
  actions: {
    setUserData(data: User) {
      this.avatar = data.avatar
      this.email = data.email
      this.tokens = data.tokens
      this.userId = data.userId
      this.username = data.username
    },
    clearUserData() {
      this.avatar = ''
      this.email = ''
      this.tokens = ''
      this.userId = ''
      this.username = ''
    },
  },
})
export const useStore = defineStore('main', () => {
  // 定义 friends 和 groups 的状态
  const friends = ref([])
  const groups = ref([])

  // 返回 store 数据
  return { friends, groups }
})
