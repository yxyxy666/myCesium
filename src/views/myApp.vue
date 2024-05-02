<script setup>
import funMenu from './funMenu.vue'
import cesiumFun from '../js/cesiumFun.js'
import * as Cesium from 'cesium';
let viewer = ref(null)
let sanDTiles = ref(null)
let handler = ref(null)
provide('cesiumViewer',viewer)
// 添加地形
provide('addTerrain',()=>{
    cesiumFun.addTerrain(viewer.value)
})
// 清除地形
provide('clearTerrain',()=>{
    cesiumFun.clearTerrain(viewer.value)
})
// 添加3dtiles
provide('add3DTiles',async()=>{
    sanDTiles.value = await cesiumFun.add3DTiles(viewer.value)
})
// 清除3dtiles
provide('clear3DTiles',()=>{
    cesiumFun.clear3DTiles(viewer.value,sanDTiles.value)
})
// 添加距离测量
provide('addDistanceMeasure',async()=>{
    if(handler.value?.isDestroyed()||!handler.value){
        handler.value = new Cesium.ScreenSpaceEventHandler(viewer.value.canvas);
    }
    cesiumFun.addDistanceMeasure(viewer.value,handler.value)
})
// 清除距离测量
provide('clearDistanceMeasure',()=>{
    cesiumFun.clearDistanceMeasure(viewer.value,handler.value)
    handler.value.destroy()
})
// 添加面积测量
provide('addAreaMeasure',async()=>{
    if(handler.value?.isDestroyed()||!handler.value){
        handler.value = new Cesium.ScreenSpaceEventHandler(viewer.value.canvas);
    }
    cesiumFun.addAreaMeasure(viewer.value,handler.value)
})
// 清除面积测量
provide('clearAreaMeasure',()=>{
    cesiumFun.clearAreaMeasure(viewer.value)
    handler.value.destroy()
})
// 添加坡度测量
provide('addSlopeMeasure',async()=>{
    sanDTiles.value = await cesiumFun.addSlopeMeasure(viewer.value)
})
// 清除坡度测量
provide('clearSlopeMeasure',()=>{
    cesiumFun.clearSlopeMeasure(viewer.value,sanDTiles.value)
})
onMounted(async()=>{
    Cesium.Ion.defaultAccessToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5YWY4NmMwZi04MTE4LTRhZDQtODEyNy1iNjEzZTVhZDlhZDIiLCJpZCI6MTk4OTU4LCJpYXQiOjE3MDkyNjQ2MDZ9.nmLa6cjbGxnQ6i6RAZtlYi31plf-VHzc5xC-Gdu9lrM'
    viewer.value = new Cesium.Viewer('cesiumContainer',{
        // terrainProvider:  terrain,
        shadows: true,
        animation:false,
        homeButton:false,
        timeline:false,
        navigationHelpButton:false,
        sceneModePicker:false,
        baseLayerPicker:false,
        geocoder:false,
        infoBox:false
    })
    cesiumFun.overrideMouse(viewer.value)
})

</script>

<template>
    <div class="first">
        <funMenu></funMenu>
        <div id="cesiumContainer"></div>
    </div>
</template>

<style scoped>
.first{
    display: flex;
}
#cesiumContainer {
    /* position: absolute; */
    width: calc(100vw - 250px);
    height: 100vh;
    /* top: 0px;
    left: 0px; */
    margin: 0;
    padding: 0;
    overflow: hidden;
}
</style>
<style>
.cesium-viewer-bottom{
    display: none;
}
</style>