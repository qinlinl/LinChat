<script setup lang="ts" name="Login">
import { reactive, ref } from 'vue'
import { login, register } from '@/api/manager'
import { ElNotification } from 'element-plus'
import { useRouter } from 'vue-router'
import { setUserInfo } from '@/composables/auth'

const router = useRouter()
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'
const loading = ref(false)
const form = reactive({
  email: '',
  username: '',
  password: '',
  Identity: '',
})
const rules = {
  email: [
    {
      required: true,
      message: '邮箱不能为空',
      trigger: 'blur',
    },
    {
      type: 'email',
      message: '请输入有效的邮箱地址',
      trigger: ['blur', 'change'],
    },
  ],
  username: [
    {
      required: true,
      message: '用户名不能为空',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: '密码不能为空',
      trigger: 'blur',
    },
  ],
  Identity: [
    {
      required: true,
      message: '密码不能为空',
      trigger: 'blur',
    },
  ],
}
const resetForm = () => {
  Object.assign(form, {
    email: '',
    username: '',
    password: '',
    Identity: '',
  })
  dialogFormVisible.value = false
}

const formRef = ref(null)
const onSubmit = () => {
  formRef.value!.validate(valid => {
    if (!valid) {
      return false
    }
    loading.value = true
    login(form.username, form.password)
      .then(res => {
        ElNotification({
          title: 'Success 登录成功',
          message: `欢迎用户: ${form.username}`,
          type: 'success',
          duration: 3000,
        })
        setUserInfo(res.tokens, res.userId, res.avatar, res.username, res.email)
        router.push('/')
      })
      .finally(() => {
        loading.value = false
      })
  })
}
const registe = () => {
  // 处理注册逻辑
  formRef.value.validate(valid => {
    if (!valid) {
      return false
    }
    loading.value = true
    register(form.email, form.username, form.password, form.Identity)
      .then(res => {
        ElNotification({
          title: 'Success 注册成功',
          message: `欢迎用户: ${form.username}`,
          type: 'success',
          duration: 3000,
        })
      })
      .finally(() => {
        dialogFormVisible.value = false
        loading.value = false
      })
  })
}
</script>
<template>
  <el-row class="login_container">
    <el-col :lg="16" :md="12" class="left">
      <div class="font-bold text-5xl">欢迎光临</div>
      <div>秦霖chat</div>
    </el-col>
    <el-col :lg="8" :md="12" class="right">
      <h2 class="title">欢迎回来</h2>
      <div>
        <span class="line"></span>
        <span>账号密码登录</span>
        <span class="line"></span>
      </div>
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        label-width="auto"
        style="max-width: 600px"
      >
        <el-form-item prop="username" label="姓名">
          <el-input v-model="form.username" placeholder="请输入用户名">
            <template #prefix>
              <el-icon class="el-input__icon"><user /></el-icon> </template
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input
            v-model="form.password"
            placeholder="请输入密码"
            type="password"
            show-password
          >
            <template #prefix>
              <el-icon class="el-input__icon"><lock /></el-icon> </template
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            round
            color="#626aef"
            type="primary"
            @click="onSubmit"
            :loading="loading"
            >登录</el-button
          >
          <el-button
            round
            color="#626aef"
            type="primary"
            plain
            @click="dialogFormVisible = true"
            >注册</el-button
          >
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
  <el-dialog v-model="dialogFormVisible" title="注册" width="500">
    <el-form :model="form" :rules="rules">
      <el-form-item label="Email" :label-width="formLabelWidth" prop="email">
        <el-input v-model="form.email" autocomplete="off" />
      </el-form-item>
      <el-form-item
        label="用户名"
        :label-width="formLabelWidth"
        prop="username"
      >
        <el-input v-model="form.username" autocomplete="off" />
      </el-form-item>
      <el-form-item
        label="输入密码"
        :label-width="formLabelWidth"
        prop="password"
      >
        <el-input
          v-model="form.password"
          autocomplete="off"
          type="password"
          show-password
        />
      </el-form-item>
      <el-form-item
        label="再次输入密码"
        :label-width="formLabelWidth"
        prop="Identity"
      >
        <el-input
          v-model="form.Identity"
          autocomplete="off"
          type="password"
          show-password
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="resetForm">取消</el-button>
        <el-button type="primary" @click="registe"> 注册 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style>
.login_container {
  @apply min-h-screen bg-indigo-500;
}
.login_container .left,
.login_container .right {
  @apply flex items-center justify-center;
}
.login_container .right {
  @apply bg-light-50 flex-col;
}
.right .title {
  @apply font-bold text-3xl text-gray-800;
}
.right > div {
  @apply flex items-center justify-center my-5 text-gray-300 space-x-2;
}
.right .line {
  @apply h-[1px] w-16 bg-gray-200;
}
</style>
