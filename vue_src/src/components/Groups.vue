<script setup lang="ts" name="Groups">
import {
  ref,
  onMounted,
  onBeforeUnmount,
  reactive,
  computed,
  watch,
  inject,
  Ref,
  nextTick,
} from 'vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import {
  feiendsList,
  groupsList,
  readmsg,
  addGroup,
  createGroup,
  uploadFile,
} from '@/api/manager'
import { getUserInfo } from '@/composables/auth'
import { SendOne, Newlybuild } from '@icon-park/vue-next'
const userinfo = getUserInfo()
const friends = ref([]) // 好友列表
const groups = ref([]) // 群列表
const selectedGroup = ref(false) // 当前选中的群聊
const searchQuery = ref('') // 搜索框的内容
const websocket = inject<Ref<WebSocket | null>>('websocket') //从父组件获取连接对象

// 获取好友列表
async function fetchFriendsList() {
  try {
    const fresponse = await feiendsList()
    if (fresponse.Code === 0 && fresponse.Rows) {
      friends.value = fresponse.Rows
    } else {
      console.error('获取好友列表失败:', fresponse.Msg)
    }
  } catch (error) {
    console.error('请求出错:', error)
  }
}
//获取群列表
async function fetchGroupsList() {
  try {
    const gfresponse = await groupsList()
    if (gfresponse.Code === 0 && gfresponse.Rows) {
      groups.value = gfresponse.Rows
    } else {
      console.error('获取群列表失败:', gfresponse.Msg)
    }
  } catch (error) {
    console.error('请求出错:', error)
  }
}
onMounted(async () => {
  await fetchFriendsList()
  await fetchGroupsList()

  if (websocket.value) {
    websocket.value.onmessage = handleIncomingMessage
  } else {
    console.warn('WebSocket 未连接')
  }
})

onBeforeUnmount(() => {
  if (websocket.value) {
    websocket.value.onmessage = null
  }
})

const groupId = ref()
const messages = ref([])

// 过滤群聊列表，根据搜索框内容进行筛选
const filteredGroups = computed(() => {
  return groups.value.filter(group =>
    group.Name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

// 选择群
function selectGroup(group: string) {
  selectedGroup.value = true
  const redmas = reactive({
    userIdA: group,
    userIdB: userinfo.userId,
    Type: 2,
    start: '0',
    end: '200',
    isRev: true,
  })
  groupId.value = group
  readmsg(redmas).then(res => {
    messages.value = res.Total.map(item => JSON.parse(item))
    console.log(messages.value)
    // scrollToBottom()
  })
}
// 格式化消息时间
function formatDate(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleString()
}
// 处理发送消息的逻辑
function sendMessage(content: string) {
  const newMessage = {
    TargetId: groupId.value,
    Type: 2,
    CreateTime: Date.now(),
    userId: Number(userinfo.userId),
    Media: 1,
    Content: content,
    SenderAvatar: userinfo.avatar,
    SenderName: userinfo.username,
  }
  messages.value.push(newMessage)
  if (websocket?.value && websocket.value.readyState === WebSocket.OPEN) {
    websocket.value.send(JSON.stringify(newMessage))
  } else {
    console.warn('WebSocket 未连接或未打开，无法发送消息')
  }
}

const messageContent = ref('')
function handleSendMessage() {
  if (messageContent.value.trim() !== '') {
    sendMessage(messageContent.value)
    messageContent.value = ''
  }
}

// 处理 WebSocket 收到的消息
function handleIncomingMessage(event: MessageEvent) {
  try {
    const incomingMessage = JSON.parse(event.data)
    if (
      incomingMessage.Type === 2 &&
      incomingMessage.userId === groupId.value
    ) {
      messages.value.push(incomingMessage)
    } else if (incomingMessage.Type === 2) {
      const sender = matchgroupss(incomingMessage.TargetId)
      const groupName = sender
        ? sender.Name
        : `未知群 (${incomingMessage.TargetId})`
      ElMessage({
        duration: 6000,
        showClose: true,
        message: `群：${groupName} 消息：${incomingMessage.Content}`,
        type: 'success',
      })
    } else {
      const sender = matchfriends(incomingMessage.userId)
      const senderName = sender
        ? sender.Name
        : `未知好友 (${incomingMessage.userId})`
      ElMessage({
        duration: 6000,
        showClose: true,
        message: `好友：${senderName} 消息：${incomingMessage.Content}`,
        type: 'warning',
      })
    }
    // scrollToBottom()
  } catch (error) {
    console.error('解析消息失败', error)
  }
}
function matchgroupss(fri) {
  return groups.value.find(group => group.ID === fri)
}
function matchfriends(fri) {
  return friends.value.find(friend => friend.UserID === fri)
}

const addfriendhandleClose = (done: () => void) => {
  ElMessageBox.confirm('你确定取消吗？')
    .then(() => {
      done()
      clearaddgroup()
    })
    .catch(() => {
      // catch error
    })
}
function clearaddgroup() {
  addGroupid.value = ''
}
const addgroup = () => {
  addGroup(addGroupid.value).then(res => {
    ElNotification({
      title: 'Success 成功',
      message: `成功加入群聊：${addGroupid.value}`,
      type: 'success',
      duration: 1500,
    })
  })
  setTimeout(() => {
    window.location.reload() // 刷新页面
  }, 1500) // 等待通知显示完毕再刷新页面
}
//创建群聊
const formLabelWidth = '140px'
const dialogcrreategroup = ref(false)
const formgroup = reactive({
  cate: '0',
  icon: '',
  name: '',
  desc: '',
})
function clearformgroup() {
  formgroup.cate = '0'
  formgroup.icon = ''
  formgroup.name = ''
  formgroup.desc = ''
}
function creategroup() {
  createGroup(formgroup).then(res => {
    ElNotification({
      title: 'Success 建群成功',
      message: `群名: ${formgroup.name}`,
      type: 'success',
      duration: 3000,
    })
  })
  clearformgroup()
  setTimeout(() => {
    window.location.reload() // 刷新页面
  }, 1500) // 等待通知显示完毕再刷新页面
}
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('你确定取消创建吗？')
    .then(() => {
      done()
      clearformgroup()
    })
    .catch(() => {
      // catch error
    })
}

const handleFileChange = file => {
  uploadFile(file.raw)
    .then(response => {
      if (response.Code === 0) {
        ElNotification({
          title: '成功',
          message: '群头像上传成功！',
          type: 'success',
          duration: 3000,
        })
      } else {
        ElNotification({
          title: '失败',
          message: response.Msg || '上传失败，请重试。',
          type: 'error',
          duration: 3000,
        })
      }
      formgroup.icon = response.Data
    })
    .catch(error => {
      ElNotification({
        title: '错误',
        message: '上传过程中出现错误，请检查网络。',
        type: 'error',
        duration: 3000,
      })
      console.error('Error uploading file:', error)
    })
}
const handleBeforeUpload = file => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('上传头像图片只能是 JPG/PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
  }

  return isImage && isLt2M
}

watch(
  messages,
  () => {
    console.log('messages变化了')
    scrollToBottomAfterRender()
  },
  { deep: true },
)

//滚动到底部
const scrollbar = ref<InstanceType<typeof ElScrollbar> | null>(null)
const scrollToBottom = () => {
  if (scrollbar.value) {
    const wrapElement = scrollbar.value.$el.querySelector(
      '.el-scrollbar__wrap',
    ) as HTMLElement
    if (wrapElement) {
      wrapElement.scrollTo({
        top: wrapElement.scrollHeight,
        behavior: 'smooth', // 使用平滑滚动
      })
    }
  }
}
// 在内容渲染完成后调用 scrollToBottom
const scrollToBottomAfterRender = async () => {
  await nextTick()
  scrollToBottom()
}
//加入或创建群聊对话框
const dialogopen = ref(false)
const addGroupid = ref()
const showCloseIcon = ref(false) //对话框红色叉叉
// 计算属性来动态控制按钮的背景颜色
const buttonStyle = computed(() => {
  return {
    backgroundColor: addGroupid.value ? '#6366f1' : '#aaa', // 根据输入框是否有内容改变颜色
    cursor: addGroupid.value ? 'pointer' : 'not-allowed', // 根据是否有内容改变鼠标指针样式
  }
})
const buttonStylecp = computed(() => {
  return {
    backgroundColor: formgroup.name ? '#6366f1' : '#aaa', // 根据输入框是否有内容改变颜色
    cursor: formgroup.name ? 'pointer' : 'not-allowed', // 根据是否有内容改变鼠标指针样式
  }
})
</script>

<template>
  <el-row>
    <!-- 左侧好友列表 -->
    <el-col :span="4">
      <div class="search-add-container">
        <el-input
          v-model="searchQuery"
          placeholder="搜索加入的群"
          clearable
          class="search-input"
        ></el-input>
        <el-dropdown placement="top-end">
          <newlybuild theme="outline" size="34" fill="#777988" />
          <template #dropdown>
            <el-dropdown-menu class="custom-dropdown-menu">
              <el-dropdown-item @click="dialogopen = true"
                >加入群聊</el-dropdown-item
              >
              <el-dropdown-item @click="dialogcrreategroup = true"
                >创建群聊</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="friend-list">
        <div class="friend-list-container">
          <template v-if="filteredGroups.length > 0">
            <div
              v-for="(group, index) in filteredGroups"
              :key="index"
              class="friend-item"
              @click="selectGroup(group.ID)"
              :style="{
                backgroundColor: groupId === group.ID ? '#6366f1' : '#323645',
              }"
            >
              <div class="friend-info">
                <el-avatar
                  :src="group.Image || 'default-avatar.png'"
                  size="50"
                ></el-avatar>
                <h3 class="friend-name">{{ group.Name }}</h3>
              </div>
            </div>
          </template>
          <template v-else>
            <p class="no-friend-found">没有群聊</p>
          </template>
        </div>
      </div>
    </el-col>

    <!-- 右侧聊天框 -->
    <el-col :span="20">
      <div class="chat-container">
        <div v-if="selectedGroup">
          <h2>{{ matchgroupss(groupId)?.Name }}</h2>
          <div class="message-area">
            <el-scrollbar ref="scrollbar" max-height="450px">
              <div
                v-for="(message, index) in messages"
                :key="index"
                :class="{
                  'message-left': message.userId != userinfo.userId,
                  'message-right': message.userId == userinfo.userId,
                }"
                class="message-item"
              >
                <!-- 发出者头像 -->
                <div class="avatar-wrapper">
                  <el-avatar
                    :src="message.SenderAvatar || 'default-avatar.png'"
                    size="40"
                    class="avatar"
                  ></el-avatar>
                  <!-- 显示发出者的名字 -->
                  <div class="sender-name">{{ message.SenderName }}</div>
                </div>

                <!-- 消息内容 -->
                <div class="message-content">
                  <p class="message-text">{{ message.Content }}</p>
                  <small class="message-time">{{
                    formatDate(message.CreateTime)
                  }}</small>
                </div>
              </div>
            </el-scrollbar>

            <div class="input-container">
              <el-input
                v-model="messageContent"
                placeholder="请输入消息"
                @keyup.enter="handleSendMessage"
                class="message-input"
              />
              <send-one
                class="send-icon"
                theme="outline"
                size="32"
                :fill="messageContent ? '#6366f1' : '#777988'"
                @click="handleSendMessage"
              />
            </div>
          </div>
        </div>
        <div v-else class="chat-box-placeholder">请选择群聊开始聊天</div>
      </div>
    </el-col>
  </el-row>
  <!-- 加群对话框 -->
  <div v-if="dialogopen" class="dialog-overlay">
    <div class="custom-dialog" @click.stop>
      <div class="dialog-header">
        <div class="close-buttons">
          <div
            class="circle circle-red"
            @mouseover="showCloseIcon = true"
            @mouseleave="showCloseIcon = false"
            @click="
              (dialogopen = false), (showCloseIcon = false), clearaddgroup()
            "
          >
            <!-- Show cross inside the red circle on hover -->
            <span v-if="showCloseIcon" class="close-icon">×</span>
          </div>
          <div class="circle circle-yellow"></div>
          <div class="circle circle-green"></div>
        </div>
        <!-- Dialog Title -->
        <div class="dialog-title">
          <span>加入群聊</span>
        </div>
      </div>

      <!-- Dialog Content -->
      <div class="dialog-body">
        <el-form :model="addGroup">
          <el-input
            v-model="addGroupid"
            autocomplete="off"
            placeholder="请输入好友名称"
          />
        </el-form>
      </div>
      <!-- Dialog Footer -->
      <div class="dialog-footer">
        <button
          @click="(dialogopen = false), clearaddgroup()"
          class="cancel-button"
        >
          取消
        </button>
        <button
          @click="addgroup(), (dialogopen = false)"
          :style="buttonStyle"
          :disabled="!addGroupid"
          class="submit-button"
        >
          好了
        </button>
      </div>
    </div>
  </div>
  <!-- 创建群对话框 -->
  <div v-if="dialogcrreategroup" class="dialog-overlay">
    <div class="custom-dialog">
      <div class="dialog-header">
        <div class="close-buttons">
          <div
            class="circle circle-red"
            @mouseover="showCloseIcon = true"
            @mouseleave="showCloseIcon = false"
            @click="(dialogcrreategroup = false), (showCloseIcon = false)"
          >
            <!-- Show cross inside the red circle on hover -->
            <span v-if="showCloseIcon" class="close-icon">×</span>
          </div>
          <div class="circle circle-yellow"></div>
          <div class="circle circle-green"></div>
        </div>
        <!-- Custom Avatar Upload -->
        <div class="avatar-container">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :auto-upload="false"
            :before-upload="handleBeforeUpload"
            :on-change="handleFileChange"
          >
            <el-avatar :size="80" :src="formgroup.icon" />
          </el-upload>
          <div class="dialog-tips">
            <span>点击上传群头像</span>
          </div>
        </div>
      </div>

      <!-- Form Inputs -->
      <el-form :model="formgroup">
        <el-form-item label="群名" :label-width="formLabelWidth" prop="群名">
          <el-input
            v-model="formgroup.name"
            autocomplete="off"
            placeholder="请输入群名"
          />
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth" prop="type">
          <el-select v-model="formgroup.cate" placeholder="请选择一个类型">
            <el-option label="默认" value="0" />
            <el-option label="兴趣爱好" value="1" />
            <el-option label="行业交流" value="2" />
            <el-option label="生活休闲" value="3" />
            <el-option label="学习考试" value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth" prop="desc">
          <el-input v-model="formgroup.desc" autocomplete="off" />
        </el-form-item>
      </el-form>
      <!-- Dialog Footer -->
      <div class="dialog-footer">
        <button
          @click="(dialogcrreategroup = false), clearformgroup()"
          class="cancel-button"
        >
          取消
        </button>
        <button
          @click="creategroup(), (dialogcrreategroup = false)"
          :style="buttonStylecp"
          :disabled="!formgroup.name"
          class="submit-button"
        >
          好了
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.friend-list {
  height: 90vh;
  max-height: calc(100vh - 160px);
  display: flex;
  justify-content: center;
  padding-top: 10px;
}

.friend-list-container {
  width: 100%;
  max-width: 300px; /* 控制最大宽度 */
  background: rgba(255, 255, 255, 0.2); /* 背景透明 */
  backdrop-filter: blur(10px); /* 毛玻璃效果 */
  border-radius: 15px; /* 圆角 */
  padding: 20px;
  overflow-y: auto; /* 使内容可滚动 */
}
.friend-list-container::-webkit-scrollbar {
  width: 0; /* 不显示滚动条 */
  height: 0;
}
.friend-list-container::-webkit-scrollbar-track {
  background: transparent;
}

.friend-list-container::-webkit-scrollbar-thumb {
  background: transparent;
}

.friend-item {
  display: flex;
  align-items: center;
  justify-content: start;
  background-color: transparent;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* 鼠标悬停时 */
.friend-item:hover .friend-info {
  transform: scale(1.05); /* 放大效果 */
}

.friend-info {
  display: flex;
  align-items: center;
  gap: 10px; /* 头像和名字之间的间隔 */
  transition: transform 0.3s ease; /* 平滑的放大效果 */
}
/* 头像 */
.friend-info .el-avatar {
  flex-shrink: 0; /* 防止头像缩小 */
}
.friend-name {
  color: white; /* 字体颜色为白色 */
  margin: 0; /* 移除默认的外边距 */
  font-size: 14px;
  white-space: wrap; /* 禁止文本换行 */
  overflow: hidden; /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 显示省略号 */
  max-width: 100px; /* 限制名字最大宽度 */
  display: block; /* 使其为块级元素，便于设置宽度 */
}
.no-friend-found {
  text-align: center;
  color: #ccc;
  padding: 20px;
}
/* 聊天框*/
.chat-container {
  width: 97%;
  height: 98%;
  padding: 20px;
  margin-left: 20px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  display: flex;
  flex-direction: column;
}

.message-area {
  flex: 1;
  height: 75vh;
  overflow-y: auto;
  background: rgba(38, 42, 55, 0.8);
  backdrop-filter: blur(5px);
  border-radius: 15px;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column; /* Ensure the message area grows upwards */
}

.message-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.message-left {
  flex-direction: row;
}

.message-right {
  flex-direction: row-reverse;
}

.avatar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
}

.avatar {
  margin-bottom: 5px; /* 头像和名字之间的间距 */
}

.message-content {
  max-width: 50%; /* 控制消息内容的最大宽度 */
  padding: 10px;
  background-color: #323645;
  border-radius: 15px;
  color: white;
  word-wrap: break-word; /* 自动换行 */
  overflow-wrap: break-word; /* 确保单词过长时换行 */
}

.message-left .message-content {
  background-color: #444;
  border-radius: 15px 15px 15px 0;
}

.message-right .message-content {
  background-color: #90e150;
  border-radius: 15px 15px 0 15px;
}

.sender-name {
  font-size: 12px;
  color: white;
  text-align: center; /* 保证名字居中 */
  text-overflow: ellipsis; /* 显示省略号 */
  max-width: 100px; /* 限制名字最大宽度 */
}

.message-text {
  margin: 5px 0;
  font-size: 14px;
}

.message-time {
  font-size: 10px;
  color: #888;
  text-align: right;
}

.input-container {
  display: flex;
  align-items: center;
  margin-top: auto; /* Move the input container to the bottom */
}

.message-input {
  flex: 1;
  margin-right: 26px;
  border-radius: 15px;
}
.send-icon {
  margin-right: 25px;
}
.chat-box-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #888;
  font-size: 16px;
}
/* 对话框 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent overlay */
  z-index: 999; /* Behind the dialog but in front of other content */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Custom Dialog Box */
.custom-dialog {
  position: relative;
  width: 500px;
  background-color: #343434;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  z-index: 1000; /* Make sure the dialog is in front */
}

/* Dialog Header */
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  position: relative;
}

/* Dialog Title */
.dialog-title {
  font-size: 18px;
  color: white;
  text-align: center; /* Center the title text */
  flex-grow: 1; /* Allow title to take the remaining space */
}

/* Close Buttons (Red, Yellow, Green Circles) */
.close-buttons {
  display: flex;
  gap: 10px;
  position: absolute;
  top: 5px;
  left: 10px; /* Position the circles at the top-left */
}

.circle {
  width: 20px; /* Increase size for better visibility */
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  position: relative; /* Position the cross icon inside the red circle */
}

.circle-red {
  background-color: red;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative; /* To position the close icon inside */
}

/* Cross Icon inside the red circle */
.circle-red .close-icon {
  color: white !important; /* Ensure the color is applied */
  font-size: 16px;
  position: absolute;
  top: -2px;
  left: 4px;
  pointer-events: none; /* Prevent hover interaction with the icon */
}

.circle-yellow {
  background-color: yellow;
}

.circle-green {
  background-color: green;
}

/* Dialog Body */
.dialog-body {
  padding: 10px 0;
  color: white;
}
.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

/* Avatar Size */
.avatar-uploader .el-avatar {
  border-radius: 50%;
}
.dialog-tips {
  margin-top: 10px;
  color: white;
  font-size: 16px;
  text-align: center;
}

/* Dialog Footer */
.dialog-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.submit-button {
  padding: 8px 16px;
  border-radius: 15px;
  border: none;
  color: white;
}

.cancel-button {
  padding: 8px 16px;
  border-radius: 15px;
  border: none;
  background-color: #aaa;
  color: white;
}

/* 确保按钮禁用时有样式 */
.submit-button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}
/* 搜索和添加 */
.search-add-container {
  display: flex;
  align-items: center;
  gap: 4px; /* 输入框和按钮之间的间距 */
  margin-bottom: 10px; /* 搜索栏与好友列表之间的间距 */
}
.search-input {
  flex: 1; /* 让输入框占据剩余空间 */
}

/* 自定义下拉菜单背景颜色 */
.custom-dropdown-menu {
  background-color: #343434 !important;
  color: white; /* 修改文本颜色为白色以增加对比度 */
}
</style>
