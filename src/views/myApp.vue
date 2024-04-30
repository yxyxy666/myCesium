<script setup>
import cesiumMap from './cesiumMap.vue'
import funMenu from './funMenu.vue'
</script>

<template>
    <div class="first">
        <funMenu></funMenu>
        <cesiumMap></cesiumMap>
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