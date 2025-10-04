<template>
  <div class="flame-localization-container">
    <!-- The map will be the background -->
    <div class="map-container">
      <div id="map-main"></div>
      <div class="map-toggle" @click="toggleSatellite">{{ isSatellite ? '切换矢量' : '切换卫星' }}</div>
    </div>

    <!-- Header Bar -->
    <div class="header-bar">
      <!-- Left: Weather and Date/Time -->
      <div class="header-left">
        <div class="weather-info">
          <div class="weather-icon">☀️</div>
          <div class="weather-details">
            <div class="temperature">25°C</div>
            <div class="weather-desc">晴朗</div>
            <div class="wind-info">风速: 3.2m/s 东北风</div>
          </div>
        </div>
        <div class="datetime-info">
          <div class="current-date">{{ currentDate }}</div>
          <div class="current-time">{{ currentTime }}</div>
        </div>
      </div>
      
      <!-- Center: Title -->
      <div class="header-center">
        <h1>火焰定位平台</h1>
      </div>
      
      <!-- Right: Style Switcher -->
      <div class="header-right">
        <div class="style-switcher">
          <div class="style-label">主题风格:</div>
          <div class="style-buttons">
            <button 
              class="style-btn blue" 
              :class="{ active: currentStyle === 'blue' }"
              @click="switchStyle('blue')"
            >蓝</button>
            <button 
              class="style-btn red" 
              :class="{ active: currentStyle === 'red' }"
              @click="switchStyle('red')"
            >红</button>
            <button 
              class="style-btn green" 
              :class="{ active: currentStyle === 'green' }"
              @click="switchStyle('green')"
            >绿</button>
            <button 
              class="style-btn purple" 
              :class="{ active: currentStyle === 'purple' }"
              @click="switchStyle('purple')"
            >紫</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Transparent UI panels will be overlaid on top of the map -->
    <div class="ui-overlay">
      <!-- Left Panel -->
      <div class="left-panel">
        <div class="panel key-data-object-panel">
          <h3>核心数据</h3>
          <KeyDataObject />
          <div class="key-data-chart">
            <chart :options="keyDataChartOptions" style="height: 150px; margin-top: 10px;" />
          </div>
        </div>
        <div class="panel enterprise-classification">
          <h3>企业分类</h3>
          <chart :options="enterpriseChartOptions" style="height: 200px;" />
        </div>
        <div class="panel major-hazard-sources">
          <h3>重大危险源<span></span></h3>
          <chart :options="hazardChartOptions" style="height: 200px;" />
        </div>
      </div>

      <!-- Right Panel -->
      <div class="right-panel">
        <div class="panel monitoring-alarm">
          <h3>监测预警<span></span></h3>
          <chart :options="alarmChartOptions" style="height: 200px;" />
        </div>
        <div class="panel hidden-danger-statistics">
          <h3>问题隐患<span></span></h3>
          <chart :options="dangerChartOptions" style="height: 200px;" />
        </div>
        <div class="panel equipment-status">
          <h3>设备状态<span></span></h3>
          <chart :options="equipmentChartOptions" style="height: 200px;" />
        </div>
      </div>
    </div>

    <!-- Recognition Modal -->
    <RecognitionModal
      :visible="isModalVisible"
      :image="currentImage"
      :loading="isLoading"
      @close="isModalVisible = false"
      @recognize="showRecognizedImage"
    />
  </div>
</template>

<script>
import AMapLoader from "@amap/amap-jsapi-loader";
import Chart from '@/components/echart/chart.vue';
import KeyDataObject from './components/KeyDataObject.vue';
import RecognitionModal from './components/RecognitionModal.vue';
import * as echarts from 'echarts';
import 'echarts-gl';

// Import images
import imageFile1 from "@/assets/images/A001.png";
import imageFile2 from "@/assets/images/A002.png";
import imageFile3 from "@/assets/images/A003.png";
import imageFile4 from "@/assets/images/A004.png";
import imageFile5 from "@/assets/images/A005.png";
import imageFile6 from "@/assets/images/A006.png";
import imageFileB1 from "@/assets/images/B001.png";
import imageFileB2 from "@/assets/images/B002.png";
import imageFileB3 from "@/assets/images/B003.png";
import imageFileB4 from "@/assets/images/B004.png";
import imageFileB5 from "@/assets/images/B005.png";
import imageFileB6 from "@/assets/images/B006.png";

// 参考 MapContainer.vue 的点位数据
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
  name: 'FlameLocalization',
  components: {
    Chart,
    KeyDataObject,
    RecognitionModal,
  },
  data() {
    return {
      map: null,
      AMapRef: null,
      // 地图图层与开关状态
      isSatellite: true,
      defaultLayer: null,
      satelliteLayer: null,
      roadNetLayer: null,
      
      // Modal state
      isModalVisible: false,
      selectedInitialImage: '',
      selectedRecognizedImage: '',
      currentImage: '',
      isLoading: false,

      // Image pairs
      imagePairs: [
        { initial: imageFile1, recognized: imageFileB1 },
        { initial: imageFile2, recognized: imageFileB2 },
        { initial: imageFile3, recognized: imageFileB3 },
        { initial: imageFile4, recognized: imageFileB4 },
        { initial: imageFile5, recognized: imageFileB5 },
        { initial: imageFile6, recognized: imageFileB6 },
      ],
      
      // Date/Time
      currentDate: '',
      currentTime: '',
      dateTimeTimer: null,
      
      // Style switching
      currentStyle: 'blue',
      styleColors: {
        blue: {
          primary: '#1890ff',
          secondary: '#40a9ff',
          accent: '#00eaff',
          gradient: ['#1890ff', '#00aaff', '#00cfff', '#00eaff']
        },
        red: {
          primary: '#ff4d4f',
          secondary: '#ff7875',
          accent: '#ffa39e',
          gradient: ['#ff4d4f', '#ff7875', '#ffa39e', '#ffd6e7']
        },
        green: {
          primary: '#52c41a',
          secondary: '#73d13d',
          accent: '#95de64',
          gradient: ['#52c41a', '#73d13d', '#95de64', '#b7eb8f']
        },
        purple: {
          primary: '#722ed1',
          secondary: '#9254de',
          accent: '#b37feb',
          gradient: ['#722ed1', '#9254de', '#b37feb', '#d3adf7']
        }
      },

      images: [
        { id: 1, thumbnail: '/img/flame_thumb_1.jpg', processed: '/img/flame_processed_1.jpg', alt: 'Flame 1' },
        { id: 2, thumbnail: '/img/flame_thumb_2.jpg', processed: '/img/flame_processed_2.jpg', alt: 'Flame 2' },
        { id: 3, thumbnail: '/img/flame_thumb_3.jpg', processed: '/img/flame_processed_3.jpg', alt: 'Flame 3' },
        { id: 4, thumbnail: '/img/flame_thumb_4.jpg', processed: '/img/flame_processed_4.jpg', alt: 'Flame 4' },
        { id: 5, thumbnail: '/img/flame_thumb_5.jpg', processed: '/img/flame_processed_5.jpg', alt: 'Flame 5' },
      ],
      selectedImage: null,
      showImageModal: false,
      enterpriseChartOptions: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: '#1890ff',
          borderWidth: 1,
          textStyle: {
            color: '#fff',
            fontSize: 14
          }
        },
        legend: {
          orient: "vertical",
          left: 10,
          data: ["A类", "B类", "C类", "D类"],
          textStyle: {
            color: "#fff",
            fontSize: 12,
            rich: {
              icon: {
                fontSize: 16
              }
            }
          },
          itemWidth: 14,
          itemHeight: 14,
          itemGap: 15,
          formatter: function(name) {
            return '{icon|●} ' + name;
          }
        },
        series: [
          {
            name: "企业分类",
            type: "pie",
            radius: ["45%", "75%"],
            center: ['60%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "24",
                fontWeight: "bold",
                color: '#fff',
                formatter: function(params) {
                  return params.name + '\n' + params.percent + '%';
                }
              },
              scale: true,
              scaleSize: 10
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 335, name: "A类", itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [{offset: 0, color: '#1890ff'}, {offset: 1, color: '#00eaff'}]) }},
              { value: 310, name: "B类", itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [{offset: 0, color: '#00aaff'}, {offset: 1, color: '#00ffff'}]) }},
              { value: 234, name: "C类", itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [{offset: 0, color: '#00cfff'}, {offset: 1, color: '#00d4ff'}]) }},
              { value: 135, name: "D类", itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [{offset: 0, color: '#00eaff'}, {offset: 1, color: '#00b3ff'}]) }},
            ],
            itemStyle: {
              borderRadius: 5,
              borderColor: 'rgba(255, 255, 255, 0.3)',
              borderWidth: 2
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200;
            }
          },
        ],
      },
      hazardChartOptions: {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: '#1890ff',
            borderWidth: 1,
            textStyle: {
              color: '#fff',
              fontSize: 14
            },
            formatter: function(params) {
              const param = params[0];
              return `危险源等级: ${param.name}<br/>数量: ${param.value} 个`;
            }
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: {
            type: "category",
            data: ["A", "B", "C", "D", "E"],
            axisLine: {
              lineStyle: {
                color: "#1890ff",
                width: 2
              },
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: "#fff",
              fontSize: 12,
              fontWeight: 'bold'
            },
          },
          yAxis: {
            type: "value",
            axisLine: {
              show: true,
              lineStyle: {
                color: "#1890ff",
                width: 2
              },
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: "#fff",
              fontSize: 10
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.1)',
                type: 'dashed'
              }
            }
          },
          series: [
            {
              data: [120, 200, 150, 80, 70],
              type: "bar",
              barWidth: '60%',
              name: '危险源数量',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#00eaff" },
                  { offset: 0.5, color: "#1890ff" },
                  { offset: 1, color: "#0050b3" },
                ]),
                borderRadius: [8, 8, 0, 0],
                shadowColor: 'rgba(24, 144, 255, 0.8)',
                shadowBlur: 15,
                shadowOffsetY: 5
              },
              emphasis: {
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: "#40a9ff" },
                    { offset: 0.5, color: "#1890ff" },
                    { offset: 1, color: "#096dd9" },
                  ]),
                  shadowColor: 'rgba(24, 144, 255, 1)',
                  shadowBlur: 25
                }
              },
              animationDelay: function (idx) {
                return idx * 200;
              }
            },
          ],
        },
      alarmChartOptions: {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: '#1890ff',
          borderWidth: 1,
          textStyle: {
            color: '#fff',
            fontSize: 14
          },
          formatter: function(params) {
            const param = params[0];
            return `${param.name}<br/>报警次数: ${param.value} 次`;
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#1890ff',
              width: 2
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#fff',
            fontSize: 10
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#1890ff',
              width: 2
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#fff',
            fontSize: 10
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.1)',
              type: 'dashed'
            }
          }
        },
        series: [{
          name: '报警次数',
          data: [1, 2, 1, 3, 2, 1, 0],
          type: 'line',
          smooth: 0.6,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#00eaff' },
              { offset: 1, color: '#1890ff' }
            ]),
            width: 3,
            shadowColor: 'rgba(24, 144, 255, 0.8)',
            shadowBlur: 10
          },
          itemStyle: {
            color: '#00eaff',
            borderColor: '#fff',
            borderWidth: 2,
            shadowColor: 'rgba(0, 234, 255, 0.8)',
            shadowBlur: 10
          },
          emphasis: {
            itemStyle: {
              color: '#fff',
              borderColor: '#1890ff',
              borderWidth: 3,
              shadowColor: 'rgba(24, 144, 255, 1)',
              shadowBlur: 15
            }
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(0, 234, 255, 0.6)'
              },
              {
                offset: 1,
                color: 'rgba(24, 144, 255, 0.1)'
              }
            ])
          },
          animationDuration: 2000,
          animationEasing: 'cubicOut'
        }]
      },
      dangerChartOptions: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: '#1890ff',
          borderWidth: 1,
          textStyle: {
            color: '#fff',
            fontSize: 14
          },
          formatter: function(params) {
            const param = params[0];
            const typeMap = {
              '一般隐患': '一般隐患',
              '重大隐患': '重大隐患'
            };
            return `${typeMap[param.name]}<br/>数量: ${param.value} 个`;
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['一般隐患', '重大隐患'],
          axisLine: {
            lineStyle: {
              color: '#1890ff',
              width: 2
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#fff',
            fontSize: 12,
            fontWeight: 'bold'
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#1890ff',
              width: 2
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#fff',
            fontSize: 10
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.1)',
              type: 'dashed'
            }
          }
        },
        series: [{
          data: [10, 2],
          type: 'bar',
          barWidth: '50%',
          itemStyle: {
            color: function(params) {
              const colorList = [
                new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {offset: 0, color: '#52c41a'},
                  {offset: 1, color: '#73d13d'}
                ]),
                new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {offset: 0, color: '#ff4d4f'},
                  {offset: 1, color: '#ff7875'}
                ])
              ];
              return colorList[params.dataIndex];
            },
            borderRadius: [8, 8, 0, 0],
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 10,
            shadowOffsetY: 5
          },
          emphasis: {
            itemStyle: {
              shadowColor: 'rgba(255, 255, 255, 0.5)',
              shadowBlur: 15,
              borderColor: '#fff',
              borderWidth: 2
            }
          },
          animationDelay: function (idx) {
            return idx * 300;
          }
        }]
      },
      keyDataChartOptions: {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: '#1890ff',
          borderWidth: 1,
          textStyle: {
            color: '#fff',
            fontSize: 14
          },
          formatter: '{b}: {c} ({d}%)'
        },
        series: [{
          name: '核心数据分布',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'outside',
            formatter: '{b}\n{c}',
            fontSize: 14,
            fontWeight: 'bold',
            color: '#fff'
          },
          labelLine: {
            show: true,
            length: 15,
            length2: 20,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.8)',
              width: 1
            }
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold'
            },
            itemStyle: {
              shadowBlur: 15,
              shadowOffsetX: 0,
              shadowColor: 'rgba(255, 255, 255, 0.5)'
            }
          },
          data: [
            {
              value: 1234,
              name: '企业',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#1890ff' },
                  { offset: 1, color: '#00eaff' }
                ])
              }
            },
            {
              value: 56,
              name: '风险',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#ff4d4f' },
                  { offset: 1, color: '#ff7875' }
                ])
              }
            },
            {
              value: 789,
              name: '设备',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#52c41a' },
                  { offset: 1, color: '#73d13d' }
                ])
              }
            }
          ],
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }
        }]
      },
      equipmentChartOptions: {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: '#1890ff',
          borderWidth: 1,
          textStyle: {
            color: '#fff',
            fontSize: 14
          },
          formatter: '{b}: {c}台 ({d}%)'
        },
        title: {
          text: '设备状态',
          left: 'center',
          top: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            name: '设备状态',
            type: 'pie',
            radius: ['45%', '70%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#0a1e3c',
              borderWidth: 2
            },
            label: {
              show: true,
              position: 'outside',
              formatter: '{b}\n{c}台',
              fontSize: 12,
              fontWeight: 'bold',
              color: '#fff'
            },
            labelLine: {
              show: true,
              length: 15,
              length2: 20,
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.8)',
                width: 1
              }
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: 'bold'
              },
              itemStyle: {
                shadowBlur: 20,
                shadowOffsetX: 0,
                shadowColor: 'rgba(255, 255, 255, 0.5)'
              }
            },
            data: [
              {
                value: 80,
                name: '正常设备',
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#52c41a' },
                    { offset: 1, color: '#73d13d' }
                  ])
                }
              },
              {
                value: 20,
                name: '异常设备',
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#ff4d4f' },
                    { offset: 1, color: '#ff7875' }
                  ])
                }
              }
            ],
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200;
            }
          }
        ]
      }
    };
  },
  mounted() {
    // 加载保存的主题设置
    const savedTheme = localStorage.getItem('flameTheme');
    if (savedTheme && this.styleColors[savedTheme]) {
      this.currentStyle = savedTheme;
      const colors = this.styleColors[savedTheme];
      this.updateUITheme(colors);
    }
    
    this.initAMap();
    this.updateDateTime();
    this.dateTimeTimer = setInterval(this.updateDateTime, 1000);
  },
  unmounted() {
    if (this.map) {
      this.map.destroy();
    }
    if (this.dateTimeTimer) {
      clearInterval(this.dateTimeTimer);
    }
  },
  methods: {
    initAMap() {
      window._AMapSecurityConfig = {
        securityJsCode: "6369bd0d6e9c44fec3677f17bf12cfb6",
      };

      AMapLoader.load({
        key: "95ffb9f1cf5287c0c801d018f37332bf",
        plugins: ["AMap.Scale"],
        preserveDrawingBuffer: true,
      })
        .then((AMap) => {
          this.AMapRef = AMap;
          this.map = new AMap.Map("map-main", {
            viewMode: "3D",
            zoom: 11,
            center: [116.397428, 39.90923],
          });

          this.map.addControl(new AMap.Scale());

          // 预创建图层以便切换（与 MapContainer.vue 一致）
          this.defaultLayer = new AMap.TileLayer();
          this.satelliteLayer = new AMap.TileLayer.Satellite();
          this.roadNetLayer = new AMap.TileLayer.RoadNet();

          // 默认使用卫星 + 路网图层
          const layers = this.roadNetLayer ? [this.satelliteLayer, this.roadNetLayer] : [this.satelliteLayer];
          this.map.setLayers(layers);
          this.isSatellite = true;

          // 批量添加标记（与 MapContainer.vue 一致）
          this.addMarkers(AMap, points);

        })
        .catch((e) => {
          console.error(e);
        });
    },
    /**
     * 批量添加标记并绑定点击事件（参考 MapContainer.vue）
     * 同时保留图表联动：点击点位更新图表模拟数据
     */
    addMarkers(AMap, points) {
      points.forEach((item, idx) => {
        const marker = new AMap.Marker({
          position: [item.value[0], item.value[1]],
          title: item.name,
          map: this.map,
          content: '<div class="flame-marker"><div class="flame-inner"></div><div class="flame-pulse"></div></div>',
          offset: new AMap.Pixel(-15, -15)
        });

        marker.on('click', () => {
          // Select a random image pair
          const randomIndex = Math.floor(Math.random() * this.imagePairs.length);
          const selectedPair = this.imagePairs[randomIndex];

          // Set the images for the modal
          this.selectedInitialImage = selectedPair.initial;
          this.selectedRecognizedImage = selectedPair.recognized;
          this.currentImage = this.selectedInitialImage;

          // Show the modal
          this.isModalVisible = true;

          // 动态更新图表模拟数据
          this.updateCharts(this.getMockData(idx + 1));
        });
      });
    },
    showRecognizedImage() {
      this.isLoading = true;
      setTimeout(() => {
        this.currentImage = this.selectedRecognizedImage;
        this.isLoading = false;
      }, 1500); // Simulate a 1.5-second recognition process
    },
    selectImage(image) {
      this.selectedImage = image;
      this.showImageModal = true;
    },
    closeImageModal() {
      this.showImageModal = false;
      this.selectedImage = null;
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
    updateCharts(data) {
      this.enterpriseChartOptions.series[0].data = data.enterpriseData;
      this.hazardChartOptions.series[0].data = data.hazardData;
      this.alarmChartOptions.series[0].data = data.alarmData;
      this.dangerChartOptions.series[0].data = data.dangerData;
      this.equipmentChartOptions.series[0].data = data.equipmentData;
      
      // Update key data chart
      this.keyDataChartOptions.series[0].data[0].value = data.enterpriseData.reduce((sum, item) => sum + item.value, 0);
      this.keyDataChartOptions.series[0].data[1].value = data.hazardData.reduce((sum, item) => sum + item.value, 0);
      this.keyDataChartOptions.series[0].data[2].value = data.equipmentData.reduce((sum, item) => sum + item.value, 0);
    },
    getMockData(id) {
      // Simple mock data generation based on ID
      return {
        enterpriseData: [
            {value: id * 2, name: 'A类'},
            {value: 10 - id, name: 'B类'},
            {value: 5 + id, name: 'C类'},
            {value: 8 - id, name: 'D类'},
        ],
        hazardData: [
          { value: id, name: '一级' },
          { value: 2 * id, name: '二级' },
          { value: 3 - id, name: '三级' },
          { value: 4 - id * 2, name: '四级' }
        ],
        alarmData: [id, 2, 3 - id, 4, 5 - id, 1, 0],
        dangerData: [10 - id, id],
        equipmentData: [
          { value: 100 - id * 5, name: '在线' },
          { value: id * 2, name: '离线' },
          { value: id, name: '故障' }
        ],
        keyData: [
          { value: 1234, name: '企业' },
          { value: 56, name: '风险' },
          { value: 789, name: '设备' }
        ]
      };
    },
    updateDateTime() {
      const now = new Date();
      this.currentDate = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'long'
      });
      this.currentTime = now.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    },
    switchStyle(style) {
      this.currentStyle = style;
      const colors = this.styleColors[style];
      
      // Update chart colors based on selected style
      this.updateChartColors(colors);
      
      // Update UI theme colors
      this.updateUITheme(colors);
      
      // 保存主题选择到本地存储
      localStorage.setItem('flameTheme', style);
      
      // 强制更新所有图表
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
    updateChartColors(colors) {
      // Update enterprise chart
      this.enterpriseChartOptions.series[0].color = colors.gradient;
      
      // Update hazard chart
      this.hazardChartOptions.series[0].itemStyle.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: colors.primary },
        { offset: 1, color: colors.secondary },
      ]);
      
      // Update alarm chart area color
      this.alarmChartOptions.series[0].areaStyle.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: colors.primary + '80' },
        { offset: 1, color: colors.primary + '00' },
      ]);
      
      // Update danger chart
      this.dangerChartOptions.series[0].itemStyle.color = new echarts.graphic.LinearGradient(
        0, 0, 0, 1,
        [
          { offset: 0, color: colors.primary },
          { offset: 0.5, color: colors.secondary },
          { offset: 1, color: colors.secondary }
        ]
      );
      
      // Update equipment chart
      this.equipmentChartOptions.series[0].itemStyle.color = {
        type: 'radial',
        x: 0.5,
        y: 0.5,
        r: 0.5,
        colorStops: [
          { offset: 0, color: colors.primary + '40' },
          { offset: 1, color: colors.primary + 'CC' }
        ]
      };
      
      // Update key data chart
      this.keyDataChartOptions.series[0].data[0].itemStyle.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: colors.primary },
        { offset: 1, color: colors.secondary }
      ]);
      this.keyDataChartOptions.series[0].data[1].itemStyle.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: colors.accent },
        { offset: 1, color: colors.secondary }
      ]);
      this.keyDataChartOptions.series[0].data[2].itemStyle.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: colors.gradient[2] },
        { offset: 1, color: colors.gradient[3] }
      ]);
      
      // Force chart update
      this.$forceUpdate();
    },
    updateUITheme(colors) {
      // Update CSS custom properties for UI theme
      const root = document.documentElement;
      root.style.setProperty('--primary-color', colors.primary);
      root.style.setProperty('--secondary-color', colors.secondary);
      root.style.setProperty('--accent-color', colors.accent);
    }
  }
};
</script>

<style scoped>
.flame-localization-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #020f24; /* Dark background for the tech feel */
}

/* Header Bar Styles */
.header-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(90deg, rgba(24, 144, 255, 0.1), rgba(0, 234, 255, 0.15), rgba(24, 144, 255, 0.1));
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(24, 144, 255, 0.3);
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  pointer-events: none;
}

.header-bar > div {
  pointer-events: all;
}

/* Left Section */
.header-left {
  display: flex;
  align-items: center;
  gap: 30px;
}

.weather-info {
  display: flex;
  align-items: center;
  gap: 15px;
  background: transparent;
  padding: 5px 10px;
  border: none;
}

.weather-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 0 12px rgba(24, 144, 255, 0.8));
  animation: weatherPulse 3s ease-in-out infinite;
}

@keyframes weatherPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.weather-details {
  color: #fff;
}

.temperature {
  font-size: 1.8rem;
  font-weight: bold;
  color: #00eaff;
  text-shadow: 0 0 12px rgba(0, 234, 255, 0.8);
  background: linear-gradient(135deg, #00eaff, #40a9ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.weather-desc {
  font-size: 1rem;
  opacity: 0.95;
  color: #b3e5fc;
  font-weight: 500;
}

.wind-info {
  font-size: 0.85rem;
  opacity: 0.8;
  margin-top: 3px;
  color: #81d4fa;
}

.datetime-info {
  color: #fff;
  text-align: center;
  background: transparent;
  padding: 5px 10px;
  border: none;
}

.current-date {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 3px;
  color: #b3e5fc;
  font-weight: 500;
}

.current-time {
  font-size: 1.5rem;
  font-weight: bold;
  color: #00eaff;
  text-shadow: 0 0 12px rgba(0, 234, 255, 0.8);
  font-family: 'Courier New', monospace;
  background: linear-gradient(135deg, #00eaff, #40a9ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1px;
}

/* Center Section */
.header-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
}

.header-center h1 {
  color: #ffffff;
  font-size: 2.2rem;
  font-weight: bold;
  text-shadow: 
    0 0 10px rgba(24, 144, 255, 0.8),
    0 0 20px rgba(24, 144, 255, 0.6),
    0 0 30px rgba(24, 144, 255, 0.4);
  margin: 0;
  letter-spacing: 2px;
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.2), rgba(20, 80, 180, 0.1));
  padding: 8px 20px;
  border-radius: 8px;
  border: 1px solid rgba(24, 144, 255, 0.4);
  display: inline-block;
}

/* Right Section */
.header-right {
  display: flex;
  align-items: center;
}

.style-switcher {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(24, 144, 255, 0.1);
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid rgba(24, 144, 255, 0.3);
}

.style-label {
  color: #fff;
  font-size: 0.9rem;
  white-space: nowrap;
}

.style-buttons {
  display: flex;
  gap: 8px;
}

.style-btn {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  color: #fff;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.style-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

.style-btn.active {
  transform: scale(1.2);
  box-shadow: 0 0 15px currentColor;
}

.style-btn.blue {
  background: linear-gradient(135deg, #1890ff, #40a9ff);
}

.style-btn.red {
  background: linear-gradient(135deg, #ff4d4f, #ff7875);
}

.style-btn.green {
  background: linear-gradient(135deg, #52c41a, #73d13d);
}

.style-btn.purple {
  background: linear-gradient(135deg, #722ed1, #9254de);
}

.map-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

#map-main {
  width: 100%;
  height: 100%;
}

.ui-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Allow map interaction */
}

.ui-overlay > div {
  pointer-events: all; /* Enable interaction for UI panels */
}

.panel {
  background: linear-gradient(180deg, rgba(0, 90, 247, 0.4), rgba(20, 80, 180, 0.3));
  border: 1px solid rgba(20, 120, 220, 0.6);
  color: #fff;
  margin: 20px;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(20, 120, 220, 0.6);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  position: relative;
  height: 250px; 
}

.panel:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 28px rgba(0, 93, 168, 0.9);
}

.panel h3 {
  color: #fcfcfc;
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #1890ff;
  border-image: linear-gradient(to right, #1890ff, transparent) 1;
  font-size: 1.4em;
  text-shadow: 0 0 8px #66ccff;
  position: relative;
}

.panel h3 span {
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 30%;
  height: 2px;
  background: linear-gradient(to right, #ffffff, transparent);
}

.left-panel, .right-panel {
  position: absolute;
  top: 100px;
  width: 350px;
  display: flex;
  flex-direction: column;
}

.left-panel {
  left: 20px;
}

.right-panel {
  right: 20px;
}

.bottom-panel {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  background-color: rgba(255, 69, 0, 0.15);
  border: 1px solid #ff4500;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 0 20px rgba(255, 69, 0, 0.6);
  backdrop-filter: blur(5px);
}

.bottom-panel h3 {
  color: #ff8c00;
  text-align: center;
  margin-top: 0;
  font-size: 1.5em;
  text-shadow: 0 0 8px #ff8c00;
}


.image-gallery {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 15px;
}

.image-item img {
  width: 150px;
  height: 100px;
  border: 2px solid #ff4500;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.2s;
}

.image-item img:hover {
  transform: scale(1.1);
  border-color: #ff8c00;
}

/* Image Modal Styles */
.image-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.image-modal-content {
  position: relative;
  background-color: rgba(255, 69, 0, 0.2);
  border: 2px solid #ff4500;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 0 30px rgba(255, 69, 0, 0.7);
  text-align: center;
}

.image-modal-content h3 {
  color: #ff8c00;
  margin-top: 0;
  font-size: 1.8em;
  text-shadow: 0 0 10px #ff8c00;
}

.image-modal-content img {
  max-width: 80vw;
  max-height: 70vh;
  border: 1px solid #ff4500;
  border-radius: 5px;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 20px;
  color: #fff;
  font-size: 30px;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.2s;
}

.close-button:hover {
  color: #ff8c00;
}
.risk-item, .enterprise-item, .hazard-item, .alarm-item, .danger-item, .equipment-item {
  padding: 5px 0;
  border-bottom: 1px solid rgba(255, 69, 0, 0.2);
}

.risk-item strong, .enterprise-item strong, .hazard-item strong, .alarm-item strong, .danger-item strong, .equipment-item strong {
  color: #ff8c00;
  float: right;
}

/* 地图切换按钮 */
.map-toggle {
  position: absolute;
  right: 12px;
  top: 12px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  box-shadow: 0 0 12px rgba(255, 120, 0, 0.6);
  border: 1px solid rgba(255, 120, 0, 0.6);
  backdrop-filter: blur(4px);
}

.panel::before,
.panel::after {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(20, 140, 240, 0.8);
  box-shadow: 0 0 12px rgba(20, 140, 240, 0.6);
}
.panel::before {
  top: 8px;
  right: 8px;
  border-left: none;
  border-bottom: none;
}
.panel::after {
  bottom: 8px;
  left: 8px;
  border-right: none;
  border-top: none;
}

@keyframes neonPulse {
  0% { box-shadow: 0 0 16px rgba(20, 140, 240, 0.4); }
  50% { box-shadow: 0 0 24px rgba(20, 160, 255, 0.9); }
  100% { box-shadow: 0 0 16px rgba(20, 140, 240, 0.4); }
}
.panel:hover { animation: neonPulse 1.8s ease-in-out infinite; }
</style>

<style>
/* Global styles for AMap custom markers */
.flame-marker {
  position: relative;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flame-inner {
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #ff6b6b, #ffd93d, #ff6b6b);
  border-radius: 50%;
  box-shadow: 
    0 0 15px rgba(255, 107, 107, 0.8),
    0 0 30px rgba(255, 217, 61, 0.6),
    inset 0 0 10px rgba(255, 255, 255, 0.3);
  animation: flameFlicker 2s ease-in-out infinite;
  position: relative;
  z-index: 2;
}

.flame-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 107, 107, 0.4) 0%, transparent 70%);
  animation: pulseRing 3s ease-out infinite;
  z-index: 1;
}

.flame-pulse::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid rgba(255, 107, 107, 0.6);
  animation: pulseBorder 2s ease-out infinite;
}

@keyframes flameFlicker {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1);
  }
  25% {
    transform: scale(1.1) rotate(-5deg);
    filter: brightness(1.2);
  }
  50% {
    transform: scale(0.95) rotate(3deg);
    filter: brightness(0.9);
  }
  75% {
    transform: scale(1.05) rotate(-2deg);
    filter: brightness(1.1);
  }
}

@keyframes pulseRing {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.4;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes pulseBorder {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.8);
    opacity: 0;
  }
}

/* 旧的涟漪标记样式，保留备用 */
.ripple-marker {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: red;
  position: relative;
}

.ripple-marker::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: red;
  animation: ripple 1.5s infinite;
}

@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}
</style>
