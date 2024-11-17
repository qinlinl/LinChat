<script setup lang="ts" name="About"></script>

<template>
  <div class="about-container">
    <!-- 标题 -->
    <h1 class="about-title">关于我</h1>

    <!-- 描述文字 -->
    <p class="about-description">
      这是一个聊天应用，旨在帮助用户在局域网内快捷地与朋友交流。
    </p>

    <!-- 信息展示 -->
    <div class="about-info">
      <p>版本号：<span>v1</span></p>
      <p>开发人员：<span>秦白金</span></p>
      <p>前端技术：<span>vue3 axios pinia Element_plus</span></p>
      <p>后端技术：<span>go gin gorm</span></p>
      <p>数据库：<span>mysql redis</span></p>
    </div>

    <!-- 社交链接 -->
    <div class="about-links">
      <a href="https://github.com/qinlinl/LinChat" target="_blank" class="link"
        >GitHub</a
      >
    </div>
  </div>
</template>

<style scoped>
/* 布局样式 */
.about-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  height: 84vh;
  background: linear-gradient(135deg, #1e3c72, #2a5298); /* 渐变背景 */
  color: #fff;
  text-align: center;
  padding: 20px;
}

/* 标题样式 */
.about-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* 描述样式 */
.about-description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  line-height: 1.5;
  max-width: 600px;
}

/* 信息块样式 */
.about-info {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
}

.about-info p {
  margin: 0.5rem 0;
  font-size: 1.1rem;
}

.about-info span {
  font-weight: bold;
  color: #ffdd57;
}

/* 链接样式 */
.about-links {
  display: flex;
  gap: 20px;
}

.link {
  color: #ffdd57;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: bold;
  transition: color 0.3s ease;
}

.link:hover {
  color: #ffd700;
}
</style>
