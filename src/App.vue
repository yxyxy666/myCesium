<script setup>
import cesiumMap from './views/cesiumMap.vue'
</script>

<template>
    <cesiumMap></cesiumMap>
</template>

<style scoped>
#cesiumContainer {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
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