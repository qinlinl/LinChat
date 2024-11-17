<template>
  <dev>
    <el-result
      icon="warning"
      title="404提示"
      sub-title="你找的页面，不小心走丢了耶~"
    >
      <template #extra>
        <el-button type="primary" @click="$router.push('/login')"
          >回到首页</el-button
        >
      </template>
    </el-result>
  </dev>
</template>
