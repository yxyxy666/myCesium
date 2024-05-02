<script setup>
import * as Cesium from 'cesium';
let viewer=inject('viewer', null)
onMounted(async ()=>{
    console.log(viewer)
    // let rectangle = new Cesium.Rectangle(Cesium.Math.toRadians(113.999720), Cesium.Math.toRadians(29.999628), Cesium.Math.toRadians(115.000162), Cesium.Math.toRadians(31.000071));
    viewer.scene.camera.setView({
        destination: new Cesium.Cartesian3.fromDegrees(114.8816542100676, 30.245409980000385,8000),
        // orientation: {
        //     heading: 0,
        //     pitch: -90,
        //     roll: 0,
        // },
        // endTransform: Cesium.Matrix4.IDENTITY,
    });
    let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((click) => {
        var cartesian = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
        console.log(cartesian)
        if (cartesian) {
            // 将世界坐标转换为地理坐标
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            var longitude = Cesium.Math.toDegrees(cartographic.longitude);  // 经度
            var latitude = Cesium.Math.toDegrees(cartographic.latitude);    // 纬度
        
            // 在控制台输出点击位置的地理坐标
            console.log("Clicked at (longitude, latitude): " + longitude + ", " + latitude);
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);   
    // viewer.camera.setView({
    //     destination: Cesium.Cartesian3.fromDegrees(
    //         113.999720,
    //         29.999628,
    //         220
    //     ),
    //     orientation: {
    //         heading: 0,
    //         pitch: -45,
    //         roll: 0,
    //     },
    //     // endTransform: Cesium.Matrix4.IDENTITY,
    // });
    // createTileset(viewer);
})
</script>
<template>
    
</template>
<style scoped>

</style>