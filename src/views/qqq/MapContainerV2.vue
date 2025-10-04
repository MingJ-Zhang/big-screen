<!-- 使用高德地图jsAPI，逆向地理位置编码接口获取位置信息 -->


<template>
    <div>
        <div id="container"></div>
    </div>
</template>

<script>
import AMapLoader from "@amap/amap-jsapi-loader";
// 原来的 points 中，只保留经纬度和点位名称，去掉写死的地理信息

const points = [
    {
        name: "点位1",
        value: [116.934372, 39.779983],
    },
    {
        name: "点位2",
        value: [116.934231, 39.8035],
    },
    {
        name: "点位3",
        value: [116.736625, 39.018747],
    },
    {
        name: "点位4",
        value: [116.945644, 39.702322],
    },
    {
        name: "点位5",
        value: [116.93885, 39.731692],
    },
    {
        name: "点位6",
        value: [116.516822, 39.589061],
    },
    {
        name: "点位7",
        value: [116.822653, 39.399692],
    },
    {
        name: "点位8",
        value: [117.11845, 39.739311],
    },
    {
        name: "点位9",
        value: [117.144678, 39.942903],
    },
];

export default {
    name: "map-view",
    data() {
        return {
            map: null,
            geocoder: null, // 存储 Geocoder 实例
        };
    },
    mounted() {
        this.initAMap();
    },
    unmounted() {
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
                key: "95ffb9f1cf5287c0c801d018f37332bf", // 换成你自己的 Web 端开发者 Key
                plugins: ["AMap.Scale", "AMap.Geocoder"], // 需要使用逆向地理编码，因此要加载 Geocoder 插件
                preserveDrawingBuffer: true,
            })
                .then((AMap) => {
                    // 创建地图
                    this.map = new AMap.Map("container", {
                        viewMode: "3D",
                        zoom: 11,
                        center: [116.397428, 39.90923], // 北京天安门
                    });

                    // 添加比例尺
                    this.map.addControl(new AMap.Scale());

                    // 创建 Geocoder 实例（逆向地理编码）
                    this.geocoder = new AMap.Geocoder({
                        // city: '010' // 可根据需要指定城市，或不填自动进行全国范围搜索
                    });

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
                // 1. 为每个点做一个逆向地理编码请求
                this.geocoder.getAddress([item.value[0], item.value[1]], (status, result) => {
                    if (status === "complete" && result.regeocode) {
                        // 将解析到的地址存入当前对象，供后续 infoWindow 显示
                        item.address = result.regeocode.formattedAddress;
                    } else {
                        item.address = "获取地址失败";
                    }
                });

                // 2. 创建 Marker
                const marker = new AMap.Marker({
                    position: [item.value[0], item.value[1]],
                    title: item.name,
                    map: this.map,
                });

                // 3. 点击事件（此处用到 item.address，可能在异步返回后才能获取到）
                marker.on("click", () => {
                    // 创建 InfoWindow
                    const infoWindow = new AMap.InfoWindow({
                        content: `<div style="font-size:14px;color:black">
                <div><b>${item.name}</b></div>
                <div>${item.address || "地址解析中..."}</div>
              </div>`,
                        offset: new AMap.Pixel(0, -30),
                    });
                    infoWindow.open(this.map, marker.getPosition());

                    // 触发自定义事件，把当前点的信息抛给外部，如果需要的话
                    this.$emit("sendMsgAmap", item);
                });
            });
        },
    },
};
</script>

<style scoped>
#container {
    width: 100%;
    height: 900px;
}
</style>