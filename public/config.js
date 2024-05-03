
const MENULIST = [
    {
        id:'sjjz',
        title:'数据加载',
        children:[
            {
                id:'terrain',
                name:'地形数据'
            },{
                id:'3dtiles',
                name:'3dtiles'
            }
        ]
    },
    {
        id:'analyze',
        title:'分析',
        children:[
            {
                id:'floodAnalyze',
                name:'淹没'
            },{
                id:'sunAnalyze',
                name:'日照分析'
            },{
                id:'viewAnalyze',
                name:'可视域分析'
            }
        ]
    },
    {
        id:'measure',
        title:'测量',
        children:[
            {
                id:'distanceMeasure',
                name:'距离测量'
            },
            {
                id:'areaMeasure',
                name:'面积测量'
            },
            // {
            //     id:'slopeMeasure',
            //     name:'坡度测量'
            // },
        ]
    }
]
const CESIUMMAP = {
    terrainUrl:"http://localhost:9003/terrain/F7jW8PpA",
    sanDtilesUrl:"http://localhost:9003/model/tUr0pMunM/tileset.json",
}