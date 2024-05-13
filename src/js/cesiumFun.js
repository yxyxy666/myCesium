import * as Cesium from 'cesium'
import * as turf from '@turf/turf'

let cesiumFun = {
    // 重写鼠标事件（左右键滚轮控制平移旋转等）
    overrideMouse(viewer){
        viewer.scene.screenSpaceCameraController.zoomEventTypes = [
            Cesium.CameraEventType.MIDDLE_DRAG,
            Cesium.CameraEventType.WHEEL,
            Cesium.CameraEventType.PINCH,
        ];
        viewer.scene.screenSpaceCameraController.tiltEventTypes = [
            Cesium.CameraEventType.RIGHT_DRAG,
        ];
    }, 
    // 添加地形数据
    async addTerrain(viewer){
        // cesiumLab自定义的地形数据加载
        // let terrain = await Cesium.CesiumTerrainProvider.fromUrl(CESIUMMAP.terrainUrl, {
        //     requestWaterMask: true,//标志指示客户端是否应该从服务器请求每个图块的水面罩（如果可用）。
        //     requestVertexNormals: true//该标志指示客户端是否应以每个顶点法线的形式从服务器请求额外的照明信息（如果可用）。
        // });
        // console.log(terrain)
        // viewer.terrainProvider = terrain;
        viewer.scene.globe.depthTestAgainstTerrain = true;
        viewer.scene.camera.setView({
            destination: new Cesium.Cartesian3.fromDegrees(114.8816542100676, 30.245409980000385,8000),
        });
        // let entity = viewer.entities.add({
        //     id:'Cesium_Air',
        //     position:new Cesium.Cartesian3.fromDegrees(114.8816542100676, 30.245409980000385,4000),
        //     model:{
        //         uri:'../../public/models/Cesium_Air.glb',
        //         show:true,
        //         minimumPixelSize: 500,
        //         maximumScale: 10000
        //     }
        // })
        // viewer.trackedEntity = viewer.entities.getById('Cesium_Air');
        // viewer.trackedEntity = entity 

    },
    // 清除地形数据
    clearTerrain(viewer){
        viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
    },
    // 加载3dTiles数据
    async add3DTiles(viewer){
        // 加载自定义3DTiles
        // let sanDTiles = viewer.scene.primitives.add(await Cesium.Cesium3DTileset.fromUrl(CESIUMMAP.sanDtilesUrl))
        // viewer.zoomTo(sanDTiles)

        let sanDTiles = await Cesium.Cesium3DTileset.fromIonAssetId(40866, {
            enableCollision: true,
        });
        viewer.scene.primitives.add(sanDTiles);
        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromRadians(
              -1.3193669086512454,
              0.698810888305128,
              220
            ),
            orientation: {
              heading: -1.3,
              pitch: -0.6,
              roll: 0,
            },
            endTransform: Cesium.Matrix4.IDENTITY,
        });
debugger
        let dataSource = await Cesium.CzmlDataSource.load('../../public/models/CesiumMilkTruck/ClampToGround.czml')
        let entity = dataSource.entities.getById("CesiumMilkTruck")
        // dataSource.entities.values[0].model.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND
        entity.model.uri = "../../public/models/CesiumMilkTruck/CesiumMilkTruck.glb";
        entity.model.scale = 2.5;
        entity.model.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
        entity.orientation = new Cesium.VelocityOrientationProperty(
            entity.position
        );
        viewer.dataSources.add(dataSource)
        viewer.clock.shouldAnimate = true
        // console.log(sanDTiles)
        return sanDTiles
    },
    // 移除3dTiles数据
    clear3DTiles(viewer,sanDTiles){
        viewer.scene.primitives.remove(sanDTiles)
    },
    // 添加淹没分析
    addFloodAnalyze(viewer){
        this.addTerrain(viewer)
        let height = 0
        // [114.9188621784644, 30.245237624889878, 0]
        // [114.88940203951506, 30.21176476628671, 0]
        // [114.84150151462956, 30.24179852054982, 0]
        // [114.87263417948456, 30.277783001036237, 0]
        // [114.9188621784644, 30.245237624889878, 0]
        let polygon = viewer.entities.add({
            polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArray([
                    114.9188621784644, 30.245237624889878,
                    114.88940203951506, 30.21176476628671,
                    114.84150151462956, 30.24179852054982,
                    114.87263417948456, 30.277783001036237,]),
                material: new Cesium.Color.fromBytes(64, 157, 253, 150),
                perPositionHeight: true,//是否利用每个点位自身高程
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,//贴地
                extrudedHeight: new Cesium.CallbackProperty(()=>{
                    console.log(height)
                    if(height < 300){
                        height += 1/6
                    }
                    return height
                },false),
            }
        });
        viewer.zoomTo(polygon)
        // setTimeout(()=>{
        //     polygon.polygon.extrudedHeight.setValue()
        // },2000)
        
    },
    // 移除淹没分析
    clearFloodAnalyze(viewer){
        this.clearTerrain(viewer)
        viewer.entities.removeAll();
    },
    // 添加日照分析
    addSunAnalyze(viewer){
        this.addTerrain(viewer)
    },
    // 移除日照分析
    clearSunAnalyze(viewer){
        this.clearTerrain(viewer)
        viewer.entities.removeAll();
    },
    // 添加距离测量工具
    addDistanceMeasure(viewer,handler){
        this.addTerrain(viewer)
        // 确保地形数据显示
        viewer.scene.globe.enableTerrain = true
        // 用于存储测量点的数组
        let positions = []
        let polylineEntity 
        function addPoint(position) {
            positions.push(position.clone());
            // 创建并添加点实体
            viewer.entities.add({
                position: position,
                point: {
                    pixelSize: 10,
                    color: Cesium.Color.RED,
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 2,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND//贴地
                },
            });
        }
        async function calculateDistance(startPosition, endPosition) {
            // 思路:
            // 先计算两点之间的直线距离，
            // 如果小于5km，按精度插值，然后结合地形高度计算每个插值点间的直线距离，最终相加得到总贴地距离，
            // 如果大于5km，按地球椭球体计算地表距离
            let linearDistance = Cesium.Cartesian3.distance(startPosition,endPosition);
            //高度采样
            let count = Math.floor(linearDistance);
            if (linearDistance < 100) {
                //100米之内的精确到厘米
                count *= 100;
            } else if (linearDistance < 5000) {
                //5000米之内的精确到分米
                count *= 10;
            } else {
                // 超过5000米按地球椭球体计算地表距离
                let geodesic = new Cesium.EllipsoidGeodesic(Cesium.Cartographic.fromCartesian(startPosition),Cesium.Cartographic.fromCartesian(endPosition));
                return geodesic.surfaceDistance.toFixed(2);
            }
            let positions = [];
            let startCartographic = Cesium.Cartographic.fromCartesian(startPosition);
            let endCartographic = Cesium.Cartographic.fromCartesian(endPosition);
            positions.push(startCartographic);
            // 插值处理
            for (let i = 1; i < count; i++) {
                let cart = Cesium.Cartesian3.lerp(startPosition,endPosition,i / count,new Cesium.Cartesian3());
                positions.push(Cesium.Cartographic.fromCartesian(cart));
            }
            positions.push(endCartographic);
            // 获取每个插值点的高度
            let updatedPositions = await Cesium.sampleTerrainMostDetailed(viewer.terrainProvider,positions)
            let surfaceDistance = 0;
            for (let i = 0; i < updatedPositions.length; i++) {
                if (i == updatedPositions.length - 1) continue;
                surfaceDistance += Cesium.Cartesian3.distance(
                    Cesium.Cartesian3.fromRadians(updatedPositions[i].longitude,updatedPositions[i].latitude,updatedPositions[i].height),
                    Cesium.Cartesian3.fromRadians(updatedPositions[i + 1].longitude,updatedPositions[i + 1].latitude,updatedPositions[i + 1].height)
                );
            }
            return surfaceDistance.toFixed(2);
        }
        handler.setInputAction(function(click) {
            // var cartesian = viewer.scene.pickPosition(click.position);
            // var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            // var longitude = Cesium.Math.toDegrees(cartographic.longitude);  // 经度
            // var latitude = Cesium.Math.toDegrees(cartographic.latitude);    // 纬度
            // console.log(longitude,latitude)
            // console.log(cartesian)
            

            if (viewer.scene.pickPosition(click.position)) {
                // 获取点击位置
                var worldPosition = viewer.scene.pickPosition(click.position);
                if (Cesium.defined(worldPosition)) {
                    addPoint(worldPosition);
                    if (positions.length > 1) {
                        let startPoint = positions[positions.length-2];
                        let endPoint = positions[positions.length-1];
                        calculateDistance(startPoint,endPoint).then(distance => {
                            console.log('距离'+ distance +'米')
                            // 将两点作为向量相加再平均算出中点向量
                            let midpoint = Cesium.Cartesian3.add(startPoint, endPoint, new Cesium.Cartesian3());
                            midpoint = Cesium.Cartesian3.multiplyByScalar(midpoint, 0.5, midpoint);
                            if (!polylineEntity) {
                                let polylineEntity = viewer.entities.add({
                                    polyline: {
                                        positions: [startPoint,endPoint],
                                        material: Cesium.Color.YELLOW,
                                        width: 5,
                                        clampToGround: true //贴地
                                    },
                                });
                                viewer.entities.add({
                                    position: midpoint,
                                    label: {
                                        text: distance + "米",
                                        font: '14px sans-serif',
                                        fillColor: Cesium.Color.WHITE,
                                        show:true,
                                        showBackground: true,
                                        backgroundColor: new Cesium.Color(0, 0, 0, 0.5),
                                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                                        verticalOrigin: Cesium.VerticalOrigin.TOP,
                                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND//贴地
                                    },
                                });
                                console.log(polylineEntity)
                            } 
                        })
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    // 移除距离测量工具
    clearDistanceMeasure(viewer,handler){
        this.clearTerrain(viewer)
        viewer.entities.removeAll();
    },
    // 添加面积测量工具
    addAreaMeasure(viewer,handler){
        this.addTerrain(viewer)
        let positions = []
        let codeInfo = []
        let polygon = new Cesium.PolygonHierarchy()
        let obj = viewer.entities.add({
            polyline: {
                positions: new Cesium.CallbackProperty(function () {
                    return positions;
                }, false),
                width: 5,
                material: Cesium.Color.YELLOW,
                clampToGround: true,
            },
            polygon: {
                hierarchy: new Cesium.CallbackProperty(function () {
                    return polygon;
                }, false),
                material: Cesium.Color.RED.withAlpha(0.4),
                clampToGround: true,
            },
        });
        handler.setInputAction((movement) => {
            let cartesian = viewer.scene.pickPosition(movement.endPosition);
            let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            let lng = Cesium.Math.toDegrees(cartographic.longitude);
            let lat = Cesium.Math.toDegrees(cartographic.latitude);
            let hei = Cesium.Math.toDegrees(cartographic.height);
            if (positions.length >= 0) {
                if (cartesian && cartesian.x) {
                    positions.pop();
                    positions.push(cartesian);
                    polygon.positions.pop();
                    polygon.positions.push(cartesian);
                    codeInfo.pop();
                    codeInfo.push([lng, lat, hei]);
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        handler.setInputAction((movement) => {
            let cartesian = viewer.scene.pickPosition(movement.position);
            let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            let lng = Cesium.Math.toDegrees(cartographic.longitude);
            let lat = Cesium.Math.toDegrees(cartographic.latitude);
            let hei = Cesium.Math.toDegrees(cartographic.height);
            if (cartesian && cartesian.x) {
                if (positions.length == 0) {
                    positions.push(cartesian.clone());
                }
                codeInfo.push([lng, lat, hei]);
                positions.push(cartesian.clone());
                polygon.positions.push(cartesian.clone());
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.setInputAction(() => {
            positions.push(positions[0]);
            obj.polyline.positions = positions
            obj.polygon.hierarchy = polygon
            getArea(positions)
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        function getArea(positions) {
            let poi = positions.map(item=>{
                let cartographic = Cesium.Cartographic.fromCartesian(item)
                return [Cesium.Math.toDegrees(cartographic.longitude),Cesium.Math.toDegrees(cartographic.latitude),cartographic.height]
            })
            let poiArr = poi.map(item=>{
                return turf.point(item)
            })
            console.log(poiArr)
            
            let center = turf.center(turf.featureCollection(poiArr));
            let area = turf.area(turf.polygon([poi]));
            console.log((area/1000).toFixed(2)+"平方公里")
            console.log(center)
            obj.position = Cesium.Cartesian3.fromDegrees(center.geometry.coordinates[0],center.geometry.coordinates[1])
            obj.label={
                text: (area/1000).toFixed(2) + "平方公里",
                font: '14px sans-serif',
                fillColor: Cesium.Color.WHITE,
                show:true,
                showBackground: true,
                backgroundColor: new Cesium.Color(0, 0, 0, 0.5),
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND//贴地
            }
        }
    },
    // 移除面积测量工具
    clearAreaMeasure(viewer){
        this.clearTerrain(viewer)
        viewer.entities.removeAll();
    },
    // 添加坡度测量工具
    addSlopeMeasure(viewer){
        this.addTerrain(viewer)
    },
    // 移除坡度测量工具
    clearSlopeMeasure(viewer){
        this.clearTerrain(viewer)
    },
}
export default cesiumFun
