<script setup lang="ts" name="HeadPortrait">
import { getUserInfo, setUserInfo } from '@/composables/auth'
import { ref, reactive, onMounted } from 'vue'
import { updata, uploadFile } from '@/api/manager'
import { ElNotification, ElMessage } from 'element-plus'
import { SettingTwo } from '@icon-park/vue-next'
const isHovered = ref(false)
const userinfo = ref({})
const showCloseIcon = ref(false)
onMounted(() => {
  userinfo.value = getUserInfo()
})
const formLabelWidth = '140px'
const dialogVisible = ref(false)
const form = reactive({
  email: '', // 初始化为用户信息
  username: '', // 初始化为用户信息
  password: '',
  Identity: '',
  avatar: '',
})
function clearform() {
  form.email = ''
  form.username = ''
  form.password = ''
  form.Identity = ''
}
function updataUserInfo() {
  updata(form).then(res => {
    ElNotification({
      title: 'Success 修改成功',
      message: `欢迎用户: ${form.username}`,
      type: 'success',
      duration: 3000,
    })

    setUserInfo(res.tokens, res.userId, res.avatar, res.username, res.email)
    userinfo.value = getUserInfo()
  })
  clearform()
}
const handleFileChange = file => {
  uploadFile(file.raw)
    .then(response => {
      if (response.Code === 0) {
        ElNotification({
          title: '成功',
          message: '头像上传成功！',
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
      form.avatar = response.Data
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
</script>

<template>
  <div class="head-portrait">
    <el-avatar :size="50" :src="userinfo.avatar" />
    <span class="activeSetting">
      <setting-two
        theme="outline"
        size="30"
        :fill="isHovered ? '#1d90f5' : '#777988'"
        @mouseover="isHovered = true"
        @mouseleave="isHovered = false"
        @click="dialogVisible = true"
      />
    </span>
  </div>
  <!-- 对话框 -->
  <div v-if="dialogVisible" class="dialog-overlay">
    <div class="custom-dialog">
      <div class="dialog-header">
        <div class="close-buttons">
          <div
            class="circle circle-red"
            @mouseover="showCloseIcon = true"
            @mouseleave="showCloseIcon = false"
            @click="(dialogVisible = false), (showCloseIcon = false)"
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
            <el-avatar :size="80" :src="form.avatar" />
          </el-upload>
          <div class="username">
            <span>{{ userinfo.username }}</span>
          </div>
        </div>
      </div>

      <!-- Form Inputs -->
      <el-form :model="form">
        <el-form-item label="Email" :label-width="formLabelWidth" prop="email">
          <el-input
            v-model="form.email"
            autocomplete="off"
            :placeholder="userinfo.email"
          />
        </el-form-item>
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
          prop="username"
        >
          <el-input
            v-model="form.username"
            autocomplete="off"
            :placeholder="userinfo.username"
          />
        </el-form-item>
        <el-form-item
          label="输入密码"
          :label-width="formLabelWidth"
          prop="password"
          type="password"
          show-password
        >
          <el-input v-model="form.password" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="再次输入密码"
          :label-width="formLabelWidth"
          prop="Identity"
          type="password"
          show-password
        >
          <el-input v-model="form.Identity" autocomplete="off" />
        </el-form-item>
      </el-form>

      <!-- Dialog Footer -->
      <div class="dialog-footer">
        <button @click="(dialogVisible = false), clearform()">取消</button>
        <button
          @click="updataUserInfo(), (dialogVisible = false)"
          class="submit-button"
        >
          好了
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.head-portrait {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid rgb(255, 255, 255);
  position: relative;
  &::before {
    content: '';
    width: 15px;
    height: 15px;
    z-index: 1;
    display: block;
    border-radius: 50%;
    background-color: rgb(144, 225, 80);
    position: absolute;
    right: 0;
  }
}
.activeSetting {
  cursor: pointer;
}
/* 对话框 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent overlay */
  z-index: 999;
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
  z-index: 1000;
}

/* Dialog Header */
.dialog-header {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
}
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

/* Avatar and username container */
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

/* Username style */
.username {
  margin-top: 10px;
  color: white;
  font-size: 16px;
  text-align: center;
}

/* Form Inputs */
.dialog-body {
  padding: 10px 0;
  color: white;
}

/* Dialog Footer */
.dialog-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.dialog-footer button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.submit-button {
  background-color: #6366f1;
  color: white;
}

.submit-button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

button {
  background-color: #aaa;
  color: white;
}
</style>
