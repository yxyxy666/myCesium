<script setup>
let menuList = ref(MENULIST)
const isCollapse = ref(true);
const currentMenu = ref(0);
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath);
};
const handleClose = (key, keyPath) => {
  console.log(key, keyPath);
};
const startFun = (item,ele) => {
  console.log(item,ele);
};
</script>
<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    text-color="#fff"
    unique-opened="true"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-sub-menu :index="item.id" v-for="(item,index) in menuList" :key="item.id">
      <template #title>{{ item.title }}</template>
      <el-menu-item :index="ele.id" v-for="(ele,i) in item.children" :key="ele.id" @click="startFun(item,ele)">{{ ele.name }}</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>
<style lang="less" scoped>
.el-menu-vertical-demo{
  width: 250px;
  height: 100vh;
}
</style>
