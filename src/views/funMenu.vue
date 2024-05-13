<script setup>
import * as Cesium from 'cesium';
import { useCounterStore } from '../stores/counter'
// 注入
let viewer = inject('cesiumViewer')
let addTerrain = inject('addTerrain')
let clearTerrain = inject('clearTerrain')
let add3DTiles = inject('add3DTiles')
let clear3DTiles = inject('clear3DTiles')
let addFloodAnalyze = inject('addFloodAnalyze')
let clearFloodAnalyze = inject('clearFloodAnalyze')
let addSunAnalyze = inject('addSunAnalyze')
let clearSunAnalyze = inject('clearSunAnalyze')
let addDistanceMeasure = inject('addDistanceMeasure')
let clearDistanceMeasure = inject('clearDistanceMeasure')
let addAreaMeasure = inject('addAreaMeasure')
let clearAreaMeasure = inject('clearAreaMeasure')
// let addSlopeMeasure = inject('addSlopeMeasure')
// let clearSlopeMeasure = inject('clearSlopeMeasure')
// 变量
let menuList = ref(MENULIST)
let isCollapse = ref(true);
let currentMenu = ref(0);

// pinia
const counterStore = useCounterStore()

// 计算属性
// const currentFuncId = computed(()=>{
//   return counterStore.currentFuncId
// } )

// 监听
// watch(
//   ()=>counterStore.currentFuncId,
//   (newVal,oldVal)=>{
//     if(oldVal){
//       closeFun(oldVal)
//     }
//   },
//   { deep: true }
// )

// 方法
// 功能菜单展开
const handleOpen = (key, keyPath) => {
    // console.log(key, keyPath);
};
// 功能菜单关闭
const handleClose = (key, keyPath) => {
  // console.log(key, keyPath);
};
// 选中某功能
const startFun = (item,ele) => {
  closeFun(counterStore.currentFuncId)
  counterStore.changeFuncId(ele.id)
  switch(ele.id){
    // 数据
    case 'terrain':
      addTerrain()
      break;
    case '3dtiles':
      add3DTiles()
      break;
    // 分析
    case 'floodAnalyze':
      addFloodAnalyze()
      break;
    case 'sunAnalyze':
      addSunAnalyze()
      break;
    case 'viewAnalyze':
      
      break;
    // 测量
    case 'distanceMeasure':
      addDistanceMeasure()
      break;
    case 'areaMeasure':
      addAreaMeasure()
      break;
  }
};
// 关闭上次功能
const closeFun = (oldId) => {
  switch(oldId){
    // 数据
    case 'terrain':
      clearTerrain()
      break;
    case '3dtiles':
      clear3DTiles()
      break;
    // 分析
    case 'floodAnalyze':
      clearFloodAnalyze()
      break;
    case 'sunAnalyze':
      clearSunAnalyze()
      break;
    case 'viewAnalyze':
      
      break;
    // 测量
    case 'distanceMeasure':
      clearDistanceMeasure()
      break;
    case 'areaMeasure':
      clearAreaMeasure()
      break;
  }
}
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
