import { getUserInfo } from '@/composables/auth'
let websocket: WebSocket | null = null

export function connectWebSocket() {
  const { userId } = getUserInfo()
  websocket = new WebSocket(`/ws?userId=${userId}`)

  websocket.onopen = () => {
    console.log('WebSocket 连接已打开')
  }

  websocket.onmessage = event => {
    const messageData = JSON.parse(event.data)
    console.log('收到消息:', messageData)
    // 处理接收到的数据，例如更新状态或触发应用程序中的动作。
  }

  websocket.onerror = error => {
    console.error('WebSocket 连接出错:', error)
  }

  websocket.onclose = () => {
    console.log('WebSocket 连接已关闭')
    // 可以在此处尝试重新连接或处理断开连接的情况。
  }
}

export function sendWebSocketMessage(message: any) {
  if (websocket && websocket.readyState === WebSocket.OPEN) {
    websocket.send(JSON.stringify(message))
  } else {
    console.warn('WebSocket 未打开，无法发送消息。')
  }
}

export function closeWebSocket() {
  if (websocket) {
    websocket.close()
    websocket = null
  }
}
