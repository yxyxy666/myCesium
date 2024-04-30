<script setup>
import * as Cesium from 'cesium';
onMounted(async ()=>{
    Cesium.Ion.defaultAccessToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5YWY4NmMwZi04MTE4LTRhZDQtODEyNy1iNjEzZTVhZDlhZDIiLCJpZCI6MTk4OTU4LCJpYXQiOjE3MDkyNjQ2MDZ9.nmLa6cjbGxnQ6i6RAZtlYi31plf-VHzc5xC-Gdu9lrM'
    let terrain = await Cesium.CesiumTerrainProvider.fromUrl('http://localhost:9003/terrain/F7jW8PpA', {
        requestWaterMask: true,//标志指示客户端是否应该从服务器请求每个图块的水面罩（如果可用）。
        requestVertexNormals: true//该标志指示客户端是否应以每个顶点法线的形式从服务器请求额外的照明信息（如果可用）。
    });
    console.log(terrain)
    let viewer = new Cesium.Viewer('cesiumContainer',{
        terrainProvider:  terrain,
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
    viewer.scene.screenSpaceCameraController.zoomEventTypes = [
        Cesium.CameraEventType.MIDDLE_DRAG,
        Cesium.CameraEventType.WHEEL,
        Cesium.CameraEventType.PINCH,
    ];
    viewer.scene.screenSpaceCameraController.tiltEventTypes = [
        Cesium.CameraEventType.RIGHT_DRAG,
    ];
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
    <div id="cesiumContainer"></div>
</template>
<style scoped>

</style>