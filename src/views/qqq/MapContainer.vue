<template>
    <div class="map-wrapper">
        <div id="container"></div>
        <div class="map-toggle" @click="toggleSatellite">
            {{ isSatellite ? '切换矢量' : '切换卫星' }}
        </div>
    </div>
</template>

<script>
import AMapLoader from "@amap/amap-jsapi-loader";

// 要标注的点位数据
const points = [
    {
        name: '点位1',
        value: [116.934372, 39.779983, '河北省廊坊市香河县安平镇鲁家务码头']
    },
    {
        name: '点位2',
        value: [116.934231, 39.803500, '北京市通州区西集镇潮白河大堤路']
    },
    {
        name: '点位3',
        value: [116.736625, 39.018747, '河北省廊坊市文安县滩里镇大清河']
    },
    {
        name: '点位4',
        value: [116.945644, 39.702322, '天津市武清区河西务镇水牛村']
    },
    {
        name: '点位5',
        value: [116.938850, 39.731692, '河北省廊坊市香河县安平镇凤港减河']
    },
    {
        name: '点位6',
        value: [116.516822, 39.589061, '北京市大兴区安定镇养殖区路']
    },
    {
        name: '点位7',
        value: [116.822653, 39.399692, '河北省廊坊市安次区落垡镇414乡道']
    },
    {
        name: '点位8',
        value: [117.118450, 39.739311, '河北省廊坊市香河县安头屯镇潮白右堤']
    },
    {
        name: '点位9',
        value: [117.144678, 39.942903, '河北省廊坊市三河市杨庄镇红杨路']
    }
];

export default {
    name: "map-view",
    data() {
        return {
            map: null,
            AMapRef: null,
            isSatellite: false,
            defaultLayer: null,
            satelliteLayer: null,
            roadNetLayer: null,
        };
    },
    mounted() {
        this.initAMap();
    },
    unmounted() {
        // 销毁地图实例
        if (this.map) {
            this.map.destroy();
        }
    },
    methods: {
        initAMap() {
            // 若使用新版安全密钥，需要在调用前配置
            window._AMapSecurityConfig = {
                securityJsCode: "6369bd0d6e9c44fec3677f17bf12cfb6",
            };

            AMapLoader.load({
                key: "95ffb9f1cf5287c0c801d018f37332bf", // 您的 Web 端开发者Key
                plugins: ["AMap.Scale"], // 此处示例仅用到比例尺插件，可以根据实际需求加载
                preserveDrawingBuffer: true,
            })
                .then((AMap) => {
                    this.AMapRef = AMap;
                    // 创建地图
                    this.map = new AMap.Map("container", {
                        viewMode: "3D", // 3D地图模式
                        zoom: 11, // 地图级别
                        center: [116.397428, 39.90923], // 地图中心点（北京天安门）
                    });

                    // 添加比例尺
                    this.map.addControl(new AMap.Scale());

                    // 预创建图层以便切换
                    this.defaultLayer = new AMap.TileLayer();
                    this.satelliteLayer = new AMap.TileLayer.Satellite();
                    this.roadNetLayer = new AMap.TileLayer.RoadNet();

                    // 在地图上批量创建标记
                    this.addMarkers(AMap, points);
                })
                .catch((e) => {
                    console.error(e);
                });
        },
        /**
         * 批量添加标记并绑定点击事件
         * @param {Object} AMap AMap 对象
         * @param {Array} points 点位数据
         */
        addMarkers(AMap, points) {
            points.forEach((item) => {
                // 创建 Marker
                const marker = new AMap.Marker({
                    position: [item.value[0], item.value[1]],
                    title: item.name,
                    map: this.map
                });

                // 点击事件
                marker.on("click", () => {
                    // 创建 InfoWindow
                    const infoWindow = new AMap.InfoWindow({
                        content: `<div style="font-size:14px;color:black">${item.value[2]}</div>`,
                        offset: new AMap.Pixel(0, -30), // 让 InfoWindow 的箭头指向 marker
                    });
                    // 在点击位置打开 InfoWindow
                    infoWindow.open(this.map, marker.getPosition());
                    this.$emit("sendMsgAmap", item)
                });
            });
        },
        // 切换卫星/矢量底图
        toggleSatellite() {
            if (!this.map || !this.AMapRef) return;
            if (this.isSatellite) {
                // 切回默认矢量底图
                this.map.setLayers([this.defaultLayer]);
                this.isSatellite = false;
            } else {
                // 切换到卫星底图（叠加路网便于识别）
                const layers = this.roadNetLayer ? [this.satelliteLayer, this.roadNetLayer] : [this.satelliteLayer];
                this.map.setLayers(layers);
                this.isSatellite = true;
            }
        },
    },
};
</script>

<style scoped>
#container {
    width: 100%;
    height: 800px;
}
.map-wrapper {
    position: relative;
}
.map-toggle {
    position: absolute;
    right: 12px;
    top: 12px;
    z-index: 10;
    background: rgba(0,0,0,0.5);
    color: #fff;
    padding: 6px 10px;
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
}
</style>
