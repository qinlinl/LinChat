<script setup lang="ts" name="Nav">
import HeadPortrait from '@/components/HeadPortrait.vue'
import { Messages, PeoplesTwo, SheepZodiac } from '@icon-park/vue-next'
import { ref } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import { removeUserInfo } from '@/composables/auth'
import { useRouter } from 'vue-router'
const router = useRouter()
const store = useUserStore()
const menuName = ref(0)
const showClose = ref(false)
function changeMenu(menu: number) {
  menuName.value = menu
}

const getIconFillColor = index => {
  return menuName.value === index ? '#1d90f5' : '#777988'
}
function quit() {
  store.clearUserData()
  removeUserInfo()
  router.replace('/login')
}
</script>

<template>
  <div class="nav">
    <div class="circle-wrapper">
      <div
        class="circle red"
        @mouseover="showClose = true"
        @mouseleave="showClose = false"
        @click="quit"
      >
        <span v-if="showClose" class="close-icon">×</span>
      </div>
      <div class="circle yellow"></div>
      <div class="circle green"></div>
    </div>
    <div class="nav-menu-wrapper">
      <ul class="menu-list">
        <router-link to="/friends">
          <li :class="{ activeNav: menuName === 0 }" @click="changeMenu(0)">
            <div class="block"></div>
            <span class="iconfont">
              <Messages theme="outline" size="36" :fill="getIconFillColor(0)" />
            </span>
          </li>
        </router-link>
        <router-link to="/groups">
          <li :class="{ activeNav: menuName === 1 }" @click="changeMenu(1)">
            <div class="block"></div>
            <span class="iconfont">
              <PeoplesTwo
                theme="outline"
                size="36"
                :fill="getIconFillColor(1)"
              />
            </span></li
        ></router-link>
        <router-link to="about">
          <li :class="{ activeNav: menuName === 2 }" @click="changeMenu(2)">
            <div class="block"></div>
            <span class="iconfont">
              <SheepZodiac
                theme="outline"
                size="36"
                :fill="getIconFillColor(2)"
              />
            </span></li
        ></router-link>
      </ul>
    </div>
    <div class="own-pic">
      <HeadPortrait></HeadPortrait>
    </div>
  </div>
</template>

<style scoped>
.nav {
  width: 100%;
  height: 90vh;
  position: relative;
  border-radius: 20px 0 0 20px;
}

.nav-menu-wrapper {
  position: absolute;
  top: 40%;
  transform: translate(0, -50%);
}

.menu-list {
  margin-left: 10px;
}

.menu-list li {
  margin: 40px 0 0 30px;
  list-style: none;
  cursor: pointer;
  position: relative;
}

.block {
  background-color: #1d90f5;
  position: absolute;
  left: -40px;
  width: 6px;
  height: 25px;
  transition: 0.5s;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  opacity: 0;
}

.menu-list li:hover .block,
.activeNav .block {
  opacity: 1;
}

.menu-list li:hover span,
.activeNav span {
  color: #1d90f5;
}

.own-pic {
  position: absolute;
  bottom: 10%;
  margin-left: 25px;
}

/* 圆圈容器 */
.circle-wrapper {
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

/* 圆圈样式 */
.circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

/* 红色圆圈按钮 */
.red {
  background-color: red;
  position: relative;
}

.red .close-icon {
  font-size: 16px;
  color: white;
  position: absolute;
}

/* 黄色圆圈 */
.yellow {
  background-color: yellow;
}

/* 绿色圆圈 */
.green {
  background-color: green;
}
</style>
