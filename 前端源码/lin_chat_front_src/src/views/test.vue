<script setup lang="ts" name="Nav">
import { ref, onMounted, nextTick } from 'vue'
import type { ElScrollbar } from 'element-plus'
</script>
<template>
  <el-dropdown
    popper-class="dropDown_style"
    trigger="click"
    @command="handleCommand"
  >
    <el-button></el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="user">user</el-dropdown-item>
        <el-dropdown-item command="faq">faq</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<style></style>
