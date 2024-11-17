<script setup lang="ts" name="Home">
import { ref, onMounted, provide, onBeforeUnmount } from 'vue'
import { getUserInfo } from '@/composables/auth'
import { useRouter, RouterView } from 'vue-router'
import Nav from '@/components/Nav.vue'
// import { connectWebSocket, sendWebSocketMessage } from '@/WebSocket'
const router = useRouter()
const userinfo = getUserInfo()

// WebSocket 连接和提供
const websocket = ref<WebSocket | null>(null)
// 创建 WebSocket 连接并设置处理程序
function connectWebSocket() {
  const wsUrl = `/ws?userId=${userinfo.userId}`

  websocket.value = new WebSocket(wsUrl)

  websocket.value.onopen = () => {
    console.log('WebSocket 连接已打开')
  }

  websocket.value.onmessage = event => {
    const messageData = JSON.parse(event.data)
    console.log('收到消息:', messageData)
    // 在此处添加对消息的处理逻辑
  }

  websocket.value.onerror = error => {
    console.error('WebSocket 连接出错:', error)
  }

  websocket.value.onclose = () => {
    console.log('WebSocket 连接已关闭')
    // 这里可以选择重连或其他处理
  }
}

// 向子组件提供 WebSocket 实例
provide('websocket', websocket)

// 在组件挂载时连接 WebSocket 并导航到好友页面
onMounted(() => {
  connectWebSocket()
  router.push({ path: '/friends' })
})

// 组件卸载前关闭 WebSocket 连接
onBeforeUnmount(() => {
  if (websocket.value) {
    websocket.value.close() // 确保关闭 WebSocket 连接
    websocket.value = null // 清除引用
  }
})
</script>

<template>
  <div class="home">
    <el-container height="100%">
      <el-aside width="100px">
        <Nav></Nav>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<style>
.home {
  width: 90vw;
  height: 90vh;
  background-color: #272a37;
  border-radius: 15px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
