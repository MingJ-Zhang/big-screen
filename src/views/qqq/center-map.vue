<template>
  <div class="centermap">
    <div class="maptitle">
      <div class="zuo"></div>
      <span class="titletext">{{ maptitle }}</span>
      <div class="you"></div>
    </div>
    <div class="mapwrap">
      <!-- <dv-border-box-13> -->
      <div class="quanguo" @click="getData('china')" v-if="code !== 'china'">
        中国
      </div>

      <Echart id="CenterMap" :options="options" ref="CenterMap" />
      <!-- </dv-border-box-13> -->
    </div>
  </div>
</template>

<script>
import xzqCode from "../../utils/map/xzqCode";
import { currentGET } from "api/modules";
import * as echarts from "echarts";
import { GETNOBASE } from "api";
export default {
  data() {
    return {
      maptitle: "设备分布图",
      options: {},
      code: "110000", //110000 代表北京
      echartBindClick: false,
      isSouthChinaSea: false, //是否要展示南海群岛  修改此值请刷新页面
    };
  },
  created() { },

  mounted() {
    // console.log(xzqCode);
    this.getData("110000");
  },
  methods: {
    getData(code) {
      currentGET("big8", { regionCode: code }).then((res) => {
        console.log(res)
        console.log("设备分布", res);
        if (res.success) {
          this.getGeojson(res.data.regionCode, res.data.dataList);
          this.mapclick();
          this.testClick();
        } else {
          this.$Message.warning(res.msg);
        }
      });
    },
    /**
     * @description: 获取geojson
     * @param {*} name china 表示中国 其他省份行政区编码
     * @param {*} mydata 接口返回列表数据
     * @return {*}
     */
    async getGeojson(name, mydata) {
      this.code = name;
      //如果要展示南海群岛并且展示的是中国的话
      let geoname = name
      if (this.isSouthChinaSea && name == "china") {
        geoname = "chinaNanhai";
      }
      //如果有注册地图的话就不用再注册 了
      let mapjson = echarts.getMap(name);
      if (mapjson) {
        mapjson = mapjson.geoJSON;
      } else {
        mapjson = await GETNOBASE(`./map-geojson/${geoname}.json`).then((res) => {
          return res;
        });
        echarts.registerMap(name, mapjson);
      }
      let cityCenter = {};
      let arr = mapjson.features;
      //根据geojson获取省份中心点
      arr.map((item) => {
        cityCenter[item.properties.name] =
          item.properties.centroid || item.properties.center;
      });
      let newData = [];
      mydata.map((item) => {
        if (cityCenter[item.name]) {
          newData.push({
            name: item.name,
            value: cityCenter[item.name].concat(item.value),
          });
        }
      });
      console.log(mydata)
      console.log(newData)
      this.init(name, mydata, newData);
    },
    init(name, data, data2) {
      // console.log(data2);
      let top = 45;
      let zoom = 1.05;
      // 将DMS坐标转换为十进制度数
      // const points = [
      //   [116.934372, 39.779983],  // 39°46'47.94"N ; 116°56'3.74"E
      //   [116.934231, 39.803500],  // 39°48'12.60"N ; 116°56'3.23"E
      //   [116.736625, 39.018747],  // 39°1'7.49"N ; 116°44'11.85"E
      //   [116.945644, 39.702322],  // 39°42'8.36"N ; 116°56'44.32"E
      //   [116.938850, 39.731692],  // 39°43'54.09"N ; 116°56'19.86"E
      //   [116.516822, 39.589061],  // 39°35'20.62"N ; 116°31'0.56"E
      //   [116.822653, 39.399692],  // 39°23'58.89"N ; 116°49'21.55"E
      //   [117.118450, 39.739311],  // 39°44'21.52"N ; 117°7'6.42"E
      //   [117.144678, 39.942903]   // 39°56'34.45"N ; 117°8'40.84"E
      // ].map(coord => ({
      //   name: '点位',
      //   value: coord.concat([1]) // 添加一个值用于显示
      // }));

      const points = [{
        name: '点位',
        value: [116.934372, 39.779983, '河北省廊坊市香河县安平镇鲁家务码头']
      }, {
        name: '点位',
        value: [116.934231, 39.803500, '北京市通州区西集镇潮白河大堤路']
      }, {
        name: '点位',
        value: [116.736625, 39.018747, '河北省廊坊市文安县滩里镇大清河']
      },
      {
        name: '点位',
        value: [116.945644, 39.702322, '天津市武清区河西务镇水牛村']
      }, {
        name: '点位',
        value: [116.938850, 39.731692, '河北省廊坊市香河县安平镇凤港减河']
      }, {
        name: '点位',
        value: [116.516822, 39.589061, '北京市大兴区安定镇养殖区路']
      }, {
        name: '点位',
        value: [116.822653, 39.399692, '河北省廊坊市安次区落垡镇414乡道']
      }, {
        name: '点位',
        value: [117.118450, 39.739311, '河北省廊坊市香河县安头屯镇潮白右堤']
      }, {
        name: '点位',
        value: [117.144678, 39.942903, '河北省廊坊市三河市杨庄镇红杨路']
      }
      ]


      let option = {
        backgroundColor: "rgba(0,0,0,0)",
        tooltip: {
          show: false,
        },
        legend: {
          show: false,
        },
        // visualMap: {
        //   left: 20,
        //   bottom: 20,
        //   pieces: [
        //     { gte: 1000, label: "1000个以上" }, // 不指定 max，表示 max 为无限大（Infinity）。
        //     { gte: 600, lte: 999, label: "600-999个" },
        //     { gte: 200, lte: 599, label: "200-599个" },
        //     { gte: 50, lte: 199, label: "49-199个" },
        //     { gte: 10, lte: 49, label: "10-49个" },
        //     { lte: 9, label: "1-9个" }, // 不指定 min，表示 min 为无限大（-Infinity）。
        //   ],
        //   inRange: {
        //     // 渐变颜色，从小到大
        //     color: [
        //       "#c3d7df",
        //       "#5cb3cc",
        //       "#8abcd1",
        //       "#66a9c9",
        //       "#2f90b9",
        //       "#1781b5",
        //     ],
        //   },
        //   textStyle: {
        //     color: "#fff",
        //   },
        // },
        geo: {
          map: name,             // 地图名称
          show: true,            // 显示地图
          roam: true,            // 支持平移缩放
          zoom: zoom,            // 初始缩放
          top: top,              // 地图偏移
          scaleLimit: {          // 缩放大小限制
            min: 1,
            max: 100
          },
          selectedMode: false,   // 是否允许选中多个区域
          // aspectScale: 0.78,   // 地图长宽比，可根据实际需求调整

          // --- 以下 itemStyle 配置即原先在 { type: 'map' } 里的 ---
          itemStyle: {
            borderColor: "rgba(147, 235, 248, .8)",
            borderWidth: 1,
            areaColor: {
              type: "radial",
              x: 0.5,
              y: 0.5,
              r: 0.8,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(147, 235, 248, 0)", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "rgba(147, 235, 248, .2)", // 100% 处的颜色
                },
              ],
              globalCoord: false, // 缺省为 false
            },
            shadowColor: "rgba(128, 217, 248, .3)",
            shadowOffsetX: -2,
            shadowOffsetY: 2,
            shadowBlur: 10,
          },
          emphasis: {
            itemStyle: {
              areaColor: "#389BB7",
              borderWidth: 1,
            },
          },
        },
        series: [
          // {
          //   name: "MAP",
          //   type: "map",
          //   map: name,
          //   // aspectScale: 0.78,
          //   data: data,
          //   // data: [1,100],
          //   selectedMode: false, //是否允许选中多个区域
          //   zoom: zoom,
          //   geoIndex: 1,
          //   top: top,
          //   tooltip: {
          //     show: true,
          //     formatter: function (params) {
          //       if (params.data) {
          //         return params.name + "：" + params.data["value"];
          //       } else {
          //         return params.name;
          //       }
          //     },
          //     backgroundColor: "rgba(0,0,0,.6)",
          //     borderColor: "rgba(147, 235, 248, .8)",
          //     textStyle: {
          //       color: "#FFF",
          //     },
          //   },
          //   label: {
          //     show: false,
          //     color: "#000",
          //     // position: [-10, 0],
          //     formatter: function (val) {
          //       // console.log(val)
          //       if (val.data !== undefined) {
          //         return val.name.slice(0, 2);
          //       } else {
          //         return "";
          //       }
          //     },
          //     rich: {},
          //   },
          //   emphasis: {
          //     label: {
          //       show: false,
          //     },
          //     itemStyle: {
          //       areaColor: "#389BB7",
          //       borderWidth: 1,
          //     },
          //   },
          //   itemStyle: {
          //     borderColor: "rgba(147, 235, 248, .8)",
          //     borderWidth: 1,
          //     areaColor: {
          //       type: "radial",
          //       x: 0.5,
          //       y: 0.5,
          //       r: 0.8,
          //       colorStops: [
          //         {
          //           offset: 0,
          //           color: "rgba(147, 235, 248, 0)", // 0% 处的颜色
          //         },
          //         {
          //           offset: 1,
          //           color: "rgba(147, 235, 248, .2)", // 100% 处的颜色
          //         },
          //       ],
          //       globalCoord: false, // 缺为 false
          //     },
          //     shadowColor: "rgba(128, 217, 248, .3)",
          //     shadowOffsetX: -2,
          //     shadowOffsetY: 2,
          //     shadowBlur: 10,
          //   },
          // },
          // {
          //   data: data2,
          //   type: "effectScatter",
          //   coordinateSystem: "geo",
          //   symbolSize: function (val) {
          //     return 4;
          //   },
          //   legendHoverLink: true,
          //   showEffectOn: "render",
          //   rippleEffect: {
          //     scale: 6,
          //     color: "rgba(255,255,255, 1)",
          //     brushType: "fill",
          //   },
          //   tooltip: {
          //     show: true,
          //     formatter: function (params) {
          //       if (params.data) {
          //         return params.name + "：" + params.data["value"][2];
          //       } else {
          //         return params.name;
          //       }
          //     },
          //     backgroundColor: "rgba(0,0,0,.6)",
          //     borderColor: "rgba(147, 235, 248, .8)",
          //     textStyle: {
          //       color: "#FFF",
          //     },
          //   },
          //   label: {
          //     formatter: (param) => {
          //       return param.name.slice(0, 2);
          //     },
          //     fontSize: 11,
          //     offset: [0, 2],
          //     position: "bottom",
          //     textBorderColor: "#fff",
          //     textShadowColor: "#000",
          //     textShadowBlur: 10,
          //     textBorderWidth: 0,
          //     color: "#FFF",
          //     show: true,
          //   },
          //   itemStyle: {
          //     color: "rgba(255,255,255,1)",
          //     borderColor: "rgba(2255,255,255,2)",
          //     borderWidth: 4,
          //     shadowColor: "#000",
          //     shadowBlur: 10,
          //   },
          // },
          {
            data: points,
            type: "effectScatter",
            coordinateSystem: "geo",
            symbolSize: function (val) {
              return 4;
              // return val[2] / 50;
            },
            legendHoverLink: true,
            showEffectOn: "render",
            rippleEffect: {
              // period: 4,
              scale: 6,
              color: "rgba(255,255,255, 1)",
              brushType: "fill",
            },
            tooltip: {
              show: true,
              formatter: function (params) {
                if (params.data) {
                  return params.name + "：" + params.data["value"][2];
                } else {
                  return params.name;
                }
              },
              backgroundColor: "rgba(0,0,0,.6)",
              borderColor: "rgba(147, 235, 248, .8)",
              textStyle: {
                color: "#FFF",
              },
            },
            label: {
              formatter: (param) => {
                return param.name.slice(0, 2);
              },

              fontSize: 11,
              offset: [0, 2],
              position: "bottom",
              textBorderColor: "#fff",
              textShadowColor: "#000",
              textShadowBlur: 10,
              textBorderWidth: 0,
              color: "#FFF",
              show: true,
            },
            // colorBy: "data",
            itemStyle: {
              color: "rgba(255,255,255,1)",
              borderColor: "rgba(2255,255,255,2)",
              borderWidth: 4,
              shadowColor: "#000",
              shadowBlur: 10,
            },
          },
        ],
        //动画效果
        // animationDuration: 1000,
        // animationEasing: 'linear',
        // animationDurationUpdate: 1000
      };
      this.options = option;
    },
    message(text) {
      this.$Message({
        text: text,
        type: "warning",
      });
    },
    mapclick() {
      if (this.echartBindClick) return;
      //单击切换到级地图，当mapCode有值,说明可以切换到下级地图
      this.$refs.CenterMap.chart.on("click", (params) => {
        // console.log(params);
        let xzqData = xzqCode[params.name];
        if (xzqData) {
          this.getData(xzqData.adcode);
        } else {
          // this.message("暂无下级地市!");
        }
      });
      this.echartBindClick = true;
    },
    testClick() {
      this.$refs.CenterMap.chart.on("click", (params) => {
        if (params.componentType === 'series' && params.seriesType === 'effectScatter') {
          this.$emit("sendMsg", params)
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.centermap {
  margin-bottom: 30px;

  .maptitle {
    height: 60px;
    display: flex;
    justify-content: center;
    padding-top: 10px;
    box-sizing: border-box;

    .titletext {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: 6px;
      background: linear-gradient(92deg,
          #0072ff 0%,
          #00eaff 48.8525390625%,
          #01aaff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0 10px;
    }

    .zuo,
    .you {
      background-size: 100% 100%;
      width: 29px;
      height: 20px;
      margin-top: 8px;
    }

    .zuo {
      background: url("../../assets/img/xiezuo.png") no-repeat;
    }

    .you {
      background: url("../../assets/img/xieyou.png") no-repeat;
    }
  }

  .mapwrap {
    height: 548px;
    width: 100%;
    // padding: 0 0 10px 0;
    box-sizing: border-box;
    position: relative;

    .quanguo {
      position: absolute;
      right: 20px;
      top: -46px;
      width: 80px;
      height: 28px;
      border: 1px solid #00eded;
      border-radius: 10px;
      color: #00f7f6;
      text-align: center;
      line-height: 26px;
      letter-spacing: 6px;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 237, 237, 0.5),
        0 0 6px rgba(0, 237, 237, 0.4);
    }
  }
}
</style>
